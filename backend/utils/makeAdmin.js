// Usage: node utils/makeAdmin.js someone@example.com
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Usage: node utils/makeAdmin.js <email>');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: 'admin' },
    { new: true }
  );
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }
  console.log(`${user.name} (${user.email}) is now an admin.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});