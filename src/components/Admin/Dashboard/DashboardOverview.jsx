"use client";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import StatCard from "./StatCard";
import Spinner from "@/components/UI/Spinner/Spinner";
import "./adminDashboard.css";

export default function DashboardOverview() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [examsTaken, setExamsTaken] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentSnapshot = await getDocs(collection(db, "students"));
        const allStudents = studentSnapshot.docs;
        setTotalStudents(allStudents.length);
        setLoadingStudents(false);

        const takenExams = allStudents.filter((doc) => {
          const data = doc.data();
          return data.subjects?.some((sub) => sub.examTaken === true);
        });
        setExamsTaken(takenExams.length);
        setLoadingExams(false);

        const classes = ["SS1", "SS2", "SS3"];
        const subjects = [
          "Biology",
          "Chemistry",
          "Physics",
          "Mathematics",
          "English Language",
          "Geography",
          "Agricultural Science",
          "Government",
          "Literature",
          "CRS",
          "Civic Education",
          "History",
          "Accounting",
          "Commerce",
          "Economics",
          "Marketing",
          "Office Practice"
        ];

        let total = 0;
        for (const classLevel of classes) {
          for (const subject of subjects) {
            const qSnap = await getDocs(
              collection(db, `Questions/${classLevel}/${subject}`)
            );
            total += qSnap.size;
          }
        }
        setTotalQuestions(total);
        setLoadingQuestions(false);
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
        <StatCard
          label="Total Students"
          count={loadingStudents ? <Spinner /> : totalStudents}
        />
        <StatCard
          label="Exams Taken"
          count={loadingExams ? <Spinner /> : examsTaken}
        />
        <StatCard
          label="Total Questions"
          count={loadingQuestions ? <Spinner /> : totalQuestions}
        />
      </div>
    </div>
  );
}
