const { db } = require('../config/firebase');

const QUIZ_POINTS = { major: 10, minor: 5 };

exports.submitQuiz = async (req, res) => {
  try {
    const { category, score, total } = req.body;
    const userId = req.user.id;

    if (!category || score === undefined || !total) {
      return res.status(400).json({ message: 'Missing quiz submission data' });
    }

    const passed = score / total >= 0.5; // Must get 50% or more to earn points
    const pointsEarned = passed ? (QUIZ_POINTS[category] || 5) : 0;

    if (pointsEarned > 0) {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const currentPoints = userDoc.data()?.activityPoints || 0;

      await userRef.update({
        activityPoints: currentPoints + pointsEarned
      });
    }

    // Log the attempt
    await db.collection('quizAttempts').add({
      userId,
      category,
      score,
      total,
      passed,
      pointsEarned,
      completedAt: new Date()
    });

    res.json({
      passed,
      pointsEarned,
      message: passed
        ? `Great job! You earned ${pointsEarned} activity points!`
        : 'Keep trying! You need at least 50% to earn points.'
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyPoints = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    const activityPoints = userDoc.data()?.activityPoints || 0;
    res.json({ activityPoints });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
