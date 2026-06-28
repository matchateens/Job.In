import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase';

// Seed mock data for a premium first-time experience
const MOCK_JOBS = [
  {
    id: 'mock-1',
    company: 'Google',
    position: 'Frontend Engineer',
    status: 'interviewing',
    dateApplied: '2026-06-25',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    link: 'https://careers.google.com',
    salary: 'Rp 25.000.000 - 35.000.000',
    notes: 'Technical Interview round 1 dijadwalkan Senin depan.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    company: 'GoTo (Gojek Tokopedia)',
    position: 'Fullstack Developer',
    status: 'applied',
    dateApplied: '2026-06-26',
    jobType: 'Full-time',
    workMode: 'Remote',
    link: 'https://careers.goto-group.com',
    salary: 'Rp 18.000.000 - 24.000.000',
    notes: 'Kirim resume via LinkedIn.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-3',
    company: 'Shopee',
    position: 'Product Manager',
    status: 'offered',
    dateApplied: '2026-06-10',
    jobType: 'Full-time',
    workMode: 'On-site',
    link: 'https://careers.shopee.co.id',
    salary: 'Rp 30.000.000',
    notes: 'Surat penawaran diterima! Deadline respons hari Jumat.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-4',
    company: 'Bukalapak',
    position: 'React Native Developer',
    status: 'rejected',
    dateApplied: '2026-06-05',
    jobType: 'Contract',
    workMode: 'Hybrid',
    link: 'https://careers.bukalapak.com',
    salary: 'Rp 15.000.000',
    notes: 'Posisi ditutup. Menerima email penolakan setelah tahap HR.',
    updatedAt: new Date().toISOString()
  }
];

// Get reference to user's jobs collection
const jobsRef = (userId) => collection(db, 'users', userId, 'jobs');

// Load all jobs for a user
export const loadJobsFromFirestore = async (userId) => {
  try {
    const q = query(jobsRef(userId), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // First time user: seed mock data into Firestore
      await seedMockData(userId);
      return MOCK_JOBS;
    }

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    // Firestore may not have the index yet; fallback to unordered
    const snapshot = await getDocs(jobsRef(userId));
    if (snapshot.empty) {
      await seedMockData(userId);
      return MOCK_JOBS;
    }
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
};

// Seed mock data into Firestore for a new user
const seedMockData = async (userId) => {
  for (const job of MOCK_JOBS) {
    const { id, ...data } = job;
    await setDoc(doc(db, 'users', userId, 'jobs', id), data);
  }
};

// Add a new job
export const addJobToFirestore = async (userId, jobData) => {
  const docRef = await addDoc(jobsRef(userId), {
    ...jobData,
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Update an existing job
export const updateJobInFirestore = async (userId, jobId, jobData) => {
  const ref = doc(db, 'users', userId, 'jobs', jobId);
  await updateDoc(ref, {
    ...jobData,
    updatedAt: new Date().toISOString(),
  });
};

// Delete a job
export const deleteJobFromFirestore = async (userId, jobId) => {
  const ref = doc(db, 'users', userId, 'jobs', jobId);
  await deleteDoc(ref);
};

// Track and fetch global visitor count
export const trackVisitor = async () => {
  try {
    const isVisited = sessionStorage.getItem('jobin_session_visited');
    const docRef = doc(db, 'global_stats', 'visitors');
    if (!isVisited) {
      await setDoc(docRef, { count: increment(1) }, { merge: true });
      sessionStorage.setItem('jobin_session_visited', 'true');
    }
  } catch (error) {
    console.error("Error tracking visitor: ", error);
  }
};

export const getVisitorCount = async () => {
  try {
    const docRef = doc(db, 'global_stats', 'visitors');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().count || 0;
    } else {
      await setDoc(docRef, { count: 1 });
      return 1;
    }
  } catch (error) {
    console.error("Error getting visitor count: ", error);
    return 0;
  }
};

