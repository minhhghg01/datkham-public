import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Chào mừng đến với hệ thống đặt lịch khám bệnh</h1>
      <Link href="/booking">
        <button style={mainBtnStyle}>Đặt lịch khám</button>
      </Link>
    </div>
  );
}

const mainBtnStyle = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "20px 48px",
  fontSize: 24,
  fontWeight: 700,
  boxShadow: "0 4px 16px rgba(46,204,113,0.15)",
  cursor: "pointer",
  transition: "background 0.2s",
};