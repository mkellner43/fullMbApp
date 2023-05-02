import { Chip, Typography, Divider } from "@mui/material";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";
import "./style/style.scss";

const Comment = ({ comment }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UsFormatter = new Intl.DateTimeFormat("en-US");

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="comment">
      <Divider />
      <div
        className="comment-content"
        onClick={() =>
          redirectToProfile({ id: comment.user._id, user: comment.user })
        }
      >
        <div className="post-avatar left">
          <AvatarWithStatus user={comment.user} />
          <Typography
            variant="h3"
            fontSize="1rem"
            component="h4"
            sx={{ ml: 1 }}
          >
            {" " + comment.user.first_name + " " + comment.user.last_name}
          </Typography>
        </div>
        <div className="time-comment">
          <Typography color="text.secondary" variant="caption" noWrap>
            {UsFormatter.format(new Date(comment.date))}
          </Typography>
          <div className="p-3 m-1 bg-blue-500 rounded">{comment.comment_body}</div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
