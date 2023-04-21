import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/posts";
import { profile } from "../../api/user";
import { setToken } from "../../pages/Login/features/loginSlice";
import { useDispatch } from "react-redux";

export const usePostsQuery = () => {
  const dispatch = useDispatch();
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => getPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) return lastPage.cursor;
    },
    retry: false,
    onError: (err) => {
      document.cookie = "access_token= ; max-age=0";
      sessionStorage.clear();
      dispatch(setToken());
    },
  });
};

export const useProfilePostsQuery = (id) => {
  const dispatch = useDispatch();
  return useInfiniteQuery({
    queryKey: ["profile", id],
    queryFn: async ({ pageParam = 0 }) => profile(id, pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) return lastPage.cursor;
    },
    retry: false,
    enabled: !!id,
    onError: (err) => {
      document.cookie = "access_token= ; max-age=0";
      sessionStorage.clear();
      dispatch(setToken());
    },
  });
};
