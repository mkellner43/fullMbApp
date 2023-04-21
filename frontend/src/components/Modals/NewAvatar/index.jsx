import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Box } from "@mui/material";
import AvatarEdit from "react-avatar-edit";
import { updateAvatar } from "../../../api/user";
import { useDispatch, useSelector } from "react-redux";
import {
  setToken,
  setCurrentUser,
} from "../../../pages/Login/features/loginSlice";
import {
  setAvatarModule,
  setSelectedImage,
} from "../../../pages/Profile/features/profileSlice";

const NewAvatar = () => {
  const avatarModule = useSelector((state) => state.profile.avatarModule);
  const selectedImage = useSelector((state) => state.profile.selectedImage);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const updateAvatarQuery = useMutation({
    mutationFn: ({ selectedImage }) => updateAvatar(selectedImage),
    onSuccess: (data) => {
      console.log(data);
      sessionStorage.setItem("user", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      dispatch(setCurrentUser(data));
    },
    // onError: () => dispatch(setToken())
  });

  const onCrop = (view) => {
    dispatch(setSelectedImage(view));
  };

  const discardImage = () => {
    dispatch(setSelectedImage(false));
  };

  const handleClose = () => {
    dispatch(setAvatarModule(false));
    dispatch(setSelectedImage(false));
  };

  const handleSave = () => {
    updateAvatarQuery.mutate({ selectedImage });
    handleClose();
  };

  return (
    <Modal
      open={avatarModule}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="center-modal">
        <Box>
          <AvatarEdit
            width={300}
            height={300}
            onCrop={onCrop}
            onClose={discardImage}
            labelStyle={{ color: "inherit" }}
          />
        </Box>
        <Button width={1} sx={{ mt: 3 }} onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default NewAvatar;
