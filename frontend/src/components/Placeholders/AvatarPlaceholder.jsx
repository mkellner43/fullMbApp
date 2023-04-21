import { Skeleton } from "@mui/material";

const AvatarPlaceholder = ({ direction, height, width }) => {
  return (
    <div
      className="center row"
      style={{ flexDirection: direction ? direction : "row" }}
    >
      <Skeleton
        variant="circular"
        height={height}
        width={width}
        sx={{ m: 1 }}
      />
      <Skeleton
        variant="rounded"
        height={"2rem"}
        width={"10rem"}
        sx={{ m: 1 }}
      />
    </div>
  );
};

export default AvatarPlaceholder;
