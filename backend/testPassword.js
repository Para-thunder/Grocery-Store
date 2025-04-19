const bcrypt = require('bcrypt');

const plainPassword = 'customer123'; // The password provided in the request
const hashedPassword = '$2b$10$B/OjUyoKHHuBN0yvlqvk0OHg3v0esP3FnXIDg/AWh/nci3F.9NusG'; // Replace with the hash from the database

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', result); // true if passwords match, false otherwise
  }
});