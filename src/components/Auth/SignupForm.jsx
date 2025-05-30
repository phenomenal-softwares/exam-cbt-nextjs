"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { generateSubjectList } from "@/utils/generateSubjectList";
import { generateStudentId } from "@/utils/generateStudentId";
import Letterhead from "../UI/Letterhead/Letterhead";
import LoadingOverlay from "../UI/LoadingOverlay/LoadingOverlay";
import SuccessModal from "../UI/Modal/SuccessModal";
import PasswordVisibility from "../UI/PasswordVisibility/PasswordVisibility";

import "./authStyles.css";

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    studentClass: "",
    department: "",
    photo: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setSelectedFileName(file.name); // Update file name state
      setError("");
    } else {
      setError("Please upload a valid photo (max 5MB, jpg/png)");
      setSelectedFileName(""); // Reset file name if invalid
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
      const studentId = generateStudentId();
      const subjects = await generateSubjectList(formData.department);

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
        gender: formData.gender,
        class: formData.studentClass,
        department: formData.department,
        subjects,
        photoURL,
        studentId,
      });

      setShowSuccessModal(true);
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
      formData.gender &&
      formData.studentClass &&
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
      <Letterhead />
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
            type={showPassword ? "text" : "password"}
            placeholder="Password - at least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input"
          />
          <PasswordVisibility
            visible={showPassword}
            setVisible={setShowPassword}
          />

          <div className="class-department-wrapper">
            <div>
              <h3>Gender</h3>
              <div className="options">
                {["Male", "Female"].map((cls) => (
                  <label
                    key={cls}
                    className={`option-label ${
                      formData.gender === cls ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={cls}
                      onChange={handleChange}
                      required
                      checked={formData.gender === cls}
                    />
                    {cls}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3>Class</h3>
              <div className="options">
                {["SS1", "SS2", "SS3"].map((cls) => (
                  <label
                    key={cls}
                    className={`option-label ${
                      formData.studentClass === cls ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="studentClass"
                      value={cls}
                      onChange={handleChange}
                      required
                      checked={formData.studentClass === cls}
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
                      required
                      checked={formData.department === dept}
                    />
                    {dept}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="photo-upload-wrapper">
            <label htmlFor="passport-upload">
              {selectedFileName
                ? `Selected: ${selectedFileName}`
                : "Passport Photo (jpg/png, max 2MB)"}
              <input
                id="passport-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                required
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="checkbox-wrapper">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                required
              />
              I have verified all information provided and I am ready to submit
              the form.
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

          {showSuccessModal && (
            <SuccessModal
              title="Registration Successful"
              message="Your exam record has been created successfully. You may now proceed to the dashboard."
              primaryLabel="Proceed to Dashboard"
              secondaryLabel="Back to Login"
              onPrimary={() => router.push("/dashboard")}
              onSecondary={() => router.push("/login")}
            />
          )}
        </form>
      </div>
    </div>
  );
}
