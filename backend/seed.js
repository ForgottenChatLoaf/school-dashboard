require('dotenv').config();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const serviceAccount = require('./src/config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson'];
const sections = ['A', 'B', 'C', 'D'];
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

async function seedStudents() {
  console.log('Seeding students...');
  const usersRef = db.collection('users');
  const salt = await bcrypt.genSalt(12);
  
  let targetEmail = '';
  let targetPassword = '';

  for (let i = 0; i < 15; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@school.edu`;
    // Create a unique password like James123!
    const rawPassword = `${fn}${i}#Secure`;
    const passwordHash = await bcrypt.hash(rawPassword, salt);
    
    const yearLevel = years[Math.floor(Math.random() * years.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];

    await usersRef.add({
      fullname: `${fn} ${ln}`,
      email: email,
      passwordHash: passwordHash,
      role: 'student',
      yearLevel: yearLevel,
      section: section,
      createdAt: new Date(),
      activityPoints: Math.floor(Math.random() * 50)
    });

    console.log(`Created: ${email} | Pass: ${rawPassword} | ${yearLevel} - Sec ${section}`);

    if (i === 0) {
      targetEmail = email;
      targetPassword = rawPassword;
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log(`\n🔑 YOU CAN USE THIS ACCOUNT TO TEST:`);
  console.log(`Email: ${targetEmail}`);
  console.log(`Password: ${targetPassword}`);
  
  process.exit(0);
}

seedStudents().catch(console.error);
