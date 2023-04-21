import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, Chip } from "@mui/material";
import { AvatarWithStatus } from "../AvatarWithStatus";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../pages/Profile/features/profileSlice";

const FriendsPending = ({ pendingQuery, acceptQuery, declineQuery }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectToProfile = (user) => {
    dispatch(setUserProfile(user));
    navigate(`/profile/${user.id}`);
  };
  return pendingQuery.data?.pages[0].pending?.length > 0 ? (
    pendingQuery.data.pages.map((page) =>
      page.pending.map((request) => (
        <div key={request.user._id} className="small-card">
          <div
            className="post-avatar"
            onClick={() =>
              redirectToProfile({ id: request.user._id, user: request.user })
            }
          >
            <AvatarWithStatus user={request.user} />
            <h5 className="text-ellipsis-flex pl1">
              {request.user.first_name + " " + request.user.last_name}
            </h5>
          </div>
          {request.type === "receiver" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() =>
                  acceptQuery.mutate({
                    request_id: request.request_id,
                  })
                }
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() =>
                  declineQuery.mutate({
                    request_id: request.request_id,
                  })
                }
              >
                Decline
              </Button>
            </div>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Chip color="warning" variant="filled" label="PENDING..." />
            </Box>
          )}
        </div>
      ))
    )
  ) : (
    <Typography textAlign={"center"}>No pending friend requests</Typography>
  );
};

export default FriendsPending;
