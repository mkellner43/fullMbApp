import PostInput from '../../components/PostInput';
import { Typography, Snackbar, Alert } from '@mui/material';
import { getPosts } from '../../api/posts';
import { useQuery } from '@tanstack/react-query';
import { AvatarWithStatus } from '../../components/AvatarWithStatus';
import PostCardSkeleton from '../../components/Placeholders/PostCardSkeleton';
import PostCards from '../../components/PostCards';
import { useDispatch, useSelector } from 'react-redux';
// import { setToken } from '../Login/features/loginSlice';
import { removeMainError } from './features/homeSlice';

const Home = ({currentUser}) => {
  const mainError = useSelector(state => state.home.mainError)
  const dispatch = useDispatch();
  
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    // onError: () => dispatch(setToken())
  })

  const handleClose = () => {
    dispatch(removeMainError())
  }

  return (
    <div className='center container'>
      {/* ERROR SNACKBAR probs need to make this only in nav*/}
      <div className='page-width'>
        {mainError && <Snackbar open={mainError ? true : false} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
            <Alert severity="error" onClose={handleClose} >
              {mainError}
            </Alert>
          </Snackbar>}
        <div className='center'>
          <AvatarWithStatus user={currentUser} width={'5rem'} height={'5rem'}/>
          <Typography sx={{mb: 2}}>{currentUser.username}</Typography>
        </div>
        <div>
          <div>
            <PostInput />
          </div>
          </div>
          {postsQuery.isLoading ?
            <PostCardSkeleton />
            : 
            <PostCards posts={postsQuery.data} currentUser={currentUser} />
          }
        </div>
    </div>
  )
}

export default Home;
