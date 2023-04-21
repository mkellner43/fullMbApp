import { Modal, Typography, Box, Button } from "@mui/material";

const SimpleTextAnswer = ({ handleDelete, setOpen, open, content }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="center-modal">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {content}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            mt: 2,
            width: "100%",
          }}
        >
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Yes
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpen(false)}
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SimpleTextAnswer;
