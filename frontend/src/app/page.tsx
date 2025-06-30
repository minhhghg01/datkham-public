import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Trang chủ</h1>
      <ul>
        <li><Link href="/booking">Đặt lịch khám</Link></li>
        <li><Link href="/login">Đăng nhập</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </div>
  );
}