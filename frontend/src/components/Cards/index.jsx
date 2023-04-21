import { useState } from "react";
import {
  postLike,
  postComment,
  deletePost,
  getPostComments,
} from "../../api/posts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Delete, ThumbUp, ChatBubble } from "@mui/icons-material";
import {
  TextField,
  Button,
  Badge,
  Typography,
  IconButton,
} from "@mui/material";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSocket } from "../../context/SocketProvider";
import { AvatarWithStatus } from "../AvatarWithStatus";
import Comment from "../Comment";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";
import SimpleTextAnswer from "../Modals/SimpleTextAnswer";
import "./style/style.scss";

const Cards = ({ post, date, user, object, currentUser }) => {
  const location = useLocation();
  const urlParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UsFormatter = new Intl.DateTimeFormat("en-US");
  const [likes, setLikes] = useState(
    object?.likes?.filter((like) => like._id === currentUser.id).length > 0
  );
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState();
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const deleteThisPost = useMutation({
    mutationFn: deletePost,
    onMutate: async (variables) => {
      //adjust for this mutation this is for sending a post
      queryClient.cancelQueries(["posts"]);
      queryClient.cancelQueries(["profile", currentUser.id]);
      const oldPosts = queryClient.getQueryData(["posts"]);
      const oldProfile = queryClient.getQueryData(["profile", currentUser.id]);
      queryClient.setQueryData(["profile", currentUser.id], (old) => {
        if (!oldProfile) return undefined;
        const newPages = old.pages?.map((page) => {
          return {
            ...page,
            posts: page.posts.filter((post) => post._id !== variables),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });

      queryClient.setQueryData(["posts"], (old) => {
        const newPages = old.pages?.map((page) => {
          return {
            ...page,
            posts: page.posts.filter((post) => post._id !== variables),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });

      return { oldPosts, oldProfile };
    },
    onSuccess: (data, variables, context) => {
      queryClient.removeQueries([`post:${variables}`, "comments"]);
    },
    onError: (data, variables, context) => {
      queryClient.setQueryData(["posts"], context.oldPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const addComment = useMutation({
    mutationFn: postComment,
    // () => console.log('commented'),
    onMutate: async (variables) => {
      await queryClient.cancelQueries([
        `post: ${variables.object._id}`,
        `comments`,
      ]);
      const oldComments = queryClient.getQueryData([
        `post: ${variables.object._id}`,
        `comments`,
      ]);
      const comment = {
        _id: Math.random(),
        comment_body: variables.comment,
        date: Date.now(),
        user: variables.currentUser,
        post: variables.object._id,
      };
      queryClient.setQueryData(
        [`post: ${variables.object._id}`, `comments`],
        (old) => {
          const newPages = old.pages.map((page, idx) =>
            idx === 0
              ? { ...page, comments: [comment, ...page.comments] }
              : page
          );
          return {
            ...old,
            pages: newPages,
          };
        }
      );
      return { oldComments };
    },
    onSuccess: (data) => {
      socket?.emit("notification", {
        to_id: data.user,
        type: "Comment",
        msg: `${currentUser.username} commented on your post!`,
      });
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        [`post: ${variables.object._id}`, `comments`],
        context.oldPosts
      );
    },
    onSettled: (data) => {
      console.log(data);
      queryClient.invalidateQueries([`post: ${data._id}`, `comments`]);
    },
  });

  const addLike = useMutation({
    mutationFn: postLike,
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["posts"]);
      const oldPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old) => {
        const newPages = old.pages.map((page) => {
          if (page.posts.includes(variables.object)) {
            return likes
              ? {
                  ...page,
                  posts: page.posts.map((post) =>
                    post._id === variables.object._id
                      ? {
                          ...post,
                          likes: post.likes?.filter(
                            (like) => like._id !== currentUser.id
                          ),
                        }
                      : post
                  ),
                }
              : {
                  ...page,
                  posts: page.posts.map((post) => {
                    if (post._id === variables.object._id) {
                      return post.likes?.length > 0
                        ? {
                            ...post,
                            likes: [
                              ...post.likes,
                              {
                                _id: Math.random(),
                                user: currentUser,
                                post_id: variables.object._id,
                              },
                            ],
                          }
                        : {
                            ...post,
                            likes: [
                              {
                                _id: Math.random(),
                                user: currentUser,
                                post_id: variables.object._id,
                              },
                            ],
                          };
                    } else return post;
                  }),
                };
          } else return page;
        });
        return {
          ...old,
          pages: newPages,
        };
      });
      if (location.pathname.includes("profile") && urlParams.id) {
        queryClient.setQueryData([`profile`, `${urlParams.id}`], (old) => {
          const newPages = old.pages.map((page) => {
            if (page.posts.includes(variables.object)) {
              return likes
                ? {
                    ...page,
                    posts: page.posts.map((post) =>
                      post._id === variables.object._id
                        ? {
                            ...post,
                            likes: post.likes?.filter(
                              (like) => like._id !== currentUser.id
                            ),
                          }
                        : post
                    ),
                  }
                : {
                    ...page,
                    posts: page.posts.map((post) => {
                      if (post._id === variables.object._id) {
                        return post.likes?.length > 0
                          ? {
                              ...post,
                              likes: [
                                ...post.likes,
                                {
                                  _id: Math.random(),
                                  user: currentUser,
                                  post_id: variables.object._id,
                                },
                              ],
                            }
                          : {
                              ...post,
                              likes: [
                                {
                                  _id: Math.random(),
                                  user: currentUser,
                                  post_id: variables.object._id,
                                },
                              ],
                            };
                      } else return post;
                    }),
                  };
            } else return page;
          });
          return {
            ...old,
            pages: newPages,
          };
        });
      }
      return { oldPosts };
    },
    onSuccess: (data) => {
      if (data.msg === "like added") {
        socket?.emit("notification", {
          to_id: data.data.user,
          type: "Like",
          msg: `${currentUser.username} liked your post!`,
        });
      }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["posts"], context.oldPosts);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["profile", urlParams.id]);
    },
  });

  const handleLike = () => {
    setLikes((prevState) => !prevState);
    addLike.mutate({ object });
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (comment?.trim().split("").length > 0) {
      addComment.mutate({ object, comment, currentUser });
      setComment("");
    }
  };

  const handleDelete = () => {
    setModal(true);
  };

  const deleteConfirmed = () => {
    deleteThisPost.mutate(object._id);
    setModal(false);
  };

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${user._id}`);
  };

  const checkSubmit = (e) => e.key === "Enter" && submitComment(e);

  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    isFetchingNextPage,
    // status,
  } = useInfiniteQuery({
    queryKey: [`post: ${object.id}`, "comments"],
    queryFn: ({ pageParam = 0 }) => {
      return getPostComments(object.id, 10, pageParam);
    },
    retry: false,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.nextCursor < object.commentCount) return lastPage.nextCursor;
      else return undefined;
    },
    enabled: !!object.id,
  });

  const more_post_comments = data?.pages?.map((page) =>
    page.comments?.map((comment) => (
      <Comment key={comment._id} comment={comment} />
    ))
  );

  return (
    <div className="post-card">
      {/* heading */}
      <div className="post-heading">
        <div
          className="post-avatar"
          onClick={() => redirectToProfile(object.user)}
        >
          <AvatarWithStatus user={object.user} width={"3rem"} height={"3rem"} />
          <Typography
            variant="h3"
            fontSize="1rem"
            ml={1}
            fontWeight={400}
            noWrap
          >
            {user}
          </Typography>
        </div>
        <div>
          <Typography color="text.secondary" variant="caption" noWrap>
            {date && UsFormatter.format(new Date(date))}
          </Typography>
          {currentUser.id === object?.user?._id && (
            <IconButton size="large" onClick={handleDelete}>
              <Delete color="error" />
            </IconButton>
          )}
        </div>
      </div>
      {/* post content */}
      <div className="post-content">
        <div className="post-text">
          <Typography variant="body1" fontWeight={200}>
            {post}
          </Typography>
        </div>
        {object.image && (
          <img className="post-image" alt={post} src={object.image} />
        )}
        {/* src={object.image.url} for fb-database, I structured devMb data slightly differently */}
        {/* post actions */}
        <div className="post-actions">
          <IconButton sx={{}} size="small" onClick={handleLike}>
            <Badge badgeContent={object.likes?.length} color="primary">
              <ThumbUp sx={{ mt: 0.6 }} color={likes ? "primary" : ""} />
            </Badge>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setIsCommenting((prevState) => !prevState)}
            color={isCommenting ? "primary" : ""}
          >
            <Badge
              badgeContent={data?.pages[0].comments?.length}
              color="primary"
            >
              <ChatBubble sx={{ mt: 0.6 }} />
            </Badge>
          </IconButton>
        </div>
        {/* comments section */}
        {isCommenting && (
          <form className="m1" onSubmit={submitComment}>
            <TextField
              id="outlined-multiline-flexible"
              label="Comment"
              multiline
              maxRows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="small"
              type="text"
              onKeyDown={checkSubmit}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
            >
              Comment
            </Button>
          </form>
        )}
        {isCommenting && more_post_comments}
        {isCommenting && hasNextPage && (
          <Button
            variant="outlined"
            size="small"
            sx={{ width: "50%", alignSelf: "center" }}
            onClick={() => fetchNextPage()}
          >
            show more
          </Button>
        )}
        {isFetchingNextPage && isCommenting && (
          <Typography width={"100%"} textAlign="center">
            Loading...
          </Typography>
        )}
      </div>
      <SimpleTextAnswer
        handleDelete={deleteConfirmed}
        setOpen={setModal}
        open={modal}
        content={"Permanently delete this post?"}
      />
    </div>
  );
};

export default Cards;
