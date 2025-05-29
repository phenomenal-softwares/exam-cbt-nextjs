"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";

import Letterhead from "../UI/Letterhead/Letterhead";
import LoadingOverlay from "../UI/LoadingOverlay/LoadingOverlay";
import PasswordVisibility from "../UI/PasswordVisibility/PasswordVisibility";

import "./authStyles.css";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <Letterhead currentTerm={"3RD TERM"} currentSession={"2024/2025"} />

      <div className="formWrapper">
        <h2 className="title">Student Login</h2>
        <form onSubmit={handleSubmit} className="form">
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
          <PasswordVisibility
            visible={showPassword}
            setVisible={setShowPassword}
          />

          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading} className="primaryBtn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="links">
          <a href="/recover" className="forgot-password">
            Forgot Password?
          </a>
          <a href="/signup" className="secondaryBtn">
            Not registered? Sign Up
          </a>
          <a href="/adminLogin" className="outlineBtn">
            Login as Admin
          </a>
        </div>
      </div>

      {loading && <LoadingOverlay />}
    </div>
  );
}
