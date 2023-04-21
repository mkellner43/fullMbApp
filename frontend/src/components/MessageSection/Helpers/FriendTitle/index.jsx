import { Typography } from "@mui/material";

const FriendTitle = ({ friend }) => (
  <div className="friend-title">
    <Typography variant="h4" component="h1" sx={{ textAlign: "center" }}>
      {friend?.username}
    </Typography>
  </div>
);

export default FriendTitle;
