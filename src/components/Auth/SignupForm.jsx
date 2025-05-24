"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { generateSubjectList } from "@/utils/generateSubjectList";
import { generateExamId } from "@/utils/generateExamId";
import Letterhead from "../Letterhead/Letterhead";
import LoadingOverlay from "../UI/LoadingOverlay/LoadingOverlay";
import SuccessModal from "../UI/Modal/SuccessModal";
import ConfirmationModal from "../UI/Modal/ConfirmationModal";
import "./authStyles.css";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "",
    department: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.size <= 2 * 1024 * 1024 &&
      ["image/jpeg", "image/png"].includes(file.type)
    ) {
      setFormData((prev) => ({ ...prev, photo: file }));
    } else {
      setError("Please upload a valid photo (max 2MB, jpg/png)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const examId = generateExamId(formData.class, formData.department);
      const subjects = generateSubjectList(formData.department);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const uid = userCredential.user.uid;

      let photoURL = "";
      if (formData.photo) {
        const photoRef = ref(storage, `students/${uid}/photo.jpg`);
        const uploadTask = uploadBytesResumable(photoRef, formData.photo);
        await uploadTask;
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "students", uid), {
        fullName: formData.fullName.toUpperCase(),
        email: formData.email,
        class: formData.class,
        department: formData.department,
        subjects,
        photoURL,
        examId,
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Error creating account. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const isValid =
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.class &&
      formData.department &&
      formData.password === formData.confirmPassword &&
      formData.photo;

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="authContainer">
      <Letterhead currentTerm={"3RD TERM"} currentSession={"2024/2025"} />
      <div className="formWrapper">
        <h2 className="title">Student Registration</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input"
          />

          <div className="class-department-wrapper">
            <div>
              <h3>Class</h3>
              <div className="options">
                {["SS1", "SS2", "SS3"].map((cls) => (
                  <label
                    key={cls}
                    className={`option-label ${
                      formData.class === cls ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="class"
                      value={cls}
                      onChange={handleChange}
                      checked={formData.class === cls}
                    />
                    {cls}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3>Department</h3>
              <div className="options">
                {["Art", "Commercial", "Science"].map((dept) => (
                  <label
                    key={dept}
                    className={`option-label ${
                      formData.department === dept ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="department"
                      value={dept}
                      onChange={handleChange}
                      checked={formData.department === dept}
                    />
                    {dept}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="photo-upload-wrapper">
            <label className="custom-file-label">
              <span className="file-label-text">
                Passport Photo (jpg/png, max 2MB)
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                required
                className="file-input"
              />
            </label>
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="primaryBtn"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
