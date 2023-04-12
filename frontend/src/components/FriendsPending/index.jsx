import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, Chip } from "@mui/material";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../pages/Profile/features/profileSlice';

const FriendsPending = ({pendingQuery, acceptQuery, declineQuery}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user))
    navigate('/profile')
  }

  return pendingQuery.data?.length === 0 ?
    <Typography textAlign={'center'} >No pending friend requests</Typography>
    :
    pendingQuery.data.map(friend => 
    <div key={friend.user._id} className='small-card'>
      <div className="post-avatar"
        onClick={() => redirectToProfile({id: friend.user._id, user: friend.user})}
      >
        <AvatarWithStatus
          user={friend.user}
        />
        <h5 className='text-ellipsis-flex pl1'>
          {friend.user.first_name + ' ' + friend.user.last_name}
        </h5>
      </div>
      {console.log(friend)}
      {friend.type === 'receiver' ?
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Button 
          variant='outlined' 
          color="success" 
          size='small' 
          onClick={() => 
            acceptQuery.mutate({
              request_id: friend.request_id, 
            })
          }>
          Accept
        </Button>
        <Button 
          variant='outlined' 
          color="error" 
          size='small' 
          sx={{mt: 1}} 
          onClick={() => 
            declineQuery.mutate({
              request_id: friend.request_id,
            })
          }>
          Decline
        </Button>
      </div>
      :
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Chip color='warning' variant='filled'label='PENDING...' />
        </Box>}
      </div>
  )
}

export default FriendsPending;
