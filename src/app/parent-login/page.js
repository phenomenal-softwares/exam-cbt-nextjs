"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";

import Letterhead from "@/components/UI/Letterhead/Letterhead";
import PasswordVisibility from "@/components/UI/PasswordVisibility/PasswordVisibility";

import "./parentLogin.css";

export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [passKey, setPassKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const q = query(
        collection(db, "parents"),
        where("email", "==", email.trim().toLowerCase()),
        where("passKey", "==", passKey.trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid email or passkey.");
        return;
      }

      const parentData = querySnapshot.docs[0].data();
      const parentId = querySnapshot.docs[0].id;

      // Save session to localStorage
      localStorage.setItem("parentSession", JSON.stringify({ parentId }));
      setLoading(false);
      router.push("/parent");
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      <Letterhead />
      <div className="parent-login-container">
        <h2 className="login-title">Parent Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            className="login-input"
            placeholder="Parent Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart())}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            placeholder="Pass key"
            value={passKey}
            onChange={(e) => setPassKey(e.target.value.trimStart())}
            required
          />
          <PasswordVisibility
            visible={showPassword}
            setVisible={setShowPassword}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="info">
            *If you don't have an account or you forgot your email/pass key, you
            are required to contact the admin.
          </p>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
