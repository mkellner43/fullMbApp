import PostInput from '../../components/PostInput';
import { Typography, Button} from '@mui/material';
import { AvatarWithStatus } from '../../components/AvatarWithStatus';
import PostCardSkeleton from '../../components/Placeholders/PostCardSkeleton';
import PostCards from '../../components/PostCards';
import AvatarPlaceholder from '../../components/Placeholders/AvatarPlaceholder';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatarModule } from './features/profileSlice';
import NewAvatar from '../../components/Modals/NewAvatar';
import { useParams } from 'react-router-dom';
import { useProfilePostsQuery } from '../../components/hooks/usePostsQuery';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.login.currentUser)
  const getProfileData = useProfilePostsQuery(id)
  const profilePosts = getProfileData.data?.pages?.map(page => page.posts)[0]

  return (
    <div className='center container'>
      {getProfileData.isLoading ?
      <div className='page-width center' style={{overflow: 'scroll', height: '100%', scrollbarWidth: 'none', paddingTop: '6rem'}}>
        <AvatarPlaceholder direction={'column'} height={'5rem'} width={'5rem'} />
        <PostCardSkeleton column={'column'}/>
      </div>
      :
      <div className='page-width center' style={{overflow: 'scroll', height: '100%', scrollbarWidth: 'none', paddingTop: '6rem'}}>
        <AvatarWithStatus user={getProfileData.data?.pages[0].posts[0].user} width={'5rem'} height={'5rem'} />
        <Typography>{getProfileData.data?.pages[0].posts[0].user.username}</Typography>
        {currentUser.id === getProfileData.data.pages[0].posts[0].user._id &&
        <Button variant='contained' size='small' component='label' 
        onClick={() => dispatch(setAvatarModule(true))}>
          update avatar
        </Button>}
          { currentUser.id === getProfileData.data.pages[0].posts[0].user._id && <div style={{marginTop: '1rem', width: '100%'}}><PostInput /></div> }
          {profilePosts && <PostCards posts={profilePosts} currentUser={currentUser} />}
        </div>
      }
      <NewAvatar />
    </div>
  )
}

export default Profile;