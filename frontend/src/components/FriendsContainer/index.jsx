import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";

const MapFriends = ({ friendQuery, handleConfirm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${user.id}`);
  };

  return friendQuery.data?.pages[0].friends?.length > 0 ? (
    friendQuery.data.pages.map((page) =>
      page.friends.map((friend) => {
        return (
          <div key={friend.request_id} className="small-card">
            <div
              className="post-avatar"
              onClick={() =>
                redirectToProfile({ id: friend.user._id, user: friend.user })
              }
            >
              <AvatarWithStatus variant="outlined" user={friend.user} />
              <h5 className="text-ellipsis-flex pl1">
                {friend.user.first_name + " " + friend.user.last_name}
              </h5>
            </div>
            <Button
              color="error"
              onClick={() => handleConfirm(friend.request_id)}
            >
              unfriend
            </Button>
          </div>
        );
      })
    )
  ) : (
    <Typography textAlign={"center"}>No current friends</Typography>
  );
};

export default MapFriends;
