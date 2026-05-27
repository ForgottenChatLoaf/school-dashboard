import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, total: 0 });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const user = await api.get('/auth/me');
        const students = await api.get('/students');
        const myProfile = students.data.find(s => s.email === user.data.email);
        
        if (myProfile) {
          const { data } = await api.get(`/attendance/summary/${myProfile.id}`);
          setAttendance(data.records || []);
          setStats(data.summary || { present: 0, late: 0, absent: 0, total: 0 });
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchAttendance();
  }, []);

  const percentage = stats.total === 0 ? 0 : Math.round(((stats.present + stats.late) / stats.total) * 100);
  const isPassing = percentage >= 80;

  return (
    <PageWrapper title="My Attendance">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-surface border border-accent/20 relative overflow-hidden stagger-1">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Overall Attendance</p>
          <div className="flex items-end gap-3 mb-3">
            <h2 className="text-4xl font-heading font-extrabold text-text-primary leading-none">{percentage}%</h2>
            <span className={`text-sm font-semibold mb-1 ${isPassing ? 'text-success' : 'text-danger'}`}>
              {isPassing ? 'Good Standing' : 'Needs Improvement'}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${isPassing ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {[
          { label: 'Present', count: stats.present, color: 'text-success', bg: 'bg-success/10 border-success/20', icon: CheckCircle },
          { label: 'Late', count: stats.late, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', icon: Clock },
          { label: 'Absent', count: stats.absent, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', icon: XCircle }
        ].map(({ label, count, color, bg, icon: Icon }, i) => (
          <div key={label} className={`p-5 rounded-2xl border ${bg} relative overflow-hidden stagger-2`}>
            <Icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-10 ${color}`} />
            <p className={`text-3xl font-heading font-extrabold ${color} mb-1`}>{count}</p>
            <p className="text-sm font-semibold text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      <Card title="Recent Activity">
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-text-muted text-xs uppercase tracking-widest">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="2" className="px-4 py-8"><div className="skeleton h-4 w-full" /></td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="2" className="px-4 py-12 text-center text-text-muted">No attendance records found.</td></tr>
              ) : (
                attendance.map((record, i) => (
                  <tr key={record.date} className="hover:bg-surface-alt/30 transition-colors" style={{ animation: `slideInUp 0.3s ease ${i * 0.05}s both` }}>
                    <td className="px-4 py-4 font-medium text-text-primary">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-4">
                      {record.status === 'present' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold border border-success/20"><CheckCircle className="w-3.5 h-3.5"/> Present</span>}
                      {record.status === 'late' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warning/10 text-warning text-xs font-bold border border-warning/20"><Clock className="w-3.5 h-3.5"/> Late</span>}
                      {record.status === 'absent' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-danger/10 text-danger text-xs font-bold border border-danger/20"><XCircle className="w-3.5 h-3.5"/> Absent</span>}
                    </td>
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

export default MyAttendance;
