import React from 'react';
import Image from 'next/image';
import '../../styles/dashboard.css';

const StudentProfileCard = ({ photoURL, fullName, studentId }) => {
  return (
    <div className="student-profile-card">
      <Image
        src={photoURL}
        alt="Student"
        width={100}
        height={100}
        className="student-photo"
      />
      <div>
        <h2>{fullName}</h2>
        <p><strong>Student ID:</strong> {studentId}</p>
      </div>
    </div>
  );
};

export default StudentProfileCard;
