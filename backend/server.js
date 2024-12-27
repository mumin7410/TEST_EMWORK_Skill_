const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000; // You can change the port if needed
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MySQL database connection setup (use XAMPP MySQL settings)
const db = mysql.createConnection({
  host: "192.168.1.107",  // Default MySQL host for XAMPP
  user: "mumin7410",       // Default MySQL user in XAMPP
  password: "mumin007",       // Default password for XAMPP MySQL (empty by default)
  database: "leave_management"  // Change this to your database name
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Handle POST requests to /api/leave-requests
app.post("/api/leave-requests", (req, res) => {
  const { name, position, email, phone, leaveType, reason, startDate, endDate, status } = req.body;

  // Validate request body (basic validation)
  if (!name || !phone || !leaveType || !reason || !startDate || !endDate) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO leave_requests (name, position, email, phone, leave_type, reason, start_date, end_date, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Get the current date/time
  const createdAt = new Date();

  // Execute the query
  db.query(query, [name, position, email, phone, leaveType, reason, startDate, endDate, status, createdAt], (err, result) => {
    if (err) {
      console.error("Error inserting data into database:", err);
      return res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลได้" });
    }

    // Respond with success and the inserted data
    res.status(201).json({ message: "บันทึกข้อมูลสำเร็จ", data: req.body });
  });
});

    app.get("/api/leave-requests", (req, res) => {
    const { search, sort } = req.query; // Extract search and sort options from query
  
    let query = "SELECT * FROM leave_requests";
    
    // Search functionality
    if (search) {
      query += ` WHERE name LIKE ? OR start_date LIKE ?`;
    }
  
    // Sort functionality
    if (sort) {
      query += ` ORDER BY created_at ${sort === 'desc' ? 'DESC' : 'ASC'}`;
    }
  
    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
      if (err) {
        console.error("Error fetching leave requests:", err);
        return res.status(500).json({ error: "ไม่สามารถดึงข้อมูลขอลาได้" });
      }
      res.json(results);
    });
  });
  
  app.delete("/api/leave-requests/:id", (req, res) => {
    const leaveRequestId = req.params.id;
  
    const query = "DELETE FROM leave_requests WHERE id = ?";
    db.query(query, [leaveRequestId], (err, result) => {
      if (err) {
        console.error("Error deleting leave request:", err);
        return res.status(500).json({ error: "ไม่สามารถลบข้อมูลขอลาได้" });
      }
  
      res.json({ message: "ลบข้อมูลขอลาเรียบร้อย" });
    });
  });

  app.patch("/api/leave-requests/:id/status", (req, res) => {
    const leaveRequestId = req.params.id;
    const { status } = req.body;
  
    // Allow only "Waiting for Approval" to be updated
    if (status !== "รอพิจารณา") {
      return res.status(400).json({ error: "สามารถเปลี่ยนสถานะได้เฉพาะรายการที่มีสถานะ 'รอพิจารณา'" });
    }
  
    const query = "UPDATE leave_requests SET status = ? WHERE id = ?";
    db.query(query, [status, leaveRequestId], (err, result) => {
      if (err) {
        console.error("Error updating leave request status:", err);
        return res.status(500).json({ error: "ไม่สามารถปรับสถานะขอลาได้" });
      }
  
      res.json({ message: "ปรับสถานะการพิจารณาเรียบร้อย" });
    });
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
