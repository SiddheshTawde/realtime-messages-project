import { ArrowBackRounded, SendRounded } from '@mui/icons-material'
import { AppBar, Container, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material'
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

  const conversationId = useMemo(() => location.pathname.split('/')[location.pathname.split('/').length - 1], [])

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

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageDoc = {
      media: '',
      content: text,
      sentAt: Timestamp.fromMillis(Date.now()),
      userId: auth.currentUser?.uid,
    }

    setDoc(doc(firestore, 'conversations', conversationId, 'messages', Date.now().toString()), messageDoc)
      .then(() => changeText(''))
      .catch(error => console.error(error))
  }

  return (
    <Container component='main' disableGutters={true} className={styles['main-container']}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton onClick={() => navigate('/', { replace: false })}>
            <ArrowBackRounded />
          </IconButton>
          <Typography variant='body1' sx={{ ml: 2 }}>{name}</Typography>
        </Toolbar>
      </AppBar>

      <List style={{ flex: 1 }}>
        {messages?.docs.map(message =>
          <ListItem key={message.id} className={styles['message']} style={{ alignItems: message.data()?.userId === auth.currentUser?.uid ? 'flex-end' : 'flex-start' }}>
            {message.data()?.userId === auth.currentUser?.uid ?
              <ListItemText
                className={styles['self-message']}
                primary={message.data().content}
                secondary={moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate()).fromNow()}
                secondaryTypographyProps={{ style: { fontSize: 10 } }}
              /> :
              <ListItemText
                className={styles['other-message']}
                primary={message.data().content}
                secondary={moment(new Timestamp(message.data().sentAt.seconds, message.data().sentAt.nanoseconds).toDate()).fromNow()}
                secondaryTypographyProps={{ style: { fontSize: 10 } }}
              />
            }
          </ListItem>
        )}
      </List>

      <form className={styles['chat-box-form']} onSubmit={handleFormSubmit}>
        <textarea placeholder='Send a message' className={styles['chat-box']} value={text} onChange={e => changeText(e.target.value)} />
        <IconButton type='submit' color='primary' className={styles['send-button']}>
          <SendRounded />
        </IconButton>
      </form>

    </Container>
  )
}

export default Conversation