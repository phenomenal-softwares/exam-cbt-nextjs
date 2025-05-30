import React from 'react';

const SubjectsTable = ({ subjects, onTakeExam, maintenanceMode }) => {
  return (
    <div className="subjects-table">
      <h3>Registered Subjects</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, idx) => {
            const isLocked = subject.examTaken || maintenanceMode;

            return (
              <tr key={idx}>
                <td>{subject.name}</td>
                <td>
                  <button
                    onClick={() => onTakeExam(subject)}
                    disabled={isLocked}
                    className={isLocked ? 'btn-disabled' : 'btn-primary'}
                  >
                    {isLocked ? 'Locked' : 'Take Exam'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectsTable;
