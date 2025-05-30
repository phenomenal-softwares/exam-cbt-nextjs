'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/services/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import './passwordRecovery.css';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetLink = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A reset link has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError('Failed to send reset link. Make sure the email is correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdmin = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Email not found in student records.');
        setLoading(false);
        return;
      }

      const student = querySnapshot.docs[0].data();

      const payload = {
        name: student.fullName,
        class: student.class,
        department: student.department,
        message: 'Reset my password',
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages'), payload);

      setMessage('Password reset request sent to admin. Please wait till you get a reset link.');
    } catch (err) {
      console.error(err);
      setError('Failed to contact admin. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-recovery">
      <h2>Password Recovery</h2>
      <p>Enter your registered email to reset your password.</p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="button-group">
        <button onClick={handleResetLink} disabled={loading}>
          Send Reset Link
        </button>
        <button onClick={handleContactAdmin} disabled={loading}>
          Contact Admin
        </button>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
  
