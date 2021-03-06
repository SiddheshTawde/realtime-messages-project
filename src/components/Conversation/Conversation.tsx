import { ArrowBackRounded, SearchRounded, SendRounded } from '@mui/icons-material'
import { AppBar, Button, Container, IconButton, List, ListItem, ListItemText, Paper, Toolbar, Typography } from '@mui/material'
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import moment from 'moment'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/auth'
import { firestore } from '../../firebase/database'

import styles from './Conversation.module.css'

const Conversation = () => {
  const navigate = useNavigate();

  const conversationId = useMemo(() => window.location.pathname.split('/')[window.location.pathname.split('/').length - 1], [])

  const [text, changeText] = useState('');

  const [name, updateName] = useState('');
  const [conversation, loading, error] = useDocumentData(doc(firestore, 'conversations', conversationId));

  const [messages, messages_loading, messages_error] = useCollection(collection(firestore, 'conversations', conversationId, 'messages'))

  useEffect(() => {

    if (conversation?.isGroup) {
      updateName(conversation?.displayName)
    } else {
      if (conversation) {
        const _uid = conversation?.participants.filter((uid: string) => uid !== auth?.currentUser?.uid)[0];

        getDoc(doc(firestore, 'users', _uid))
          .then(result => updateName(result.data()?.displayName))
          .catch(error => console.error(error));
      }
    }
  }, [conversation]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageDoc = {
      media: '',
      content: text,
      sentAt: Timestamp.fromMillis(Date.now()),
      userId: auth.currentUser?.uid,
    };

    if (text.length > 0) {
      await setDoc(doc(firestore, 'conversations', conversationId, 'messages', Date.now().toString()), messageDoc)
      changeText('')
    };

  }

  return (
    <Container component='main' disableGutters={true} className={styles['main-container']}>
      <AppBar position='static' elevation={0}>
        <Toolbar>
          <IconButton onClick={() => navigate('/', { replace: false })}>
            <ArrowBackRounded />
          </IconButton>
          <Typography variant='h5' sx={{ ml: 2, flex: 1 }}>{name}</Typography>
          <IconButton>
            <SearchRounded />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper sx={{ borderRadius: 4, margin: 2, flex: 1, display: 'flex' }} elevation={0}>
        <List className={styles['list-container']}>
          {messages?.docs.map(message =>
            <ListItem key={message.id} className={styles['message']} style={{ alignItems: message.data()?.userId === auth.currentUser?.uid ? 'flex-end' : 'flex-start' }}>
              {message.data()?.userId === auth.currentUser?.uid ?
                <ListItemText
                  className={styles['self-message']}
                  primary={message.data().content}
                  secondary={moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate()).fromNow()}
                  secondaryTypographyProps={{ className: styles['self-message-secondary'] }}
                /> :
                <ListItemText
                  className={styles['other-message']}
                  primary={message.data().content}
                  secondary={moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate()).fromNow()}
                  secondaryTypographyProps={{ className: styles['other-message-secondary'] }}
                />
              }
            </ListItem>
          )}
        </List>
      </Paper>

      <form className={styles['chat-box-form']} onSubmit={handleFormSubmit}>
        <textarea placeholder='Send a message' className={styles['chat-box-input']} value={text} onChange={e => changeText(e.target.value)} />
        <Button variant='contained' type='submit' color='secondary' disabled={text.length === 0} className={styles['send-button']}>
          <SendRounded />
        </Button>
      </form>

    </Container >
  )
}

export default Conversation