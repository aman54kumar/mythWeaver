import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a2332',
            color: '#f6edd9',
            border: '1px solid #c59b45',
          },
          success: {
            iconTheme: {
              primary: '#c59b45',
              secondary: '#f6edd9',
            },
          },
          error: {
            iconTheme: {
              primary: '#8b2a2a',
              secondary: '#f6edd9',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
