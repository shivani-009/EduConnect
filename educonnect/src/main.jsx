import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SavedTutorProvider } from './context/SavedTutorContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { TutorProvider } from './context/TutorContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TutorProvider>
            <SavedTutorProvider>
              <BookingProvider>
                <App />
                <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
              </BookingProvider>
            </SavedTutorProvider>
          </TutorProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
