import { FunctionComponent } from 'react';
import { Box, Button, Card, Container, Typography } from '@mui/material';

import styles from './SignIn.module.css';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/database';

const SignIn: FunctionComponent = () => {
    const handleGoogleSignIn = async () => {

        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            
            const userDoc = {
                displayName: result.user.displayName,
                email: result.user.email,
                emailVerified: result.user.emailVerified,
                metadata: { lastSignInTime: result.user.metadata.lastSignInTime, creationTime: result.user.metadata.creationTime },
                phoneNumber: result.user.phoneNumber,
                photoURL: result.user.photoURL,
                providerId: result.user.providerId,
                uid: result.user.uid
            }

            await setDoc(doc(firestore, 'users', userDoc.uid), userDoc);

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <Container component='main' className={styles['main-container']} disableGutters={true} maxWidth='xs'>
            <Card className={styles['card-container']}>
                <Box className={styles['box-element']}>
                    <Typography variant='h3'>Realtime Messages Project</Typography>
                </Box>
                <Box className={styles['box-element']}>
                    <Button variant='contained' onClick={handleGoogleSignIn}>Sign In</Button>
                </Box>
            </Card>
        </Container>
    )
}

export default SignIn