import { useInfiniteQuery } from "@tanstack/react-query";
import { getThread } from "../../api/message";

export const useMessageThread = (id) => {
  return useInfiniteQuery({
    queryKey: ["thread:", id],
    queryFn: async ({ pageParam = 0 }) => getThread(id, pageParam),
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return undefined;
      return lastPage.count > lastPage.cursor ? lastPage.cursor : undefined;
    },
  });
};
