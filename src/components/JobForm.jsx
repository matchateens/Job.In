import React, { useState, useEffect } from 'react';

const JobForm = ({ isOpen, onClose, onSubmit, initialJob, submitting = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
    dateApplied: new Date().toISOString().split('T')[0],
    jobType: 'Full-time',
    workMode: 'Hybrid',
    link: '',
    salary: '',
    notes: ''
  });

  useEffect(() => {
    if (initialJob) {
      setFormData({
        company: initialJob.company || '',
        position: initialJob.position || '',
        status: initialJob.status || 'applied',
        dateApplied: initialJob.dateApplied || new Date().toISOString().split('T')[0],
        jobType: initialJob.jobType || 'Full-time',
        workMode: initialJob.workMode || 'Hybrid',
        link: initialJob.link || '',
        salary: initialJob.salary || '',
        notes: initialJob.notes || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        status: 'applied',
        dateApplied: new Date().toISOString().split('T')[0],
        jobType: 'Full-time',
        workMode: 'Hybrid',
        link: '',
        salary: '',
        notes: ''
      });
    }
  }, [initialJob, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) {
      alert('Nama perusahaan dan posisi harus diisi!');
      return;
    }
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialJob ? 'Edit Lamaran Kerja' : 'Tambah Lamaran Baru'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Perusahaan *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Contoh: Google, GoTo, Shopee"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Posisi / Pekerjaan *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Contoh: Frontend Developer"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status Lamaran</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Melamar</label>
              <input
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipe Pekerjaan</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Model Kerja</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tautan Lowongan (Link)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kisaran Gaji (Opsional)</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Contoh: Rp 10jt - 15jt"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Tambahan</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tambahkan info kontak recruiter, tahapan interview, persiapan materi, dll..."
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : (initialJob ? 'Simpan Perubahan' : 'Tambah Lamaran')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
