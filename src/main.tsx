import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { indigo } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: indigo.A200
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        style: {
          textTransform: 'none'
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
