import React, { useState } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import bulkQuestions from '../data/bulkQuestions';

const AddQuestions = () => {
  const [status, setStatus] = useState('idle');

  const uploadQuestions = async () => {
    setStatus('uploading');
    try {
      const classes = ['SS2', 'SS3'];  // Classes to upload to
      const batch = classes.map(async (classLevel) => {
        for (const question of bulkQuestions) {
          await addDoc(collection(db, 'Questions', classLevel, 'Office Practice'), question);
        }
      });

      await Promise.all(batch);
      setStatus('done');
      console.log('✅ Questions uploaded successfully!');
    } catch (error) {
      console.error('❌ Error uploading questions:', error);
      setStatus('error');
    }
  };

  return (
    <div className="upload-container">
      <h2>Uploading Office Practice Questions...</h2>
      <p>Status: <strong>{status}</strong></p>
      <button onClick={uploadQuestions} disabled={status === 'uploading'}>
        {status === 'uploading' ? 'Uploading...' : 'Upload Questions'}
      </button>
    </div>
  );
};

export default AddQuestions;
