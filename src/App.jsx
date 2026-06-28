import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import KanbanBoard from './components/KanbanBoard';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import StatusPieChart from './components/StatusPieChart';
import {
  loadJobsFromFirestore,
  addJobToFirestore,
  updateJobInFirestore,
  deleteJobFromFirestore,
  trackVisitor,
  getVisitorCount,
} from './utils/firestoreStorage';

function App() {
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('job_in_welcome_dismissed') !== 'true');
  const [theme, setTheme] = useState(() => localStorage.getItem('job_in_theme') || 'dark');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  // Track page visitor and load counter
  useEffect(() => {
    const handleVisitorTracking = async () => {
      await trackVisitor();
      const count = await getVisitorCount();
      setVisitorCount(count);
    };
    handleVisitorTracking();
  }, []);

  // Sync theme class to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('job_in_theme', theme);
  }, [theme]);

  // Load jobs from Firestore when user logs in
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoadingJobs(false);
      return;
    }
    setLoadingJobs(true);
    loadJobsFromFirestore(user.uid)
      .then((data) => setJobs(data))
      .catch(console.error)
      .finally(() => setLoadingJobs(false));
  }, [user]);

  // --- CRUD Handlers (now Firestore-backed) ---

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingJob) {
        await updateJobInFirestore(user.uid, editingJob.id, formData);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === editingJob.id ? { ...j, ...formData, updatedAt: new Date().toISOString() } : j
          )
        );
      } else {
        const newId = await addJobToFirestore(user.uid, formData);
        const newJob = { id: newId, ...formData, updatedAt: new Date().toISOString() };
        setJobs((prev) => [newJob, ...prev]);
      }
      setIsFormOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error('Gagal menyimpan lamaran:', err);
      alert(`Gagal menyimpan data: ${err.message}\n\nPastikan Firestore Rules sudah dikonfigurasi dengan benar.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    await deleteJobFromFirestore(user.uid, id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateJobInFirestore(user.uid, id, { status: newStatus });
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: newStatus, updatedAt: new Date().toISOString() } : j
      )
    );
  };

  const handleEditClick = (job) => { setEditingJob(job); setIsFormOpen(true); };
  const handleAddClick = () => { setEditingJob(null); setIsFormOpen(true); };
  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('job_in_welcome_dismissed', 'true');
  };

  // If not logged in, show Login page
  if (!user) return <Login />;

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.notes && job.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.jobType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Statistics
  const totalApplied = jobs.length;
  const countApplied = jobs.filter((j) => j.status === 'applied').length;
  const countInterviewing = jobs.filter((j) => j.status === 'interviewing').length;
  const countOffered = jobs.filter((j) => j.status === 'offered').length;
  const countRejected = jobs.filter((j) => j.status === 'rejected').length;
  const successRate = totalApplied > 0 ? Math.round((countOffered / totalApplied) * 100) : 0;

  return (
    <div className="app-container">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="logo-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <img src="/logo.png" alt="Job.In Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pelacak Lamaran Pekerjaan & Progress Karir Anda</p>
        </div>

        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="btn btn-secondary"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
            style={{ padding: '0.65rem 0.85rem' }}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          {/* Tambah Job */}
          <button className="btn btn-primary" onClick={handleAddClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tambah Job
          </button>

          {/* User Avatar / Menu */}
          <div style={{ position: 'relative' }}>
            <button
              className="user-avatar-btn"
              onClick={() => setShowUserMenu((v) => !v)}
              title={user.displayName || user.email}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="user-avatar-img" />
              ) : (
                <span className="user-avatar-initials">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            {showUserMenu && (
              <div className="user-dropdown glass-card">
                <div className="user-dropdown-info">
                  <span className="user-dropdown-name">{user.displayName || 'Pengguna'}</span>
                  <span className="user-dropdown-email">{user.email}</span>
                </div>
                <div className="user-dropdown-divider" />
                <button
                  className="user-dropdown-logout"
                  onClick={() => { setShowUserMenu(false); logout(); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Welcome Banner ── */}
      {showWelcome && (
        <div className="welcome-banner glass-card">
          <button className="welcome-close-btn" onClick={handleDismissWelcome} title="Tutup informasi ini">&times;</button>
          <h2>Selamat Datang{user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!</h2>
          <p>
            Job.In adalah platform personal yang dirancang khusus untuk mendata, melacak, dan mengelola seluruh alur lamaran pekerjaan Anda. Data Anda kini tersimpan aman di cloud dan dapat diakses dari perangkat mana pun.
          </p>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">📋</span>
              <div className="feature-text"><strong>Papan Kanban</strong>Tarik & taruh kartu lamaran untuk memperbarui status secara instan.</div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div className="feature-text"><strong>Statistik Dashboard</strong>Pantau total lamaran dan rasio keberhasilan secara real-time.</div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">☁️</span>
              <div className="feature-text"><strong>Tersimpan di Cloud</strong>Data aman di Firestore, sinkron di semua perangkat Anda.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <section className="stats-grid">
        <div className="glass-card stat-card total">
          <span className="stat-label">Total Lamaran</span>
          <span className="stat-value">{totalApplied}</span>
          <span className="stat-desc">keseluruhan lamaran kerja</span>
        </div>
        <div className="glass-card stat-card applied">
          <span className="stat-label">Applied</span>
          <span className="stat-value">{countApplied}</span>
          <span className="stat-desc">menunggu respon berkas</span>
        </div>
        <div className="glass-card stat-card interviewing">
          <span className="stat-label">Interviewing</span>
          <span className="stat-value">{countInterviewing}</span>
          <span className="stat-desc">sedang proses wawancara</span>
        </div>
        <div className="glass-card stat-card offered">
          <span className="stat-label">Offered</span>
          <span className="stat-value" style={{ color: 'var(--accent-offered)' }}>{countOffered}</span>
          <span className="stat-desc">success rate: {successRate}%</span>
        </div>
        <div className="glass-card stat-card rejected">
          <span className="stat-label">Rejected</span>
          <span className="stat-value" style={{ color: 'var(--accent-rejected)' }}>{countRejected}</span>
          <span className="stat-desc">belum berhasil</span>
        </div>
        <div className="glass-card stat-card visitors" style={{ borderLeft: '3px solid var(--accent-applied)' }}>
          <span className="stat-label">Total Pengunjung</span>
          <span className="stat-value" style={{ color: 'var(--accent-applied)' }}>{visitorCount}</span>
          <span className="stat-desc">pengunjung unik (sesi)</span>
        </div>
      </section>

      {/* ── Dashboard: Pie Chart + Progress Bars ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <StatusPieChart jobs={jobs} />
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Ringkasan Karir</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Metrik performa lamaran Anda</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'Tingkat Respon', value: totalApplied > 0 ? Math.round(((countInterviewing + countOffered) / totalApplied) * 100) : 0, color: 'var(--accent-applied)', desc: 'lamaran mendapat balasan' },
              { label: 'Tingkat Keberhasilan', value: successRate, color: 'var(--accent-offered)', desc: 'berhasil mendapat penawaran' },
              { label: 'Tingkat Penolakan', value: totalApplied > 0 ? Math.round((countRejected / totalApplied) * 100) : 0, color: 'var(--accent-rejected)', desc: 'lamaran ditolak' },
            ].map((metric) => (
              <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{metric.label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: metric.color }}>{metric.value}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${metric.value}%`, background: metric.color, borderRadius: '4px', transition: 'width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)', boxShadow: `0 0 8px ${metric.color}88` }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{metric.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filters & Toggle ── */}
      <section className="glass-card controls-bar">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Cari perusahaan, posisi atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          {viewMode === 'list' && (
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-input">
              <option value="all">Semua Status</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="select-input">
            <option value="all">Semua Tipe</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
          <div className="view-toggle">
            <button className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              Kanban
            </button>
            <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Tabel
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content: Kanban / List ── */}
      <main>
        {loadingJobs ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="spinner" />
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Memuat data lamaran...</p>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard jobs={filteredJobs} onEdit={handleEditClick} onDelete={handleDeleteJob} onStatusChange={handleStatusChange} />
        ) : (
          <JobList jobs={filteredJobs} onEdit={handleEditClick} onDelete={handleDeleteJob} />
        )}
      </main>

      {/* ── Form Modal ── */}
      <JobForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingJob(null); }}
        onSubmit={handleFormSubmit}
        initialJob={editingJob}
        submitting={submitting}
      />
    </div>
  );
}

export default App;
