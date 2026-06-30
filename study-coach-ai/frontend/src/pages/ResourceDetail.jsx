import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  ArrowLeft, Clock, CheckCircle, ChevronRight, BookOpen,
  Target, ClipboardList, Lightbulb, Brain, Plus, Loader,
  XCircle,
} from 'lucide-react';
import { RESOURCES, levelBadgeClass } from '../data/resourcesData';

// ─── Markdown-lite renderer ───────────────────────────────────────────────────

const renderContent = (text) =>
  text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="rd-h2">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="rd-h3">{line.slice(4)}</h3>;
    if (line.startsWith('#### ')) return <h4 key={i} className="rd-h4">{line.slice(5)}</h4>;
    if (line.startsWith('- ')) {
      const html = line.slice(2).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return <li key={i} className="rd-li" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (line.startsWith('| ') || line.startsWith('|---')) return <p key={i} className="rd-table-row">{line}</p>;
    if (line.startsWith('```')) return <div key={i} className="rd-code-fence" />;
    if (line.trim() === '') return <br key={i} />;
    if (line.trim() === '---') return <hr key={i} className="rd-hr" />;
    const html = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    return <p key={i} className="rd-p" dangerouslySetInnerHTML={{ __html: html }} />;
  });

// ─── Self-check quiz generator ────────────────────────────────────────────────

function buildSelfCheck(resource) {
  const questions = [];

  // Build from keyPoints
  resource.keyPoints.forEach((point, i) => {
    const words = point.split(' ').filter((w) => w.length > 4);
    if (words.length < 3) return;
    const blankIdx = Math.floor(words.length / 2);
    const blank = words[blankIdx];
    const masked = point.replace(blank, '______');
    const options = shuffleArr([
      blank,
      ...resource.keyPoints
        .filter((_, j) => j !== i)
        .flatMap((p) => p.split(' ').filter((w) => w.length > 4))
        .slice(0, 3),
    ]).slice(0, 4);
    if (options.length === 4 && options.includes(blank)) {
      questions.push({ question: `Complete: "${masked}"`, options, answer: blank, source: point });
    }
  });

  // Build from practice items
  resource.recommendedPractice.forEach((practice, i) => {
    if (i >= 2) return;
    questions.push({
      question: `Which of the following best matches this recommended activity: "${practice.substring(0, 80)}..."?`,
      options: shuffleArr([
        'Study and apply the concept described',
        'Skip this and move to the next topic',
        'Only read about it without practicing',
        'Ask someone else to do this for you',
      ]),
      answer: 'Study and apply the concept described',
      source: practice,
    });
  });

  return questions.slice(0, 5);
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Main component ───────────────────────────────────────────────────────────

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const resource = RESOURCES.find((r) => r.id === parseInt(id, 10));

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [planMsg, setPlanMsg] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [planSuccess, setPlanSuccess] = useState(false);

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Progress tracking
  const [progress, setProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('resource_progress') || '{}');
      return saved[id] || { started: false, completed: false, score: null };
    } catch { return { started: false, completed: false, score: null }; }
  });

  useEffect(() => {
    // Mark as started
    if (resource && !progress.started) {
      const updated = { ...progress, started: true };
      setProgress(updated);
      saveProgress(updated);
    }
  }, []);

  useEffect(() => {
    api.get('/subjects').then(({ data }) => setSubjects(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      api.get(`/topics/subject/${selectedSubject}`)
        .then(({ data }) => setTopics(data))
        .catch(() => setTopics([]));
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
  }, [selectedSubject]);

  const saveProgress = (p) => {
    try {
      const all = JSON.parse(localStorage.getItem('resource_progress') || '{}');
      all[id] = p;
      localStorage.setItem('resource_progress', JSON.stringify(all));
    } catch {}
  };

  if (!resource) {
    return (
      <div className="page">
        <div className="alert alert--error">Resource not found.</div>
        <Link to="/resources" className="btn btn--ghost" style={{ marginTop: 16 }}>
          <ArrowLeft size={14} /> Back to Resources
        </Link>
      </div>
    );
  }

  // ─── Add to study plan ────────────────────────────────────────────────────

  const handleAddToPlan = async () => {
    setPlanLoading(true);
    setPlanMsg('');
    try {
      await api.post('/study-plans', {
        title: `Study Plan: ${resource.title}`,
        learningGoal: `Complete and understand the resource: ${resource.title}`,
        availableTime: resource.time,
        plan: `## ${resource.title}\n\n${resource.content.substring(0, 500)}...`,
        recommendations: resource.recommendedPractice,
        subjectId: selectedSubject || undefined,
        topicId: selectedTopic || undefined,
      });
      setPlanSuccess(true);
      setPlanMsg('Added to your study plans!');
    } catch (err) {
      setPlanMsg(err.response?.data?.message || 'Failed to add to study plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  // ─── Self-check quiz ──────────────────────────────────────────────────────

  const startQuiz = () => {
    const qs = buildSelfCheck(resource);
    setQuestions(qs);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setQuizMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pickAnswer = (qi, opt) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qi]: opt }));
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    const pct = Math.round((correct / questions.length) * 100);
    setScore({ correct, total: questions.length, pct });
    setSubmitted(true);
    // Save progress
    const updated = { ...progress, completed: true, score: pct };
    setProgress(updated);
    saveProgress(updated);
  };

  const Icon = resource.icon;

  // ─── Quiz view ────────────────────────────────────────────────────────────

  if (quizMode) {
    return (
      <div className="page">
        <div className="rd-quiz-header">
          <button className="btn btn--ghost btn--sm" onClick={() => setQuizMode(false)}>
            <ArrowLeft size={14} /> Back to Resource
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>Self-Check: {resource.title}</h1>
        </div>

        {!submitted ? (
          <>
            <p className="rd-quiz-intro">
              Test your understanding of <strong>{resource.title}</strong>.
              Answer all questions, then submit to see your score.
            </p>
            {questions.length === 0 ? (
              <div className="alert alert--error">
                Not enough content to generate questions. Please read the material first.
              </div>
            ) : (
              questions.map((q, qi) => (
                <div key={qi} className="rd-question-card">
                  <p className="rd-question-text">
                    <span className="rd-question-num">{qi + 1}.</span> {q.question}
                  </p>
                  <div className="rd-options">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        className={`rd-option ${answers[qi] === opt ? 'rd-option--chosen' : ''}`}
                        onClick={() => pickAnswer(qi, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
            {questions.length > 0 && (
              <button
                className="btn btn--primary"
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < questions.length}
                style={{ marginTop: 24 }}
              >
                Submit Answers
              </button>
            )}
          </>
        ) : (
          <div className="rd-result">
            <div className={`rd-result__banner ${score.pct >= 70 ? 'rd-result__banner--pass' : 'rd-result__banner--fail'}`}>
              {score.pct >= 70 ? <CheckCircle size={28} /> : <XCircle size={28} />}
              <div>
                <div className="rd-result__score">{score.pct}%</div>
                <div className="rd-result__label">
                  {score.correct}/{score.total} correct —{' '}
                  {score.pct >= 70 ? 'Great understanding!' : 'Review the material and try again.'}
                </div>
              </div>
            </div>

            <div className="rd-result__review">
              {questions.map((q, qi) => {
                const correct = answers[qi] === q.answer;
                return (
                  <div key={qi} className={`rd-review-item ${correct ? 'rd-review-item--pass' : 'rd-review-item--fail'}`}>
                    <p className="rd-review-item__q"><strong>{qi + 1}.</strong> {q.question}</p>
                    {!correct && (
                      <>
                        <p className="rd-review-item__wrong">Your answer: {answers[qi] || '—'}</p>
                        <p className="rd-review-item__correct">Correct: {q.answer}</p>
                        {q.source && (
                          <div className="rd-source-quote">
                            <span className="rd-source-quote__label">From the resource:</span>
                            <span className="rd-source-quote__text">"{q.source}"</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rd-result__actions">
              <button className="btn btn--ghost" onClick={() => { setSubmitted(false); setAnswers({}); setScore(null); }}>
                Retry Quiz
              </button>
              <button className="btn btn--ghost" onClick={() => setQuizMode(false)}>
                Back to Resource
              </button>
              <Link className="btn btn--primary" to="/resources">
                Browse More Resources
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Main detail view ─────────────────────────────────────────────────────

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="td-breadcrumb">
        <Link to="/resources" className="td-breadcrumb__link">
          <ArrowLeft size={14} /> Resources
        </Link>
        <ChevronRight size={14} className="td-breadcrumb__sep" />
        <span>{resource.title}</span>
      </div>

      <div className="rd-layout">
        {/* ── Main content column ── */}
        <div className="rd-main">
          {/* Header */}
          <div className="rd-hero">
            <div className="rd-hero__icon" style={{ background: resource.bg }}>
              <Icon size={28} color={resource.color} />
            </div>
            <div className="rd-hero__info">
              <div className="rd-hero__badges">
                <span className="badge badge--gray">{resource.category}</span>
                <span className={`badge ${levelBadgeClass(resource.level)}`}>{resource.level}</span>
                {progress.completed && (
                  <span className="badge badge--green">
                    <CheckCircle size={11} style={{ marginRight: 3 }} />
                    Completed {progress.score !== null ? `· ${progress.score}%` : ''}
                  </span>
                )}
              </div>
              <h1 className="rd-hero__title">{resource.title}</h1>
              <p className="rd-hero__desc">{resource.desc}</p>
              <div className="rd-hero__meta">
                <span><Clock size={13} /> {resource.time}</span>
                <span><Target size={13} /> {resource.keyPoints.length} key points</span>
                <span><ClipboardList size={13} /> {resource.recommendedPractice.length} practice tasks</span>
              </div>
            </div>
          </div>

          {/* Learning Content */}
          <div className="card rd-content-card">
            <div className="rd-content-header">
              <BookOpen size={16} />
              <h2>Learning Content</h2>
            </div>
            <div className="rd-content-body">
              {renderContent(resource.content)}
            </div>
          </div>

          {/* Key Points */}
          <div className="card rd-section-card">
            <div className="rd-content-header">
              <Lightbulb size={16} />
              <h2>Key Points to Remember</h2>
            </div>
            <ul className="rd-keypoints">
              {resource.keyPoints.map((point, i) => (
                <li key={i} className="rd-keypoint">
                  <CheckCircle size={15} className="rd-keypoint__icon" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Practice */}
          <div className="card rd-section-card">
            <div className="rd-content-header">
              <ClipboardList size={16} />
              <h2>Recommended Practice</h2>
            </div>
            <ol className="rd-practice-list">
              {resource.recommendedPractice.map((item, i) => (
                <li key={i} className="rd-practice-item">
                  <span className="rd-practice-num">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="rd-sidebar">
          {/* Quick actions */}
          <div className="rd-sidebar-card">
            <h3 className="rd-sidebar-card__title">Actions</h3>
            <button
              className="rd-action-btn rd-action-btn--quiz"
              onClick={startQuiz}
            >
              <Brain size={16} /> Self-Check Quiz
            </button>
            <p className="rd-action-hint">Test your understanding with practice questions from this resource</p>
          </div>

          {/* Add to Study Plan */}
          <div className="rd-sidebar-card">
            <h3 className="rd-sidebar-card__title">
              <Plus size={14} /> Add to Study Plan
            </h3>
            <div className="rd-plan-form">
              <label className="form-label" style={{ fontSize: 12 }}>Subject (optional)</label>
              <select
                className="form-input"
                style={{ fontSize: 13 }}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">No subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>

              {selectedSubject && (
                <>
                  <label className="form-label" style={{ fontSize: 12, marginTop: 8 }}>Topic (optional)</label>
                  <select
                    className="form-input"
                    style={{ fontSize: 13 }}
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  >
                    <option value="">No topic</option>
                    {topics.map((t) => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </>
              )}

              {planMsg && (
                <div className={`alert ${planSuccess ? 'alert--success' : 'alert--error'}`} style={{ marginTop: 8, fontSize: 12 }}>
                  {planMsg}
                </div>
              )}

              <button
                className="rd-action-btn rd-action-btn--plan"
                style={{ marginTop: 10 }}
                onClick={handleAddToPlan}
                disabled={planLoading || planSuccess}
              >
                {planLoading
                  ? <><Loader size={14} className="spin" /> Adding...</>
                  : planSuccess
                  ? <><CheckCircle size={14} /> Added!</>
                  : <><Plus size={14} /> Add to Study Plan</>}
              </button>
            </div>
          </div>

          {/* Related subjects */}
          {resource.relatedSubjects?.length > 0 && (
            <div className="rd-sidebar-card">
              <h3 className="rd-sidebar-card__title">Related Subjects</h3>
              <div className="td-concepts">
                {resource.relatedSubjects.map((s) => (
                  <span key={s} className="td-concept-badge">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="rd-sidebar-card">
            <h3 className="rd-sidebar-card__title">More Resources</h3>
            {RESOURCES.filter((r) => r.category === resource.category && r.id !== resource.id)
              .slice(0, 3)
              .map((r) => {
                const RIcon = r.icon;
                return (
                  <Link key={r.id} to={`/resources/${r.id}`} className="rd-related-link">
                    <RIcon size={13} style={{ color: r.color, flexShrink: 0 }} />
                    <span>{r.title}</span>
                  </Link>
                );
              })}
            <Link to="/resources" className="btn btn--ghost btn--sm" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={13} /> All Resources
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ResourceDetail;
