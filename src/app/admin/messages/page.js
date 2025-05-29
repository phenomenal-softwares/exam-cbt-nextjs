"use client";

import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import "./messages.css";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const messageList = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          sn: index + 1,
          ...doc.data(),
        }));
        setMessages(messageList);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "messages", id));
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  return (
    <div className="messages-page">
      <h2>Inbox Messages</h2>
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table className="messages-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Sender Name</th>
              <th>Class</th>
              <th>Department</th>
              <th>Message</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={msg.id}>
                <td>{index + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.class}</td>
                <td>{msg.department}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.timestamp?.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button className="deleteBtn" onClick={() => handleDelete(msg.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
