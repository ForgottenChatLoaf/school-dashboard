import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Search, Plus, Edit2, Trash2, UserCheck } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentRecords = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ fullname: '', studentNumber: '', course: '', yearLevel: '1', section: '', contact: '' });

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleOpenModal = (student = null) => {
    if (student) { setFormData(student); setEditingId(student.id); }
    else { setFormData({ fullname: '', studentNumber: '', course: '', yearLevel: '1', section: '', contact: '' }); setEditingId(null); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await api.put(`/students/${editingId}`, formData); toast.success('Student updated!'); }
      else { await api.post('/students', formData); toast.success('Student added!'); }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student permanently?')) return;
    try { await api.delete(`/students/${id}`); toast.success('Student deleted'); fetchStudents(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = students.filter(s =>
    s.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass = "w-full px-4 py-2.5 bg-surface-alt border border-white/8 rounded-xl text-text-primary text-sm focus:outline-none transition-all placeholder:text-text-muted/40";

  return (
    <PageWrapper title="Student Records">
      <Card>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input type="text" placeholder="Search name, ID or course…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-white/8 rounded-xl text-sm text-text-primary focus:outline-none transition-all placeholder:text-text-muted/40" />
          </div>
          <button onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all btn-glow text-sm font-semibold whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-alt rounded-lg border border-white/5">
            <UserCheck className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-text-muted">Total: <span className="text-text-primary font-bold">{students.length}</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-alt rounded-lg border border-white/5">
            <Search className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted">Showing: <span className="text-text-primary font-bold">{filtered.length}</span></span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-text-muted text-xs uppercase tracking-widest">
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Full Name</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Course & Year</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">Section</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-text-muted">
                      <UserCheck className="w-10 h-10 opacity-30" />
                      <p className="font-medium">No students found</p>
                      <p className="text-xs opacity-60">{searchTerm ? 'Try a different search' : 'Add your first student using the button above'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((student, i) => (
                  <tr key={student.id} className="hover:bg-surface-alt/50 transition-colors group"
                    style={{ animation: `slideInUp 0.3s ease ${i * 0.04}s both` }}>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-md">{student.studentNumber}</span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-text-primary">{student.fullname}</td>
                    <td className="px-4 py-4 text-text-muted hidden md:table-cell">{student.course} · Yr {student.yearLevel}</td>
                    <td className="px-4 py-4 text-text-muted hidden lg:table-cell">{student.section}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(student)}
                          className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(student.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Student' : 'Add New Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'fullname', type: 'text', placeholder: 'Juan dela Cruz', full: true },
            { label: 'Student Number', key: 'studentNumber', type: 'text', placeholder: '2024-00001', full: true },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">{label}</label>
              <input required type={type} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                className={inputClass} placeholder={placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Course</label>
              <input required type="text" placeholder="e.g. BSCS" value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Year Level</label>
              <select value={formData.yearLevel} onChange={e => setFormData({ ...formData, yearLevel: e.target.value })}
                className={inputClass + ' appearance-none'}>
                {['1', '2', '3', '4'].map(y => <option key={y} value={y}>{y === '1' ? '1st' : y === '2' ? '2nd' : y === '3' ? '3rd' : '4th'} Year</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Section</label>
              <input required type="text" placeholder="e.g. A" value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1.5 block">Contact</label>
              <input type="text" placeholder="09xxxxxxxxx" value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm text-text-muted hover:text-white transition-colors rounded-xl hover:bg-white/5">Cancel</button>
            <button type="submit"
              className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all btn-glow text-sm font-semibold">
              {editingId ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default StudentRecords;
