'use client'
// pages/leave-request.js
import { useState } from "react";

export default function LeaveRequest() {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    leaveType: "อื่นๆ",
    reason: "",
    startDate: "",
    endDate: "",
    status: "รอพิจารณา",
  });

  const [error, setError] = useState("");

  const validateForm = () => {
    // Validation logic as per your conditions
    if (!formData.name || !formData.phone || !formData.leaveType || !formData.reason || !formData.startDate || !formData.endDate) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    // Check if vacation leave is requested at least 3 days in advance and for no more than 2 days
    if (formData.leaveType === "พักร้อน") {
      const today = new Date();
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      const daysAhead = (startDate - today) / (1000 * 60 * 60 * 24);
      const daysLength = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

      if (daysAhead < 3) {
        setError("กรุณาขอล่วงหน้าอย่างน้อย 3 วัน");
        return false;
      }
      if (daysLength > 2) {
        setError("การลาพักร้อนติดต่อกันไม่เกิน 2 วัน");
        return false;
      }
    }

    // Check if leave is in the future (no backdated leave allowed)
    const currentDate = new Date();
    if (new Date(formData.startDate) < currentDate || new Date(formData.endDate) < currentDate) {
      setError("ไม่อนุญาตให้บันทึกวันลาย้อนหลัง");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch("http://localhost:5000/api/leave-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setError("");
      alert("ข้อมูลบันทึกสำเร็จ!");
    } else {
      setError("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">ระบบขออนุญาตลาหยุด</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ชื่อ - นามสกุล</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">สังกัด/ตำแหน่ง</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">อีเมล์</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">เบอร์โทรศัพท์</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ประเภทการลา</label>
          <select
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            required
            className="form-select"
          >
            <option value="ลา">ลา</option>
            <option value="ลากิจ">ลากิจ</option>
            <option value="พักร้อน">พักร้อน</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">สาเหตุการลา</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3 row">
          <div className="col-md-6">
            <label className="form-label">วันที่ขอลา</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">ถึงวันที่</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="d-none">
          <label className="form-label">วันเวลาที่บันทึกข้อมูล</label>
          <input
            type="text"
            value={new Date().toLocaleString()}
            readOnly
            className="form-control"
          />
        </div>

        <div className="d-none">
          <label className="form-label">สถานะ</label>
          <input
            type="text"
            value={formData.status}
            readOnly
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">
          ส่งคำขอลา
        </button>
      </form>
    </div>
  );
}
