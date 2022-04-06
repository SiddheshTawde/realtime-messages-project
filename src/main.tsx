import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'

import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#A1EEFF',
    },
    secondary: {
      main: '#004E5B'
    },
    background: {
      default: '#004E5B'
    },
    text: {
      primary: '#004E5B',
      secondary: '#004E5B'
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
