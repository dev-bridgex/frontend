import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Import Bootstrap and Font Awesome ==================================>
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import "@fortawesome/fontawesome-free/css/all.min.css"

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
      <App />
  </QueryClientProvider>
)
