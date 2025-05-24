// context/FirebaseContext.js
'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, auth } from '../services/firebase'; // Assuming you also have auth set up in firebase.js
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);  // Track the user authentication status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);  // Set the authenticated user
        fetchStudentData(user.uid); // Fetch the student's data from Firestore
      } else {
        setUser(null);  // User not authenticated
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const fetchStudentData = async (uid) => {
    const docRef = doc(db, 'students', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setStudentData(docSnap.data());
    } else {
      console.log('No student data found!');
    }
    setLoading(false);
  };

  return (
    <FirebaseContext.Provider value={{ studentData, loading, user }}>
      {children}
    </FirebaseContext.Provider>
  );
};
