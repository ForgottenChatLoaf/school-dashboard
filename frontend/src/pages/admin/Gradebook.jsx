import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Book, Save, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Gradebook = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [subject, setSubject] = useState('Mathematics');
  const [semester, setSemester] = useState('Fall 2026');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState({});

  const subjects = ['Mathematics', 'Science', 'English', 'History'];
  const terms = ['Midterm', 'Finals'];

  useEffect(() => { fetchData(); }, [semester, subject]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, gRes] = await Promise.all([
        api.get('/students'),
        api.get(`/grades?semester=${semester}`)
      ]);
      setStudents(sRes.data);
      const map = {};
      gRes.data.forEach(r => {
        if (!map[r.studentId]) map[r.studentId] = {};
        if (!map[r.studentId][r.subject]) map[r.studentId][r.subject] = {};
        map[r.studentId][r.subject][r.term] = r.grade;
      });
      setGrades(map);
    } catch { toast.error('Failed to load grades'); }
    finally { setLoading(false); }
  };

  const handleChange = (studentId, term, val) => {
    setGrades(prev => ({
      ...prev, [studentId]: {
        ...(prev[studentId] || {}), [subject]: {
          ...(prev[studentId]?.[subject] || {}), [term]: val
        }
      }
    }));
  };

  const handleSave = async (studentId, term) => {
    const val = parseFloat(grades[studentId]?.[subject]?.[term]);
    if (isNaN(val) || val < 0 || val > 100) return;
    
    setSavingStatus(prev => ({ ...prev, [`${studentId}-${term}`]: 'saving' }));
    try {
      await api.post('/grades', { studentId, subject, semester, term, grade: val });
      setSavingStatus(prev => ({ ...prev, [`${studentId}-${term}`]: 'saved' }));
      setTimeout(() => setSavingStatus(prev => ({ ...prev, [`${studentId}-${term}`]: null })), 2000);
    } catch {
      setSavingStatus(prev => ({ ...prev, [`${studentId}-${term}`]: 'error' }));
      toast.error('Failed to save grade');
    }
  };

  return (
    <PageWrapper title="Gradebook">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-heading font-bold text-text-primary">Class Gradebook</h3>
            <p className="text-xs text-text-muted mt-0.5">Grades auto-save when you click away</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="pl-9 pr-8 py-2 bg-surface-alt border border-white/8 rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all appearance-none">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <select value={semester} onChange={e => setSemester(e.target.value)}
              className="px-4 py-2 bg-surface-alt border border-white/8 rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all appearance-none">
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-text-muted text-xs uppercase tracking-widest">
                <th className="px-4 py-3 font-semibold">Student Name</th>
                {terms.map(t => <th key={t} className="px-4 py-3 font-semibold text-center w-32">{t}</th>)}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="skeleton h-4 w-40" /></td>
                    <td className="px-4 py-4"><div className="skeleton h-8 w-20 mx-auto" /></td>
                    <td className="px-4 py-4"><div className="skeleton h-8 w-20 mx-auto" /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr><td colSpan="3" className="px-4 py-16 text-center text-text-muted">No students enrolled.</td></tr>
              ) : (
                students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-surface-alt/30 transition-colors group"
                    style={{ animation: `slideInUp 0.3s ease ${i * 0.04}s both` }}>
                    <td className="px-4 py-3 font-semibold text-text-primary">{s.fullname}</td>
                    {terms.map(t => {
                      const status = savingStatus[`${s.id}-${t}`];
                      return (
                        <td key={t} className="px-4 py-3 text-center">
                          <div className="relative inline-block">
                            <input type="number" min="0" max="100" placeholder="—"
                              value={grades[s.id]?.[subject]?.[t] || ''}
                              onChange={e => handleChange(s.id, t, e.target.value)}
                              onBlur={() => handleSave(s.id, t)}
                              className={`w-20 px-3 py-1.5 bg-surface-alt border rounded-lg text-center font-mono text-text-primary focus:outline-none transition-all ${
                                status === 'saved' ? 'border-success/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                                status === 'error' ? 'border-danger/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                                'border-white/8 hover:border-white/20 focus:border-accent/50'
                              }`} />
                            {status === 'saving' && <div className="absolute -right-5 top-1/2 -translate-y-1/2"><span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span></span></div>}
                            {status === 'saved' && <CheckCircle className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-success" style={{ animation: 'scaleIn 0.2s ease' }} />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
};

export default Gradebook;
