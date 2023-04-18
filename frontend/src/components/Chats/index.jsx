import { TextField, Typography, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FriendPlaceholder from "../Placeholders/FriendPlaceholder";
import { useDispatch, useSelector } from "react-redux";
import { setSearch, setSearchResults, setFriend } from "../../pages/Messages/features/messagesSlice";
import { getThreads } from '../../api/message';
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useFriendQuery } from "../hooks/useFriendQuery";

const Chats = () => {
  const dispatch = useDispatch();
  const search = useSelector(state => state.messages.search)
  const searchResults = useSelector(state => state.messages.searchResults)
  const currentUser = useSelector(state => state.login.currentUser)
  const friendQuery = useFriendQuery();
  const threadQuery = useQuery({queryKey: ['threads'], queryFn: () => getThreads()})

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value))
    const [results] =friendQuery.data.pages.map(page => page.friends.filter( friend => {
      if(e.target.value.trim().length === 0) return null
      return friend.user.username.toLowerCase().includes(e.target.value.toLowerCase())
    }))
    dispatch(setSearchResults(results))
  }
  const pickMessage = threadQuery.data?.map(thread => {
    const friend = thread.users.filter(user => user._id !== currentUser.id)[0]
    return <Button 
    sx={{display: 'flex', justifyContent: 'flex-start'}}
    key={friend?._id} 
    fullWidth 
    variant='outlined'
    onClick={() => dispatch(setFriend(friend))} >
      <AvatarWithStatus user={friend} width={'3rem'} height={'3rem'}/>
      <Typography ml={1}>
        {friend?.username} 
      </Typography>
  </Button> })
  console.log(searchResults)
  const pickFromSearch = searchResults?.map(result =>
    <Button
    sx={{display: 'flex', justifyContent: 'flex-start'}}
    variant='outlined'
    key={result.user._id} 
    fullWidth 
    onClick={() => {
      dispatch(setFriend(result.user))
      dispatch(setSearch(''))
      dispatch(setSearchResults([]))
    }} >
    <AvatarWithStatus user={result.user} />
    <Typography ml={1}>
      {console.log(result)}
      {result.user.username} 
    </Typography>
  </Button>)

  return (
    <div className='chats-section'>
    <h1>
      Chats
    </h1>
    <TextField label="Search Friends" variant="filled" size='small' fullWidth value={search} onChange={handleSearch} />
    { searchResults.length > 0 && 

    <div className='scroll'>
      {pickFromSearch}
    </div>}

    { threadQuery.isLoading ?
    <FriendPlaceholder />
    :
    <div className='scroll flex-grow'>
      {pickMessage}
    </div>}
  </div>
  )
}

export default Chats;


/// need to get messages to show up, was able to get new threads created and showing up
/// work on infinite query and updating backend to make sense logistically