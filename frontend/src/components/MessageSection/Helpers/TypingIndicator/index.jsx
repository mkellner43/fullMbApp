import { motion } from 'framer-motion';
import { AvatarWithStatus } from '../../../AvatarWithStatus';
import { useSelector } from 'react-redux';

const TypingIndicator = ({typingBubble, typing}) => {
  const friend = useSelector(state => state.messages.friend)
  return typing &&
    <motion.div layout className='post-avatar' ref={typingBubble} key={2} inital={{opacity: 0}} animate={{opacity: 1, y: ['100px','0px']}} exit={{y: '100px', opacity: 0 }}>
    <AvatarWithStatus user={friend} />
    <div className="dot-container">
      <span className='dot1'/>
      <span className='dot2'/>
      <span className='dot3'/>
    </div>
  </motion.div>
}

export default TypingIndicator;
