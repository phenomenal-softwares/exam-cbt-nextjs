// pages/admin/AddQuestions.jsx or just AddQuestions.jsx if reused elsewhere
import React, { useEffect, useState } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import bulkQuestions from '../../data/bulkQuestions';

const AddQuestions = () => {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const uploadQuestions = async () => {
      setStatus('uploading');
      try {
        const batch = bulkQuestions.map(async (question) => {
          await addDoc(collection(db, 'Questions', 'SS2', 'Chemistry'), question);
        });

        await Promise.all(batch);
        setStatus('done');
        console.log('✅ Questions uploaded successfully!');
      } catch (error) {
        console.error('❌ Error uploading questions:', error);
        setStatus('error');
      }
    };

    uploadQuestions();
  }, []);

  return (
    <div className="upload-container">
      <h2>Uploading SS2 Biology Questions...</h2>
      <p>Status: <strong>{status}</strong></p>
    </div>
  );
};

export default AddQuestions;
