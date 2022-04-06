import { Fragment } from 'react'
import { Container, AppBar, Toolbar, Typography, Button, List, Skeleton, ListItem, ListItemAvatar, Divider, ListItemButton, ListItemSecondaryAction, ListItemText } from '@mui/material'

const Global = () => {
    return (
        <Container component='main' disableGutters={true} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            Loading...
        </Container >
    )
}

export default Global