import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import WardsTable from "./WardsTable";
import ResultsPage from "@/app/results/page";
import MessageModal from "../UI/Modal/MessageModal";
import { saveParentMessageToDatabase } from "@/utils/saveParentMessageToDatabase"; // adjust path if needed

import "./ParentDashboard.css";

export default function ParentDashboard({ parentId }) {
  const [parentData, setParentData] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
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

  const handleViewResults = (student) => {
    setSelectedStudent(student);
    setShowResultModal(true);
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
      <h2 className="title">PARENT DASHBOARD</h2>
      <h2>Welcome, {parentData.fullName}</h2>
      <p>Email: {parentData.email}</p>
      <p>Phone: {parentData.phone}</p>
      <WardsTable
        wardIds={parentData.wards}
        onViewResults={handleViewResults}
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

      {showResultModal && selectedStudent && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <ResultsPage
              passedStudent={selectedStudent}
              onClose={() => setShowResultModal(false)}
            />
          </div>
        </div>
      )}

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
