import { createUser } from './auth.js';

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4];

if (!email || !password || !name) {
  console.log('Usage: node create-user.js <email> <password> <name>');
  console.log('Example: node create-user.js user@kensan.nl password123 "Jan Janssen"');
  process.exit(1);
}

try {
  const userId = createUser(email, password, name);
  console.log(`✅ User created successfully!`);
  console.log(`   ID: ${userId}`);
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
}
