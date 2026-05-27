require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Dashboard API is running.' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/students', require('./src/routes/studentRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/grades', require('./src/routes/gradeRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
