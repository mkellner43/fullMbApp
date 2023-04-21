import { AnimatePresence, motion } from "framer-motion";
import { AvatarWithStatus } from "../../../AvatarWithStatus";
import { useSelector } from "react-redux";
import { useLayoutEffect, useRef } from "react";

const TypingIndicator = ({ scrollPosition }) => {
  const friend = useSelector((state) => state.messages.friend);
  const typing = useSelector((state) => state.messages.typing);
  const typingBubble = useRef(null);

  useLayoutEffect(() => {
    if (
      scrollPosition.current?.scrollHeight -
        scrollPosition.current?.scrollTop <=
        scrollPosition.current?.clientHeight +
          scrollPosition.current?.clientHeight * 0.1 ||
      (!typing &&
        scrollPosition.current?.scrollHeight -
          scrollPosition.current?.scrollTop <=
          scrollPosition.current?.clientHeight -
            scrollPosition.current?.clientHeight * 0.1)
    )
      typingBubble.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [typing, typingBubble, scrollPosition]);

  return (
    <AnimatePresence>
      {typing && (
        <motion.div
          layout
          className="post-avatar"
          ref={typingBubble}
          key={2}
          inital={{ opacity: 0 }}
          animate={{ opacity: 1, y: ["100px", "0px"] }}
          exit={{ y: "100px", opacity: 0 }}
        >
          <AvatarWithStatus user={friend} />
          <div className="dot-container">
            <span className="dot1" />
            <span className="dot2" />
            <span className="dot3" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingIndicator;
