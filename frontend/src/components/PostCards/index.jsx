import React from 'react';
import Cards from '../Cards';
import { Typography } from '@mui/material';

const PostCards = ({posts, currentUser}) => {
  return posts.length === 0 ?
      <Typography variant='h5' component='h1' textAlign='center' sx={{mt: 3}}>No Posts Yet...</Typography>
    :
    posts.map(post => 
      <div key={post._id} style={{marginTop: '1rem', width: '100%'}}>  
        <Cards 
          post={post?.post_body}
          comments={post?.comments}
          user={post?.user?.username}
          date={post?.date}
          avatar={post?.user?.avatar?.image}
          object={post}
          currentUser={currentUser}
        />
      </div>  
    )
}

export default PostCards;