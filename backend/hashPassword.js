const bcrypt = require('bcrypt');

const plainPassword = 'customer123'; // Replace with the desired password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});