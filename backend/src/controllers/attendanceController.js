const { db } = require('../config/firebase');

exports.logAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const attendanceRef = db.collection('attendance');
    
    // Check if record already exists for this student on this date for this subject
    let query = attendanceRef.where('studentId', '==', studentId).where('date', '==', date);
    if (subjectId) {
      query = query.where('subjectId', '==', subjectId);
    }
    
    const snapshot = await query.get();

    if (!snapshot.empty) {
      // Update existing record
      const docId = snapshot.docs[0].id;
      await attendanceRef.doc(docId).update({ status });
      return res.json({ message: 'Attendance updated successfully' });
    }

    // Create new record
    await attendanceRef.add({
      studentId,
      subjectId: subjectId || 'general',
      date,
      status,
      loggedBy: req.user.id,
      timestamp: new Date()
    });

    res.status(201).json({ message: 'Attendance logged successfully' });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.query;
    const attendanceRef = db.collection('attendance');
    let query = attendanceRef;

    if (studentId) query = query.where('studentId', '==', studentId);
    if (date) query = query.where('date', '==', date);

    const snapshot = await query.get();
    
    const records = [];
    snapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() });
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const snapshot = await db.collection('attendance').where('studentId', '==', studentId).get();
    
    let present = 0;
    let absent = 0;
    let late = 0;

    snapshot.forEach(doc => {
      const status = doc.data().status;
      if (status === 'present') present++;
      if (status === 'absent') absent++;
      if (status === 'late') late++;
    });

    const total = present + absent + late;
    const percentage = total === 0 ? 0 : Math.round(((present + (late * 0.5)) / total) * 100);

    res.json({ total, present, absent, late, percentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
