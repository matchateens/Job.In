import React from 'react';

const COLUMNS = [
  { id: 'applied', title: 'Applied', colorClass: 'applied', color: 'var(--accent-applied)' },
  { id: 'interviewing', title: 'Interviewing', colorClass: 'interviewing', color: 'var(--accent-interviewing)' },
  { id: 'offered', title: 'Offered', colorClass: 'offered', color: 'var(--accent-offered)' },
  { id: 'rejected', title: 'Rejected', colorClass: 'rejected', color: 'var(--accent-rejected)' }
];

const KanbanBoard = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  
  // HTML5 Drag & Drop handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('jobId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) {
      onStatusChange(jobId, targetStatus);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colJobs = jobs.filter((job) => job.status === col.id);
        
        return (
          <div
            key={col.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="column-header">
              <span className="column-title" style={{ color: col.color }}>
                {col.id === 'interviewing' && <span className="pulse-indicator"></span>}
                {col.title}
              </span>
              <span className="column-badge">{colJobs.length}</span>
            </div>
            
            <div className="job-cards-list">
              {colJobs.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  border: '1px dashed var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '0.5rem'
                }}>
                  Tarik berkas ke sini
                </div>
              ) : (
                colJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`job-card glass-card ${col.colorClass}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job.id)}
                  >
                    <div className="card-header-info">
                      <span className="company-name">{job.company}</span>
                      <span className="card-date">{formatDate(job.dateApplied)}</span>
                    </div>
                    
                    <h4 className="job-title">{job.position}</h4>
                    
                    <div className="card-tags">
                      <span className={`tag status-badge ${job.status}`}>
                        {col.title}
                      </span>
                      {job.workMode && <span className="tag">{job.workMode}</span>}
                      {job.jobType && <span className="tag">{job.jobType}</span>}
                    </div>

                    {job.notes && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4'
                      }}>
                        {job.notes}
                      </p>
                    )}
                    
                    <div className="card-footer-info">
                      <span className="card-salary">
                        {job.salary || 'Salary: -'}
                      </span>
                      <div className="card-actions">
                        {job.link && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon"
                            title="Buka Link Lowongan"
                            style={{ color: 'var(--accent-applied)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        )}
                        <button
                          className="btn-icon"
                          title="Edit Lamaran"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(job);
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn-icon"
                          title="Hapus Lamaran"
                          style={{ color: 'var(--accent-rejected)' }}
                          onClick={(e) => {
                            e.stopPropagation();
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
