import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/notifications";
import { setToken } from "../../pages/Login/features/loginSlice";
import { useDispatch } from "react-redux";

const useNotificationQuery = () => {
  const dispatch = useDispatch();
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }) => getNotifications(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.cursor;
    },
    retry: false,
    onError: (err) => {
      document.cookie = "access_token= ; max-age=0";
      sessionStorage.clear();
      dispatch(setToken());
    },
  });
};

export default useNotificationQuery;
