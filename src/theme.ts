import { createTheme } from '@mui/material'

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: '#EADDFF',
        },
        secondary: {
            main: '#625B71'
        },
        background: {
            default: '#EADDFF'
        }
    },
    components: {
        MuiButton: {
            defaultProps: {
                style: {
                    textTransform: 'none'
                }
            }
        },
        MuiListItem: {
            defaultProps: {
                style: {
                    paddingLeft: 0,
                    paddingRight: 0
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                rounded: {
                    borderRadius: 8
                }
            }
        }
    }
})