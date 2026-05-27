import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Zap, Trophy, Star, BookOpen, Code, Lock, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const QUIZZES = {
  major: [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Test your knowledge of HTML structure and semantic elements.',
      points: 10,
      questions: [
        { q: 'Which HTML tag is used to define an internal style sheet?', options: ['<css>', '<script>', '<style>', '<head>'], answer: 2 },
        { q: 'What does HTML stand for?', options: ['Hyperlinks and Text Markup Language', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyper Tool Markup Language'], answer: 1 },
        { q: 'Which HTML element defines the title of a document?', options: ['<meta>', '<head>', '<title>', '<header>'], answer: 2 },
        { q: 'Which attribute specifies an alternate text for an image?', options: ['title', 'src', 'alt', 'href'], answer: 2 },
        { q: 'How do you create a hyperlink in HTML?', options: ['<a href="url">', '<link href="url">', '<url href="link">', '<href link="url">'], answer: 0 },
      ]
    },
    {
      id: 'css-fundamentals',
      title: 'CSS Fundamentals',
      description: 'Dive into selectors, box model, and layout techniques.',
      points: 10,
      questions: [
        { q: 'Which CSS property controls the text size?', options: ['text-size', 'font-size', 'text-style', 'font-style'], answer: 1 },
        { q: 'How do you add a background color in CSS?', options: ['color: red;', 'background-color: red;', 'bg-color: red;', 'background: red;'], answer: 1 },
        { q: 'Which CSS property is used to change the font of an element?', options: ['font-style', 'font-weight', 'font-family', 'font-size'], answer: 2 },
        { q: 'What does the CSS box model include?', options: ['margin, border, padding, content', 'margin, border, content', 'padding, content, width', 'margin, padding, font'], answer: 0 },
        { q: 'Which value of display makes elements sit side by side?', options: ['block', 'inline-block', 'hidden', 'grid'], answer: 1 },
      ]
    },
    {
      id: 'js-basics',
      title: 'JavaScript Basics',
      description: 'Variables, functions, and control flow in JavaScript.',
      points: 10,
      questions: [
        { q: 'Which keyword declares a block-scoped variable in JS?', options: ['var', 'let', 'def', 'local'], answer: 1 },
        { q: 'What is the output of: console.log(typeof null)?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], answer: 2 },
        { q: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'add()'], answer: 0 },
        { q: 'What is a closure in JavaScript?', options: ['A loop that closes', 'A function with access to its outer scope', 'An error handler', 'A CSS animation'], answer: 1 },
        { q: 'What does "=== " mean in JavaScript?', options: ['Assignment', 'Equal value only', 'Strict equality (value and type)', 'Not equal'], answer: 2 },
      ]
    },
  ],
  minor: [
    {
      id: 'math-algebra',
      title: 'Basic Algebra',
      description: 'Equations, variables, and algebraic expressions.',
      points: 5,
      questions: [
        { q: 'Solve for x: 2x + 4 = 10', options: ['2', '3', '4', '5'], answer: 1 },
        { q: 'What is 5² ?', options: ['10', '15', '20', '25'], answer: 3 },
        { q: 'Simplify: 3(x + 2)', options: ['3x + 2', '3x + 6', 'x + 6', '3x + 5'], answer: 1 },
        { q: 'What is the slope of the line y = 3x + 2?', options: ['2', '3', '1', '0'], answer: 1 },
        { q: 'If x = 4, what is 2x²?', options: ['16', '32', '64', '8'], answer: 1 },
      ]
    },
    {
      id: 'general-knowledge',
      title: 'General Knowledge',
      description: 'Trivia about science, history, and the world.',
      points: 5,
      questions: [
        { q: 'What is the chemical symbol for water?', options: ['WA', 'H2O', 'HO2', 'W2O'], answer: 1 },
        { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2 },
        { q: 'What is the speed of light (approx)?', options: ['300 km/s', '300,000 km/s', '3,000 km/s', '30,000 km/s'], answer: 1 },
        { q: 'Who invented the telephone?', options: ['Edison', 'Tesla', 'Bell', 'Marconi'], answer: 2 },
        { q: 'What is the largest planet in our solar system?', options: ['Saturn', 'Earth', 'Jupiter', 'Neptune'], answer: 2 },
      ]
    },
  ]
};

const QuizCard = ({ quiz, category, onStart, completed }) => {
  const Icon = category === 'major' ? Code : BookOpen;
  return (
    <div className={`relative p-5 rounded-2xl border transition-all group ${completed ? 'border-success/30 bg-success/5' : 'border-white/8 bg-surface hover:border-accent/30 hover:shadow-[0_0_20px_rgba(124,111,255,0.1)] cursor-pointer'}`}
      onClick={() => !completed && onStart(quiz, category)}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category === 'major' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${category === 'major' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'}`}>
            +{quiz.points} pts
          </span>
          {completed && <CheckCircle className="w-5 h-5 text-success" />}
        </div>
      </div>
      <h4 className="font-bold text-text-primary mb-1">{quiz.title}</h4>
      <p className="text-xs text-text-muted leading-relaxed">{quiz.description}</p>
      {!completed && (
        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Start Quiz <ChevronRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

const Playground = () => {
  const [activityPoints, setActivityPoints] = useState(0);
  const [completed, setCompleted] = useState({});
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/game/points').then(r => setActivityPoints(r.data.activityPoints || 0)).catch(() => {});
  }, []);

  const startQuiz = (quiz, category) => {
    setActiveQuiz(quiz);
    setActiveCategory(category);
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    if (currentQ < activeQuiz.questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQ(q => q + 1);
      setSelected(null);
    } else {
      // Calculate score
      const score = newAnswers.filter((a, i) => a === activeQuiz.questions[i].answer).length;
      const total = activeQuiz.questions.length;
      try {
        const { data } = await api.post('/game/submit', { category: activeCategory, score, total });
        setResult({ score, total, ...data });
        setActivityPoints(p => p + (data.pointsEarned || 0));
        if (data.passed) {
          setCompleted(prev => ({ ...prev, [activeQuiz.id]: true }));
          toast.success(`+${data.pointsEarned} Activity Points! 🎉`);
        } else {
          toast.error('Score too low. Try again!');
        }
      } catch {
        toast.error('Failed to submit quiz');
      }
      setShowResult(true);
    }
  };

  const totalQuizzes = QUIZZES.major.length + QUIZZES.minor.length;
  const completedCount = Object.keys(completed).length;

  return (
    <PageWrapper title="Playground">
      {/* Points Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="sm:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-accent/15 via-surface to-surface border border-accent/20 flex items-center gap-5 relative overflow-hidden stagger-1">
          <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-[0_0_20px_rgba(124,111,255,0.3)] flex-shrink-0">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Total Activity Points</p>
            <h2 className="text-5xl font-heading font-extrabold text-text-primary">{activityPoints}</h2>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-white/5 flex flex-col justify-center stagger-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Progress</p>
            <p className="text-xs font-bold text-accent">{completedCount}/{totalQuizzes}</p>
          </div>
          <div className="h-2.5 w-full bg-surface-alt rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(124,111,255,0.5)]"
              style={{ width: `${(completedCount / totalQuizzes) * 100}%` }} />
          </div>
          <p className="text-xs text-text-muted mt-2">{completedCount === totalQuizzes ? '🏆 All quizzes completed!' : `${totalQuizzes - completedCount} quiz${totalQuizzes - completedCount !== 1 ? 'zes' : ''} remaining`}</p>
        </div>
      </div>

      {/* Active Quiz Panel */}
      {activeQuiz && !showResult && (
        <Card className="mb-8 border-accent/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">{activeQuiz.title}</p>
              <p className="text-text-muted text-sm">Question {currentQ + 1} of {activeQuiz.questions.length}</p>
            </div>
            <div className="flex items-center gap-2">
              {activeQuiz.questions.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentQ ? 'w-6 bg-accent' : i < currentQ ? 'w-3 bg-success' : 'w-3 bg-surface-alt'}`} />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-6 leading-snug">{activeQuiz.questions[currentQ].q}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeQuiz.questions[currentQ].options.map((opt, i) => {
              const isCorrect = i === activeQuiz.questions[currentQ].answer;
              const isSelected = selected === i;
              let style = 'border-white/8 bg-surface-alt hover:border-accent/40 cursor-pointer';
              if (selected !== null) {
                if (isCorrect) style = 'border-success/50 bg-success/10 cursor-default';
                else if (isSelected) style = 'border-danger/50 bg-danger/10 cursor-default';
                else style = 'border-white/5 bg-surface-alt/30 opacity-50 cursor-default';
              }
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-xl border font-medium text-text-primary transition-all ${style}`}>
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected || (selected !== null && isCorrect) ? 'bg-current text-white' : 'bg-surface border border-white/10'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {selected !== null && isCorrect && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
                    {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-danger ml-auto" />}
                  </span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="flex justify-end" style={{ animation: 'scaleIn 0.2s ease' }}>
              <button onClick={handleNext}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all btn-glow flex items-center gap-2">
                {currentQ < activeQuiz.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Result Panel */}
      {showResult && result && (
        <Card className="mb-8 text-center" style={{ animation: 'scaleIn 0.3s ease' }}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-success/15 border-2 border-success/30 shadow-[0_0_25px_rgba(34,197,94,0.3)]' : 'bg-danger/15 border-2 border-danger/30'}`}>
            {result.passed ? <Trophy className="w-10 h-10 text-success" /> : <RotateCcw className="w-10 h-10 text-danger" />}
          </div>
          <h3 className={`text-2xl font-heading font-extrabold mb-2 ${result.passed ? 'text-success' : 'text-danger'}`}>
            {result.passed ? 'Quiz Passed!' : 'Not Quite!'}
          </h3>
          <p className="text-text-muted mb-2">{result.message}</p>
          <p className="text-4xl font-heading font-extrabold text-text-primary mb-6">{result.score}/{result.total}</p>
          <div className="flex justify-center gap-3">
            {!result.passed && (
              <button onClick={() => startQuiz(activeQuiz, activeCategory)}
                className="px-5 py-2 bg-surface-alt border border-white/10 hover:border-accent/30 text-text-primary font-semibold rounded-xl transition-all flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            )}
            <button onClick={() => { setActiveQuiz(null); setShowResult(false); }}
              className="px-5 py-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all btn-glow">
              Back to Quizzes
            </button>
          </div>
        </Card>
      )}

      {/* Quiz Grid */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center"><Code className="w-4 h-4 text-accent" /></div>
            <div>
              <h3 className="font-heading font-bold text-text-primary">Major Subjects</h3>
              <p className="text-xs text-text-muted">IT & Web Development — 10 pts each</p>
            </div>
            <span className="ml-auto text-xs font-bold bg-accent/10 text-accent px-2.5 py-1 rounded-full">+10 pts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUIZZES.major.map((quiz, i) => (
              <div key={quiz.id} style={{ animation: `slideInUp 0.3s ease ${i * 0.07}s both` }}>
                <QuizCard quiz={quiz} category="major" onStart={startQuiz} completed={!!completed[quiz.id]} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center"><BookOpen className="w-4 h-4 text-warning" /></div>
            <div>
              <h3 className="font-heading font-bold text-text-primary">Minor Subjects</h3>
              <p className="text-xs text-text-muted">Math, Science & General Knowledge — 5 pts each</p>
            </div>
            <span className="ml-auto text-xs font-bold bg-warning/10 text-warning px-2.5 py-1 rounded-full">+5 pts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUIZZES.minor.map((quiz, i) => (
              <div key={quiz.id} style={{ animation: `slideInUp 0.3s ease ${i * 0.07}s both` }}>
                <QuizCard quiz={quiz} category="minor" onStart={startQuiz} completed={!!completed[quiz.id]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Playground;
