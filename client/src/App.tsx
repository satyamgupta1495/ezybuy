import './App.css'
import './assets/css/style.css'
import { useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import AppRoutes from './routes/index';
import Loader from './Loader';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbars from '@/components/Navbar';
import Footer from './components/Footer';

function App() {

  const routing = useRoutes(AppRoutes())
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Navbars />
        {routing}
        <Toaster
          position="top-center"
          reverseOrder={true}
          toastOptions={{
            style: {
              fontSize: '14px',
              border: '1px dashed white',
              color: '#000',
              zIndex: 100,
            }
          }}
        />
        <Footer />
      </Suspense>
    </>
  )
}

export default App
