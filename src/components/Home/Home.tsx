import { AppBar, Avatar, Box, Button, Container, Divider, Drawer, Fab, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Paper, Toolbar, Typography } from '@mui/material'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/auth'
import { collection, doc, DocumentData, getDoc, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/database';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import styles from './Home.module.css';
import { PersonAddRounded, SearchRounded } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const [profile, toggleProfile] = useState(false);
  const [conversations, loading, error] = useCollection(collection(firestore, 'conversations'));

  const handleSignOut = async () => {
    await signOut(auth);
  }

  return (
    <Container component='main' disableGutters={true} className={styles['main-conatiner']}>
      <AppBar position='static' elevation={0}>
        <Toolbar>

          <Typography variant='h5' style={{ flex: 1, fontWeight: 'bold' }}>LOGO</Typography>

          <IconButton sx={{ mr: 2, p: 2 }} onClick={() => navigate('/add', { replace: false })}>
            <SearchRounded />
          </IconButton>

          <IconButton onClick={() => toggleProfile(true)}>
            <Avatar variant='rounded' src={auth.currentUser?.photoURL || ''} alt='Profile Avatar'></Avatar>
          </IconButton>

        </Toolbar>
      </AppBar>

      <Paper sx={{ borderRadius: 4, margin: 2, flex: 1 }} elevation={0}>
        <List>
          {conversations?.docs.map((conversation, index) => <ConversationItem key={index} conversation={conversation} />)}
        </List>
      </Paper>

      <Drawer anchor='bottom' open={profile} onClose={() => toggleProfile(false)} PaperProps={{ className: styles['user-profile-paper'] }}>
        <Box className={styles['profile-container']}>
          <Avatar variant='rounded' src={auth.currentUser?.photoURL || ''} style={{ width: 76, height: 76, marginBottom: 12 }} />
          <Typography variant='h5'>{auth.currentUser?.displayName}</Typography>
          <Typography variant='caption'>{auth.currentUser?.email}</Typography>
          <Divider variant='middle' sx={{ width: '100%', my: 2 }} />
          <Button type='button' onClick={handleSignOut} color='error'>Sign Out</Button>
        </Box>
      </Drawer>
    </Container>
  )
}

const ConversationItem: FunctionComponent<{ conversation: DocumentData }> = ({ conversation }) => {
  const navigate = useNavigate();
  const [name, updateName] = useState('');
  const [profilePicture, updateProfilePicture] = useState('');

  const [message, loading, error] = useCollectionData(query(collection(firestore, 'conversations', conversation.id, 'messages'), orderBy('sentAt', 'desc'), limit(1)));

  useEffect(() => {
    if (conversation.data().isGroup) {
      updateName(conversation.data().displayName)
      updateProfilePicture(conversation.data().photoURL)
    } else {
      getDoc(doc(firestore, 'users', conversation.data().participants.filter((uid: string) => uid !== auth.currentUser?.uid)[0]))
        .then(result => {
          updateName(result.data()?.displayName);
          updateProfilePicture(result.data()?.photoURL)
        })
        .catch(error => console.error(error))
    }
  }, [conversation]);

  return (
    <ListItem>
      <ListItemButton onClick={() => navigate('/conversation/' + conversation.id, { replace: false })}>
        <ListItemAvatar>
          <Avatar variant='rounded' src={profilePicture} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={message?.length === 0 ? 'No previous Messages' : message?.map(doc => doc.content)}
          primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
        />
        <ListItemSecondaryAction>
          <Typography variant='subtitle2'>
            {message?.length === 0 ? '' : message?.map(doc => moment(new Timestamp(doc.sentAt.seconds, doc.sentAt.nanoseconds).toDate()).fromNow())}
          </Typography>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  )
}

export default Home