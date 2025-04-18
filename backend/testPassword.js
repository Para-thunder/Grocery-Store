const bcrypt = require('bcrypt');

const plainPassword = 'customer123'; // The password provided in the request
const hashedPassword = '$2b$10$KgaHIpa/0FrEQwVdNIX5KOhGpvLnxrXHtBkZtNHIl32i4SuH.6Nxu'; // Replace with the hash from the database

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', result); // true if passwords match, false otherwise
  }
});