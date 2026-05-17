import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios' // Imported axios

// Enable cookies to be sent across different domains (Vercel -> Render)
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <App />
)