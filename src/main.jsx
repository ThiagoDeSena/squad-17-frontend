import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterApp} from './RouterApp'
import {Analytics} from '@vercel/analytics/react'
import { UserProvider } from './Contexts/UserContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterApp />
    </UserProvider>
    <Analytics/>
  </StrictMode>,
)
