const { db } = require('../config/firebase');

exports.saveGrade = async (req, res) => {
  try {
    const { studentId, subject, semester, term, grade } = req.body;

    if (!studentId || !subject || !term || grade === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const gradesRef = db.collection('grades');
    const query = gradesRef
      .where('studentId', '==', studentId)
      .where('subject', '==', subject)
      .where('semester', '==', semester)
      .where('term', '==', term);
      
    const snapshot = await query.get();

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await gradesRef.doc(docId).update({ grade });
      return res.json({ message: 'Grade updated successfully' });
    }

    await gradesRef.add({
      studentId,
      subject,
      semester,
      term,
      grade: parseFloat(grade),
      gradedBy: req.user.id,
      timestamp: new Date()
    });

    res.status(201).json({ message: 'Grade saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const { studentId, semester } = req.query;
    let query = db.collection('grades');

    if (studentId) query = query.where('studentId', '==', studentId);
    if (semester) query = query.where('semester', '==', semester);

    const snapshot = await query.get();
    const records = [];
    snapshot.forEach(doc => records.push({ id: doc.id, ...doc.data() }));

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
