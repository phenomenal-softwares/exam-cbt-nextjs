const defaultSubjects = {
  Science: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'Agricultural Science',
  ],
  Art: [
    'Mathematics',
    'English Language',
    'Government',
    'Literature',
    'CRS',
    'Civic Education',
    'History',
  ],
  Commercial: [
    'Mathematics',
    'English Language',
    'Accounting',
    'Commerce',
    'Economics',
    'Marketing',
    'Office Practice',
  ],
};

export function generateSubjectList(department) {
  const normalizedDepartment =
    department.charAt(0).toUpperCase() + department.slice(1).toLowerCase(); // Capitalize the first letter

  return (
    defaultSubjects[normalizedDepartment]?.map((name) => ({
      name,
      examTaken: false,
      score: 0, // Include default score
    })) || []
  );
}

