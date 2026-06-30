import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain, Target, TrendingUp, AlertTriangle, Library,
  ArrowRight, GraduationCap, Users, BookOpen, Zap, CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    color: '#4f46e5',
    bg: '#eef2ff',
    title: 'Smart Study Plans',
    desc: 'Get personalized study plans tailored to your topic, learning goal, and available time.',
  },
  {
    icon: Zap,
    color: '#7c3aed',
    bg: '#f5f3ff',
    title: 'AI Quiz Generation',
    desc: 'Generate interactive multiple-choice quizzes instantly from any topic you are studying.',
  },
  {
    icon: TrendingUp,
    color: '#059669',
    bg: '#ecfdf5',
    title: 'Progress Tracking',
    desc: 'Track subject completion, quiz scores, and overall learning progress in real time.',
  },
  {
    icon: AlertTriangle,
    color: '#d97706',
    bg: '#fffbeb',
    title: 'Weak Area Detection',
    desc: 'Identify topics and concepts you need to review based on your quiz performance.',
  },
  {
    icon: Library,
    color: '#0891b2',
    bg: '#ecfeff',
    title: 'Learning Resources',
    desc: 'Access curated online materials organized by subject and education level.',
  },
];

const steps = [
  { num: '01', title: 'Add Subjects', desc: 'Create your subjects — Mathematics, Biology, English, and more.' },
  { num: '02', title: 'Create Topics', desc: 'Break each subject into focused topics you need to study.' },
  { num: '03', title: 'Generate Study Plan', desc: 'Get a personalized plan tailored to your learning goal.' },
  { num: '04', title: 'Take Quizzes', desc: 'Test your understanding with AI-generated quiz questions.' },
  { num: '05', title: 'Track Progress', desc: 'Review scores, spot weak areas, and keep improving.' },
];

const audiences = [
  { icon: GraduationCap, label: 'University Students', desc: 'Manage coursework and exam prep' },
  { icon: BookOpen, label: 'High Schoolers', desc: 'Prepare for tests and build strong habits' },
  { icon: Users, label: 'Elementary Pupils', desc: 'Learn basics in a fun, structured way' },
  { icon: Target, label: 'Self-Learners', desc: 'Study any topic at your own pace' },
];

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <GraduationCap size={22} color="#4f46e5" />
          <span>Study Coach AI</span>
        </div>
        <div className="landing-nav__links">
          <Link to="/login" className="landing-nav__login">Sign In</Link>
          <Link to="/register" className="btn btn--primary">Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">
            <Zap size={13} />
            AI-Powered Learning Assistant
          </div>
          <h1 className="hero__title">
            Study Smarter.<br />
            Learn Faster.<br />
            <span className="hero__title-accent">Achieve More.</span>
          </h1>
          <p className="hero__subtitle">
            Study Coach AI helps students of all ages organize their learning, generate personalized study plans, take interactive quizzes, and track their progress — all in one beautiful platform.
          </p>
          <div className="hero__cta">
            <Link to="/register" className="btn btn--primary hero__btn-main">
              Start Learning Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn--ghost hero__btn-secondary">
              Sign In
            </Link>
          </div>
          <div className="hero__proof">
            <CheckCircle size={15} color="#10b981" />
            <span>Free to use · No credit card required · Works for all grade levels</span>
          </div>
        </div>

        {/* HERO VISUAL — mock dashboard cards */}
        <div className="hero__visual">
          <div className="hero__card-stack">
            <div className="hero__card hero__card--1">
              <div className="hero__card-icon">📊</div>
              <div style={{ flex: 1 }}>
                <div className="hero__card-title">Overall Progress</div>
                <div className="hero__card-value">72%</div>
                <div className="hero__progress-bar">
                  <div className="hero__progress-fill" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
            <div className="hero__card hero__card--2">
              <div className="hero__card-icon">✅</div>
              <div>
                <div className="hero__card-title">Quiz Score</div>
                <div className="hero__card-value" style={{ color: '#059669' }}>85%</div>
              </div>
            </div>
            <div className="hero__card hero__card--3">
              <div className="hero__card-icon">📚</div>
              <div>
                <div className="hero__card-title">Subjects</div>
                <div className="hero__card-value">6</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Everything you need to study effectively</h2>
          <p className="landing-section__sub">
            One platform for organizing, planning, testing, and tracking your learning journey.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-card__icon" style={{ background: f.bg }}>
                  <Icon size={22} color={f.color} />
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section landing-section--gray">
        <div className="landing-section__header">
          <h2 className="landing-section__title">How it works</h2>
          <p className="landing-section__sub">
            Get started in minutes and build a solid study routine step by step.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-card__num">{step.num}</div>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="landing-section">
        <div className="landing-section__header">
          <h2 className="landing-section__title">Built for every learner</h2>
          <p className="landing-section__sub">
            Whether you're in elementary school or university, Study Coach AI adapts to your needs.
          </p>
        </div>
        <div className="audience-grid">
          {audiences.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="audience-card">
                <div className="audience-card__icon-wrap">
                  <Icon size={26} />
                </div>
                <h3 className="audience-card__label">{a.label}</h3>
                <p className="audience-card__desc">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2 className="landing-cta__title">Ready to take control of your learning?</h2>
        <p className="landing-cta__sub">
          Join students who are studying smarter with Study Coach AI.
        </p>
        <Link to="/register" className="btn landing-cta__btn">
          Create Your Free Account
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <GraduationCap size={16} color="#4f46e5" />
          <span>Study Coach AI</span>
        </div>
        <p className="landing-footer__copy">© 2024 Study Coach AI. Built for students.</p>
      </footer>
    </div>
  );
};

export default Landing;
