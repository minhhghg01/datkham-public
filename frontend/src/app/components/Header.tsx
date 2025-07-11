"use client";
import Link from "next/link";
import React from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link href="/" style={homeBtnStyle}>🏠 Home</Link>
      </div>
      <div style={{ fontWeight: 600, fontSize: 20 }}>Đặt lịch khám bệnh</div>
      <div>
        {loggedIn ? (
          <button style={logoutBtnStyle} onClick={handleLogout}>Đăng xuất</button>
        ) : (
          <Link href="/login" style={loginBtnStyle}>Đăng nhập</Link>
        )}
      </div>
    </header>
  );
}

const headerStyle = {
  width: "100%",
  height: 60,
  background: "#fff",
  borderBottom: "1.5px solid #e0e0e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 32px",
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
};
const homeBtnStyle = {
  background: "#f5f5f5",
  color: "#222",
  border: "none",
  borderRadius: 6,
  padding: "8px 16px",
  fontWeight: 500,
  textDecoration: "none",
  fontSize: 16,
  cursor: "pointer",
};
const loginBtnStyle = {
  background: "#3498db",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "8px 18px",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  textDecoration: "none",
}; 
const logoutBtnStyle = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  borderRadius: 6,
  padding: "8px 18px",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  textDecoration: "none",
};