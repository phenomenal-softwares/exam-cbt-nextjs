"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { generateSubjectList } from "@/utils/generateSubjectList";
import "./batchForm.css";

export default function BatchRegister() {
  const [students, setStudents] = useState(
    Array.from({ length: 3 }, () => ({
      fullName: "",
      email: "",
      studentId: "",
    }))
  );
  const [classLevel, setClassLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStudentChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.size <= 5 * 1024 * 1024 &&
      ["image/jpeg", "image/png"].includes(file.type)
    ) {
      setPhoto(file);
    } else {
      alert("Invalid photo. Only JPG/PNG under 5MB allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classLevel || !department || !gender || !photo) {
      alert("Fill all general details and upload a valid photo.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const subjects = generateSubjectList(department);

      for (let i = 0; i < students.length; i++) {
        const { fullName, email, studentId } = students[i];
        if (!fullName || !email || !studentId) continue;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          "123456"
        );
        const uid = userCredential.user.uid;

        const photoRef = ref(storage, `students/${uid}/photo.jpg`);
        const uploadTask = uploadBytesResumable(photoRef, photo);
        await uploadTask;
        const photoURL = await getDownloadURL(photoRef);

        await setDoc(doc(db, "students", uid), {
          fullName: fullName.toUpperCase(),
          email,
          class: classLevel,
          department,
          gender,
          subjects,
          studentId,
          photoURL,
          examTaken: false,
        });
      }

      setStatus("Batch registration successful.");
    } catch (err) {
      console.error(err);
      setStatus("Some registrations may have failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="batchFormContainer">
      <h2>Temporary Batch Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="topSection">
          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            <option value="SS1">SS1</option>
            <option value="SS2">SS2</option>
            <option value="SS3">SS3</option>
          </select>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="Science">Science</option>
            <option value="Art">Art</option>
            <option value="Commercial">Commercial</option>
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            required
          />
        </div>

        <div className="studentFields">
          {students.map((student, index) => (
            <div key={index} className="studentRow">
              <input
                type="text"
                placeholder={`Full Name ${index + 1}`}
                value={student.fullName}
                onChange={(e) =>
                  handleStudentChange(index, "fullName", e.target.value)
                }
              />
              <input
                type="email"
                placeholder={`Email ${index + 1}`}
                value={student.email}
                onChange={(e) =>
                  handleStudentChange(index, "email", e.target.value)
                }
              />
              <input
                type="text"
                placeholder={`Student ID ${index + 1}`}
                value={student.studentId}
                onChange={(e) =>
                  handleStudentChange(index, "studentId", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Students"}
        </button>

        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
