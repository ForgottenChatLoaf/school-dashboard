import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Schedule = () => {
  const { user } = useAuth();
  
  const scheduleData = [
    { id: 1, time: '08:00 AM - 09:30 AM', subject: 'Web Development 101', room: 'Room 302', type: 'Major' },
    { id: 2, time: '09:45 AM - 11:15 AM', subject: 'Advanced CSS', room: 'Lab A', type: 'Major' },
    { id: 3, time: '11:30 AM - 12:30 PM', subject: 'Basic Algebra', room: 'Room 105', type: 'Minor' },
    { id: 4, time: '01:30 PM - 03:00 PM', subject: 'JavaScript Fundamentals', room: 'Lab B', type: 'Major' },
  ];

  return (
    <PageWrapper title="My Schedule">
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-surface to-surface border border-accent/20 relative overflow-hidden stagger-1">
        <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(124,111,255,0.2)]">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-text-primary">Weekly Timetable</h2>
            <p className="text-sm text-text-muted">Viewing schedule for {user?.role === 'teacher' ? 'Instructor' : 'Student'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {scheduleData.map((item, i) => (
          <div key={item.id} style={{ animation: `slideInUp 0.3s ease ${i * 0.1}s both` }}>
            <Card className="hover:border-accent/30 transition-all hover:shadow-[0_0_20px_rgba(124,111,255,0.05)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-alt flex flex-col items-center justify-center border border-white/5 flex-shrink-0">
                    <span className="text-[10px] text-text-muted font-bold uppercase">{item.time.split(' ')[1]}</span>
                    <span className="text-sm font-bold text-text-primary">{item.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
                      {item.subject}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.type === 'Major' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'}`}>
                        {item.type}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mt-1.5 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.room}</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-surface-alt hover:bg-surface-alt/80 border border-white/10 text-text-primary text-xs font-semibold rounded-lg transition-all">
                  View Details
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default Schedule;
