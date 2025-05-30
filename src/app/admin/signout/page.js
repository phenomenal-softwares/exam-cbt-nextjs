'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import './signout.css';

const SignOutPage = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleCancel = () => {
    router.back(); // Takes admin to the previous page
  };

  return (
    <div className="signout-page">
      <div className="signout-box">
        <h2>Confirm Sign Out</h2>
        <p>Are you sure you want to sign out of the admin panel?</p>
        <div className="signout-buttons">
          <button className="yes-btn" onClick={handleSignOut}>Yes, Sign Me Out</button>
          <button className="no-btn" onClick={handleCancel}>No, Stay Here</button>
        </div>
      </div>
    </div>
  );
};

export default SignOutPage;
