"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import PasswordVisibility from "@/components/UI/PasswordVisibility/PasswordVisibility";
import LoadingOverlay from "@/components/UI/LoadingOverlay/LoadingOverlay";

import "./adminLogin.css";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        "admin@dolapoexamportal.com",
        password
      );
      router.push("/admin");
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError("Invalid admin pass key.");
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Admin Login</h2>

        <label>Email</label>
        <input
          type="email"
          value="admin@dolapoexamportal.com"
          disabled
          className="input"
        />

        <label>Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
          placeholder="Enter admin pass key"
        />

        <PasswordVisibility
          visible={showPassword}
          setVisible={setShowPassword}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="back-link">
          Not an admin? <a href="/">Back to home page</a>
        </p>
      </form>
    </div>
  );
}
