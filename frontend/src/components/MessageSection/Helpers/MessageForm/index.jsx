import { TextField, IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "@mui/icons-material";
import { sendMessage } from "../../../../api/message";
import { useSocket } from "../../../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../../pages/Messages/features/messagesSlice";

const MessageForm = () => {
  const friend = useSelector((state) => state.messages.friend);
  const currentUser = useSelector((state) => state.login.currentUser);
  const message = useSelector((state) => state.messages.message);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const dispatch = useDispatch();

  const sendMessageQuery = useMutation({
    mutationFn: ({ to_id, message }) => sendMessage(to_id, message),
    onSuccess: (data, variables) => {
      socket.emit("send message", { id: variables.to_id, thread: data });
      socket.emit("notification", {
        to_id: variables.to_id,
        type: "Message",
        msg: `${currentUser.username} : ${variables.message}`,
      });
    },
    // onError: () => dispatch(setToken())
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["thread:", variables.to_id]);
      const oldThread = queryClient.getQueryData(["thread:", variables.to_id]);
      queryClient.setQueryData(["thread:", variables.to_id], (old) => {
        const newPages = old.pages.map((page, idx) =>
          idx === 0
            ? {
                ...page,
                messages: [
                  ...page.messages,
                  {
                    date: Date.now(),
                    message: variables.message,
                    sender: { ...currentUser, _id: currentUser.id },
                    _id: "newMessage",
                  },
                ],
              }
            : page
        );
        return {
          ...old,
          pages: newPages,
        };
      });
      return { oldThread };
    },
    onError: (_err, _newThread, context) => {
      queryClient.setQueryData(context.oldThread);
    },
    onSettled: (_data, _error, variables, _context) => {
      queryClient.invalidateQueries(["thread:", variables.to_id]);
    },
  });

  return (
    <form
      className="message-input"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessageQuery.mutate({ to_id: friend?._id, message });
        dispatch(setMessage(""));
      }}
    >
      <TextField
        fullWidth
        id="outlined-basic"
        label="Type a new message"
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => {
          socket.emit("typing", friend?._id);
          dispatch(setMessage(e.target.value));
        }}
        onFocus={() => socket.emit("typing", friend?._id)}
        onBlur={() => socket.emit("not typing", friend?._id)}
      />
      <IconButton type="submit" disabled={message.trim().length === 0}>
        <Send color="primary" />
      </IconButton>
    </form>
  );
};

export default MessageForm;
