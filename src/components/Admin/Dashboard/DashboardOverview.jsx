'use client';
import { useEffect, useState } from 'react';
import { db } from '@/services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import StatCard from './StatCard';
import './adminDashboard.css'; // custom styles

export default function DashboardOverview() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [examsTaken, setExamsTaken] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, 'students'));
        const allStudents = studentSnapshot.docs;
        setTotalStudents(allStudents.length);

        const takenExams = allStudents.filter((doc) => {
          const data = doc.data();
          return data.subjects?.some(sub => sub.examTaken === true);
        });
        setExamsTaken(takenExams.length);

        // Count all questions (loop through levels and subjects or restructure later)
        const classes = ['SS1', 'SS2', 'SS3'];
        const subjects = ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Language'];

        let total = 0;
        for (const classLevel of classes) {
          for (const subject of subjects) {
            const qSnap = await getDocs(collection(db, `Questions/${classLevel}/${subject}`));
            total += qSnap.size;
          }
        }
        setTotalQuestions(total);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      <h2>Admin Dashboard</h2>
      <div className="overview-grid">
        <StatCard label="Total Students" count={totalStudents} />
        <StatCard label="Exams Taken" count={examsTaken} />
        <StatCard label="Total Questions" count={totalQuestions} />
      </div>
    </div>
  );
}
