import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getFriends,
  getPendingRequests,
  getSuggestions,
} from "../../api/friends";
import { useDispatch } from "react-redux";
import { setToken } from "../../pages/Login/features/loginSlice";

export const useFriendQuery = () => {
  const dispatch = useDispatch();

  return useInfiniteQuery({
    queryKey: ["friends"],
    queryFn: async ({ pageParam = 0 }) => getFriends(pageParam),
    getNextPageParam: (lastPage, pages) => {
      console.log(lastPage, pages);
      if (lastPage.hasMore) return lastPage.cursor;
      return undefined;
    },
    retry: false,
    onError: (err) => {
      document.cookie = "access_token= ; max-age=0";
      sessionStorage.clear();
      dispatch(setToken());
    },
  });
};

export const usePendingQuery = () => {
  const dispatch = useDispatch();

  return useInfiniteQuery({
    queryKey: ["pending"],
    queryFn: async ({ pageParam = 0 }) => getPendingRequests(pageParam),
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

export const useSuggestionQuery = () => {
  const dispatch = useDispatch();

  return useInfiniteQuery({
    queryKey: ["suggestions"],
    queryFn: async ({ pageParam = 0 }) => getSuggestions(pageParam),
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
