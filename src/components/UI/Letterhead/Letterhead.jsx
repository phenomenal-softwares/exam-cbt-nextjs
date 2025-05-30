'use client';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import Spinner from '../Spinner/Spinner';
import './Letterhead.css';

const Letterhead = () => {
  const [term, setTerm] = useState('');
  const [session, setSession] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermSession = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTerm(data.academicTerm);
          setSession(data.academicSession);
        } else {
          console.warn("No term/session config found");
        }
      } catch (error) {
        console.error("Error fetching term/session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermSession();
  }, []);

  return (
    <div className="letterhead">
      <div className="logo-container">
        <img
          src="/images/school-logo.png"
          alt="School Logo"
          width={100}
          height={100}
          className="school-logo"
        />
      </div>
      <div className="letterhead-text">
        <h1 className="school-name">DOLAPO HIGH SCHOOL</h1>
        <p className="school-address">
          P.M.B 2317, ASA DAM, ILORIN, KWARA STATE
        </p>
        <div className="exam-details">
          {loading ? <Spinner /> : `${term} ${session} INTEGRATED EXAM E-FACILITY`}
        </div>
      </div>
    </div>
  );
};

export default Letterhead;
