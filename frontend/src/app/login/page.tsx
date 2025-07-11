"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    if (!username.trim()) {
      setUsernameError("Username không được để trống");
      valid = false;
    } else {
      setUsernameError("");
    }
    if (!password.trim()) {
      setPasswordError("Mật khẩu không được để trống");
      valid = false;
    } else {
      setPasswordError("");
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitClicked(true);
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/api/user/login", {
        username,
        password,
      });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: 32,
        borderRadius: 24,
        boxShadow: "0 8px 32px #e0e0e0",
        background: "#fff",
        border: "1px solid #f0f0f0",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 28,
          textAlign: "center",
          letterSpacing: 1,
          color: "#222",
        }}
      >
        Đăng nhập
      </h1>
      <form onSubmit={handleSubmit}>
        <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
          Username:
        </label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 14px",
            borderRadius: 12,
            border: "1.5px solid #b2f2dd",
            fontSize: 18,
            marginBottom: 6,
            background: "#fff",
            fontWeight: 500,
            color: "#222",
            outline: "none",
            boxShadow: "0 1px 4px #f0f0f0",
          }}
        />
        {submitClicked && usernameError && <div style={{ color: 'red', marginBottom: 8 }}>{usernameError}</div>}

        <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
          Mật khẩu:
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 14px",
            borderRadius: 12,
            border: "1.5px solid #b2f2dd",
            fontSize: 18,
            marginBottom: 6,
            background: "#fff",
            fontWeight: 500,
            color: "#222",
            outline: "none",
            boxShadow: "0 1px 4px #f0f0f0",
          }}
        />
        {submitClicked && passwordError && <div style={{ color: 'red', marginBottom: 8 }}>{passwordError}</div>}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <button
            type="submit"
            style={{
              padding: "12px 32px",
              borderRadius: 10,
              border: "none",
              background: "#2ecc71",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? "none" : "0 2px 8px #b2f2dd",
              transition: "all 0.2s",
            }}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
} 