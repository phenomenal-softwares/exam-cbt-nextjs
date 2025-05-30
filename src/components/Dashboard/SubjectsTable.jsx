import React from 'react';

const SubjectsTable = ({ subjects, onTakeExam }) => {
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
          {subjects.map((subject, idx) => (
            <tr key={idx}>
              <td>{subject.name}</td>
              <td>
                <button
                  onClick={() => onTakeExam(subject)}
                  disabled={subject.examTaken}
                  className={subject.examTaken ? 'btn-disabled' : 'btn-primary'}
                >
                  {subject.examTaken ? 'Locked' : 'Take Exam'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectsTable;
