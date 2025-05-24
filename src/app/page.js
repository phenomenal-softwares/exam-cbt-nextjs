// pages/_app.js or app/page.js
'use client';
import { FirebaseProvider, useFirebase } from '../context/FirebaseContext';
import LoginPage from './login/page';  // Your login page
import DashboardPage from './dashboard/page';  // Your dashboard page

export default function App({ Component, pageProps }) {
  return (
    <FirebaseProvider>
      <MainApp />
    </FirebaseProvider>
  );
}

const MainApp = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <div>Loading...</div>;  // Show a loading indicator while Firebase auth is being checked
  }

  return (
    <>
      {user ? <DashboardPage /> : <LoginPage />}
    </>
  );
};
