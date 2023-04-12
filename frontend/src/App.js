import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Nav from './components/Nav';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const App = () => {
  const currentUser = useSelector(state => state.login.currentUser)
  const token = useSelector(state => state.login.token)
  const theme = useSelector(state => state.nav.theme)
  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  if(darkTheme.palette.mode === 'light') {
    let root = document.querySelector(':root')
    root.style.setProperty('--color', 'rgba(0, 0, 0, 0.12)')
    root.style.setProperty('--background', '#fff')
    root.style.setProperty('--modal-text', '#121212')

  } else {
    let root = document.querySelector(':root')
    root.style.setProperty('--color', '#dee4e7')
    root.style.setProperty('--background', '#121212')
    root.style.setProperty('--modal-text', '#fff')

  }

  if(!token || currentUser?.token !== token ) return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Routes>
        <Route element={ <Login /> } path='/login' />
        <Route element={ <Signup /> } path='/signup' />
        <Route element={ <Login /> } path='*' />
      </Routes>
    </ThemeProvider>
  )

  
  return (
    <SocketProvider value={currentUser?.id}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <Nav currentUser={currentUser}/>
        <Routes>
          <Route element={<Home  currentUser={currentUser}/>} path="/"/>
          <Route element={<Profile currentUser={currentUser} />} path="/profile" />
          <Route element={<Friends currentUser={currentUser} />} path="/friends" />
          <Route element={<Messages currentUser={currentUser} />} path='/messages' />
          <Route element={<Notifications currentUser={currentUser} />} path='/notifications' />
          <Route element={<Home currentUser={currentUser} />} path='*'/>
        </Routes>
      </ThemeProvider>
   </SocketProvider>
  );
}

export default App;

// look into client error handling
// learn graphQL? could be dope
// mongoDB image storage / using multer to store static files on your own server - used cloudinary -- could look into other options outside of 3rd party
// look at backend notes in app.js :)
// ready to get up and running for production to show off to sharecare, learn about docker and how to deploy ****
// got docker working for dev
// get docker working for prod
// socket io seems to have issues with logout and online status indictors
// message not scrolling down when typing bubble appears