import React from 'react';

const StudentDetailsGrid = ({ email, className, department }) => {
  return (
    <div className="student-details-grid">
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Class:</strong> {className}</p>
      <p><strong>Department:</strong> {department}</p>
    </div>
  );
};

export default StudentDetailsGrid;
