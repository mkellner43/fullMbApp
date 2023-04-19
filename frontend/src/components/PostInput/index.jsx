import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton, TextField } from '@mui/material';
import { sendPost } from '../../api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPhotoAlternateOutlined, Close } from '@mui/icons-material';
// import { setToken } from '../../pages/Login/features/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setMainError } from '../../pages/Home/features/homeSlice';
import './style/style.scss';

const Post = () => {
  const dispatch = useDispatch();
  const [post, setPost] = useState();
  const [imageAvailable, setImageAvailable] = useState();
  const currentUser = useSelector(state => state.login.currentUser)
  const queryClient = useQueryClient();

  const send = useMutation({
    mutationFn: (object) => 
    sendPost(object),
    // console.log('post sent'),
    onMutate: (variables) => {
      queryClient.cancelQueries(['posts'])
      queryClient.cancelQueries(['profile'])
      const oldPosts = queryClient.getQueryData(['posts'])
      const oldProfile = queryClient.getQueryData(['profile', currentUser.id])

      queryClient.setQueryData(['profile', currentUser.id], old => {
        const newPages = old.pages.map((page, idx) => 
        idx !== 0 ? page : {...page, posts: [{_id: Math.random(), post_body: variables.post_body, post_image: variables.post_image, user: currentUser, likes: [], comments: []},...page.posts]})
        return {
          ...old,
          pages: newPages
        }
      })

      queryClient.setQueryData(['posts'], old => {
        const newPages = old.pages.map((page, idx) => 
        idx !== 0 ? page : {...page, posts: [{_id: Math.random(), post_body: variables.post_body, post_image: variables.post_image, user: currentUser, likes: [], comments: []},...page.posts]})
        return {
          ...old,
          pages: newPages
        }
      })

      return {oldPosts, oldProfile}
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['profile', currentUser.id])
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      queryClient.setQueryData(['posts'], context.oldPosts)
      queryClient.setQueryData(['profile', currentUser.id], context.oldProfile)
      dispatch(setMainError(err.message))
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!post) return
    const object = {post_body: post, post_image: imageAvailable}
    send.mutate(object)
    setPost('')
    discardImage()
  }

  const checkSubmit = e => e.key === 'Enter' && handleSubmit(e)

  const handlePreview = async() => {
    const file = await document.querySelector('#image').files[0]
      const base64String = await toBase64(file)
      setImageAvailable(base64String)
  }

  const discardImage = () => {
   const file = document.querySelector('#image')
   file.value = ''
    setImageAvailable()
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

  return (
    <form onSubmit={handleSubmit} className='post-input'>
      <TextField
        id="outlined-multiline-flexible"
        label="What's on your mind?"
        onChange={(e) => setPost(e.target.value)}
        value={post}
        fullWidth
        multiline
        rows={5}
        type='text'
        name='post'
        onKeyDown={checkSubmit}
      />
      <div className={`image-preview ${imageAvailable ? '' : 'none'}`}>
        <IconButton sx={{color: 'red', alignSelf: 'flex-end'}} onClick={discardImage}>
          <Close />
        </IconButton>
        <img id='preview' alt='preview of upload' src={imageAvailable}/>
      </div>
      <div className='post-buttons'>
        <Button type='submit' size="small" variant='outlined' sx={{flex:1}}>
          Post
        </Button>
        <IconButton size="small" component="label">
          <input id='image' hidden accept='image/*' type="file" onChange={handlePreview}/>
          <AddPhotoAlternateOutlined color='primary'/>
        </IconButton>
      </div>
    </form>
  )
}

export default Post;