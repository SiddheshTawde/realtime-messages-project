import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { auth } from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import Global from './components/Loaders/Global';
import { createTheme, ThemeProvider } from '@mui/material';

const SignInPage = lazy(() => import('./components/Authentication/SignIn'));
const HomePage = lazy(() => import('./components/Home/Home'));
const ConversationPage = lazy(() => import('./components/Conversation/Conversation'));
const AddUserPage = lazy(() => import('./components/AddUser/AddUser'));

function App() {
  const [user, loading, error] = useAuthState(auth);


  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: '#A1EEFF',
      },
      secondary: {
        main: '#004E5B'
      },
      background: {
        default: '#004E5B'
      },
      text: {
        primary: '#004E5B',
        secondary: '#004E5B'
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          style: {
            textTransform: 'none'
          }
        }
      },
      MuiListItem: {
        defaultProps: {
          style: {
            paddingLeft: 0,
            paddingRight: 0
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          rounded: {
            borderRadius: 8
          }
        }
      }
    }
  })

  if (loading) {
    return <Global />
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/sign-in' element={user ? <Navigate to='/' /> : <Suspense fallback={<Global />}><SignInPage /></Suspense>} />
          <Route path='/add' element={user ? <Suspense fallback={<Global />}><AddUserPage /></Suspense> : <Navigate to='/sign-in' />} />
          <Route path='/conversation/:id' element={user ? <Suspense fallback={<Global />}><ConversationPage /></Suspense> : <Navigate to='/sign-in' />} />
          <Route path='/' element={user ? <Suspense fallback={<Global />}><HomePage /></Suspense> : <Navigate to='/sign-in' />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
