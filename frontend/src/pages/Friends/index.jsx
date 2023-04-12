import {useState} from 'react';
import { getFriends, getPendingRequests, getSuggestions, sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import {Typography} from '@mui/material';
import { useSocket } from '../../context/SocketProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteFriend from '../../components/Modals/SimpleTextAnswer';
import MapFriends from '../../components/FriendsContainer';
import FriendsPending from '../../components/FriendsPending';
import FriendSuggestions from '../../components/FriendSuggestions';
import FriendPlaceholder from '../../components/Placeholders/FriendPlaceholder';
import { setToken } from '../Login/features/loginSlice';
import { useDispatch } from 'react-redux';
import './style/style.scss';

const Friends = ({currentUser}) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState()

  const friendQuery = useQuery({
    queryKey: ['friends'], 
    queryFn: () => getFriends()})
  const pendingQuery = useQuery({
    queryKey: ['pending'], queryFn: () => getPendingRequests()})
  const suggestionsQuery = useQuery({queryKey: ['suggestions'], queryFn: () => getSuggestions()})

  const declineQuery = useMutation({
    mutationFn: ({request_id}) =>
      declineFriend(request_id),
    onMutate: async(variables) => {
      await queryClient.cancelQueries({queryKey: ['friends']})
      await queryClient.cancelQueries({queryKey: ['pending']})
      await queryClient.cancelQueries({queryKey: ['suggestions']})
      
      const prevFriends = queryClient.getQueryData(['friends'])
      const prevPending = queryClient.getQueryData(['pending'])
      const prevSuggestions = queryClient.getQueryData(['suggestions'])

      const [person] = queryClient.getQueryData(['friends']).filter(request => request.request_id === variables.request_id)
      const [personPending] = queryClient.getQueryData(['pending']).filter(request => request.request_id === variables.request_id)

      queryClient.setQueryData(['suggestions'], (old) => [...old, person ? person.user : personPending.user])
      queryClient.setQueryData(['friends'], (old) => {
        const newFriends = old.filter(request => request.request_id !== variables.request_id)
        return newFriends
      })
      queryClient.setQueryData(['pending'], (old) => {
        const newPending = old.filter(request => request.request_id !== variables.request_id)
        return newPending
      })
      return {prevFriends, prevPending, prevSuggestions}
    },
    onError: (err, request, context) => {
      queryClient.setQueryData(['friends'], context.prevFriends)
      queryClient.setQueryData(['pending'], context.prevPending)
      queryClient.setQueryData(['suggestions'], context.prevSuggestions)
      // dispatch(setToken())
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ['pending']})
        queryClient.invalidateQueries({queryKey: ['friends']})
        queryClient.invalidateQueries({queryKey: ['suggestions']})
      }, 1000)
    }
  })
  
  const acceptQuery = useMutation({
    mutationFn: ({request_id}) => 
      acceptFriend(request_id),
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['pending'])
      await queryClient.cancelQueries(['friends'])
      const oldFriends = queryClient.getQueryData(['friends'])
      const oldPending = queryClient.getQueryData(['pending'])
      const [newFriend] = queryClient.getQueryData(['pending']).filter(request => request.request_id === variables.request_id)
      queryClient.setQueryData(['pending'], (old) => old.filter(request => request.request_id !== variables.request_id))
      queryClient.setQueryData(['friends'], (old) => [...old, newFriend])
      return {oldPending, oldFriends}
    },
    onSuccess: (variables) => {
      socket?.emit('notification', {to_id: variables.friend_id, type: 'Friend Request', msg: `${currentUser.username} accepted your friend request!`})
    },
    onError: (err, request, context) => {
      queryClient.setQueryData(['pending'], context.oldPending)
      queryClient.setQueryData(['friends', context.oldFriends])
      dispatch(setToken())
    },
    onSettled: () => {
      queryClient.invalidateQueries(['friends'])
      queryClient.invalidateQueries(['pending'])
      queryClient.invalidateQueries(['suggestions'])
    }
  })

  const sendRequestQuery = useMutation({
    mutationFn: ({friend, currentUser}) =>
      sendFriendRequest(friend, currentUser),
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['pending'])
      await queryClient.cancelQueries(['suggestions'])

      const prevPending = queryClient.getQueryData(['pending'])
      const prevSuggestions = queryClient.getQueryData(['suggestions'])

      const [sentTo] = queryClient.getQueryData(['suggestions']).filter(user => user._id === variables.friend)
      console.log(sentTo)
      queryClient.setQueryData(['suggestions'], (old) => old.filter(user => user._id !== variables.friend))
      queryClient.setQueryData(['pending'], (old) => [...old, {user: sentTo, type: 'requester'}])

      return {prevPending, prevSuggestions}

    },
    onSuccess: (variables) => {
      socket?.emit('notification', {to_id: variables.user._id, type: 'Friend Request', msg: `${currentUser.username} sent you a friend request!`})
    },
    onError: (err, request, context) => {
      queryClient.setQueryData(['pending'], context.prevPending)
      queryClient.setQueryData(['suggestions'], context.prevSuggestions)
      dispatch(setToken())
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['pending']})
      queryClient.invalidateQueries({queryKey: ['suggestions']})
    }
  })

  const handleConfirm = (request_id) => {
    setConfirmDelete(request_id)
    setOpen(true)
  }

  const handleDelete = () => {
    setOpen(false)
    declineQuery.mutate({request_id: confirmDelete})
    setConfirmDelete(null)
  }

  return (
    <div className='friend-container'>
      <div className='friend-section'>
        <Typography variant='h4' component='h1' mb={2}>
          Friends
        </Typography>
        {friendQuery.isLoading ?
          <FriendPlaceholder friendPage={true} mb={2}/>
        :
        <div className="scroll">
          <MapFriends friendQuery={friendQuery} handleConfirm={handleConfirm}/>
        </div>}
      </div>
      <div className='friend-section'> 
        <Typography variant='h4' component='h1' mb={2} sx={{alignSelf: 'center'}}>
          Pending Requests
        </Typography>
        { pendingQuery.isLoading ?
        <FriendPlaceholder friendPage={true}/>
        :
        <div className="scroll" >
          <FriendsPending pendingQuery={pendingQuery} acceptQuery={acceptQuery} declineQuery={declineQuery} /> 
        </div>
        }
      </div>
      <div className='friend-section'> 
        <Typography variant='h4' component='h1' mb={2}>
          Suggestions
        </Typography>
        { suggestionsQuery.isLoading ? 
        <FriendPlaceholder friendPage={true}/>
        :
        <div className="scroll" >
          <FriendSuggestions suggestionsQuery={suggestionsQuery} sendRequestQuery={sendRequestQuery} currentUser={currentUser} /> 
        </div>}
      </div>
      <DeleteFriend 
        handleDelete={handleDelete} 
        setOpen={setOpen} 
        open={open} 
        content={'This will remove this friend are you sure you want to continue?'} 
      />
    </div>
  )
}

export default Friends;
