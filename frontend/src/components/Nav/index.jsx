import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../context/SocketProvider";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Logout,
  Feed,
  Message,
  PeopleAlt,
  Notifications,
} from "@mui/icons-material";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useDispatch } from "react-redux";
import { setToken } from "../../pages//Login/features/loginSlice";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";
import useNotificationQuery from "../hooks/useNotificationQuery";
import AppBar from "@mui/material/AppBar";
import { motion } from "framer-motion";
import { setTheme } from "./features/navSlice";
import { setOnlineFriends } from "./features/navSlice";

export const Nav = ({ currentUser }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const socket = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [switcher, setSwitcher] = useState(localStorage.getItem("theme"));
  const queryClient = useQueryClient();
  const notificationQuery = useNotificationQuery();
  const drawerWidth = 240;

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${currentUser.id}`);
  };

  const handleLogout = () => {
    socket?.emit("logOut", currentUser.id);
    document.cookie = "access_token= ; max-age=0";
    sessionStorage.clear();
    queryClient.clear();
    dispatch(setToken());
    navigate("/login");
  };

  useEffect(() => {
    socket?.on("notification", (data) => {
      setNotificationMsg(data);
      setNotificationOpen(true);
    });
    socket?.emit("onlineFriends");
    socket?.on("onlineFriends", (data) => {
      dispatch(setOnlineFriends(data));
    });
    return () => {
      socket?.off("notification");
      socket?.off("onlineFriends");
    };
  }, [socket, queryClient, dispatch]);

  useEffect(() => {
    switcher === "dark"
      ? localStorage.setItem("theme", "dark")
      : localStorage.setItem("theme", "light");
    switcher === "dark"
      ? dispatch(setTheme("dark"))
      : dispatch(setTheme("light"));
  }, [switcher, dispatch]);

  const handleDrawerOpen = () => {
    queryClient.invalidateQueries(["notifications"]);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setNotificationOpen(false);
  };

  const getBadgeContent = () => notificationQuery.data?.pages.unread;

  return (
    <Box>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {notificationMsg}
        </Alert>
      </Snackbar>
      <AppBar
        open={open}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "60px",
          padding: "0rem 1rem",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ ...(open && { display: "none" }) }}
        >
          <Menu />
        </IconButton>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <Typography variant="h6" component="h1">
              MattBook
            </Typography>
          </Link>
          <motion.div
            layout
            layoutRoot
            style={{
              position: "relative",
              width: "40px",
              height: "20px",
              backgroundColor: "white",
              margin: "1rem",
              borderRadius: "9999px",
              display: "flex",
              justifyContent: switcher === "dark" ? "flex-end" : "flex-start",
              alignItems: "center",
              padding: ".1rem",
            }}
            onClick={() =>
              setSwitcher((prevState) =>
                prevState === "dark" ? "light" : "dark"
              )
            }
          >
            <motion.span
              layout
              style={{
                height: "16px",
                width: "16px",
                backgroundColor: switcher === "dark" ? "#121212" : "#1976d2",
                borderRadius: "50%",
              }}
              transition={{ type: "spring", stiffness: 700, damping: 25 }}
            />
          </motion.div>
        </div>
      </AppBar>
      <Drawer
        disableScrollLock
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        anchor="left"
        role="presentation"
        open={open}
        onClose={handleDrawerClose}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Profile" placement="bottom-end" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: 1,
                p: 2,
              }}
              onClick={() =>
                redirectToProfile({ id: currentUser.id, user: currentUser })
              }
            >
              <AvatarWithStatus
                user={currentUser}
                width={"3rem"}
                height={"3rem"}
              />
              <Typography ml={1}>{currentUser.username}</Typography>
            </Box>
          </Tooltip>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <Feed />
              </ListItemIcon>
              <ListItemText primary="Feed" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/messages")}>
              <ListItemIcon>
                <Message />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/friends")}>
              <ListItemIcon>
                <PeopleAlt />
              </ListItemIcon>
              <ListItemText primary="Friends" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/notifications");
              }}
            >
              <ListItemIcon>
                <Badge color="primary" badgeContent={getBadgeContent()}>
                  <Notifications />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary={"Log Out"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Nav;
