import { useEffect, useLayoutEffect, useRef } from 'react';
import { Typography } from "@mui/material";
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketProvider';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarWithStatus } from '../../components/AvatarWithStatus';
import { AnimatePresence, motion } from 'framer-motion';
import { setTyping } from '../../pages/Messages/features/messagesSlice';
import { CircularProgress } from "@mui/material";
import { useMessageThread } from "../hooks/useMessages";
import MessageForm from './Helpers/MessageForm';
import TypingIndicator from './Helpers/TypingIndicator';
import RefreshIcon from './Helpers/RefreshIcon';
import FriendTitle from './Helpers/FriendTitle';
import './style/style.scss';
// import { setToken } from '../../pages/Login/features/loginSlice';

const MessageSection = () => {
  const friend = useSelector(state => state.messages.friend)
  const currentUser = useSelector(state => state.login.currentUser)
  const typing = useSelector(state => state.messages.typing)
  const queryClient = useQueryClient()
  const scroll = useRef(null)
  const lastMessage = useRef(null)
  const typingBubble = useRef(null)
  const scrollPosition = useRef(null)
  const socket = useSocket()
  const dispatch = useDispatch()
  const UsFormatter = new Intl.DateTimeFormat('en-US',
   {timeStyle: 'short', dateStyle: 'short'})
  const thread = useMessageThread(friend?._id)

  useLayoutEffect(()=> {
    if(thread.data?.pages.length === 1){
      scroll.current?.scrollIntoView(false)
    } else lastMessage?.current?.scrollIntoView(true)
  }, [thread.data?.pages])

  useLayoutEffect(() => {
    typingBubble.current?.scrollIntoView({behavior: 'smooth', block: "end"})
  }, [typing])

  useEffect(() => {
    socket?.on('typing', () => dispatch(setTyping(true)))
    socket?.on('not typing', () => dispatch(setTyping(false)))
    socket?.on('message received', (data) => {
      queryClient.setQueryData(['thread'], data)
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['thread'])
    })
    return () => {
      socket?.off('typing')
      socket?.off('not typing')
      socket?.off('message received')
      dispatch(setTyping(false))
    }
  }, [socket, queryClient, dispatch])
  
  const handleScroll = () => {
    if(scrollPosition.current.scrollHeight !== scrollPosition.current.clientHeight &&
      scrollPosition.current.scrollTop === 0 && thread.hasNextPage) {
        thread.fetchNextPage();
    }
  }

  return (
    <div className='message-section'>
      <div className='align-center'>
        <FriendTitle friend={friend}/>
        <AnimatePresence>
          <motion.div layoutScroll className='chat-scroll' ref={scrollPosition} onScroll={handleScroll}>
            <motion.div className='expand' key={1} />
            { thread.isLoading && 
              <motion.div className='circleLoaderContainer' key='circleLoader'>
                <CircularProgress/>
              </motion.div> }
            { thread.isFetchingNextPage && <RefreshIcon /> }
            { thread.data?.pages[0] &&
              thread.data.pages.map( (page, indx) => page.messages.map((message, idx) => {
              let attributes = { ref: {} }
              if(idx === page.messages.length - 1 && indx === thread.data.pages.length - 1) attributes.ref = scroll
              if(idx === 0 && indx === 1) attributes.ref = lastMessage
    
              return (
                <motion.div 
                  layout
                  className='message' 
                  key={message._id + idx}
                  {...attributes}
                >
                  <div className={message.sender._id === currentUser.id ? 'currentUserMessage' : 'friendMessage'} >
                    <Typography variant='caption'>
                    {UsFormatter.format(new Date(message.date))}
                    </Typography>
                  </div>
                  <div className={`post-avatar ${message.sender._id === currentUser.id ? 'user-message' : 'friend-message'}`}>
                    <Typography variant='body1' className={`message-text`}>
                      {message.message}
                    </Typography>
                    <AvatarWithStatus user={message.sender._id === currentUser.id ? currentUser : friend} />
                  </div>
                </motion.div>) }
            )) }
            { thread.isSuccess && !thread.data?.pages[0] &&
            <Typography sx={{position: 'absolute', top: '50%', textAlign: 'center', width: 1}}>
              No Messages Yet
            </Typography> }
            <TypingIndicator scroll={typingBubble} typing={typing} />
          </motion.div>
        </AnimatePresence>
        <MessageForm scroll={scroll} />
      </div>
    </div>
  )
}

export default MessageSection;

// scroll behavior issues when changing friends or sending a message