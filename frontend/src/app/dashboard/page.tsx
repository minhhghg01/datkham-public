"use client";
import React, { useState } from "react";
import BookingManager from "./BookingManager";
import UserManager from "./UserManager";

const Sidebar = ({ selected, onSelect }: { selected: string, onSelect: (key: string) => void }) => (
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
  </div>
);

export default function DashboardPage() {
  const [selected, setSelected] = useState('booking');
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar selected={selected} onSelect={setSelected} />
      <div style={{ flex: 1, background: '#fff' }}>
        {selected === 'booking' ? <BookingManager /> : <UserManager />}
      </div>
    </div>
  );
} 