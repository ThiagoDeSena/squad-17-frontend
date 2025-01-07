import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterApp} from './RouterApp'

import {Analytics} from '@vercel/analytics/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterApp />
    <Analytics/>
  </StrictMode>,
)
