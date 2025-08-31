import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ClerkProvider} from "@clerk/clerk-react"
import {BrowserRouter} from "react-router-dom"
import { SettingsProvider } from './context/SettingsContext';
import { HeaderProvider } from './context/HeaderContext.jsx';
import { CodeProvider } from './context/CodeContext.jsx'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY



createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>

    <BrowserRouter>
      <CodeProvider>
      <SettingsProvider>
        <HeaderProvider>
          <App />
        </HeaderProvider>
      </SettingsProvider>
      </CodeProvider>
    </BrowserRouter>
    
  </ClerkProvider>
)
