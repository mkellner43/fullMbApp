import { Typography, Button } from "@mui/material";
import {
  readAllNotifications,
  unreadAllNotifications,
} from "../../api/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotificationQuery from "../../components/hooks/useNotificationQuery";
import { CreateNotificationCards } from "../../components/NotificationCard";
import "./styles/style.scss";

const Notifications = () => {
  const queryClient = useQueryClient();
  const notificationQuery = useNotificationQuery();

  const readAll = useMutation({
    mutationFn: () => readAllNotifications(notificationQuery.data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const prevNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old) => {
        const newPages = old.pages.map((page) => {
          return {
            ...page,
            notifications: page.notifications.map((notification) => {
              return {
                ...notification,
                status: "read",
              };
            }),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });
      return { prevNotifications };
    },
    onError: (err, newNotifications, context) => {
      queryClient.setQueryData(["notifications"], context.prevNotifications);
    },
    onSettled: () => queryClient.invalidateQueries(["notifications"]),
  });

  const unreadAll = useMutation({
    mutationFn: () => unreadAllNotifications(notificationQuery.data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const prevNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old) => {
        const newPages = old.pages.map((page) => {
          return {
            ...page,
            notifications: page.notifications.map((notification) => {
              return {
                ...notification,
                status: "unread",
              };
            }),
          };
        });
        return {
          ...old,
          pages: newPages,
        };
      });
      return { prevNotifications };
    },
    onError: (err, newNotifications, context) => {
      queryClient.setQueryData(["notifications"], context.prevNotifications);
    },
    onSettled: () => queryClient.invalidateQueries(["notifications"]),
  });

  return (
    <div className="notification-container">
      <Typography textAlign="center" variant="h4" component="h1">
        Notifications
      </Typography>
      {notificationQuery?.data?.length !== 0 && (
        <div className="notification-buttons">
          <Button
            variant="outlined"
            width={50}
            onClick={() => unreadAll.mutate()}
          >
            Unread All
          </Button>
          <Button
            variant="outlined"
            width={50}
            onClick={() => readAll.mutate()}
          >
            Read All
          </Button>
        </div>
      )}
      <CreateNotificationCards query={notificationQuery} />
    </div>
  );
};

export default Notifications;
