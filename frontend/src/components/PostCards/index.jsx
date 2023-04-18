import Cards from '../Cards';
import { Typography } from '@mui/material';
import usePostsQuery from '../../components/hooks/usePostsQuery';
import { useEffect } from 'react';

const PostCards = ({currentUser}) => {
  const { data, hasNextPage, fetchNextPage } = usePostsQuery();

  useEffect(() => {
    const handleScroll = (e) => {
      console.log(window.innerHeight + window.scrollY >= document.body.offsetHeight)
      if(window.innerHeight + window.scrollY >= document.body.offsetHeight && 
        hasNextPage) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  return data.length === 0 ?
    <Typography variant='h5' component='h1' textAlign='center' sx={{mt: 3}}>
      No Posts Yet...
    </Typography>
    :
    data.pages.map( page => page.posts.map(post => 
      <div 
        key={post._id} 
        style={{marginTop: '1rem', width: '100%'}} 
      >  
        <Cards 
          post={post?.post_body}
          comments={post?.comments}
          user={post?.user?.username}
          date={post?.date}
          avatar={post?.user?.avatar?.image}
          object={post}
          currentUser={currentUser}
        />
      </div>)
    )
}

export default PostCards;