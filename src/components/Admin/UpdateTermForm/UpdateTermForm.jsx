'use client';

import { useState } from 'react';
import { db } from '@/services/firebase';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';

import './UpdateTermForm.css';

const termOptions = ['1ST TERM', '2ND TERM', '3RD TERM'];

export default function UpdateTermForm() {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleTermUpdate = async () => {
    if (!selectedTerm) {
      alert('Please select a term');
      return;
    }

    const confirmAction = confirm(
      `Are you sure you want to update to ${selectedTerm}? This will reset all students' exam statuses.`
    );

    if (!confirmAction) return;

    setLoading(true);
    setFeedback('');

    try {
      // 1. Update the current term in settings
      const settingsRef = doc(db, 'config', 'settings');
      await updateDoc(settingsRef, { term: selectedTerm });

      // 2. Get all students
      const studentsRef = collection(db, 'students');
      const snapshot = await getDocs(studentsRef);

      // 3. Loop through and reset their subjects
      const updates = snapshot.docs.map(async (docSnap) => {
        const studentData = docSnap.data();
        const updatedSubjects = (studentData.subjects || []).map((subject) => ({
          ...subject,
          score: 0,
          examTaken: false,
        }));

        return updateDoc(doc(db, 'students', docSnap.id), {
          subjects: updatedSubjects,
        });
      });

      await Promise.all(updates);

      setFeedback(`Term updated to ${selectedTerm} successfully.`);
      setSelectedTerm('');
    } catch (err) {
      console.error('Failed to update term:', err);
      setFeedback('An error occurred while updating the term.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="term-form">
      <h3>Update Academic Term</h3>
      <select
        value={selectedTerm}
        onChange={(e) => setSelectedTerm(e.target.value)}
        className="dropdown"
      >
        <option value="">-- Select Term --</option>
        {termOptions.map((term) => (
          <option key={term} value={term}>
            {term}
          </option>
        ))}
      </select>

      <button onClick={handleTermUpdate} disabled={loading} className="primaryBtn">
        {loading ? 'Updating...' : 'Update Term'}
      </button>

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
