const { db } = require('../config/firebase');

exports.getAllStudents = async (req, res) => {
  try {
    // Fetch actual registered users with the 'student' role
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('role', '==', 'student').get();
    
    if (snapshot.empty) {
      return res.json([]);
    }

    const students = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Map user data to the format StudentRecords.jsx expects
      students.push({ 
        id: doc.id,
        fullname: data.fullname,
        email: data.email,
        studentNumber: `2024-${doc.id.substring(0, 5).toUpperCase()}`, // generate fake ID from hash
        course: 'BSCS', // mock course since it's not in user schema
        yearLevel: data.yearLevel?.charAt(0) || '1', // "1st Year" -> "1"
        section: data.section || 'A',
        createdAt: data.createdAt
      });
    });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const docRef = db.collection('students').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { fullname, studentNumber, course, yearLevel, section, contact } = req.body;

    const newStudent = {
      fullname,
      studentNumber,
      course,
      yearLevel: parseInt(yearLevel, 10),
      section,
      contact,
      createdAt: new Date()
    };

    const docRef = await db.collection('students').add(newStudent);
    res.status(201).json({ message: 'Student created successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const docRef = db.collection('students').doc(id);
    await docRef.update(updates);

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('students').doc(id);
    await docRef.delete();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
