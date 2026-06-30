import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  uploadLectureToTopic,
  getTopicLectures,
  generateQuizFromLecture,
  generateStudyPlanFromLecture,
  deleteLecture,
} from '../api/lectureApi';
import Loading from '../components/Loading';
import {
  ArrowLeft, Upload, FileText, Brain, BookOpen, CheckCircle,
  XCircle, ChevronRight, Loader, Trash2, ClipboardList, Target,
  Lightbulb, BookMarked,
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

const statusLabel = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' };
const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const statusClass = { not_started: 'badge--gray', in_progress: 'badge--blue', completed: 'badge--green' };
const difficultyClass = { easy: 'badge--green', medium: 'badge--yellow', hard: 'badge--red' };

// ─── component ────────────────────────────────────────────────────────────────

const TopicDetail = () => {
  const { topicId } = useParams();

  const [topic, setTopic] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // selected lecture + quiz/plan state
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [phase, setPhase] = useState('lecture'); // lecture | quiz | result | plan
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [topicRes, lecturesRes] = await Promise.all([
          api.get(`/topics/${topicId}`),
          getTopicLectures(topicId),
        ]);
        setTopic(topicRes.data);
        setLectures(lecturesRes.data);
      } catch {
        setPageError('Failed to load topic details.');
      } finally {
        setPageLoading(false);
      }
    })();
  }, [topicId]);

  // ─── upload ────────────────────────────────────────────────────────────────

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file.');
      return;
    }
    setUploadError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('pdf', file);
    try {
      const { data } = await uploadLectureToTopic(topicId, fd);
      setLectures((prev) => [data, ...prev]);
      openLecture(data);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // ─── lecture selection ─────────────────────────────────────────────────────

  const openLecture = (lec) => {
    setSelectedLecture(lec);
    setPhase('lecture');
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setPlan(null);
    setQuizError('');
    setPlanError('');
  };

  const handleDeleteLecture = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this lecture?')) return;
    try {
      await deleteLecture(id);
      setLectures((prev) => prev.filter((l) => l._id !== id));
      if (selectedLecture?._id === id) {
        setSelectedLecture(null);
        setPhase('lecture');
      }
    } catch {
      // silent — won't break the page
    }
  };

  // ─── quiz ──────────────────────────────────────────────────────────────────

  const startQuiz = async () => {
    setQuizLoading(true);
    setQuizError('');
    try {
      const { data } = await generateQuizFromLecture(selectedLecture._id);
      setQuiz(data);
      setAnswers({});
      setSubmitted(false);
      setPhase('quiz');
    } catch (err) {
      setQuizError(err.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  const pickAnswer = (qi, opt) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qi]: opt }));
  };

  const submitQuiz = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const pct = Math.round((correct / quiz.questions.length) * 100);
    setScore({ correct, total: quiz.questions.length, pct });
    setSubmitted(true);
    setPhase('result');
  };

  // ─── study plan ────────────────────────────────────────────────────────────

  const startPlan = async () => {
    setPlanLoading(true);
    setPlanError('');
    try {
      const { data } = await generateStudyPlanFromLecture(selectedLecture._id);
      setPlan(data);
      setPhase('plan');
    } catch (err) {
      setPlanError(err.response?.data?.message || 'Failed to generate study plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  // ─── render ────────────────────────────────────────────────────────────────

  if (pageLoading) return <Loading />;
  if (pageError) return (
    <div className="page">
      <div className="alert alert--error">{pageError}</div>
      <Link to="/topics" className="btn btn--ghost" style={{ marginTop: 16 }}>
        <ArrowLeft size={16} /> Back to Topics
      </Link>
    </div>
  );

  return (
    <div className="page">
      {/* breadcrumb */}
      <div className="td-breadcrumb">
        <Link to="/topics" className="td-breadcrumb__link">
          <ArrowLeft size={14} /> Topics
        </Link>
        <ChevronRight size={14} className="td-breadcrumb__sep" />
        <span>{topic.title}</span>
      </div>

      {/* topic header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{topic.title}</h1>
          {topic.description && <p className="page-subtitle">{topic.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`badge ${statusClass[topic.status]}`}>{statusLabel[topic.status]}</span>
          <span className={`badge ${difficultyClass[topic.difficulty]}`}>{difficultyLabel[topic.difficulty]}</span>
          {topic.subjectId?.name && (
            <span className="badge badge--indigo">{topic.subjectId.name}</span>
          )}
        </div>
      </div>

      <div className="td-layout">
        {/* ── LEFT: upload + lecture list ── */}
        <aside className="td-sidebar">
          <div className="td-sidebar__title">
            <BookOpen size={16} />
            Lecture Materials
          </div>

          {/* upload dropzone */}
          <div
            className={`td-dropzone ${dragOver ? 'td-dropzone--over' : ''} ${uploading ? 'td-dropzone--busy' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !uploading && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {uploading ? (
              <>
                <Loader size={22} className="spin" />
                <span className="td-dropzone__text">Analyzing PDF...</span>
              </>
            ) : (
              <>
                <Upload size={22} />
                <span className="td-dropzone__text">Drop PDF or click to upload</span>
                <span className="td-dropzone__hint">Max 10 MB · PDF only</span>
              </>
            )}
          </div>

          {uploadError && <div className="alert alert--error" style={{ marginTop: 8 }}>{uploadError}</div>}

          {/* lectures list */}
          {lectures.length === 0 ? (
            <div className="td-empty-lectures">
              <FileText size={20} />
              <p>No lectures yet. Upload a PDF to get started.</p>
            </div>
          ) : (
            <ul className="td-lecture-list">
              {lectures.map((lec) => (
                <li
                  key={lec._id}
                  className={`td-lecture-item ${selectedLecture?._id === lec._id ? 'td-lecture-item--active' : ''}`}
                  onClick={() => openLecture(lec)}
                >
                  <FileText size={14} className="td-lecture-item__icon" />
                  <div className="td-lecture-item__body">
                    <div className="td-lecture-item__title">{lec.title}</div>
                    <div className="td-lecture-item__meta">{lec.wordCount?.toLocaleString()} words</div>
                  </div>
                  <button
                    className="td-lecture-item__del"
                    onClick={(e) => handleDeleteLecture(lec._id, e)}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* ── RIGHT: detail panel ── */}
        <section className="td-main">
          {!selectedLecture ? (
            <div className="td-empty-main">
              <Brain size={36} />
              <h3>Select or upload a lecture</h3>
              <p>Upload a PDF lecture file to generate quizzes and study plans based entirely on its content.</p>
            </div>
          ) : phase === 'lecture' ? (
            <LectureDetail
              lecture={selectedLecture}
              quizLoading={quizLoading}
              quizError={quizError}
              planLoading={planLoading}
              planError={planError}
              onQuiz={startQuiz}
              onPlan={startPlan}
            />
          ) : phase === 'quiz' ? (
            <QuizPanel
              quiz={quiz}
              answers={answers}
              submitted={submitted}
              onPick={pickAnswer}
              onSubmit={submitQuiz}
              onBack={() => setPhase('lecture')}
            />
          ) : phase === 'result' ? (
            <ResultPanel
              score={score}
              quiz={quiz}
              answers={answers}
              onRetry={() => { setAnswers({}); setSubmitted(false); setPhase('quiz'); }}
              onBack={() => setPhase('lecture')}
              onPlan={startPlan}
              planLoading={planLoading}
            />
          ) : phase === 'plan' ? (
            <PlanPanel
              plan={plan}
              lecture={selectedLecture}
              onBack={() => setPhase('lecture')}
              onQuiz={startQuiz}
              quizLoading={quizLoading}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
};

// ─── LectureDetail ────────────────────────────────────────────────────────────

const LectureDetail = ({ lecture, quizLoading, quizError, planLoading, planError, onQuiz, onPlan }) => (
  <div className="td-lecture-detail">
    <div className="td-ld__header">
      <div className="td-ld__pdf-badge">
        <FileText size={14} /> PDF
      </div>
      <h2 className="td-ld__title">{lecture.title}</h2>
      <span className="td-ld__words">{lecture.wordCount?.toLocaleString()} words extracted</span>
    </div>

    {lecture.summary && (
      <div className="td-section">
        <h3 className="td-section__heading"><BookMarked size={15} /> Summary</h3>
        <p className="td-section__text">{lecture.summary}</p>
      </div>
    )}

    {lecture.keyConcepts?.length > 0 && (
      <div className="td-section">
        <h3 className="td-section__heading"><Lightbulb size={15} /> Key Concepts</h3>
        <div className="td-concepts">
          {lecture.keyConcepts.map((c) => (
            <span key={c} className="td-concept-badge">{c}</span>
          ))}
        </div>
      </div>
    )}

    {lecture.learningObjectives?.length > 0 && (
      <div className="td-section">
        <h3 className="td-section__heading"><Target size={15} /> Learning Objectives</h3>
        <ul className="td-list">
          {lecture.learningObjectives.map((obj, i) => (
            <li key={i} className="td-list__item">
              <CheckCircle size={14} className="td-list__icon td-list__icon--check" />
              {obj}
            </li>
          ))}
        </ul>
      </div>
    )}

    {lecture.whatStudentShouldLearn?.length > 0 && (
      <div className="td-section">
        <h3 className="td-section__heading"><ClipboardList size={15} /> What You Should Learn</h3>
        <ul className="td-list">
          {lecture.whatStudentShouldLearn.map((item, i) => (
            <li key={i} className="td-list__item">
              <ChevronRight size={14} className="td-list__icon" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    )}

    {(quizError || planError) && (
      <div className="alert alert--error">{quizError || planError}</div>
    )}

    <div className="td-actions">
      <button className="td-action-btn td-action-btn--quiz" onClick={onQuiz} disabled={quizLoading || planLoading}>
        {quizLoading ? <><Loader size={16} className="spin" /> Generating Quiz...</> : <><Brain size={16} /> Generate Quiz</>}
      </button>
      <button className="td-action-btn td-action-btn--plan" onClick={onPlan} disabled={quizLoading || planLoading}>
        {planLoading ? <><Loader size={16} className="spin" /> Generating Plan...</> : <><BookOpen size={16} /> Generate Study Plan</>}
      </button>
    </div>
    <p className="td-source-note">All quiz questions and study plan content are generated exclusively from the uploaded PDF.</p>
  </div>
);

// ─── QuizPanel ────────────────────────────────────────────────────────────────

const QuizPanel = ({ quiz, answers, submitted, onPick, onSubmit, onBack }) => {
  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);
  return (
    <div className="td-quiz">
      <div className="td-quiz__header">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="td-quiz__title">{quiz.title}</h2>
        <span className="td-pdf-badge"><FileText size={12} /> All questions from your PDF</span>
      </div>

      {quiz.questions.map((q, qi) => (
        <div key={qi} className="td-question">
          <p className="td-question__text"><span className="td-question__num">{qi + 1}.</span> {q.question}</p>
          <div className="td-options">
            {q.options.map((opt) => {
              const chosen = answers[qi] === opt;
              const isCorrect = opt === q.correctAnswer;
              let cls = 'td-option';
              if (submitted) {
                if (isCorrect) cls += ' td-option--correct';
                else if (chosen) cls += ' td-option--wrong';
              } else if (chosen) {
                cls += ' td-option--chosen';
              }
              return (
                <button key={opt} className={cls} onClick={() => onPick(qi, opt)} disabled={submitted}>
                  {submitted && isCorrect && <CheckCircle size={14} />}
                  {submitted && chosen && !isCorrect && <XCircle size={14} />}
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && answers[qi] !== q.correctAnswer && q.sourceText && (
            <div className="td-source-quote">
              <span className="td-source-quote__label">Lecture source:</span>
              <span className="td-source-quote__text">"{q.sourceText}"</span>
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button className="btn btn--primary" onClick={onSubmit} disabled={!allAnswered} style={{ marginTop: 24 }}>
          Submit Quiz
        </button>
      )}
    </div>
  );
};

// ─── ResultPanel ──────────────────────────────────────────────────────────────

const ResultPanel = ({ score, quiz, answers, onRetry, onBack, onPlan, planLoading }) => {
  const passed = score.pct >= 70;
  return (
    <div className="td-result">
      <div className={`td-result__banner ${passed ? 'td-result__banner--pass' : 'td-result__banner--fail'}`}>
        {passed ? <CheckCircle size={28} /> : <XCircle size={28} />}
        <div>
          <div className="td-result__score">{score.pct}%</div>
          <div className="td-result__label">
            {score.correct}/{score.total} correct — {passed ? 'Great work!' : 'Keep studying!'}
          </div>
        </div>
      </div>

      <div className="td-result__review">
        {quiz.questions.map((q, qi) => {
          const correct = answers[qi] === q.correctAnswer;
          return (
            <div key={qi} className={`td-review-item ${correct ? 'td-review-item--pass' : 'td-review-item--fail'}`}>
              <p className="td-review-item__q"><strong>{qi + 1}.</strong> {q.question}</p>
              {!correct && (
                <>
                  <p className="td-review-item__wrong">Your answer: {answers[qi] || '—'}</p>
                  <p className="td-review-item__correct">Correct: {q.correctAnswer}</p>
                  {q.sourceText && (
                    <div className="td-source-quote">
                      <span className="td-source-quote__label">Lecture source:</span>
                      <span className="td-source-quote__text">"{q.sourceText}"</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="td-result__actions">
        <button className="btn btn--ghost" onClick={onBack}>Back to Lecture</button>
        <button className="btn btn--ghost" onClick={onRetry}>Retry Quiz</button>
        <button className="td-action-btn td-action-btn--plan" onClick={onPlan} disabled={planLoading}>
          {planLoading ? <><Loader size={16} className="spin" /> Generating...</> : <><BookOpen size={16} /> Generate Study Plan</>}
        </button>
      </div>
    </div>
  );
};

// ─── PlanPanel ────────────────────────────────────────────────────────────────

const renderPlanLine = (line, i) => {
  if (line.startsWith('# ')) return <h2 key={i} className="plan-h1">{line.slice(2)}</h2>;
  if (line.startsWith('## ')) return <h3 key={i} className="plan-h2">{line.slice(3)}</h3>;
  if (line.startsWith('### ')) return <h4 key={i} className="plan-h3">{line.slice(4)}</h4>;
  if (line.startsWith('- ')) return <li key={i} className="plan-li">{line.slice(2)}</li>;
  if (line.startsWith('| ')) return <p key={i} className="plan-table-row">{line}</p>;
  if (line.trim() === '---') return <hr key={i} className="plan-hr" />;
  if (line.trim() === '') return <br key={i} />;
  const html = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return <p key={i} className="plan-p" dangerouslySetInnerHTML={{ __html: html }} />;
};

const PlanPanel = ({ plan, lecture, onBack, onQuiz, quizLoading }) => (
  <div className="td-plan">
    <div className="td-quiz__header">
      <button className="btn btn--ghost btn--sm" onClick={onBack}>
        <ArrowLeft size={14} /> Back
      </button>
      <h2 className="td-quiz__title">Study Plan: {lecture.title}</h2>
    </div>

    <div className="sl-plan-content">
      {plan?.plan?.split('\n').map(renderPlanLine)}
    </div>

    {plan?.recommendations?.length > 0 && (
      <div className="td-section" style={{ marginTop: 24 }}>
        <h3 className="td-section__heading"><Lightbulb size={15} /> Recommendations</h3>
        <ul className="td-list">
          {plan.recommendations.map((r, i) => (
            <li key={i} className="td-list__item"><ChevronRight size={14} className="td-list__icon" />{r}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="td-actions" style={{ marginTop: 24 }}>
      <button className="td-action-btn td-action-btn--quiz" onClick={onQuiz} disabled={quizLoading}>
        {quizLoading ? <><Loader size={16} className="spin" /> Generating...</> : <><Brain size={16} /> Take Quiz</>}
      </button>
    </div>
  </div>
);

export default TopicDetail;
