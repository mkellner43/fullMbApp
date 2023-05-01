import { useContext, useEffect, useState, createContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({id, children}) {
  const [socket, setSocket] = useState()
  
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'))
    const newSocket = io('ws://localhost:8900',
     {
       auth: {
        sessionID: currentUser.token,
        userID: currentUser.id,
        username: currentUser.username
      }
    })
     setSocket(newSocket)
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}