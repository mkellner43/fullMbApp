import PostInput from '../../components/PostInput';
import { Typography, Button} from '@mui/material';
import { profile } from '../../api/user';
import { useQuery } from '@tanstack/react-query';
import { AvatarWithStatus } from '../../components/AvatarWithStatus';
import PostCardSkeleton from '../../components/Placeholders/PostCardSkeleton';
import PostCards from '../../components/PostCards';
import AvatarPlaceholder from '../../components/Placeholders/AvatarPlaceholder';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatarModule } from './features/profileSlice';
import NewAvatar from '../../components/Modals/NewAvatar';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.login.currentUser)
  const userProfile = useSelector(state => state.profile.userProfile)
  
  useEffect(() => {
    !userProfile && navigate('/');
  }, [userProfile, navigate])

  const getProfileData = useQuery({
    queryKey: ['profile', `${userProfile?.id}`],
    queryFn: () => profile(userProfile?.id),
    enabled: !!userProfile
  })
  
  
  return (
    <div className='center container'>
      {getProfileData.isLoading ?
      <div className='page-width center'>
        <AvatarPlaceholder direction={'column'} height={'5rem'} width={'5rem'} />
        <PostCardSkeleton column={'column'}/>
      </div>
      :
      <div className='page-width center'>
        <AvatarWithStatus user={getProfileData.data?.user} width={'5rem'} height={'5rem'} />
        <Typography>{getProfileData.data?.user.username}</Typography>
        {currentUser.id === getProfileData.data.user._id &&
        <Button variant='contained' size='small' component='label' 
        onClick={() => dispatch(setAvatarModule(true))}>
          update avatar
        </Button>}
          { currentUser.id === getProfileData.data.user._id && <div style={{marginTop: '1rem', width: '100%'}}><PostInput /></div> }
          <PostCards posts={getProfileData.data.posts} currentUser={currentUser} />
        </div>
      }
      <NewAvatar />
    </div>
  )
}

export default Profile;