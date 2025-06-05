import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import WardsTable from "./WardsTable";
import ResultsPage from "@/app/results/page";
import MessageModal from "../UI/Modal/MessageModal";
import { saveParentMessageToDatabase } from "@/utils/saveParentMessageToDatabase"; // adjust path if needed

import "./ParentDashboard.css";

export default function ParentDashboard({ parentId }) {
  const [parentData, setParentData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageStatus, setMessageStatus] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchParent = async () => {
      const docRef = doc(db, "parents", parentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setParentData(docSnap.data());
      }
    };
    fetchParent();
  }, [parentId]);

  const handleDownloadResult = async (student) => {
    setSelectedStudent(student);

    setTimeout(async () => {
      const input = document.getElementById("pdf-container");
      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // If pdfHeight is longer than A4, cap it
      const pageHeight = pdf.internal.pageSize.getHeight();
      const finalHeight = Math.min(pdfHeight, pageHeight);

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`${student.fullName}_Result.pdf`);
    }, 500);
  };

  const handleConfirmMessage = async (messageText) => {
    if (!parentData) return;
    setShowMessageModal(false);
    try {
      setSendingMessage(true);
      await saveParentMessageToDatabase({
        fullName: parentData.fullName,
        message: messageText,
      });

      setMessageStatus(
        "The admin has received your message and a prompt response is assured. Thank you for reaching out!"
      );
    } catch (error) {
      setMessageStatus("Failed to send message. Please try again.");
    }

    setSendingMessage(false);
    // Clear status after a short while
    setTimeout(() => setMessageStatus(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("parentSession");
    router.push("/parent-login");
  };

  if (!parentData) return <p className="fetching">Fecthing parent info...</p>;

  return (
    <div className="dashboard">
      <h3 className="title">PARENT DASHBOARD</h3>
      <h3>Welcome, {parentData.fullName}</h3>
      <p>Email: {parentData.email}</p>
      <p>Phone: {parentData.phone}</p>

      <WardsTable
        wards={parentData.wards || []}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        onDownloadResult={handleDownloadResult}
      />

      {messageStatus && <p className="message-status">{messageStatus}</p>}

      <div className="extra-buttons">
        <button
          className="send-message-btn"
          onClick={() => setShowMessageModal(true)}
          disabled={sendingMessage}
        >
          {sendingMessage ? "Sending... please wait" : "Send Message to Admin"}
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div id="pdf-container">
          {selectedStudent && (
            <ResultsPage
              passedStudent={selectedStudent}
              onClose={() => {}}
              isExport={true} // optional prop if needed to hide buttons
            />
          )}
        </div>
      </div>

      {showMessageModal && (
        <MessageModal
          title="We'd like to hear your feedback!"
          onConfirm={handleConfirmMessage}
          onCancel={() => setShowMessageModal(false)}
          studentInfo={null}
        />
      )}
    </div>
  );
}
