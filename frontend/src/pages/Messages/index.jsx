import Chats from "../../components/Chats";
import MessageSection from "../../components/MessageSection";
import NoChats from "../../components//MessageSection/Helpers/NoChats";
import { useSelector } from "react-redux";
import "./style.scss";

const Messages = () => {
  const friend = useSelector((state) => state.messages.friend);

  return (
    <div className="chat-page-container">
      <Chats />
      {friend ? <MessageSection /> : <NoChats />}
    </div>
  );
};

export default Messages;
