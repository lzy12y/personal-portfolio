import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { EditProvider } from './context/EditContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EditProvider>
        <App />
      </EditProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
