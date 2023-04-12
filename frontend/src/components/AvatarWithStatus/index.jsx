import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketProvider';
import { StyledOnlineBadge, StyledOfflineBadge } from './themes/style';

export const AvatarWithStatus = ({user, width='3rem', height='3rem'}) => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const userID = user?.id || user?._id
  // eslint-disable-next-line no-unused-vars
  const [statusChange, setStatusChange] = useState(false)
  
  useEffect(() => {
    socket?.emit('onlineFriends')
    socket?.on('onlineFriends', (data) => {
      queryClient.setQueryDefaults(['onlineFriends'], {cacheTime: Infinity})
      queryClient.setQueryData(['onlineFriends'], data)
      setStatusChange(prev => !prev)
    })
    return () => {
      socket?.off('onlineFriends')
    };
  }, [socket, queryClient])

  return queryClient.getQueryData(['onlineFriends'])?.includes(userID) ? 
    <StyledOnlineBadge
      overlap="circular"
      anchorOrigin={{ 
        vertical: 'bottom',
        horizontal: 'right' 
      }}
      variant="dot"
    >
      <Avatar 
        src={user?.avatar?.url}
        sx={{width: width,
        height: height}}
        >
        {user?.first_name.split('')[0]}
        {user?.last_name.split('')[0]}
      </Avatar>
    </StyledOnlineBadge> 
    :
    <StyledOfflineBadge
      overlap="circular"
      anchorOrigin={{ 
        vertical: 'bottom',
        horizontal: 'right' 
      }}
      variant="dot"
    >
      <Avatar 
        src={user?.avatar?.image}
        sx={{width: width,
          height: height}}
        >
        {user?.first_name.split('')[0]}
        {user?.last_name.split('')[0]}
      </Avatar>
    </StyledOfflineBadge> 
}

