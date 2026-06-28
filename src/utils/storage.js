// Helper utilities for managing local storage and backup import/export

const STORAGE_KEY = 'job_in_applications';

// Seed mock data for a premium initial experience
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
    notes: 'Technical Interview round 1 scheduled for next Monday. Study React 19 concurrent features and system design.',
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
    notes: 'Submitted resume via LinkedIn. Referenced by Senior SWE.',
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
    notes: 'Offer letter received! Offering competitive base salary and sign-on bonus. Deadline for response is Friday.',
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
    notes: 'Position closed. Received generic rejection email after HR round.',
    updatedAt: new Date().toISOString()
  }
];

export const loadJobs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial mock data so the app isn't blank
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_JOBS));
      return MOCK_JOBS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load jobs from localStorage:', error);
    return [];
  }
};

export const saveJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Failed to save jobs to localStorage:', error);
  }
};

