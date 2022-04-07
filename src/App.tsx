import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { auth } from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import Global from './components/Loaders/Global';
import { ThemeProvider } from '@mui/material';
import { lightTheme } from './theme';

const SignInPage = lazy(() => import('./components/Authentication/SignIn'));
const HomePage = lazy(() => import('./components/Home/Home'));
const ConversationPage = lazy(() => import('./components/Conversation/Conversation'));
const AddUserPage = lazy(() => import('./components/AddUser/AddUser'));

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Global />
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path='/sign-in' element={user ? <Navigate to='/' /> : <Suspense fallback={<Global />}><SignInPage /></Suspense>} />
          <Route path='/add' element={user ? <Suspense fallback={<Global />}><AddUserPage /></Suspense> : <Navigate to='/sign-in' />} />
          <Route path='/conversation/:id' element={user ? <Suspense fallback={<Global />}><ConversationPage /></Suspense> : <Navigate to='/sign-in' />} />
          <Route path='/' element={user ? <Suspense fallback={<Global />}><HomePage /></Suspense> : <Navigate to='/sign-in' />} />

          <Route path='*' element={<Navigate to='/sign-in' />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;