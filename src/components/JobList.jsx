import React from 'react';

const JobList = ({ jobs, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'interviewing': return 'Interviewing';
      case 'offered': return 'Offered';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  if (jobs.length === 0) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        border: '1px dashed var(--border-glass)',
        borderRadius: 'var(--radius-md)'
      }}>
        Tidak ada data lamaran pekerjaan yang sesuai filter.
      </div>
    );
  }

  return (
    <div className="list-view-container glass-card">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Perusahaan / Posisi</th>
            <th>Tanggal Melamar</th>
            <th>Tipe / Model</th>
            <th>Gaji</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  {job.position}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {job.company}
                </div>
              </td>
              <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {formatDate(job.dateApplied)}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="tag">{job.jobType}</span>
                  <span className="tag">{job.workMode}</span>
                </div>
              </td>
              <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {job.salary || '-'}
              </td>
              <td>
                <span className={`tag status-badge ${job.status}`}>
                  {getStatusLabel(job.status)}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {job.link && (
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon btn-secondary"
                      title="Buka Link Lowongan"
                      style={{ color: 'var(--accent-applied)', padding: '0.4rem' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  )}
                  <button
                    className="btn-icon btn-secondary"
                    title="Edit"
                    style={{ padding: '0.4rem' }}
                    onClick={() => onEdit(job)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    className="btn-icon btn-secondary"
                    title="Hapus"
                    style={{ color: 'var(--accent-rejected)', padding: '0.4rem' }}
                    onClick={() => {
                      if (window.confirm(`Hapus lamaran di ${job.company}?`)) {
                        onDelete(job.id);
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
