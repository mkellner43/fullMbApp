import PostInput from '../../components/PostInput';
import { Typography, Snackbar, Alert } from '@mui/material';
import { AvatarWithStatus } from '../../components/AvatarWithStatus';
import PostCardSkeleton from '../../components/Placeholders/PostCardSkeleton';
import PostCards from '../../components/PostCards';
import { useDispatch, useSelector } from 'react-redux';
// import { setToken } from '../Login/features/loginSlice';
import { removeMainError } from './features/homeSlice';
import {usePostsQuery} from '../../components/hooks/usePostsQuery';

const Home = ({currentUser}) => {
  const mainError = useSelector(state => state.home.mainError)
  const dispatch = useDispatch();
  const postsQuery = usePostsQuery();

  const handleClose = () => {
    dispatch(removeMainError())
  }

  return (
    <div className='center container' >
      {/* ERROR SNACKBAR probs need to make this only in nav*/}
      <div className='page-width' style={{overflow: 'scroll', height: '100%', scrollbarWidth: 'none', paddingTop: '6rem'}} >
        {mainError && <Snackbar open={mainError ? true : false}
         anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
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
        <div>
        {postsQuery.isLoading ?
          <PostCardSkeleton />
          : 
          <PostCards currentUser={currentUser} />
        }
        {
          postsQuery.isFetchingNextPage && 
          <div className="dot-container">
            <span className='dot1'/>
            <span className='dot2'/>
            <span className='dot3'/>
          </div>
        }
        </div>
      </div>
    </div>
  )
}

export default Home;
