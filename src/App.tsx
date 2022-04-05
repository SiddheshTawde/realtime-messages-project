import { ThemeProvider } from '@emotion/react';
import indigo from '@mui/material/colors/indigo';
import { Navigate, Route, Routes } from 'react-router-dom'
import { auth } from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'

import SignIn from './components/Authentication/SignIn';
import Home from './components/Home/Home';
import { createTheme } from '@mui/material';
import Conversation from './components/Conversation/Conversation';

function App() {
  const [user, loading, error] = useAuthState(auth);

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: indigo.A200
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          style: {
            textTransform: 'none'
          }
        }
      }
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path='/sign-in' element={user ? <Navigate to='/' /> : <SignIn />} />

        <Route path='/conversation/:id' element={user ? <Conversation /> : <Navigate to='/sign-in' />} />
        <Route path='/' element={user ? <Home /> : <Navigate to='/sign-in' />} />

      </Routes>
    </ThemeProvider>
  )
}

export default App
