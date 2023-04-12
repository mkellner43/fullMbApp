import { motion } from "framer-motion";

const RefreshIcon = () => 
  <motion.div layout key="animation" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
  <div className="loader-container">
    <span className='dot1 loader'/>
    <span className='dot2 loader'/>
    <span className='dot3 loader'/>
  </div>
  </motion.div>


export default RefreshIcon;