import { async } from '@firebase/util'
import { ArrowBackRounded } from '@mui/icons-material'
import { AppBar, Avatar, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Toolbar, Typography } from '@mui/material'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
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
            window.location.replace('conversation/' + result.docs.map(doc => doc.id))
        } else {

            const newDoc = await addDoc(collection(firestore, 'conversations'), {
                displayName: "",
                isGroup: false,
                media: "",
                participants: [auth.currentUser?.uid, uid],
                photoURL: ""
            })

            window.location.replace('conversation/' + newDoc.id)
        }

    }

    return (
        <Container disableGutters={true} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <AppBar position='static' elevation={0}>
                <Toolbar>
                    <IconButton sx={{ mr: 2 }} onClick={() => navigate('/', { replace: false })}>
                        <ArrowBackRounded />
                    </IconButton>
                    <Typography variant='body1'>All User</Typography>
                </Toolbar>
            </AppBar>

            <Paper elevation={0} style={{ flex: 1, borderRadius: 16, margin: 16 }}>
                <List>
                    {users?.docs.map(user =>
                        auth.currentUser?.uid !== user.data().uid ?
                            <ListItem key={user.id}>
                                <ListItemButton onClick={() => handleNewConversation(user.data().uid)}>
                                    <ListItemAvatar>
                                        <Avatar variant='rounded' src={user.data().photoURL} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.data().displayName}
                                        secondary={user.data().email}
                                        primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                                    />
                                </ListItemButton>
                            </ListItem> : null
                    )}
                </List>
            </Paper>
        </Container>
    )
}

export default AddUser