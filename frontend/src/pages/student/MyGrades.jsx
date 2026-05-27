import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Download, Award, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [semester, setSemester] = useState('Fall 2026');
  const [loading, setLoading] = useState(true);

  const subjects = ['Mathematics', 'Science', 'English', 'History'];

  useEffect(() => {
    const fetchMyGrades = async () => {
      setLoading(true);
      try {
        const { data: me } = await api.get('/auth/me');
        const { data: students } = await api.get('/students');
        const myProfile = students.find(s => s.email === me.email);
        
        if (myProfile) {
          const { data } = await api.get(`/grades?semester=${semester}&studentId=${myProfile.id}`);
          const gradesMap = {};
          data.forEach(record => {
            if (!gradesMap[record.subject]) gradesMap[record.subject] = {};
            gradesMap[record.subject][record.term] = record.grade;
          });
          setGrades(gradesMap);
        }
      } catch (err) { toast.error('Failed to load grades'); } 
      finally { setLoading(false); }
    };
    fetchMyGrades();
  }, [semester]);

  const handlePrint = () => { window.print(); };

  const getAverage = (subjGrades) => {
    if (!subjGrades) return '-';
    const midterm = subjGrades['Midterm'];
    const finals = subjGrades['Finals'];
    if (midterm && finals) return ((midterm + finals) / 2).toFixed(1);
    return '-';
  };

  const getOverallGPA = () => {
    let sum = 0; let count = 0;
    subjects.forEach(s => {
      const avg = parseFloat(getAverage(grades[s]));
      if (!isNaN(avg)) { sum += avg; count++; }
    });
    return count === 0 ? '—' : (sum / count).toFixed(2);
  };

  const gpa = getOverallGPA();

  return (
    <PageWrapper title="My Grades">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <select value={semester} onChange={(e) => setSemester(e.target.value)}
          className="px-4 py-2 bg-surface-alt border border-white/8 rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer">
          <option value="Fall 2026">Fall 2026</option>
          <option value="Spring 2027">Spring 2027</option>
        </select>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all btn-glow text-sm font-semibold">
          <Download className="w-4 h-4" /> Download PDF Transcript
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 print:hidden">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-surface border border-accent/20 flex items-center gap-5 stagger-1">
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 border border-accent/30 shadow-[0_0_15px_rgba(124,111,255,0.3)]">
            <Award className="w-7 h-7 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Term Average</p>
            <h2 className="text-3xl font-heading font-extrabold text-text-primary">{gpa}</h2>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-white/5 flex items-center gap-5 stagger-2">
          <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center flex-shrink-0 border border-white/10">
            <FileText className="w-7 h-7 text-text-muted" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1">Total Subjects</p>
            <h2 className="text-3xl font-heading font-extrabold text-text-primary">{subjects.length}</h2>
          </div>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none print:bg-white print:text-black">
        <div className="hidden print:block mb-10 text-center">
          <h1 className="text-3xl font-heading font-bold text-black mb-2">Official Transcript</h1>
          <p className="text-gray-600 font-semibold">{semester}</p>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-white/5 print:border-gray-300">
          <table className="w-full text-left border-collapse print:text-black">
            <thead>
              <tr className="bg-surface-alt print:bg-gray-100 text-text-muted print:text-black text-xs uppercase tracking-widest">
                <th className="px-5 py-4 font-semibold">Subject</th>
                <th className="px-5 py-4 font-semibold text-center">Midterm</th>
                <th className="px-5 py-4 font-semibold text-center">Finals</th>
                <th className="px-5 py-4 font-semibold text-center text-accent print:text-black">Final Average</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5 print:divide-gray-200">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><div className="skeleton h-4 w-32" /></td>
                    <td className="px-5 py-4"><div className="skeleton h-4 w-12 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="skeleton h-4 w-12 mx-auto" /></td>
                    <td className="px-5 py-4"><div className="skeleton h-4 w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : (
                subjects.map((subject, i) => (
                  <tr key={subject} className="hover:bg-surface-alt/30 print:hover:bg-transparent transition-colors"
                    style={{ animation: `slideInUp 0.3s ease ${i * 0.05}s both` }}>
                    <td className="px-5 py-4 font-bold text-text-primary print:text-black">{subject}</td>
                    <td className="px-5 py-4 text-center text-text-muted print:text-gray-700 font-mono">{grades[subject]?.['Midterm'] || '—'}</td>
                    <td className="px-5 py-4 text-center text-text-muted print:text-gray-700 font-mono">{grades[subject]?.['Finals'] || '—'}</td>
                    <td className="px-5 py-4 text-center font-bold text-accent print:text-black font-mono">
                      <span className="bg-accent/10 print:bg-transparent px-3 py-1.5 rounded-lg">{getAverage(grades[subject])}</span>
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

export default MyGrades;
