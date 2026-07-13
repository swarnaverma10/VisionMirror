import { BrowserRouter } from 'react-router-dom';
import { AppProvider }   from '@context/AppContext';
import { CollectionsProvider } from '@context/CollectionsContext';
import AppRouter         from '@/routes';
import Toast             from '@components/Common/Toast';
import '@/styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <CollectionsProvider>
          <AppRouter />
          <Toast />
        </CollectionsProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
