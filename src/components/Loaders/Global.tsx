import { AppBar, Container, Paper, Skeleton, Toolbar, Typography } from '@mui/material'
import styles from './Global.module.css';

const Global = () => {
    return (
        <Container component='main' disableGutters={true} className={styles['main-conatiner']}>
            <AppBar position='static' elevation={0} color='transparent'>
                <Toolbar>
                    <Typography variant='h5' style={{ flex: 1 }}>
                        <Skeleton variant='text' animation='wave' width={72} />
                    </Typography>
                </Toolbar>
            </AppBar>

            <Paper sx={{ borderRadius: 4, margin: 2, flex: 1 }} elevation={0} />
        </Container >
    )
}

export default Global