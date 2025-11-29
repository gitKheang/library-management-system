import bcrypt from 'bcryptjs';
import { database } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

// Import mock data from frontend (we'll copy the data here)
const users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@library.edu',
    passwordHash: 'admin123', // Will be hashed
    role: 'ADMIN',
    status: 'ACTIVE',
    needsPasswordReset: false,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Staff Member',
    email: 'staff@library.edu',
    passwordHash: 'staff123', // Will be hashed
    role: 'STAFF',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    _id: '3',
    name: 'John Student',
    email: 'john@student.edu',
    passwordHash: 'password123', // Will be hashed
    studentId: 'STU001',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-20T14:30:00.000Z',
    updatedAt: '2024-01-20T14:30:00.000Z',
  },
  {
    _id: '4',
    name: 'Jane Doe',
    email: 'jane@student.edu',
    passwordHash: 'password123', // Will be hashed
    studentId: 'STU002',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-21T09:15:00.000Z',
    updatedAt: '2024-01-21T09:15:00.000Z',
  },
  {
    _id: '5',
    name: 'Bob Smith',
    email: 'bob@student.edu',
    passwordHash: 'password123', // Will be hashed
    studentId: 'STU003',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2024-01-22T11:00:00.000Z',
    updatedAt: '2024-01-22T11:00:00.000Z',
  },
];

const books = [
  {
    _id: 'book-1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    ISBN: '978-0262033848',
    description: 'Comprehensive introduction to algorithms and data structures.',
    category: 'Computer Science',
    publicationYear: 2009,
    shelfLocation: 'CS-A-101',
    isActive: true,
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-10T08:00:00.000Z',
  },
  {
    _id: 'book-2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    ISBN: '978-0132350884',
    description: 'A handbook of agile software craftsmanship.',
    category: 'Computer Science',
    publicationYear: 2008,
    shelfLocation: 'CS-A-102',
    isActive: true,
    createdAt: '2024-01-10T08:15:00.000Z',
    updatedAt: '2024-01-10T08:15:00.000Z',
  },
  {
    _id: 'book-3',
    title: 'The Art of Computer Programming',
    author: 'Donald E. Knuth',
    ISBN: '978-0201896831',
    description: 'Classic comprehensive study of algorithms.',
    category: 'Computer Science',
    publicationYear: 1997,
    shelfLocation: 'CS-A-103',
    isActive: true,
    createdAt: '2024-01-10T08:30:00.000Z',
    updatedAt: '2024-01-10T08:30:00.000Z',
  },
  {
    _id: 'book-4',
    title: 'Linear Algebra and Its Applications',
    author: 'Gilbert Strang',
    ISBN: '978-0030105678',
    description: 'Introduction to linear algebra.',
    category: 'Mathematics',
    publicationYear: 2006,
    shelfLocation: 'MATH-B-201',
    isActive: true,
    createdAt: '2024-01-11T09:00:00.000Z',
    updatedAt: '2024-01-11T09:00:00.000Z',
  },
  {
    _id: 'book-5',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    ISBN: '978-1285741550',
    description: 'Comprehensive calculus textbook.',
    category: 'Mathematics',
    publicationYear: 2015,
    shelfLocation: 'MATH-B-202',
    isActive: true,
    createdAt: '2024-01-11T09:15:00.000Z',
    updatedAt: '2024-01-11T09:15:00.000Z',
  },
  {
    _id: 'book-6',
    title: 'University Physics',
    author: 'Hugh D. Young',
    ISBN: '978-0321973610',
    description: 'Comprehensive physics textbook.',
    category: 'Physics',
    publicationYear: 2015,
    shelfLocation: 'PHYS-C-301',
    isActive: true,
    createdAt: '2024-01-12T10:00:00.000Z',
    updatedAt: '2024-01-12T10:00:00.000Z',
  },
  {
    _id: 'book-7',
    title: 'Principles of Economics',
    author: 'N. Gregory Mankiw',
    ISBN: '978-1305585126',
    description: 'Introduction to economics principles.',
    category: 'Economics',
    publicationYear: 2017,
    shelfLocation: 'ECON-D-401',
    isActive: true,
    createdAt: '2024-01-13T11:00:00.000Z',
    updatedAt: '2024-01-13T11:00:00.000Z',
  },
  {
    _id: 'book-8',
    title: 'Campbell Biology',
    author: 'Jane B. Reece',
    ISBN: '978-0134093413',
    description: 'Comprehensive biology textbook.',
    category: 'Biology',
    publicationYear: 2016,
    shelfLocation: 'BIO-E-501',
    isActive: true,
    createdAt: '2024-01-14T12:00:00.000Z',
    updatedAt: '2024-01-14T12:00:00.000Z',
  },
  {
    _id: 'book-9',
    title: 'Data Structures and Algorithm Analysis',
    author: 'Mark Allen Weiss',
    ISBN: '978-0132576277',
    description: 'Advanced data structures and algorithms.',
    category: 'Computer Science',
    publicationYear: 2011,
    shelfLocation: 'CS-A-104',
    isActive: true,
    createdAt: '2024-01-15T13:00:00.000Z',
    updatedAt: '2024-01-15T13:00:00.000Z',
  },
  {
    _id: 'book-10',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    ISBN: '978-0073383095',
    description: 'Comprehensive discrete mathematics.',
    category: 'Mathematics',
    publicationYear: 2012,
    shelfLocation: 'MATH-B-203',
    isActive: true,
    createdAt: '2024-01-16T14:00:00.000Z',
    updatedAt: '2024-01-16T14:00:00.000Z',
  },
];

const bookCopies = [
  // Introduction to Algorithms - 5 copies
  { _id: 'copy-1', bookId: 'book-1', copyCode: 'ITA-001', status: 'AVAILABLE', createdAt: '2024-01-10T08:00:00.000Z', updatedAt: '2024-01-10T08:00:00.000Z' },
  { _id: 'copy-2', bookId: 'book-1', copyCode: 'ITA-002', status: 'AVAILABLE', createdAt: '2024-01-10T08:00:00.000Z', updatedAt: '2024-01-10T08:00:00.000Z' },
  { _id: 'copy-3', bookId: 'book-1', copyCode: 'ITA-003', status: 'BORROWED', createdAt: '2024-01-10T08:00:00.000Z', updatedAt: '2024-02-01T10:00:00.000Z' },
  { _id: 'copy-4', bookId: 'book-1', copyCode: 'ITA-004', status: 'AVAILABLE', createdAt: '2024-01-10T08:00:00.000Z', updatedAt: '2024-01-10T08:00:00.000Z' },
  { _id: 'copy-5', bookId: 'book-1', copyCode: 'ITA-005', status: 'AVAILABLE', createdAt: '2024-01-10T08:00:00.000Z', updatedAt: '2024-01-10T08:00:00.000Z' },
  // Clean Code - 4 copies
  { _id: 'copy-6', bookId: 'book-2', copyCode: 'CC-001', status: 'AVAILABLE', createdAt: '2024-01-10T08:15:00.000Z', updatedAt: '2024-01-10T08:15:00.000Z' },
  { _id: 'copy-7', bookId: 'book-2', copyCode: 'CC-002', status: 'BORROWED', createdAt: '2024-01-10T08:15:00.000Z', updatedAt: '2024-01-25T14:00:00.000Z' },
  { _id: 'copy-8', bookId: 'book-2', copyCode: 'CC-003', status: 'AVAILABLE', createdAt: '2024-01-10T08:15:00.000Z', updatedAt: '2024-01-10T08:15:00.000Z' },
  { _id: 'copy-9', bookId: 'book-2', copyCode: 'CC-004', status: 'AVAILABLE', createdAt: '2024-01-10T08:15:00.000Z', updatedAt: '2024-01-10T08:15:00.000Z' },
  // The Art of Computer Programming - 3 copies
  { _id: 'copy-10', bookId: 'book-3', copyCode: 'TAOCP-001', status: 'AVAILABLE', createdAt: '2024-01-10T08:30:00.000Z', updatedAt: '2024-01-10T08:30:00.000Z' },
  { _id: 'copy-11', bookId: 'book-3', copyCode: 'TAOCP-002', status: 'AVAILABLE', createdAt: '2024-01-10T08:30:00.000Z', updatedAt: '2024-01-10T08:30:00.000Z' },
  { _id: 'copy-12', bookId: 'book-3', copyCode: 'TAOCP-003', status: 'AVAILABLE', createdAt: '2024-01-10T08:30:00.000Z', updatedAt: '2024-01-10T08:30:00.000Z' },
  // Continue pattern for remaining books (2-5 copies each)
  { _id: 'copy-13', bookId: 'book-4', copyCode: 'LAAIA-001', status: 'AVAILABLE', createdAt: '2024-01-11T09:00:00.000Z', updatedAt: '2024-01-11T09:00:00.000Z' },
  { _id: 'copy-14', bookId: 'book-4', copyCode: 'LAAIA-002', status: 'AVAILABLE', createdAt: '2024-01-11T09:00:00.000Z', updatedAt: '2024-01-11T09:00:00.000Z' },
  { _id: 'copy-15', bookId: 'book-5', copyCode: 'CET-001', status: 'AVAILABLE', createdAt: '2024-01-11T09:15:00.000Z', updatedAt: '2024-01-11T09:15:00.000Z' },
  { _id: 'copy-16', bookId: 'book-5', copyCode: 'CET-002', status: 'AVAILABLE', createdAt: '2024-01-11T09:15:00.000Z', updatedAt: '2024-01-11T09:15:00.000Z' },
  { _id: 'copy-17', bookId: 'book-5', copyCode: 'CET-003', status: 'AVAILABLE', createdAt: '2024-01-11T09:15:00.000Z', updatedAt: '2024-01-11T09:15:00.000Z' },
  { _id: 'copy-18', bookId: 'book-6', copyCode: 'UP-001', status: 'AVAILABLE', createdAt: '2024-01-12T10:00:00.000Z', updatedAt: '2024-01-12T10:00:00.000Z' },
  { _id: 'copy-19', bookId: 'book-6', copyCode: 'UP-002', status: 'AVAILABLE', createdAt: '2024-01-12T10:00:00.000Z', updatedAt: '2024-01-12T10:00:00.000Z' },
  { _id: 'copy-20', bookId: 'book-7', copyCode: 'POE-001', status: 'AVAILABLE', createdAt: '2024-01-13T11:00:00.000Z', updatedAt: '2024-01-13T11:00:00.000Z' },
  { _id: 'copy-21', bookId: 'book-7', copyCode: 'POE-002', status: 'AVAILABLE', createdAt: '2024-01-13T11:00:00.000Z', updatedAt: '2024-01-13T11:00:00.000Z' },
  { _id: 'copy-22', bookId: 'book-7', copyCode: 'POE-003', status: 'AVAILABLE', createdAt: '2024-01-13T11:00:00.000Z', updatedAt: '2024-01-13T11:00:00.000Z' },
  { _id: 'copy-23', bookId: 'book-7', copyCode: 'POE-004', status: 'AVAILABLE', createdAt: '2024-01-13T11:00:00.000Z', updatedAt: '2024-01-13T11:00:00.000Z' },
  { _id: 'copy-24', bookId: 'book-8', copyCode: 'CB-001', status: 'AVAILABLE', createdAt: '2024-01-14T12:00:00.000Z', updatedAt: '2024-01-14T12:00:00.000Z' },
  { _id: 'copy-25', bookId: 'book-8', copyCode: 'CB-002', status: 'AVAILABLE', createdAt: '2024-01-14T12:00:00.000Z', updatedAt: '2024-01-14T12:00:00.000Z' },
  { _id: 'copy-26', bookId: 'book-9', copyCode: 'DSAAA-001', status: 'AVAILABLE', createdAt: '2024-01-15T13:00:00.000Z', updatedAt: '2024-01-15T13:00:00.000Z' },
  { _id: 'copy-27', bookId: 'book-9', copyCode: 'DSAAA-002', status: 'AVAILABLE', createdAt: '2024-01-15T13:00:00.000Z', updatedAt: '2024-01-15T13:00:00.000Z' },
  { _id: 'copy-28', bookId: 'book-9', copyCode: 'DSAAA-003', status: 'AVAILABLE', createdAt: '2024-01-15T13:00:00.000Z', updatedAt: '2024-01-15T13:00:00.000Z' },
  { _id: 'copy-29', bookId: 'book-10', copyCode: 'DMAIA-001', status: 'AVAILABLE', createdAt: '2024-01-16T14:00:00.000Z', updatedAt: '2024-01-16T14:00:00.000Z' },
  { _id: 'copy-30', bookId: 'book-10', copyCode: 'DMAIA-002', status: 'AVAILABLE', createdAt: '2024-01-16T14:00:00.000Z', updatedAt: '2024-01-16T14:00:00.000Z' },
];

const loans = [
  {
    _id: 'loan-1',
    userId: '3',
    bookId: 'book-1',
    copyId: 'copy-3',
    borrowDate: '2024-02-01T10:00:00.000Z',
    dueDate: '2024-02-15T23:59:59.000Z',
    returnDate: null,
    status: 'BORROWED',
    reminderSent: false,
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2024-02-01T10:00:00.000Z',
  },
  {
    _id: 'loan-2',
    userId: '4',
    bookId: 'book-2',
    copyId: 'copy-7',
    borrowDate: '2024-01-25T14:00:00.000Z',
    dueDate: '2024-02-05T23:59:59.000Z',
    returnDate: null,
    status: 'OVERDUE',
    reminderSent: false,
    createdAt: '2024-01-25T14:00:00.000Z',
    updatedAt: '2024-01-25T14:00:00.000Z',
  },
];

async function seedDatabase() {
  try {
    console.log('========================================');
    console.log('Backend Database Seeding');
    console.log('========================================\n');

    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.DATABASE_NAME || 'library';

    await database.connect(mongoUri, dbName);
    const db = database.getDb();

    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('books').deleteMany({});
    await db.collection('bookCopies').deleteMany({});
    await db.collection('loans').deleteMany({});
    console.log('✓ Existing data cleared\n');

    // Hash passwords for users
    console.log('Hashing user passwords...');
    const usersToInsert = await Promise.all(
      users.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash(user.passwordHash, 10),
      }))
    );
    console.log('✓ Passwords hashed\n');

    // Insert data
    console.log('Inserting users...');
    await db.collection('users').insertMany(usersToInsert as any);
    console.log(`✓ Inserted ${usersToInsert.length} users\n`);

    console.log('Inserting books...');
    await db.collection('books').insertMany(books as any);
    console.log(`✓ Inserted ${books.length} books\n`);

    console.log('Inserting book copies...');
    await db.collection('bookCopies').insertMany(bookCopies as any);
    console.log(`✓ Inserted ${bookCopies.length} book copies\n`);

    console.log('Inserting loans...');
    await db.collection('loans').insertMany(loans as any);
    console.log(`✓ Inserted ${loans.length} loans\n`);

    // Create indexes
    console.log('Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ studentId: 1 }, { sparse: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('books').createIndex({ ISBN: 1 }, { unique: true });
    await db.collection('books').createIndex({ category: 1 });
    await db.collection('books').createIndex({ isActive: 1 });
    await db.collection('bookCopies').createIndex({ bookId: 1 });
    await db.collection('bookCopies').createIndex({ copyCode: 1 }, { unique: true });
    await db.collection('bookCopies').createIndex({ status: 1 });
    await db.collection('bookCopies').createIndex({ bookId: 1, status: 1 });
    await db.collection('loans').createIndex({ userId: 1 });
    await db.collection('loans').createIndex({ bookId: 1 });
    await db.collection('loans').createIndex({ status: 1 });
    await db.collection('loans').createIndex({ borrowDate: -1 });
    console.log('✓ Indexes created\n');

    console.log('========================================');
    console.log('Database seeding completed successfully!');
    console.log('========================================\n');
    console.log('Default credentials:');
    console.log('  Admin: admin@library.edu / admin123');
    console.log('  Staff: staff@library.edu / staff123');
    console.log('  User:  john@student.edu / password123\n');

    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await database.disconnect();
    process.exit(1);
  }
}

seedDatabase();
