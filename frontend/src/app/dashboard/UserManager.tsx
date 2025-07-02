"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  password?: string;
  role: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: null,
    name: "",
    user_name: "",
    phone: "",
    user_password: "",
    role: "user",
  });
  const [isEdit, setIsEdit] = useState(false);

  // Validate state
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user");
      setUsers(res.data);
    } catch (err) {
      alert("Không thể tải danh sách user!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Validate realtime
  useEffect(() => {
    if (!formData.name.trim()) setNameError("Họ tên không được để trống");
    else setNameError("");
  }, [formData.name]);

  useEffect(() => {
    if (!formData.user_name.trim()) setUsernameError("Tên đăng nhập không được để trống");
    else if (formData.user_name.length < 8) setUsernameError("Tên đăng nhập phải từ 8 ký tự");
    else setUsernameError("");
  }, [formData.user_name]);

  useEffect(() => {
    if (!formData.phone.trim()) setPhoneError("Số điện thoại không được để trống");
    else if (!/^\d{8,12}$/.test(formData.phone)) setPhoneError("Số điện thoại không hợp lệ");
    else setPhoneError("");
  }, [formData.phone]);

  useEffect(() => {
    if (!isEdit && !(formData.user_password ?? "").trim()) setPasswordError("Mật khẩu không được để trống");
    else if (!isEdit && (formData.user_password ?? "").length < 8) setPasswordError("Mật khẩu phải từ 8 ký tự");
    else setPasswordError("");
  }, [formData.user_password, isEdit]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleAddUser = () => {
    setFormData({ id: null, name: "", user_name: "", phone: "", user_password: "", role: "user" });
    setIsEdit(false);
    setTouched({});
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      user_name: user.username,
      phone: user.phone,
      user_password: user.password ?? "",
      role: user.role,
    });
    setIsEdit(true);
    setTouched({});
    setShowForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await axios.delete("http://localhost:4000/api/user", { data: { id } });
      fetchUsers();
    } catch (err) {
      alert("Xóa user thất bại!");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, user_name: true, phone: true, user_password: true });
    if (nameError || usernameError || phoneError || passwordError) return;
    try {
      const submitData = {
        id: formData.id,
        name: formData.name,
        username: formData.user_name,
        phone: formData.phone,
        password: formData.user_password,
        role: formData.role,
      };
      if (isEdit) {
        await axios.put("http://localhost:4000/api/user", submitData);
      } else {
        await axios.post("http://localhost:4000/api/user", submitData);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert("Lưu user thất bại!");
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>Quản lý User</h2>
        <button style={addBtnStyle} onClick={handleAddUser}>+ Thêm tài khoản người dùng</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Họ tên</th>
            <th style={thStyle}>Tên đăng nhập</th>
            {/* <th style={thStyle}>Mật khẩu</th> */}
            <th style={thStyle}>SĐT</th>
            <th style={thStyle}>Vai trò</th>
            <th style={thStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={tdStyle}>{idx + 1}</td>
              <td style={tdStyle}>{u.name}</td>
              <td style={tdStyle}>{u.username}</td>
              {/* <td style={tdStyle}>{u.password}</td> */}
              <td style={tdStyle}>{u.phone}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                <button style={actionBtn} onClick={() => handleEditUser(u)}>Sửa</button>
                <button style={{ ...actionBtn, background: '#e74c3c' }} onClick={() => handleDeleteUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div style={modalStyle}>
          <form style={formStyle2} onSubmit={handleSubmit} autoComplete="off">
            <h3 style={{ marginBottom: 24 }}>{isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}</h3>
            <div style={formGroup}>
              <label style={labelStyle}>Họ tên</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={inputStyle(!!(nameError && touched.name))}
                autoComplete="off"
                required
              />
              {nameError && touched.name && <div style={errorStyle}>{nameError}</div>}
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Tên đăng nhập</label>
              <input
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={inputStyle(!!(usernameError && touched.user_name))}
                autoComplete="off"
                required
              />
              {usernameError && touched.user_name && <div style={errorStyle}>{usernameError}</div>}
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Số điện thoại</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={inputStyle(!!(phoneError && touched.phone))}
                autoComplete="off"
                required
              />
              {phoneError && touched.phone && <div style={errorStyle}>{phoneError}</div>}
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Mật khẩu</label>
              <input
                name="user_password"
                type="password"
                value={formData.user_password ?? ""}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={inputStyle(!!(passwordError && touched.user_password))}
                autoComplete="new-password"
                required={!isEdit}
              />
              {passwordError && touched.user_password && <div style={errorStyle}>{passwordError}</div>}
            </div>
            <div style={formGroup}>
              <label style={labelStyle}>Quyền</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={inputStyle(false)}
              >
                <option value="user">User</option>
                <option value="cntt">CNTT</option>
              </select>
            </div>
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <button type="button" style={cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
              <button type="submit" style={saveBtn}>{isEdit ? "Lưu" : "Tạo"}</button>
            </div>
          </form>
        </div>
      )}
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

const actionBtn = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: 8,
  borderRadius: 4,
  cursor: "pointer",
};

const addBtnStyle = {
  background: "#2ecc71",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 4,
  fontWeight: 600,
  cursor: "pointer",
};

const modalStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const formStyle2 = {
  background: "white",
  padding: 32,
  borderRadius: 8,
  minWidth: 340,
  maxWidth: 400,
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: 8,
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
};

const formGroup = {
  display: "flex",
  flexDirection: "column" as const,
  marginBottom: 8,
};

const labelStyle = {
  fontWeight: 500,
  marginBottom: 4,
};

const inputStyle = (error: boolean) => ({
  padding: "10px 12px",
  borderRadius: 6,
  border: error ? "1.5px solid #e74c3c" : "1.5px solid #ccc",
  outline: "none",
  fontSize: 16,
  background: error ? "#fff6f6" : "white",
  transition: "border 0.2s, background 0.2s",
});

const errorStyle = {
  color: "#e74c3c",
  fontSize: 13,
  marginTop: 2,
  marginLeft: 2,
};

const cancelBtn = {
  background: "#aaa",
  color: "white",
  border: "none",
  padding: "6px 16px",
  borderRadius: 4,
  marginRight: 8,
  cursor: "pointer",
};

const saveBtn = {
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "6px 16px",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: 600,
}; 