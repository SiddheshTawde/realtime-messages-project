import { async } from '@firebase/util'
import { ArrowBackRounded } from '@mui/icons-material'
import { AppBar, Avatar, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemSecondaryAction, ListItemText, Toolbar, Typography } from '@mui/material'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { Fragment } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/auth'
import { firestore } from '../../firebase/database'

const AddUser = () => {
    const navigate = useNavigate();
    const [users, loading, error] = useCollection(collection(firestore, 'users'));

    const handleNewConversation = async (uid: string) => {

        const result = await getDocs(query(collection(firestore, 'conversations'), where('participants', 'array-contains-any', [auth.currentUser?.uid.trim(), uid.trim()])));

        if (result.size > 0) {
            location.replace('conversation/' + result.docs.map(doc => doc.id))
        } else {

            const newDoc = await addDoc(collection(firestore, 'conversations'), {
                displayName: "",
                isGroup: false,
                media: "",
                participants: [auth.currentUser?.uid, uid],
                photoURL: ""
            })

            location.replace('conversation/' + newDoc.id)
        }

    }

    return (
        <Container disableGutters={true}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton sx={{ mr: 2 }} onClick={() => navigate('/', { replace: false })}>
                        <ArrowBackRounded />
                    </IconButton>
                    <Typography variant='body1'>All User</Typography>
                </Toolbar>
            </AppBar>

            <List>
                {users?.docs.map(user =>
                    auth.currentUser?.uid !== user.data().uid ?
                        <Fragment key={user.id}>
                            <ListItem>
                                <ListItemButton onClick={() => handleNewConversation(user.data().uid)}>
                                    <ListItemAvatar>
                                        <Avatar src={user.data().photoURL} />
                                    </ListItemAvatar>
                                    <ListItemText primary={user.data().displayName} secondary={user.data().email} />
                                </ListItemButton>
                            </ListItem>
                            <Divider variant='middle' />
                        </Fragment> : null
                )}
            </List>
        </Container>
    )
}

export default AddUser