"use client";

import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { generateParentPassKey } from "@/utils/generateParentPassKey";

import SuccessModal from "@/components/UI/Modal/SuccessModal";

import "./ParentForm.css";

export default function ParentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    wards: [],
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passKey] = useState(() => generateParentPassKey());

  const router = useRouter();

  const isFormValid =
      formData.fullName.trim() && formData.email.trim() && formData.phone.trim() && formData.wards.length > 0;

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort alphabetically by full name
      studentsList.sort((a, b) => a.fullName.localeCompare(b.fullName));

      setStudents(studentsList);
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === "wards") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      setFormData((prev) => ({ ...prev, wards: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!isFormValid) {
      setError("Please fill in all required fields, including selecting at least one ward.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "parents"), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        wards: formData.wards,
        passKey,
      });

      setShowSuccessModal(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        wards: [],
      });
    } catch (err) {
      setError("Failed to create parent. Please try again.");
      alert("Failed to create parent. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-form-container">
      <h2>Add A Parent</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="fullName"
          type="text"
          placeholder="Parent Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="email"
          type="email"
          placeholder="Parent Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="phone"
          type="tel"
          placeholder="Parent Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="input"
        />

        <label className="label">Select Wards:</label>
        <div className="checkbox-group">
          {students.map((student) => (
            <label key={student.id} className="checkbox-item">
              <input
                type="checkbox"
                value={student.id}
                checked={formData.wards.includes(student.id)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    wards: checked
                      ? [...prev.wards, value]
                      : prev.wards.filter((id) => id !== value),
                  }));
                }}
              />
              <div>
                {student.fullName} ({student.class} {student.department})
              </div>
            </label>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="primaryBtn"
        >
          {loading ? "Saving..." : "Save Parent"}
        </button>

        {showSuccessModal && (
          <SuccessModal
            title="Parent Added"
            message="Parent information has been successfully saved."
            primaryLabel="Back to Dashboard"
            onPrimary={() => window.location.assign("/admin/parents")}
          />
        )}
      </form>
    </div>
  );
}
