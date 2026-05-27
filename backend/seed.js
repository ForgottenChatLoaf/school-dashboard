require('dotenv').config();
const { db } = require('./src/config/firebase');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@school.edu';
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', adminEmail).get();

    if (!snapshot.empty) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await usersRef.add({
      fullname: 'System Administrator',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      createdAt: new Date()
    });

    console.log('Admin user seeded successfully:');
    console.log('Email: admin@school.edu');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
