"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { auth } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getGradeAndRemark } from "@/utils/getGradeAndRemark";

import "./results.css";

export default function ResultsPage() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/login");
          return;
        }

        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          console.error("No student data found.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>No data found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="flex items-center gap-4 mb-6 bg-white shadow-md p-4 rounded-lg">
        <img
          src={student.photoURL}
          alt="Student"
          className="student-photo"
        />
        <div>
          <h2 className="text-xl font-bold">{student.fullName}</h2>
          <p>{student.email}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded-lg">
        <div><strong>Class:</strong> {student.class}</div>
        <div><strong>Department:</strong> {student.department}</div>
        <div><strong>Exam ID:</strong> {student.examId}</div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Subject</th>
              <th className="py-2 px-4 text-left">Score</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Grade</th>
              <th className="py-2 px-4 text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject, index) => {
              const { name, score, examTaken } = subject;

              if (!examTaken) {
                return (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{name}</td>
                    <td className="py-2 px-4">Nil</td>
                    <td className="py-2 px-4">Nil</td>
                    <td className="py-2 px-4">Nil</td>
                    <td className="py-2 px-4">Nil</td>
                  </tr>
                );
              }

              const { grade, remark } = getGradeAndRemark(score);

              return (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{name}</td>
                  <td className="py-2 px-4">{score}</td>
                  <td className="py-2 px-4">20</td>
                  <td className="py-2 px-4">{grade}</td>
                  <td className="py-2 px-4">{remark}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
}
  
