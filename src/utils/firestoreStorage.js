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

// Get reference to user's jobs collection
const jobsRef = (userId) => collection(db, 'users', userId, 'jobs');

// Load all jobs for a user
export const loadJobsFromFirestore = async (userId) => {
  try {
    const q = query(jobsRef(userId), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    // Firestore may not have the index yet; fallback to unordered
    const snapshot = await getDocs(jobsRef(userId));
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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

