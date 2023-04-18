import { useState } from 'react';
import { postLike, postComment, deletePost, getPostComments } from '../../api/posts';
import { useNavigate } from 'react-router-dom';
import { Delete, ThumbUp, ChatBubble } from '@mui/icons-material'
import { TextField, Button, Badge, Typography, IconButton } from '@mui/material';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketProvider';
import { AvatarWithStatus } from '../AvatarWithStatus';
import Comment from '../Comment';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../../pages/Profile/features/profileSlice';
import SimpleTextAnswer from '../Modals/SimpleTextAnswer';
import './style/style.scss';

const Cards = ({post, comments, date, user, object, currentUser}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UsFormatter = new Intl.DateTimeFormat('en-US');
  const [likes, setLikes] = useState(object?.likes?.filter(like => like._id === currentUser.id).length > 0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState();
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const deleteThisPost = useMutation({
    mutationFn: deletePost,
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['posts'])
      const oldPosts = queryClient.getQueryData(['posts'])
      queryClient.setQueryData(['posts'], (old) => old.filter(post => post._id !== variables))
      return {oldPosts}
    },
    onError: (data, variables, context) => {
      queryClient.setQueryData(['posts'], context.oldPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  const addComment = useMutation({
    mutationFn: postComment,
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['posts'])
      const oldPosts = queryClient.getQueryData(['posts'])
      const comment = { 
        _id: 'newpost',
        comment_body: variables.comment,
        date: Date.now(),
        user: variables.currentUser,
        post: variables.object._id
      }
      queryClient.setQueryData(['posts'], (old) => {
        old.map(post => {
          if(post._id === variables.object._id){
            post.comments.unshift(comment)
            return post
          } else return post
        })
      })
      return {oldPosts}
    },
    onSuccess: (data) => {
      socket?.emit('notification', {to_id: data.user, type: 'Comment', msg: `${currentUser.username} commented on your post!`})
    },
    onError: (err, vars, context ) => {
      queryClient.setQueryData(['posts'], context.oldPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  const addLike = useMutation({
    mutationFn: postLike,
    onMutate: async(variables) => {
      await queryClient.cancelQueries(['posts'])
      const oldPosts = queryClient.getQueryData(['posts'])
      queryClient.setQueryData(['posts'], (old) => {
        console.log(old)
        return old.map(post => {
          if(post._id === variables.object._id){
            if(likes) post.likes = post.likes.filter(like => like.id !== currentUser.id) 
            else post.likes.unshift(currentUser)
            return post 
          } else return post
        })
      })
      return {oldPosts}
    },
    onSuccess: (data) => {
      if(data.msg === 'like added'){
        socket?.emit('notification', {to_id: data.data.user, type: 'Like', msg: `${currentUser.username} liked your post!`})
      }
    },
    onError: (err, vars, context) => {
     queryClient.setQueryData(['posts'], context.oldPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  const handleLike = () => {
    setLikes(prevState => !prevState)
    addLike.mutate({object})
  }

  const submitComment = (e) => {
    e.preventDefault()
    if(comment?.trim().split('').length > 0) {
      addComment.mutate({object, comment, currentUser})
      setComment('')
    } 
  }

  const handleDelete = () => {
    setModal(true)
  }
  
  const deleteConfirmed = () => {
    deleteThisPost.mutate(object._id)
    setModal(false)
  }

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user))
    navigate('/profile')
  }

  const checkSubmit = e => e.key === 'Enter' && submitComment(e)

  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    isFetchingNextPage,
    // status,
  } = useInfiniteQuery({
    queryKey: [`post: ${object.id}`, 'comments'],
    queryFn: ({pageParam}) => {
      return getPostComments(object.id, 2, pageParam)
    },
    getNextPageParam: (lastPage, pages) => {
      if(lastPage.nextCursor < object.commentCount) 
        return lastPage.nextCursor
      else return undefined;
    }
  })

  const more_post_comments = data?.pages.flatMap(page => page.comments.flatMap(comment => <Comment key={comment._id} comment={comment}/>))

  return (
    <div className='post-card'>
      {/* heading */}
      <div className="post-heading">
        <div className='post-avatar'
        onClick={() => redirectToProfile({id: object.user._id, user: object.user})}
        >
          <AvatarWithStatus user={object.user} width={'3rem'} height= {'3rem'} />
          <Typography variant="h3" fontSize='1rem' ml={1} fontWeight={400} noWrap>
            {user}
          </Typography>
        </div>
        <div>
          <Typography color="text.secondary" variant='caption' noWrap>
            {date && UsFormatter.format(new Date(date))}
          </Typography>
          {currentUser.id === object?.user?._id &&
          <IconButton size='large' onClick={handleDelete}>
            <Delete color='error'/>
          </IconButton>}
        </div>
      </div>
      {/* post content */}
      <div className='post-content'>
        <div className='post-text'>
          <Typography variant="body1" fontWeight={200} noWrap>
            {post}
          </Typography>
        </div>
      {object.image && 
      <img className='post-image' alt={post} src={object.image} />}
      {/* src={object.image.url} for fb-database, I structured devMb data slightly differently */}
      {/* post actions */}
      <div className='post-actions'>
          <IconButton sx={{}} size="small" onClick={handleLike}>
        <Badge badgeContent={object.likes.length} color="primary">
            <ThumbUp sx={{mt: 0.6}} color={likes ? 'primary' : ''}/>
        </Badge>
          </IconButton>
        <IconButton 
          size="small" 
          onClick={() => setIsCommenting(prevState => !prevState)}
          color={isCommenting ? 'primary' : ''}
          >
          <Badge badgeContent={object.commentCount} color="primary">
            <ChatBubble sx={{mt: 0.6}}/>
          </Badge>
        </IconButton>
      </div>
      {/* comments section */}
      {isCommenting &&
      <form className='m1' onSubmit={submitComment}>
        <TextField
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          maxRows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          size='small'
          type='text'
          onKeyDown={checkSubmit}
        />
        <Button type="submit" variant="contained" size='small' fullWidth sx={{mt: 1}}>
          Comment
        </Button>
      </form>}
        {isCommenting && more_post_comments}
        {isCommenting && hasNextPage && 
        <Button variant='outlined' size='small' sx={{width:'50%', alignSelf: 'center'}} onClick={() => fetchNextPage()}>
          show more
        </Button>}
        {isFetchingNextPage && isCommenting && 
        <Typography width={'100%'} textAlign="center">
          Loading...
        </Typography>}
      </div>
      <SimpleTextAnswer handleDelete={deleteConfirmed} setOpen={setModal} open={modal} content={'Permanently delete this post?'}/>
    </div>
  )
}

export default Cards;
