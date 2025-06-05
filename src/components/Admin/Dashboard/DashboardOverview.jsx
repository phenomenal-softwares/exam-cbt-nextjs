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
  const [uploadedExams, setUploadedExams] = useState({
    SS1: 0,
    SS2: 0,
    SS3: 0,
  });
  const [totalParents, setTotalParents] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  const subjectList = [
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
    "Office Practice",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch students
        const studentSnapshot = await getDocs(collection(db, "students"));
        const allStudents = studentSnapshot.docs;
        setTotalStudents(allStudents.length);

        // Exams taken
        const takenExams = allStudents.filter((doc) =>
          doc.data().subjects?.some((sub) => sub.examTaken === true)
        );
        setExamsTaken(takenExams.length);

        // Exams uploaded per class
        const classes = ["SS1", "SS2", "SS3"];
        const uploaded = {};

        for (const classLevel of classes) {
          let count = 0;
          for (const subject of subjectList) {
            const qSnap = await getDocs(
              collection(db, `Questions/${classLevel}/${subject}`)
            );
            if (!qSnap.empty) count += 1;
          }
          uploaded[classLevel] = count;
        }
        setUploadedExams(uploaded);

        // Parents
        const parentSnap = await getDocs(collection(db, "parents"));
        setTotalParents(parentSnap.size);

        // Messages + Parent Messages
        const [msgSnap, parentMsgSnap] = await Promise.all([
          getDocs(collection(db, "messages")),
          getDocs(collection(db, "parentMessages")),
        ]);
        setTotalMessages(msgSnap.size + parentMsgSnap.size);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      <h1 className="page-title">Overview</h1>
      <div className="overview-grid">
        <StatCard
          label="Total Students"
          count={loading ? <Spinner /> : totalStudents}
        />
        <StatCard
          label="Exams Submitted"
          count={loading ? <Spinner /> : examsTaken}
        />
        <StatCard
          label="Exams Uploaded (SS1)"
          count={
            loading ? <Spinner /> : `${uploadedExams.SS1}/${subjectList.length}`
          }
        />
        <StatCard
          label="Exams Uploaded (SS2)"
          count={
            loading ? <Spinner /> : `${uploadedExams.SS2}/${subjectList.length}`
          }
        />
        <StatCard
          label="Exams Uploaded (SS3)"
          count={
            loading ? <Spinner /> : `${uploadedExams.SS3}/${subjectList.length}`
          }
        />
        <StatCard
          label="Total Parents"
          count={loading ? <Spinner /> : totalParents}
        />
        <StatCard
          label="Total Messages"
          count={loading ? <Spinner /> : totalMessages}
        />
      </div>
    </div>
  );
}
