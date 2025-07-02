"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const getStatusLabel = (status: string) => {
    let label = "";
    let color = "";
  
    switch (status) {
      case "pending":
        label = "Đang chờ";
        color = "#f1c40f"; // vàng
        break;
      case "done":
        label = "Hoàn thành";
        color = "#2ecc71"; // xanh lá
        break;
      case "deleted":
        label = "Đã hủy";
        color = "#e74c3c"; // đỏ
        break;
      default:
        label = status;
        color = "#bdc3c7"; // xám
    }
  
    return (
      <span
        style={{
          backgroundColor: color,
          color: "white",
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: 500,
          display: "inline-block",
          minWidth: "80px",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    );
  };    

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:4000/api/booking/${id}`, {
        status: newStatus,
      });
  
      // Cập nhật lại danh sách bookings sau khi thay đổi
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/booking");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Danh sách đặt lịch</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Họ tên</th>
            <th style={thStyle}>SĐT</th>
            <th style={thStyle}>Giới tính</th>
            <th style={thStyle}>Ngày sinh</th>
            <th style={thStyle}>Phòng khám</th>
            <th style={thStyle}>Thời gian</th>
            <th style={thStyle}>Trạng thái</th>
            <th style={thStyle}>Hành động</th>
            <th style={thStyle}>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b: any, index: number) => (
            <React.Fragment key={b.id}>
              <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{b.name}</td>
                <td style={tdStyle}>{b.phone}</td>
                <td style={tdStyle}>{b.gender}</td>
                <td style={tdStyle}>{new Date(b.dateOfBirth).toLocaleDateString()}</td>
                <td style={tdStyle}>{b.clinic?.name}</td>
                <td style={tdStyle}>{`${new Date(b.date).toLocaleDateString()} ${b.time}`}</td>
                <td style={tdStyle}>{getStatusLabel(b.status)}</td>
                <td style={tdStyle}>
                <button style={actionBtn} onClick={() => handleUpdateStatus(b.id, 'done')}>
                  Xác nhận
                </button>
                <button
                  style={{ ...actionBtn, background: '#e74c3c' }}
                  onClick={() => handleUpdateStatus(b.id, 'deleted')}
                >
                  Xóa
                </button>
                </td>
                <td style={tdStyle}>
                  <button style={actionBtn} onClick={() => toggleRow(b.id)}>
                    {expandedRows.includes(b.id) ? "Ẩn" : "Chi tiết"}
                  </button>
                </td>
              </tr>
              {expandedRows.includes(b.id) && (
                <tr>
                  <td style={tdDetail} colSpan={10}>
                    <div><strong>CCCD:</strong> {b.cccd}</div>
                    <div><strong>Quốc gia:</strong> {b.country?.name}</div>
                    <div><strong>Dân tộc:</strong> {b.ethnic?.name}</div>
                    <div><strong>Nghề nghiệp:</strong> {b.occupation?.name}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "12px 16px",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "12px 16px",
};

const tdDetail = {
  padding: "12px 16px",
  backgroundColor: "#f9f9f9",
  fontSize: "14px",
  lineHeight: "1.6",
};

const actionBtn = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: 8,
  borderRadius: 4,
  cursor: "pointer",
};
