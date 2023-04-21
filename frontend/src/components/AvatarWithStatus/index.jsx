import { Avatar } from "@mui/material";
import { StyledOnlineBadge, StyledOfflineBadge } from "./themes/style";
import { useSelector } from "react-redux";

export const AvatarWithStatus = ({ user, width = "3rem", height = "3rem" }) => {
  const userID = user?.id || user?._id;
  const onlineFriends = useSelector((state) => state.nav.onlineFriends);

  return onlineFriends?.includes(userID) ? (
    <StyledOnlineBadge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      variant="dot"
    >
      <Avatar src={user?.avatar?.url} sx={{ width: width, height: height }}>
        {user?.first_name.split("")[0]}
        {user?.last_name.split("")[0]}
      </Avatar>
    </StyledOnlineBadge>
  ) : (
    <StyledOfflineBadge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      variant="dot"
    >
      <Avatar src={user?.avatar?.url} sx={{ width: width, height: height }}>
        {user?.first_name.split("")[0]}
        {user?.last_name.split("")[0]}
      </Avatar>
    </StyledOfflineBadge>
  );
};
