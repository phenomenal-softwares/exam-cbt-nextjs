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

  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "parents"),
        where("email", "==", email),
        where("passKey", "==", passKey)
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

      router.push("/parent");
    } catch (err) {
      setError("Login failed. Please try again.");
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
            className="login-input"
            placeholder="Parent Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            placeholder="Passkey"
            value={passKey}
            onChange={(e) => setPassKey(e.target.value)}
            required
          />
          <PasswordVisibility
            visible={showPassword}
            setVisible={setShowPassword}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
