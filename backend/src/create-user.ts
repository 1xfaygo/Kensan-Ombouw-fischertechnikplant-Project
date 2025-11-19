import { createUser } from './auth.js';

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4];

if (!email || !password || !name) {
  console.log('Usage: npm run create-user <email> <password> <name>');
  console.log('Example: npm run create-user user@kensan.nl password123 "Jan Janssen"');
  process.exit(1);
}

try {
  const userId = createUser(email, password, name);
  console.log(`User created successfully!`);
  console.log(`   ID: ${userId}`);
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
} catch (error: any) {
  console.error(`Error: ${error.message}`);
}
