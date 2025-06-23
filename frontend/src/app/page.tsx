"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function generateTimeSlots() {
  const slots = [];
  for (let h = 7; h <= 18; h++) {
    for (let m = 0; m < 60; m += 5) {
      const hour = h.toString().padStart(2, "0");
      const min = m.toString().padStart(2, "0");
      slots.push(`${hour}:${min}`);
    }
  }
  return slots;
}

function splitTimeSlots(slots: string[], minTime?: string) {
  // Buổi sáng: 07:30 - 12:00
  let morning = slots.filter((t: string) => t >= "07:30" && t <= "12:00");
  // Buổi chiều: 13:30 - 17:00
  let afternoon = slots.filter((t: string) => t >= "13:30" && t <= "17:00");
  if (minTime) {
    morning = morning.filter(t => t >= minTime);
    afternoon = afternoon.filter(t => t >= minTime);
  }
  return { morning, afternoon };
}

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [clinicRoom, setClinicRoom] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setCccd] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [clinics, setClinics] = useState<{id: number, name: string}[]>([]);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [nameError, setNameError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cccdError, setCccdError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [dateOfBirthTouched, setDateOfBirthTouched] = useState(false);
  const [genderTouched, setGenderTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [cccdTouched, setCccdTouched] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [countries, setCountries] = useState<{id: number, name: string}[]>([]);
  const [ethnics, setEthnics] = useState<{id: number, name: string}[]>([]);
  const [occupations, setOccupations] = useState<{id: number, name: string}[]>([]);
  const [countryId, setCountryId] = useState<number | null>(null);
  const [ethnicId, setEthnicId] = useState<number | null>(null);
  const [occupationId, setOccupationId] = useState<number | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const timeSlots = generateTimeSlots();
  const today = new Date();
  today.setHours(0,0,0,0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 6);

  useEffect(() => {
    fetch("http://localhost:4000/api/clinic")
      .then(res => res.json())
      .then(data => setClinics(data))
      .catch(err => console.error("Lỗi lấy danh sách phòng khám:", err));
  }, []);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  useEffect(() => {
    if (!name.trim()) setNameError("Họ tên không được để trống");
    else setNameError("");
  }, [name]);

  useEffect(() => {
    if (!phone.trim()) setPhoneError("Số điện thoại không được để trống");
    else if (phone.length < 8 || phone.length > 12) setPhoneError("Số điện thoại không hợp lệ");
    else setPhoneError("");
  }, [phone]);

  useEffect(() => {
    if (!cccd.trim()) setCccdError("CCCD không được để trống");
    else if (!/^\d{12}$/.test(cccd)) setCccdError("CCCD phải có đúng 12 số");
    else setCccdError("");
  }, [cccd]);

  useEffect(() => {
    if (!address.trim()) setAddressError("Địa chỉ không được để trống");
    else if (!/^[^-]+-[^-]+$/.test(address)) setAddressError("Địa chỉ phải theo định dạng: Tỉnh-Quận");
    else setAddressError("");
  }, [address]);

  useEffect(() => {
    if (!dateOfBirth.trim()) {
      setDateOfBirthError("Ngày sinh không được để trống");
    } else {
      const parts = dateOfBirth.split('/');
      if (parts.length !== 3) {
        setDateOfBirthError("Ngày sinh phải theo định dạng DD/MM/YYYY");
      } else {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const date = new Date(year, month - 1, day);
        
        if (isNaN(date.getTime()) || 
            day !== date.getDate() || 
            month !== date.getMonth() + 1 || 
            year !== date.getFullYear() ||
            year < 1900 || 
            date > new Date()) {
          setDateOfBirthError("Ngày sinh không hợp lệ");
        } else {
          setDateOfBirthError("");
        }
      }
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (!gender) {
      setGenderError("Vui lòng chọn giới tính");
    } else {
      setGenderError("");
    }
  }, [gender]);

  useEffect(() => {
    if (step === 3) {
      setLoadingData(true);
      setDataError("");
      
      Promise.all([
        fetch('http://localhost:4000/api/country').then(res => res.json()),
        fetch('http://localhost:4000/api/ethnic').then(res => res.json()),
        fetch('http://localhost:4000/api/occupation').then(res => res.json())
      ])
      .then(([countriesData, ethnicsData, occupationsData]) => {
        setCountries(countriesData);
        setEthnics(ethnicsData);
        setOccupations(occupationsData);
        setLoadingData(false);
      })
      .catch(error => {
        console.error("Lỗi khi tải dữ liệu:", error);
        setDataError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoadingData(false);
      });
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1 && clinicRoom) setStep(2);
    else if (step === 2 && selectedDate && time) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setTimeout(() => {
        setResult({
          clinicRoom,
          name,
          phone,
          cccd,
          address,
          date: selectedDate
            ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
            : "",
          time,
        });
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError("Lỗi đăng ký");
      setLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Họ tên không được để trống");
      valid = false;
    } else {
      setNameError("");
    }
    if (!phone.trim()) {
      setPhoneError("Số điện thoại không được để trống");
      valid = false;
    } else if (phone.length < 8 || phone.length > 12) {
      setPhoneError("Số điện thoại không hợp lệ");
      valid = false;
    } else {
      setPhoneError("");
    }
    if (!cccd.trim()) {
      setCccdError("CCCD không được để trống");
      valid = false;
    } else if (!/^\d{12}$/.test(cccd)) {
      setCccdError("CCCD phải có đúng 12 số");
      valid = false;
    } else {
      setCccdError("");
    }
    if (!address.trim()) {
      setAddressError("Địa chỉ không được để trống");
      valid = false;
    } else if (!/^[^-]+-[^-]+$/.test(address)) {
      setAddressError("Địa chỉ phải theo định dạng: Tỉnh-Quận");
      valid = false;
    } else {
      setAddressError("");
    }
    if (!dateOfBirth.trim()) {
      setDateOfBirthError("Ngày sinh không được để trống");
      valid = false;
    } else {
      const parts = dateOfBirth.split('/');
      if (parts.length !== 3) {
        setDateOfBirthError("Ngày sinh phải theo định dạng DD/MM/YYYY");
        valid = false;
      } else {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const date = new Date(year, month - 1, day);
        
        if (isNaN(date.getTime()) || 
            day !== date.getDate() || 
            month !== date.getMonth() + 1 || 
            year !== date.getFullYear() ||
            year < 1900 || 
            date > new Date()) {
          setDateOfBirthError("Ngày sinh không hợp lệ");
          valid = false;
        }
      }
    }
    if (!gender) {
      setGenderError("Vui lòng chọn giới tính");
      valid = false;
    }
    return valid;
  };

  const handleSubmitForm = () => {
    setSubmitClicked(true);
    setNameTouched(true);
    setDateOfBirthTouched(true);
    setGenderTouched(true);
    setPhoneTouched(true);
    setCccdTouched(true);
    setAddressTouched(true);
    if (validateForm()) {
      handleSubmit();
    }
  };

  let minTime = undefined;
  if (selectedDate) {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (isToday) {
      // Tính thời gian hiện tại + 2h, làm tròn xuống 5 phút
      const plus2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const hour = plus2h.getHours().toString().padStart(2, '0');
      const min = (Math.floor(plus2h.getMinutes() / 5) * 5).toString().padStart(2, '0');
      minTime = `${hour}:${min}`;
    }
  }
  const { morning, afternoon } = splitTimeSlots(timeSlots, minTime);

  const isFormValid = name && phone && cccd && !nameError && !phoneError && !cccdError;

  // Thêm hàm format ngày sinh
  const formatDateOfBirth = (value: string) => {
    // Chỉ cho phép nhập số và dấu /
    const cleaned = value.replace(/[^\d/]/g, '');
    
    // Tự động thêm dấu /
    let formatted = cleaned;
    if (cleaned.length >= 2 && !cleaned.includes('/')) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 5 && cleaned.split('/').length === 2) {
      const parts = formatted.split('/');
      formatted = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
    }
    
    return formatted.slice(0, 10); // Giới hạn độ dài tối đa
  };

  return (
    <div
      style={{
        width: step === 2 ? "90%" : "auto",
        maxWidth: step === 2 ? 1200 : 480,
        margin: "40px auto",
        padding: 32,
        borderRadius: 24,
        boxShadow: "0 8px 32px #e0e0e0",
        background: "#fff",
        border: "1px solid #f0f0f0",
        transition: "max-width 0.4s ease-in-out",
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
        Đặt lịch phòng khám
      </h1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: step === i ? "#2ecc71" : "#e0e0e0",
              color: step === i ? "#fff" : "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 20,
              border: step === i ? "3px solid #27ae60" : "none",
              boxShadow: step === i ? "0 2px 8px #b2f2dd" : "none",
              transition: "all 0.2s",
            }}
          >
            {i}
          </div>
        ))}
      </div>
      {step === 1 && (
        <div>
          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            Chọn phòng khám:
          </label>
          <select
            value={clinicRoom ?? ""}
            onChange={e => setClinicRoom(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "14px 14px",
              borderRadius: 12,
              border: "1.5px solid #b2f2dd",
              fontSize: 18,
              marginBottom: 24,
              background: "#fff",
              fontWeight: 500,
              color: "#222",
              outline: "none",
              boxShadow: "0 1px 4px #f0f0f0",
            }}
          >
            <option value="">-- Chọn phòng --</option>
            {clinics.map(clinic => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                border: "none",
                background: "#2ecc71",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                cursor: clinicRoom ? "pointer" : "not-allowed",
                opacity: clinicRoom ? 1 : 0.5,
                boxShadow: clinicRoom ? "0 2px 8px #b2f2dd" : "none",
                transition: "all 0.2s",
              }}
              disabled={!clinicRoom}
              onClick={handleNext}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 24, width: '100%', margin: '0 auto' }}>
          <div style={{ width: 320, background: '#fff', borderRadius: 18, padding: 8 }}>
            <label style={{ fontWeight: 600, marginBottom: 10, display: 'block', color: '#222', fontSize: 20 }}>
              Chọn ngày khám:
            </label>
            <Calendar
              value={selectedDate}
              onChange={d => setSelectedDate(d as Date)}
              minDate={today}
              maxDate={maxDate}
              tileDisabled={({ date }) => date < today || date > maxDate}
              tileClassName={({ date }) =>
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
                  ? 'selected-date'
                  : ''
              }
              locale="vi-VN"
              calendarType="iso8601"
              className="custom-calendar"
              onClickDay={d => setSelectedDate(d)}
              onClickMonth={() => {}}
              onClickYear={() => {}}
              navigationLabel={({ date }) => {
                const thang = `Tháng ${String(date.getMonth() + 1).padStart(2, '0')}`;
                const nam = `Năm ${date.getFullYear()}`;
                return (
                  <span style={{ fontWeight: 700, fontSize: 22, textTransform: 'capitalize', width: '100%', display: 'block', textAlign: 'center' }}>
                    {thang} {nam}
                  </span>
                );
              }}
              next2Label={null}
              prev2Label={null}
              nextLabel={null}
              prevLabel={null}
              formatShortWeekday={(locale, date) => {
                const map = ['CN','T2','T3','T4','T5','T6','T7'];
                return map[date.getDay()];
              }}
            />
            <style>{`
              /* Main calendar container */
              .custom-calendar {
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                width: 100%;
              }

              /* Navigation (Month/Year) */
              .react-calendar__navigation__label {
                pointer-events: none !important;
                font-size: 18px !important;
                font-weight: 700 !important;
              }

              /* Weekday labels (T2, T3...) */
              .react-calendar__month-view__weekdays__weekday abbr {
                text-decoration: none !important;
                font-weight: bold !important;
                font-size: 14px !important;
              }

              /* Day tiles */
              .react-calendar__tile {
                background: none !important;
                border-radius: 50% !important;
                height: 38px !important;
                display: flex !important;
                align-items: center;
                justify-content: center;
              }

              /* Disabled day */
              .react-calendar__tile:disabled {
                color: #ccc !important;
                background-color: #f5f5f5 !important;
              }

              /* Hover effect for non-selected days */
              .react-calendar__tile:not(.react-calendar__tile--active):not(:disabled):hover {
                background: #eafaf1 !important;
                color: #2ecc71 !important;
              }

              /* Selected day */
              .react-calendar__tile--active {
                background: #2ecc71 !important;
                color: #fff !important;
                box-shadow: 0 2px 8px #b2f2dd;
              }
            `}</style>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 18, padding: '8px 24px', minWidth: 400 }}>
            {((): React.ReactNode => {
              return (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#2ecc71', letterSpacing: 1, borderBottom: '2px solid #f0f0f0', paddingBottom: 8 }}>Buổi sáng</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: 10 }}>
                      {morning.map((t: string) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          style={{
                            padding: '8px 0',
                            borderRadius: 8,
                            border: time === t ? '2px solid #2ecc71' : '1.5px solid #e0e0e0',
                            background: time === t ? '#2ecc71' : '#f8fafc',
                            color: time === t ? '#fff' : '#222',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: time === t ? '0 2px 8px #b2f2dd' : 'none',
                            transition: 'all 0.2s',
                            outline: 'none',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = time === t ? '#2ecc71' : '#eafaf1'}
                          onMouseOut={e => e.currentTarget.style.background = time === t ? '#2ecc71' : '#f8fafc'}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#2ecc71', letterSpacing: 1, borderBottom: '2px solid #f0f0f0', paddingBottom: 8 }}>Buổi chiều</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: 10 }}>
                      {afternoon.map((t: string) => (
                        <button
                          key={t}
                          onClick={() => setTime(t)}
                          style={{
                            padding: '8px 0',
                            borderRadius: 8,
                            border: time === t ? '2px solid #2ecc71' : '1.5px solid #e0e0e0',
                            background: time === t ? '#2ecc71' : '#f8fafc',
                            color: time === t ? '#fff' : '#222',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: time === t ? '0 2px 8px #b2f2dd' : 'none',
                            transition: 'all 0.2s',
                            outline: 'none',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = time === t ? '#2ecc71' : '#eafaf1'}
                          onMouseOut={e => e.currentTarget.style.background = time === t ? '#2ecc71' : '#f8fafc'}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 40 }}>
              <button
                style={{
                  padding: '14px 40px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#e0e0e0',
                  color: '#333',
                  fontWeight: 700,
                  fontSize: 20,
                  cursor: 'pointer',
                }}
                onClick={handleBack}
              >
                Quay lại
              </button>
              <button
                style={{
                  padding: '14px 40px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#2ecc71',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  cursor: selectedDate && time ? 'pointer' : 'not-allowed',
                  opacity: selectedDate && time ? 1 : 0.5,
                  boxShadow: selectedDate && time ? '0 2px 8px #b2f2dd' : 'none',
                  transition: 'all 0.2s',
                }}
                disabled={!selectedDate || !time || loading}
                onClick={handleNext}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            Họ tên:
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
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
          {(nameTouched || submitClicked) && nameError && <div style={{ color: 'red', marginBottom: 8 }}>{nameError}</div>}

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
                Ngày sinh:
              </label>
              <input
                value={dateOfBirth}
                onChange={e => setDateOfBirth(formatDateOfBirth(e.target.value))}
                onBlur={() => setDateOfBirthTouched(true)}
                placeholder="DD/MM/YYYY"
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
              {(dateOfBirthTouched || submitClicked) && dateOfBirthError && <div style={{ color: 'red', marginBottom: 8 }}>{dateOfBirthError}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
                Giới tính:
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                onBlur={() => setGenderTouched(true)}
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
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              {(genderTouched || submitClicked) && genderError && <div style={{ color: 'red', marginBottom: 8 }}>{genderError}</div>}
            </div>
          </div>

          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            Số điện thoại:
          </label>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
            onBlur={() => setPhoneTouched(true)}
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
          {(phoneTouched || submitClicked) && phoneError && <div style={{ color: 'red', marginBottom: 8 }}>{phoneError}</div>}
          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            CCCD:
          </label>
          <input
            value={cccd}
            onChange={e => setCccd(e.target.value.replace(/\D/g, ""))}
            onBlur={() => setCccdTouched(true)}
            maxLength={12}
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
            placeholder="Nhập 12 số CCCD"
          />
          {(cccdTouched || submitClicked) && cccdError && <div style={{ color: 'red', marginBottom: 8 }}>{cccdError}</div>}
          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            Địa chỉ:
          </label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            onBlur={() => setAddressTouched(true)}
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
            placeholder="Ví dụ: Hà Nội-Cầu Giấy"
          />
          {(addressTouched || submitClicked) && addressError && <div style={{ color: 'red', marginBottom: 8 }}>{addressError}</div>}

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
                Quốc gia:
              </label>
              <select
                value={countryId ?? ""}
                onChange={e => setCountryId(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "14px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #b2f2dd",
                  fontSize: 18,
                  marginBottom: dataError ? 6 : 16,
                  background: "#fff",
                  fontWeight: 500,
                  color: "#222",
                  outline: "none",
                  boxShadow: "0 1px 4px #f0f0f0",
                }}
              >
                <option value="">-- Chọn --</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {dataError && <div style={{ color: 'red', marginBottom: 16 }}>{dataError}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
                Dân tộc:
              </label>
              <select
                value={ethnicId ?? ""}
                onChange={e => setEthnicId(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "14px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #b2f2dd",
                  fontSize: 18,
                  marginBottom: dataError ? 6 : 16,
                  background: "#fff",
                  fontWeight: 500,
                  color: "#222",
                  outline: "none",
                  boxShadow: "0 1px 4px #f0f0f0",
                }}
              >
                <option value="">-- Chọn --</option>
                {ethnics.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              {dataError && <div style={{ color: 'red', marginBottom: 16 }}>{dataError}</div>}
            </div>
          </div>

          <label style={{ fontWeight: 600, marginBottom: 10, display: "block", color: "#222" }}>
            Nghề nghiệp:
          </label>
          {loadingData ? (
            <div style={{ padding: "14px", color: "#666" }}>Đang tải dữ liệu...</div>
          ) : (
            <select
              value={occupationId ?? ""}
              onChange={e => setOccupationId(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "14px 14px",
                borderRadius: 12,
                border: "1.5px solid #b2f2dd",
                fontSize: 18,
                marginBottom: dataError ? 6 : 16,
                background: "#fff",
                fontWeight: 500,
                color: "#222",
                outline: "none",
                boxShadow: "0 1px 4px #f0f0f0",
              }}
            >
              <option value="">-- Chọn nghề nghiệp --</option>
              {occupations.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          )}
          {dataError && <div style={{ color: 'red', marginBottom: 16 }}>{dataError}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                border: "none",
                background: "#e0e0e0",
                color: "#333",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
              }}
              onClick={handleBack}
            >
              Quay lại
            </button>
            <button
              style={{
                padding: "12px 32px",
                borderRadius: 10,
                border: "none",
                background: "#2ecc71",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                cursor: isFormValid ? "pointer" : "not-allowed",
                opacity: isFormValid ? 1 : 0.5,
                boxShadow: isFormValid ? "0 2px 8px #b2f2dd" : "none",
                transition: "all 0.2s",
              }}
              disabled={!isFormValid}
              onClick={handleSubmitForm}
            >
              Đăng ký
            </button>
          </div>
        </div>
      )}
      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 28, color: "#2ecc71", textAlign: "center" }}>
          <b>Đăng ký thành công!</b>
          <pre style={{ textAlign: "left", background: "#f6fff8", padding: 16, borderRadius: 10 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}