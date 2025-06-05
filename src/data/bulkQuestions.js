const bulkQuestions = [
  {
    question: "What is the primary purpose of office correspondence?",
    options: ["To store documents", "To communicate formally within and outside the organization", "To manage office supplies", "To schedule meetings"],
    answer: "To communicate formally within and outside the organization"
  },
  {
    question: "Which of the following is a key responsibility of an office administrator?",
    options: ["Managing the financial records of the company", "Supervising the technical team", "Coordinating office activities and communications", "Designing the company's marketing strategy"],
    answer: "Coordinating office activities and communications"
  },
  {
    question: "What does the term 'filling system' refer to in an office setting?",
    options: ["A computer system for storing data", "A method of organizing physical and digital files for easy retrieval", "A software used for financial management", "A technique for organizing office staff"],
    answer: "A method of organizing physical and digital files for easy retrieval"
  },
  {
    question: "Which of the following is a common method of record-keeping in an office?",
    options: ["Pen and paper", "Electronic filing system", "Paperless storage", "All of the above"],
    answer: "Electronic filing system"
  },
  {
    question: "What is the purpose of an office diary?",
    options: ["To record personal events", "To keep track of business appointments, meetings, and deadlines", "To store customer feedback", "To manage office supplies"],
    answer: "To keep track of business appointments, meetings, and deadlines"
  },
  {
    question: "Which of the following is an example of formal office communication?",
    options: ["Personal notes", "Email to a colleague about lunch", "Memo to the management team about a meeting", "Informal chat with a coworker"],
    answer: "Memo to the management team about a meeting"
  },
  {
    question: "What does 'confidentiality' in office practice refer to?",
    options: ["The ability to communicate freely with coworkers", "The need to secure sensitive company information from unauthorized access", "The importance of maintaining office decorum", "Ensuring employees are well-dressed"],
    answer: "The need to secure sensitive company information from unauthorized access"
  },
  {
    question: "What is a 'business letter' primarily used for?",
    options: ["Casual communication with clients", "Formal communication with clients, suppliers, and business partners", "Sending personal messages", "Sharing personal opinions about company policies"],
    answer: "Formal communication with clients, suppliers, and business partners"
  },
  {
    question: "Which of the following best defines 'minutes of meeting'?",
    options: ["A summary of a meeting's discussion, decisions, and action points", "An invitation for a meeting", "A detailed report on a project's progress", "A formal speech made during a meeting"],
    answer: "A summary of a meeting's discussion, decisions, and action points"
  },
  {
    question: "What is the role of a receptionist in an office setting?",
    options: ["To prepare financial statements", "To answer phone calls, schedule appointments, and greet visitors", "To manage company logistics", "To handle office inventory"],
    answer: "To answer phone calls, schedule appointments, and greet visitors"
  },
  {
    question: "What does the term 'office protocol' refer to?",
    options: ["Rules governing the use of office equipment", "The system of formal conduct and etiquette followed in an office environment", "The schedule of office meetings", "The method of managing employee work shifts"],
    answer: "The system of formal conduct and etiquette followed in an office environment"
  },
  {
    question: "Which of the following is a responsibility of an office manager?",
    options: ["Managing the payroll", "Planning the office’s budget", "Setting up company-wide meetings", "Coordinating office activities and resources"],
    answer: "Coordinating office activities and resources"
  },
  {
    question: "What is an 'office memo'?",
    options: ["A formal letter used to communicate with external parties", "A brief written communication used within the office to convey important information", "A record of office supplies", "A document detailing employee performance evaluations"],
    answer: "A brief written communication used within the office to convey important information"
  },
  {
    question: "Which of the following is an example of office equipment?",
    options: ["Computers", "Printers", "Photocopiers", "All of the above"],
    answer: "All of the above"
  },
  {
    question: "What is the role of an office filing system?",
    options: ["To store sensitive data in a secure location", "To organize documents for easy retrieval and reference", "To reduce paper waste", "To store only financial records"],
    answer: "To organize documents for easy retrieval and reference"
  },
  {
    question: "What is the purpose of an office schedule?",
    options: ["To plan and organize daily activities, meetings, and appointments", "To reduce the need for meetings", "To assign specific tasks to each employee", "To track the company’s performance"],
    answer: "To plan and organize daily activities, meetings, and appointments"
  },
  {
    question: "Which of the following is a characteristic of a good office communication system?",
    options: ["It ensures fast and clear communication", "It allows for multiple personal conversations", "It avoids formal messages", "It includes only email communication"],
    answer: "It ensures fast and clear communication"
  },
  {
    question: "Which of the following is an important aspect of office time management?",
    options: ["Avoiding breaks", "Setting priorities and sticking to deadlines", "Scheduling as many meetings as possible", "Avoiding delegation of tasks"],
    answer: "Setting priorities and sticking to deadlines"
  },
  {
    question: "What is the primary function of a 'call log' in an office?",
    options: ["To document office maintenance issues", "To record all incoming and outgoing calls for follow-up or reference", "To store employee attendance records", "To keep track of office supplies"],
    answer: "To record all incoming and outgoing calls for follow-up or reference"
  },
  {
    question: "What is the purpose of office ergonomics?",
    options: ["To ensure employees have comfortable working spaces that enhance productivity", "To improve the design of office furniture", "To keep the office clean and organized", "To create a stress-free office environment"],
    answer: "To ensure employees have comfortable working spaces that enhance productivity"
  },
  {
    question: "What is a 'job description' in an office environment?",
    options: ["A document outlining the tasks and responsibilities of a particular role", "A list of tasks for an employee to do each day", "A report on an employee’s performance", "A list of office supplies needed"],
    answer: "A document outlining the tasks and responsibilities of a particular role"
  },
  {
    question: "What does the term 'office automation' refer to?",
    options: ["The use of machines to complete manual tasks", "The integration of software tools to streamline office tasks and improve efficiency", "The installation of automatic doors in offices", "The outsourcing of administrative tasks"],
    answer: "The integration of software tools to streamline office tasks and improve efficiency"
  },
  {
    question: "Which of the following is an example of a good office practice?",
    options: ["Keeping sensitive documents in unlocked drawers", "Organizing emails by importance", "Using personal mobile phones for work-related calls", "Ignoring the office dress code"],
    answer: "Organizing emails by importance"
  },
  {
    question: "What is an 'outgoing mail register' used for in an office?",
    options: ["To track the items received by the office", "To log all outgoing correspondence and packages", "To keep track of employee attendance", "To schedule office meetings"],
    answer: "To log all outgoing correspondence and packages"
  },
  {
    question: "What does 'conflict resolution' in the office setting involve?",
    options: ["Ignoring workplace disagreements", "Addressing and resolving disputes between employees in a fair and professional manner", "Encouraging competition among coworkers", "Increasing employee workloads"],
    answer: "Addressing and resolving disputes between employees in a fair and professional manner"
  },
  {
    question: "What is the role of 'office supplies management'?",
    options: ["To ensure the office has necessary resources like stationery and equipment", "To organize employee schedules", "To oversee the company's finances", "To manage employee records"],
    answer: "To ensure the office has necessary resources like stationery and equipment"
  },
  {
    question: "What is the purpose of a 'telephone etiquette' in the office?",
    options: ["To improve office aesthetics", "To ensure professional communication over the phone", "To restrict phone use in the office", "To avoid communication with clients"],
    answer: "To ensure professional communication over the phone"
  },
  {
    question: "What is the best way to ensure effective office communication?",
    options: ["Sending emails only", "Holding frequent meetings", "Having a clear and structured communication system", "Relying solely on informal discussions"],
    answer: "Having a clear and structured communication system"
  }
];

export default bulkQuestions;
