"use client";
import React, { useState, useEffect } from "react";
import BookingManager from "./BookingManager";
import UserManager from "./UserManager";
import { useRouter } from "next/navigation";

const Sidebar = ({ selected, onSelect, role }: { selected: string, onSelect: (key: string) => void, role: string }) => (
  <div style={{
    width: 220,
    background: '#f8fafc',
    borderRight: '1px solid #e0e0e0',
    minHeight: '100vh',
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }}>
    <div
      onClick={() => onSelect('booking')}
      style={{
        padding: '16px 32px',
        cursor: 'pointer',
        background: selected === 'booking' ? '#2ecc71' : 'transparent',
        color: selected === 'booking' ? '#fff' : '#222',
        fontWeight: 700,
        borderRadius: '0 24px 24px 0',
        transition: 'all 0.2s',
      }}
    >
      Quản lý Booking
    </div>
    {(role === 'cntt' || role === 'admin') && (
      <div
        onClick={() => onSelect('user')}
        style={{
          padding: '16px 32px',
          cursor: 'pointer',
          background: selected === 'user' ? '#2ecc71' : 'transparent',
          color: selected === 'user' ? '#fff' : '#222',
          fontWeight: 700,
          borderRadius: '0 24px 24px 0',
          transition: 'all 0.2s',
        }}
      >
        Quản lý User
      </div>
    )}
  </div>
);

export default function DashboardPage() {
  const [selected, setSelected] = useState('booking');
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const r = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (!token || !r) {
      router.replace('/login');
      return;
    }
    setRole(r);
    // Nếu user thì luôn về booking
    if (r === 'user') setSelected('booking');
  }, [router]);

  if (!role) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Sidebar
        selected={selected}
        onSelect={setSelected}
        role={role}
      />
      <div style={{ flex: 1, background: '#fff' }}>
        {selected === 'booking' && <BookingManager />}
        {selected === 'user' && (role === 'cntt' || role === 'admin') && <UserManager role={role} />}
      </div>
    </div>
  );
} 