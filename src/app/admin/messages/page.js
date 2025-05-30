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
        const studentQuery = query(
          collection(db, "messages"),
          orderBy("timestamp", "desc")
        );
        const parentQuery = query(
          collection(db, "parentMessages"),
          orderBy("timestamp", "desc")
        );

        const [studentSnap, parentSnap] = await Promise.all([
          getDocs(studentQuery),
          getDocs(parentQuery),
        ]);

        const studentMessages = studentSnap.docs.map((doc) => ({
          id: doc.id,
          type: "student",
          ...doc.data(),
        }));

        const parentMessages = parentSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            type: "parent",
            name: data.fullName || "—",
            class: "—",
            department: "—",
            message: data.message,
            timestamp: data.timestamp,
          };
        });

        // Merge and sort all messages by timestamp (descending)
        const allMessages = [...studentMessages, ...parentMessages].sort(
          (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
        );

        // Add serial numbers
        const messagesWithSN = allMessages.map((msg, index) => ({
          sn: index + 1,
          ...msg,
        }));

        setMessages(messagesWithSN);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id, type) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      const collectionName = type === "parent" ? "parentMessages" : "messages";
      await deleteDoc(doc(db, collectionName, id));
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      window.location.reload();
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
              <th>Source</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.sn}</td>
                <td>{msg.name}</td>
                <td>{msg.class}</td>
                <td>{msg.department}</td>
                <td>{msg.message}</td>
                <td>{msg.type === "parent" ? "Parent" : "Student"}</td>
                <td>
                  {msg.timestamp
                    ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                    : "—"}
                </td>
                <td>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(msg.id, msg.type)}
                  >
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
