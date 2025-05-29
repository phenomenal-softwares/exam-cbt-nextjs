'use client';
import { FirebaseProvider, useFirebase } from '../context/FirebaseContext';
import LoginPage from './login/page';
import DashboardPage from './dashboard/page';
import LoadingOverlay from '@/components/UI/LoadingOverlay/LoadingOverlay';

export default function App() {
  return (
    <FirebaseProvider>
      <MainApp />
    </FirebaseProvider>
  );
}

const MainApp = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      {user ? <DashboardPage /> : <LoginPage />}
    </>
  );
};
