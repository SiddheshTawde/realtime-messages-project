import { Navigate, Route, Routes } from 'react-router-dom'
import { auth } from './firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'

import SignIn from './components/Authentication/SignIn';
import Home from './components/Home/Home';
import Conversation from './components/Conversation/Conversation';
import AddUser from './components/AddUser/AddUser';

import Global from './components/Loaders/Global';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Global />
  }

  return (
    <Routes>
      <Route path='/sign-in' element={user ? <Navigate to='/' /> : <SignIn />} />

      <Route path='/add' element={user ? <AddUser /> : <Navigate to='/sign-in' />} />
      <Route path='/conversation/:id' element={user ? <Conversation /> : <Navigate to='/sign-in' />} />
      <Route path='/' element={user ? <Home /> : <Navigate to='/sign-in' />} />

    </Routes>
  )
}

export default App
