import { Chip, Typography, Divider } from '@mui/material';
import { AvatarWithStatus } from '../AvatarWithStatus';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../pages/Profile/features/profileSlice';
import './style/style.scss';

const Comment = ({comment}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UsFormatter = new Intl.DateTimeFormat('en-US');
  
  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user))
    navigate('/profile')
  }
  
  return (
    <div className='comment'>
      <Divider />
      <div className='comment-content' 
        onClick={ () => 
        redirectToProfile({ id: comment.user._id, user: comment.user })}
      >
        <div className='post-avatar left'>
          <AvatarWithStatus
            user={comment.user}
          />
          <Typography variant="h3" fontSize='1rem' component='h4' sx={{ml: 1}}>
            {" " + comment.user.first_name + " " + comment.user.last_name}
          </Typography>
        </div>
        <div className='time-comment'>
          <Typography color="text.secondary" variant='caption' noWrap>
            {UsFormatter.format(new Date(comment.date))}
          </Typography>
          <Chip label={comment.comment_body} color="primary"></Chip>
        </div>
      </div>
    </div>
  )
}

export default Comment;
