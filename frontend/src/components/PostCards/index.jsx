import Cards from "../Cards";
import { Typography } from "@mui/material";
import {
  usePostsQuery,
  useProfilePostsQuery,
} from "../../components/hooks/usePostsQuery";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PostCards = ({ currentUser, posts }) => {
  const { data, hasNextPage, fetchNextPage } = usePostsQuery();
  const profile = useProfilePostsQuery();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (e) => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        hasNextPage &&
        location.pathname === "/"
      ) {
        fetchNextPage();
      }
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        profile.hasNextPage &&
        location.pathname === "/profile"
      ) {
        profile.fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (posts)
    return posts.length > 0 ? (
      posts.map((post) => (
        <div key={post._id} style={{ marginTop: "1rem", width: "100%" }}>
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
      ))
    ) : (
      <Typography variant="h5" component="h1" textAlign="center" sx={{ mt: 3 }}>
        No Posts Yet...
      </Typography>
    );

  return data.length === 0 ? (
    <Typography variant="h5" component="h1" textAlign="center" sx={{ mt: 3 }}>
      No Posts Yet...
    </Typography>
  ) : (
    data.pages.map((page) =>
      page.posts.map((post) => (
        <div key={post._id} style={{ marginTop: "1rem", width: "100%" }}>
          <Cards
            post={post?.post_body}
            user={post?.user?.username}
            date={post?.date}
            object={post}
            currentUser={currentUser}
          />
        </div>
      ))
    )
  );
};

export default PostCards;
