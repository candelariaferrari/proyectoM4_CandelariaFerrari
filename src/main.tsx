import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Authenticator } from './features/auth/Authenticator.tsx'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Authenticator>
  </StrictMode>,
)
