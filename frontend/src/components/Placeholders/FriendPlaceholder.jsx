import { Card, Skeleton } from "@mui/material";
import AvatarPlaceholder from "./AvatarPlaceholder";

const FriendPlaceholder = ({ friendPage = false }) => {
  return (
    <div>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AvatarPlaceholder direction={"row"} width={"3rem"} height={"3rem"} />
        {friendPage && (
          <Skeleton
            variant="rounded"
            sx={{ width: "5rem", height: "2rem", m: 1 }}
          />
        )}
      </Card>
    </div>
  );
};

export default FriendPlaceholder;
