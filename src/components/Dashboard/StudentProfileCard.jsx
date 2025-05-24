import React from 'react';
import Image from 'next/image';
import '../../styles/dashboard.css';

const StudentProfileCard = ({ photoURL, fullName, examId }) => {
  return (
    <div className="student-profile-card">
      <Image
        src={photoURL}
        alt="Student"
        width={80}
        height={80}
        className="student-photo"
      />
      <div>
        <h2>{fullName}</h2>
        <p><strong>Exam ID:</strong> {examId}</p>
      </div>
    </div>
  );
};

export default StudentProfileCard;
