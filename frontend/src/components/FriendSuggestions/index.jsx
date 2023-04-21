import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";

const FriendSuggestions = ({ suggestionsQuery, sendRequestQuery }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login.currentUser);

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${user.id}`);
  };

  return suggestionsQuery.data.pages[0].suggestions.length === 0 ? (
    <Typography textAlign={"center"}>No suggestions</Typography>
  ) : (
    suggestionsQuery.data.pages.map((page) =>
      page.suggestions.map((friend) => (
        <div key={friend._id} className="small-card">
          <div
            className="post-avatar"
            onClick={() => redirectToProfile({ id: friend._id, user: friend })}
          >
            <AvatarWithStatus user={friend} />
            <h5 className="text-ellipsis-flex pl1">
              {friend.first_name + " " + friend.last_name}
            </h5>
          </div>
          <Button
            variant="outlined"
            size="small"
            disabled={sendRequestQuery.isLoading}
            onClick={() =>
              sendRequestQuery.mutate({
                friend: friend._id,
                currentUser: currentUser.id,
              })
            }
          >
            Add
          </Button>
        </div>
      ))
    )
  );
};

export default FriendSuggestions;
