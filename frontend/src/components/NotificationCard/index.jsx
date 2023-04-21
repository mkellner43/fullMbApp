import { Typography, IconButton, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { deleteNotification, readOne } from "../../api/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AvatarWithStatus } from "../AvatarWithStatus";
import useNotificationQuery from "../../components/hooks/useNotificationQuery";
// import { useDispatch } from 'react-redux';
// import { setToken } from '../../pages/Login/features/loginSlice';
import "./style/style.scss";
import { useRef } from "react";
import RefreshIcon from "../MessageSection/Helpers/RefreshIcon";

export const CreateNotificationCards = () => {
  const queryClient = useQueryClient();
  const query = useNotificationQuery();
  const notificationQuery = queryClient.getQueryData(["notifications"]);
  const scrollPosition = useRef();
  // const dispatch = useDispatch();

  const deleteQuery = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["notifications"]);
      const oldNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old) => {
        const newPages = old.pages.map((page) => {
          return {
            ...page,
            notifications: page.notifications.filter(
              (notification) => notification._id !== variables
            ),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });
      return { oldNotifications };
    },
    onSettled: () => queryClient.invalidateQueries(["notifications"]),
    onError: (err, variables, context) => {
      queryClient.setQueryData(["notifications"], context.oldNotifications);
      // dispatch(setToken())
    },
  });

  const readOneNotification = useMutation({
    mutationFn: (id) => readOne(id),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const prevData = queryClient.getQueryData(["notifications"]);
      await queryClient.setQueryData(["notifications"], (old) => {
        const newPages = old.pages.map((page) => {
          return {
            ...page,
            notifications: page.notifications.map((notification) =>
              notification._id === variables
                ? { ...notification, status: "read" }
                : notification
            ),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });
      return { prevData };
    },
    onError: (err, newNotifications, context) => {
      queryClient.setQueryData(["notifications"], context.prevData);
    },
    onSettled: (data, variables, context) => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleRead = (id) => {
    const [alreadyRead] = queryClient
      .getQueryData(["notifications"])
      .pages.map((page) =>
        page.notifications.find(
          (notification) =>
            notification._id === id && notification.status === "unread"
        )
      );
    if (alreadyRead) readOneNotification.mutate(id);
  };

  const handleScroll = () => {
    if (
      scrollPosition.current.scrollHeight ===
        scrollPosition.current.scrollTop +
          scrollPosition.current.clientHeight &&
      query.hasNextPage
    )
      query.fetchNextPage();
  };

  return (
    <div
      className="notification-section"
      ref={scrollPosition}
      onScroll={handleScroll}
    >
      {notificationQuery?.pages?.map((page, indx) =>
        page.notifications.map((notification, idx) => {
          return (
            <div
              className={`small-card notification-card-${notification.status}`}
              onMouseEnter={() => handleRead(notification._id)}
              key={notification._id}
            >
              <div className="post-avatar flex1">
                <AvatarWithStatus user={notification.requester} />
                <Typography sx={{ ml: 0.5, textOverflow: "ellipsis" }} noWrap>
                  {notification.msg}
                </Typography>
              </div>
              <div>
                <IconButton
                  onClick={() => deleteQuery.mutate(notification._id)}
                >
                  <ClearIcon color="error" />
                </IconButton>
              </div>
            </div>
          );
        })
      )}
      {(scrollPosition.current?.scrollHeight <=
        scrollPosition.current?.clientHeight ||
        !scrollPosition.current) &&
        query.hasNextPage && (
          <Button onClick={() => query.fetchNextPage()}>Load More</Button>
        )}
      {query.isFetchingNextPage && <RefreshIcon />}
      {notificationQuery?.isSuccess &&
        notificationQuery?.pages[0].length > 0 && (
          <Typography mt={5} variant="h5" component="h2" textAlign="center">
            No new notifications
          </Typography>
        )}
    </div>
  );
};
