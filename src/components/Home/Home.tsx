import { AppBar, Avatar, Container, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Toolbar, Typography } from '@mui/material'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/auth'
import { collection, doc, DocumentData, getDoc, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase/database';
import { useCollection, useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Home = () => {
  const [conversations, loading, error] = useCollection(collection(firestore, 'conversations'));

  const handleSignOut = () => {
    signOut(auth);
  }

  return (
    <Container component='main' disableGutters={true}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='body1' style={{ flex: 1 }}>Realtime Messages Project</Typography>
          <Avatar></Avatar>
        </Toolbar>
      </AppBar>

      <List>
        {conversations?.docs.map((conversation, index) => <ConversationItem key={index} conversation={conversation} />)}
      </List>
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
          <Avatar src={profilePicture} />
        </ListItemAvatar>
        <ListItemText primary={name} secondary={message?.length === 0 ? 'No previous Messages' : message?.map(doc => doc.content)} />
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