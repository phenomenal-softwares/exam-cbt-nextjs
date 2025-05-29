export function generateStudentId() {
  const prefix = "DHS"; // School short name
  const year = new Date().getFullYear().toString().slice(-2); // e.g., "25"
  const randomDigits = getRandomDigits(4); // e.g., "0011"

  return `${prefix}-${year}-${randomDigits}`;
}

function getRandomDigits(length) {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
}
