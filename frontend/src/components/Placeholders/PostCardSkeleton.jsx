import { Skeleton } from "@mui/material";
import "./style.scss";

const PostCardSkeleton = ({ column }) => {
  return (
    <div className="full-width p1 nice-border skeleton-container mt3">
      <div className="center row">
        <div className="left full-width">
          <Skeleton
            variant="circular"
            height={"3rem"}
            width={"3rem"}
            sx={{ m: 1 }}
          />
          <Skeleton variant="rounded" height={"2rem"} width={"30%"} />
        </div>
        <div className="right">
          <Skeleton variant="rounded" height={"2rem"} width={"3rem"} />
        </div>
      </div>
      <div className="full-width center space-between">
        <Skeleton
          variant="rounded"
          height={"2rem"}
          width={"100%"}
          sx={{ mb: 1 }}
        />
        <Skeleton variant="rounded" height={"2rem"} width={"100%"} />
      </div>
      <Skeleton
        variant="rounded"
        height={"2rem"}
        width={"10%"}
        sx={{ mt: 1 }}
      />
    </div>
  );
};

export default PostCardSkeleton;
