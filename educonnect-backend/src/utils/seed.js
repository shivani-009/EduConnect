import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const sampleTutors = [
  {
    fullName: 'Dr. Sarah Chen', email: 'sarah.chen@example.com',
    subject: 'Mathematics & Physics', qualification: 'PhD in Applied Mathematics',
    experience: 8, hourlyFee: 45,
    bio: 'PhD in Applied Mathematics with 8+ years of teaching experience across global curriculum standards.',
    languages: 'English', teachingMode: 'Both',
    expertise: ['Calculus BC', 'Statistics', 'Linear Algebra', 'SAT Prep'],
    rating: 4.9, reviewCount: 124, verified: true, topRated: true,
    coords: [-73.9665, 40.7812], address: 'Upper West Side, New York, NY',
  },
  {
    fullName: 'James Wilson', email: 'james.wilson@example.com',
    subject: 'English & Literature', qualification: 'MA English Literature',
    experience: 5, hourlyFee: 35,
    bio: 'Passionate literature teacher helping students fall in love with reading and writing.',
    languages: 'English', teachingMode: 'Online',
    expertise: ['Essay Writing', 'Literary Analysis', 'SAT English'],
    rating: 4.7, reviewCount: 89, verified: true, topRated: false,
    coords: [-73.9857, 40.7484], address: 'Midtown, New York, NY',
  },
  {
    fullName: 'Elena Rodriguez', email: 'elena.rodriguez@example.com',
    subject: 'Computer Science & Python', qualification: 'BS Computer Science, MIT',
    experience: 8, hourlyFee: 60,
    bio: 'Ex-software engineer turned educator. I teach CS fundamentals, DSA, and Python from scratch.',
    languages: 'English, Spanish', teachingMode: 'Both',
    expertise: ['Data Structures', 'Python', 'Web Dev', 'AI & ML Basics'],
    rating: 5.0, reviewCount: 124, verified: true, topRated: true,
    coords: [-71.0589, 42.3601], address: 'Boston, MA',
  },
  {
    fullName: 'Priya Sharma', email: 'priya.sharma@example.com',
    subject: 'Mathematics', qualification: 'MSc Mathematics, IIT Delhi',
    experience: 6, hourlyFee: 20,
    bio: 'I help students build strong fundamentals in mathematics for board exams and competitive tests.',
    languages: 'English, Hindi', teachingMode: 'Home Visit',
    expertise: ['Algebra', 'Trigonometry', 'JEE Prep'],
    rating: 4.8, reviewCount: 67, verified: true, topRated: true,
    coords: [80.9462, 26.8467], address: 'Gomti Nagar, Lucknow, UP',
  },
  {
    fullName: 'Arjun Verma', email: 'arjun.verma@example.com',
    subject: 'Computer Science', qualification: 'B.Tech CSE',
    experience: 3, hourlyFee: 15,
    bio: 'Software developer teaching DSA, web development, and coding fundamentals for beginners.',
    languages: 'English, Hindi', teachingMode: 'Both',
    expertise: ['DSA', 'JavaScript', 'React', 'Java'],
    rating: 4.9, reviewCount: 52, verified: true, topRated: false,
    coords: [80.9195, 26.863], address: 'Hazratganj, Lucknow, UP',
  },
  {
    fullName: 'Neha Gupta', email: 'neha.gupta@example.com',
    subject: 'English & Communication', qualification: 'MA English',
    experience: 4, hourlyFee: 18,
    bio: 'Focused on spoken English, interview prep, and academic writing for school and college students.',
    languages: 'English, Hindi', teachingMode: 'Home Visit',
    expertise: ['Spoken English', 'Interview Prep', 'Grammar'],
    rating: 4.6, reviewCount: 31, verified: false, topRated: false,
    coords: [80.3319, 26.4499], address: 'Civil Lines, Kanpur, UP',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding tutors...');

  await User.deleteMany({ role: 'tutor', email: { $in: sampleTutors.map((t) => t.email) } });

  const password = await bcrypt.hash('password123', 10);

  for (const t of sampleTutors) {
    await User.create({
      fullName: t.fullName, email: t.email, password, role: 'tutor',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=16A34A&color=fff`,
      subject: t.subject, qualification: t.qualification, experience: t.experience,
      hourlyFee: t.hourlyFee, bio: t.bio, languages: t.languages, teachingMode: t.teachingMode,
      expertise: t.expertise, rating: t.rating, reviewCount: t.reviewCount,
      verified: t.verified, topRated: t.topRated,
      location: { type: 'Point', coordinates: t.coords, address: t.address },
    });
  }

  console.log(`Seeded ${sampleTutors.length} tutors (password for all: "password123").`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
