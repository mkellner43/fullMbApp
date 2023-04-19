import { useRef, useState, useLayoutEffect } from 'react';
import { sendFriendRequest, acceptFriend, declineFriend } from '../../api/friends';
import {Typography} from '@mui/material';
import { useSocket } from '../../context/SocketProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteFriend from '../../components/Modals/SimpleTextAnswer';
import MapFriends from '../../components/FriendsContainer';
import FriendsPending from '../../components/FriendsPending';
import FriendSuggestions from '../../components/FriendSuggestions';
import FriendPlaceholder from '../../components/Placeholders/FriendPlaceholder';
import { setToken } from '../Login/features/loginSlice';
import { useDispatch } from 'react-redux';
import { useFriendQuery, usePendingQuery, useSuggestionQuery } from '../../components/hooks/useFriendQuery';
import './style/style.scss';

const Friends = ({currentUser}) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState();
  const friendQuery = useFriendQuery();
  const pendingQuery = usePendingQuery();
  const suggestionsQuery = useSuggestionQuery();
  const friendsScroll = useRef();
  const pendingScroll = useRef();
  const suggestionsScroll = useRef();

  // NEED TO RESTRUCTURE OPTOMISM
  // get infinite scroll and search to work here (: 

  const declineQuery = useMutation({
    mutationFn: ({request_id}) =>
      declineFriend(request_id),
      // console.log('delete'),
    onMutate: async(variables) => {
      await queryClient.cancelQueries({queryKey: ['friends']})
      await queryClient.cancelQueries({queryKey: ['pending']})
      await queryClient.cancelQueries({queryKey: ['suggestions']})
      const oldSuggestions = queryClient.getQueryData(['suggestions'])
      const oldFriends = queryClient.getQueryData(['friends'])
      const oldPending = queryClient.getQueryData(['pending'])

      const [pendingFriend] = queryClient.getQueryData(['pending']).pages.map( page => page.pending?.find( request => request.request_id === variables.request_id))
      const [oldFriend] = queryClient.getQueryData(['friends']).pages.map( page => page.friends?.find( request => request.request_id === variables.request_id))

      queryClient.setQueryData(['pending'], (old) => {
        const newPages = old.pages.map( page => {
          return {
            ...page,
            pending: page.pending?.filter( request => request.request_id !== variables.request_id)
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
      queryClient.setQueryData(['friends'], (old) => { 
        const newPages = old.pages.map( page => {
          return {
            ...page,
            friends: page.friends?.filter( request => request.request_id !== variables.request_id)
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
      queryClient.setQueryData(['suggestions'], (old) => { 
        const newPages = old.pages.map( page => {
          const friend = pendingFriend || oldFriend
          return {
            ...page,
            suggestions: page.suggestions?.length > 0 ? [...page.suggestions, friend.user] : [friend.user]
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
      return {oldPending, oldFriends, oldSuggestions}
    },
    onError: (_err, _request, context) => {
      queryClient.setQueryData(['friends'], context.oldPending)
      queryClient.setQueryData(['pending'], context.oldFriends)
      queryClient.setQueryData(['suggestions'], context.oldSuggestions)
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
      // console.log('accept'),
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['pending'])
      await queryClient.cancelQueries(['friends'])
      const oldFriends = queryClient.getQueryData(['friends'])
      const oldPending = queryClient.getQueryData(['pending'])
      const [newFriend] = queryClient.getQueryData(['pending']).pages.map( page => page.pending.find( request => request.request_id === variables.request_id))
      queryClient.setQueryData(['pending'], (old) => { 
        const newPages = old.pages.map( page => {
          return page.pending?.length > 0 ?
           {
            ...page,
            pending: page.pending?.filter( request => request.request_id !== variables.request_id)
          }
          :
          page
        })
        return {
          ...old,
          pages: newPages
        }
      })
      queryClient.setQueryData(['friends'], (old) => { 
        const newPages = old.pages.map( page => {
          return {
            ...page,
            friends: page.friends?.length > 0 ? [...page.friends, newFriend] : [newFriend]
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
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
      // console.log('sent'),
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['pending'])
      await queryClient.cancelQueries(['suggestions'])
      const prevPending = queryClient.getQueryData(['pending'])
      const prevSuggestions = queryClient.getQueryData(['suggestions'])
      const [sentTo] = queryClient.getQueryData(['suggestions']).pages.map( page => page.suggestions.filter( friend => friend._id === variables.friend))
      queryClient.setQueryData(['suggestions'], (old) => { 
        const newPages = old.pages.map( page => {
          return {
            ...page,
            suggestions: page.suggestions.filter( friend => friend._id !== variables.friend)
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
      queryClient.setQueryData(['pending'], (old) => { 
        const newPages = old.pages.map( page => {
          return {
            ...page,
            pending: page.pending?.length > 0 ? [...page.pending, {request_id: Math.random(),user: sentTo[0], type: 'requester'}] : [{request_id: Math.random(), user: sentTo[0], type: 'requester'}]
          }
        })
        return {
          ...old,
          pages: newPages
        }
      })
      return {prevPending, prevSuggestions}
    },
    onSuccess: (data, variables, context) => {
      console.log(data, variables, context)
      socket?.emit('notification', {to_id: variables._id, type: 'Friend Request', msg: `${currentUser.username} sent you a friend request!`})
    },
    onError: (_err, _request, context) => {
      queryClient.setQueryData(['pending'], context.prevPending)
      queryClient.setQueryData(['suggestions'], context.prevSuggestions)
      dispatch(setToken())
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['pending']})
      queryClient.invalidateQueries({queryKey: ['suggestions']})
    }
  })

  useLayoutEffect(() => {
    if(friendsScroll.current?.clientHeight === friendsScroll.current?.scrollHeight && friendQuery.hasNextPage) friendQuery.fetchNextPage()
    
    if(pendingScroll.current?.clientHeight === pendingScroll.current?.scrollHeight && pendingQuery.hasNextPage) pendingQuery.fetchNextPage()

    if(suggestionsScroll.current?.clientHeight === suggestionsScroll.current?.scrollHeight && suggestionsQuery.hasNextPage) suggestionsQuery.fetchNextPage()
  }, [friendQuery, pendingQuery, suggestionsQuery])

  const handleFriendScroll = () => {
    if(friendsScroll.current.clientHeight + friendsScroll.current.scrollTop === friendsScroll.current.scrollHeight) friendQuery.fetchNextPage()
  }

  const handlePendingScroll = () => {
    if(pendingScroll.current.clientHeight + pendingScroll.current.scrollTop === pendingScroll.current.scrollHeight) pendingQuery.fetchNextPage()
  }

  const handleSuggestionsScroll = () => {
    if(suggestionsScroll.current.clientHeight + suggestionsScroll.current.scrollTop === suggestionsScroll.current.scrollHeight) suggestionsQuery.fetchNextPage()
  }

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
        <div className="scroll" ref={friendsScroll} onScroll={handleFriendScroll}>
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
        <div className="scroll" ref={pendingScroll} onScroll={handlePendingScroll}>
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
        <div className="scroll" ref={suggestionsScroll} onScroll={handleSuggestionsScroll}>
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
