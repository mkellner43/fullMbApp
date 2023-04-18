import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../api/posts";
import { setToken } from "../../pages/Login/features/loginSlice";
import { useDispatch } from "react-redux";

const usePostsQuery = () => {
  const dispatch = useDispatch();
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async({pageParam=0}) => getPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if(lastPage.hasMore) return lastPage.cursor
    },
    retry: false,
    onError: (err) => {
      document.cookie = 'access_token= ; max-age=0'
      sessionStorage.clear()
      dispatch(setToken())
    }
  })
}
  
export default usePostsQuery