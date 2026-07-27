import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes/AppRouter';
import { Toaster } from "sileo";

function App() {
  
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <AppRouter />
    </QueryClientProvider>
  )
}

export default App
