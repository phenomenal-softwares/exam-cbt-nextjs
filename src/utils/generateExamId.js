// utils/generateExamId.js

export function generateExamId(className, department) {
  const year = new Date().getFullYear().toString().slice(-2); // e.g. '25'
  const deptCode = getDeptCode(department); // e.g. 'SCI'
  const randomPart = getRandomLetters(2) + getRandomDigits(2); // e.g. 'AB42'

  return `${year}/${className}/${deptCode}/${randomPart}`;
}

function getDeptCode(department) {
  const map = {
    Science: 'SCI',
    Art: 'ART',
    Commercial: 'COM',
  };

  const formatted = department.charAt(0).toUpperCase() + department.slice(1).toLowerCase();
  return map[formatted] || 'UNK'; // fallback for unknown
}

function getRandomLetters(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomDigits(length) {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return result;
}
