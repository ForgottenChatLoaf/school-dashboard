import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS = {
  present: { label: 'Present', icon: CheckCircle, color: 'text-success', bg: 'bg-success/10 border-success/30', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.25)]' },
  late:    { label: 'Late',    icon: Clock,        color: 'text-warning', bg: 'bg-warning/10 border-warning/30', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]' },
  absent:  { label: 'Absent',  icon: XCircle,      color: 'text-danger',  bg: 'bg-danger/10 border-danger/30',   glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]' },
};

const AttendanceLog = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes] = await Promise.all([
        api.get('/students'),
        api.get(`/attendance?date=${date}`)
      ]);
      setStudents(sRes.data);
      const map = {};
      aRes.data.forEach(r => { map[r.studentId] = r.status; });
      setAttendance(map);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const markAttendance = async (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    try {
      await api.post('/attendance', { studentId, date, status, subjectId: 'general' });
      toast.success(`Marked ${STATUS[status].label}`, { id: 'att', duration: 1500 });
    } catch { toast.error('Failed to save'); fetchData(); }
  };

  const summary = Object.values(attendance);
  const presentCount = summary.filter(s => s === 'present').length;
  const lateCount = summary.filter(s => s === 'late').length;
  const absentCount = summary.filter(s => s === 'absent').length;

  return (
    <PageWrapper title="Attendance Logging">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Present', count: presentCount, color: 'text-success', bg: 'bg-success/10 border-success/20' },
          { label: 'Late',    count: lateCount,    color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
          { label: 'Absent',  count: absentCount,  color: 'text-danger',  bg: 'bg-danger/10 border-danger/20'  },
        ].map(({ label, count, color, bg }, i) => (
          <div key={label} className={`p-4 rounded-2xl border ${bg} text-center stagger-${i+1}`}>
            <p className={`text-2xl font-heading font-extrabold ${color}`}>{count}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-heading font-bold text-text-primary">Daily Roll Call</h3>
            <p className="text-xs text-text-muted mt-0.5">Click a status button to record attendance</p>
          </div>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-alt border border-white/8 rounded-xl text-sm text-text-primary focus:outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-text-muted text-xs uppercase tracking-widest">
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Course</th>
                <th className="px-4 py-3 font-semibold text-right">Mark Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4"><div className="skeleton h-4 w-40" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="skeleton h-4 w-24" /></td>
                    <td className="px-4 py-4"><div className="skeleton h-8 w-32 ml-auto" /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr><td colSpan="3" className="px-4 py-16 text-center text-text-muted text-sm">No students enrolled yet.</td></tr>
              ) : (
                students.map((student, i) => {
                  const current = attendance[student.id];
                  return (
                    <tr key={student.id} className="hover:bg-surface-alt/30 transition-colors"
                      style={{ animation: `slideInUp 0.3s ease ${i * 0.04}s both` }}>
                      <td className="px-4 py-3.5 font-semibold text-text-primary">{student.fullname}</td>
                      <td className="px-4 py-3.5 text-text-muted text-xs hidden md:table-cell">{student.course} · Yr {student.yearLevel}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {Object.entries(STATUS).map(([key, cfg]) => {
                            const Icon = cfg.icon;
                            const active = current === key;
                            return (
                              <button key={key} onClick={() => markAttendance(student.id, key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                  active
                                    ? `${cfg.bg} ${cfg.color} ${cfg.glow} border-opacity-100`
                                    : 'bg-surface-alt border-white/8 text-text-muted hover:border-white/20'
                                }`}>
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{cfg.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageWrapper>
  );
};

export default AttendanceLog;
