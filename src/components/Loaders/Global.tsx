import { Fragment } from 'react'
import { Container, AppBar, Toolbar, Typography, Button, List, Skeleton, ListItem, ListItemAvatar, Divider, ListItemButton, ListItemSecondaryAction, ListItemText } from '@mui/material'

const Global = () => {
    return (
        <Container component='main' disableGutters={true}>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='body1' style={{ flex: 1 }}>Realtime Messages Project</Typography>
                    <Button>
                        <Skeleton variant='circular' animation='wave' width={40} height={40} />
                    </Button>
                </Toolbar>
            </AppBar>

            <List style={{ maxHeight: 'calc(100vh - 72px)', overflow: 'hidden' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n =>
                    <Fragment key={n}>
                        <ListItem>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Skeleton variant='circular' animation='wave' width={40} height={40} />
                                </ListItemAvatar>
                                <ListItemText primary={<Skeleton variant='text' animation='wave' height={36} width={148} />} secondary={<Skeleton variant='text' animation='wave' height={16} width={200} />} />
                                <ListItemSecondaryAction>
                                    <Skeleton variant='text' animation='wave' height={24} width={72} />
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ListItem>
                        <Divider variant='middle' />
                    </Fragment>
                )}
            </List>
        </Container >
    )
}

export default Global