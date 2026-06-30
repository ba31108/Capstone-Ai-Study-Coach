import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import {
  uploadLecture,
  generateQuizFromLecture,
  generateStudyPlanFromLecture,
  getLectures,
  deleteLecture,
} from '../api/lectureApi';
import {
  Brain, Upload, FileText, CheckCircle, Lightbulb, PenSquare,
  ClipboardList, ChevronRight, RotateCcw, Trash2, ArrowLeft,
  BookOpen, Loader, AlertCircle,
} from 'lucide-react';

const SmartLecture = () => {
  const [phase, setPhase] = useState('upload');
  // Phases: 'upload' | 'uploading' | 'summary' | 'generatingQuiz' | 'quiz'
  //         | 'submittingQuiz' | 'result' | 'generatingPlan' | 'plan' | 'history'

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [form, setForm] = useState({ title: '', subjectId: '', topicId: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [lecture, setLecture] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);

  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSubjectsAndTopics();
    fetchLectures();
  }, []);

  useEffect(() => {
    if (form.subjectId) {
      setFilteredTopics(topics.filter(t => {
        const sid = t.subjectId?._id || t.subjectId;
        return sid === form.subjectId;
      }));
    } else {
      setFilteredTopics(topics);
    }
    setForm(f => ({ ...f, topicId: '' }));
  }, [form.subjectId, topics]);

  const fetchSubjectsAndTopics = async () => {
    try {
      const [sRes, tRes] = await Promise.all([api.get('/subjects'), api.get('/topics')]);
      setSubjects(sRes.data);
      setTopics(tRes.data);
      setFilteredTopics(tRes.data);
    } catch {}
  };

  const fetchLectures = async () => {
    try {
      const { data } = await getLectures();
      setLectures(data);
    } catch {}
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return setError('Please select a PDF file first.');
    setError('');
    setPhase('uploading');

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    if (form.title.trim()) formData.append('title', form.title.trim());
    if (form.subjectId) formData.append('subjectId', form.subjectId);
    if (form.topicId) formData.append('topicId', form.topicId);

    try {
      const { data } = await uploadLecture(formData);
      setLecture(data);
      setPhase('summary');
      fetchLectures();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setPhase('upload');
    }
  };

  const handleGenerateQuiz = async () => {
    setError('');
    setPhase('generatingQuiz');
    try {
      const { data } = await generateQuizFromLecture(lecture._id);
      setQuiz(data);
      setSelectedAnswers(new Array(data.questions.length).fill(''));
      setQuizResult(null);
      setPhase('quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate quiz.');
      setPhase('summary');
    }
  };

  const handleGenerateStudyPlan = async () => {
    setError('');
    setPhase('generatingPlan');
    try {
      const { data } = await generateStudyPlanFromLecture(lecture._id);
      setStudyPlan(data);
      setPhase('plan');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate study plan.');
      setPhase('summary');
    }
  };

  const handleSelectAnswer = (qIndex, answer) => {
    const updated = [...selectedAnswers];
    updated[qIndex] = answer;
    setSelectedAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswers.some(a => !a)) {
      return setError('Please answer all questions before submitting.');
    }
    setError('');
    setPhase('submittingQuiz');
    try {
      const { data } = await api.post('/quizzes/submit', {
        quizId: quiz._id,
        answers: selectedAnswers,
      });
      setQuizResult({ ...data, questions: quiz.questions });
      setPhase('result');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
      setPhase('quiz');
    }
  };

  const handleDeleteLecture = async (id) => {
    if (!window.confirm('Delete this lecture and its generated content?')) return;
    try {
      await deleteLecture(id);
      fetchLectures();
      if (lecture?._id === id) {
        resetToUpload();
      }
    } catch {
      setError('Delete failed.');
    }
  };

  const resetToUpload = () => {
    setPhase('upload');
    setLecture(null);
    setQuiz(null);
    setSelectedAnswers([]);
    setQuizResult(null);
    setStudyPlan(null);
    setSelectedFile(null);
    setForm({ title: '', subjectId: '', topicId: '' });
    setError('');
  };

  const answeredCount = selectedAnswers.filter(Boolean).length;
  const totalQuestions = quiz?.questions?.length || 0;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // ── Upload Phase ──
  if (phase === 'upload' || phase === 'uploading') {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Smart Lecture</h1>
            <p className="page-subtitle">Upload a lecture PDF — every quiz question and study plan step is generated from your actual content</p>
          </div>
          {lectures.length > 0 && (
            <button className="btn btn--ghost" onClick={() => setPhase('history')}>
              My Lectures ({lectures.length})
            </button>
          )}
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="sl-upload-card">
          <div className="sl-upload-form">
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Subject <span className="form-label--opt">(optional)</span></label>
                <select
                  className="form-input"
                  value={form.subjectId}
                  onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Topic <span className="form-label--opt">(optional)</span></label>
                <select
                  className="form-input"
                  value={form.topicId}
                  onChange={e => setForm(f => ({ ...f, topicId: e.target.value }))}
                >
                  <option value="">Select a topic</option>
                  {filteredTopics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lecture Title <span className="form-label--opt">(optional — auto-detected from filename)</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Introduction to Photosynthesis"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
          </div>

          <div
            className={`sl-dropzone ${dragOver ? 'sl-dropzone--over' : ''} ${selectedFile ? 'sl-dropzone--ready' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={e => handleFileChange(e.target.files[0])}
            />
            {selectedFile ? (
              <>
                <div className="sl-dropzone__icon sl-dropzone__icon--ready">
                  <FileText size={32} color="#4f46e5" />
                </div>
                <p className="sl-dropzone__filename">{selectedFile.name}</p>
                <p className="sl-dropzone__hint">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
                </p>
              </>
            ) : (
              <>
                <div className="sl-dropzone__icon">
                  <Upload size={32} color="#94a3b8" />
                </div>
                <p className="sl-dropzone__title">Click to upload or drag &amp; drop</p>
                <p className="sl-dropzone__hint">PDF only · Maximum 10 MB</p>
              </>
            )}
          </div>

          <button
            className="btn btn--primary sl-upload-btn"
            onClick={handleUpload}
            disabled={phase === 'uploading' || !selectedFile}
          >
            {phase === 'uploading' ? (
              <>
                <Loader size={16} className="spin" />
                Extracting lecture content...
              </>
            ) : (
              <>
                <Brain size={16} />
                Analyze Lecture
              </>
            )}
          </button>
        </div>

        {lectures.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h2 className="card-title">Recent Lectures</h2>
            </div>
            <div className="items-list">
              {lectures.slice(0, 3).map(lec => (
                <div key={lec._id} className="list-item">
                  <div className="list-item__info">
                    <span className="list-item__title">{lec.title}</span>
                    <span className="list-item__meta">
                      {lec.wordCount?.toLocaleString()} words
                      {lec.subjectId?.name ? ` · ${lec.subjectId.name}` : ''}
                      {' · '}{new Date(lec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => { setLecture(lec); setPhase('summary'); }}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDeleteLecture(lec._id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── History Phase ──
  if (phase === 'history') {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Lectures</h1>
            <p className="page-subtitle">All your uploaded lecture PDFs</p>
          </div>
          <button className="btn btn--primary" onClick={resetToUpload}>
            + Upload New
          </button>
        </div>
        {error && <div className="alert alert--error">{error}</div>}
        {lectures.length === 0 ? (
          <div className="empty-state empty-state--centered">
            <div className="empty-state__icon"><Brain size={28} /></div>
            <h3>No lectures yet</h3>
            <p>Upload your first lecture PDF to get started.</p>
            <button className="btn btn--primary" onClick={resetToUpload}>Upload PDF</button>
          </div>
        ) : (
          <div className="items-list" style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            {lectures.map(lec => (
              <div key={lec._id} className="list-item">
                <div className="list-item__info">
                  <span className="list-item__title">{lec.title}</span>
                  <span className="list-item__meta">
                    {lec.wordCount?.toLocaleString()} words
                    {lec.subjectId?.name ? ` · ${lec.subjectId.name}` : ''}
                    {lec.topicId?.title ? ` · ${lec.topicId.title}` : ''}
                    {' · '}{new Date(lec.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => { setLecture(lec); setPhase('summary'); setError(''); }}
                  >
                    Open
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDeleteLecture(lec._id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Summary Phase ──
  if (phase === 'summary' || phase === 'generatingQuiz' || phase === 'generatingPlan') {
    const isGenerating = phase === 'generatingQuiz' || phase === 'generatingPlan';
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Lecture Analyzed</h1>
            <p className="page-subtitle">{lecture?.title}</p>
          </div>
          <button className="btn btn--ghost" onClick={resetToUpload}>
            <Upload size={14} /> Upload Another
          </button>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="sl-summary-card">
          <div className="sl-summary-header">
            <div className="sl-summary-icon">
              <CheckCircle size={22} color="#059669" />
            </div>
            <div>
              <h2 className="sl-summary-title">{lecture?.title}</h2>
              <p className="sl-summary-meta">
                {lecture?.wordCount?.toLocaleString()} words extracted
                {lecture?.subjectId?.name ? ` · ${lecture.subjectId.name}` : ''}
                {lecture?.topicId?.title ? ` · ${lecture.topicId.title}` : ''}
              </p>
            </div>
          </div>

          <div className="sl-summary-body">
            <p className="sl-summary-text">{lecture?.summary}</p>
          </div>

          {lecture?.keyConcepts?.length > 0 && (
            <div className="sl-concepts">
              <div className="sl-concepts__header">
                <Lightbulb size={15} color="#d97706" />
                <span>Key Concepts Identified</span>
              </div>
              <div className="sl-concepts__grid">
                {lecture.keyConcepts.map((concept, i) => (
                  <span key={i} className="sl-concept-badge">{concept}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sl-actions">
          <button
            className="sl-action-btn sl-action-btn--quiz"
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
          >
            {phase === 'generatingQuiz' ? (
              <><Loader size={22} className="spin" /><span>Generating Quiz...</span></>
            ) : (
              <>
                <PenSquare size={22} />
                <span>Generate Quiz</span>
                <small>Test your understanding of this lecture</small>
              </>
            )}
          </button>

          <button
            className="sl-action-btn sl-action-btn--plan"
            onClick={handleGenerateStudyPlan}
            disabled={isGenerating}
          >
            {phase === 'generatingPlan' ? (
              <><Loader size={22} className="spin" /><span>Generating Plan...</span></>
            ) : (
              <>
                <ClipboardList size={22} />
                <span>Generate Study Plan</span>
                <small>Get a step-by-step learning roadmap</small>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz Phase ──
  if (phase === 'quiz' || phase === 'submittingQuiz') {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">{quiz?.title}</h1>
            <p className="page-subtitle">Based on your uploaded lecture</p>
          </div>
          <button className="btn btn--ghost" onClick={() => setPhase('summary')}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="card quiz-card">
          <div className="sl-pdf-source-note">
            <Brain size={13} />
            All questions are generated directly from your uploaded lecture PDF
          </div>

          <div className="quiz-progress">
            <span>{answeredCount}/{totalQuestions} answered</span>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-bar__fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span>{progressPct}%</span>
          </div>

          <div className="quiz-questions">
            {quiz?.questions?.map((q, qIdx) => (
              <div key={qIdx} className="quiz-question">
                <p className="quiz-question__text">
                  <span className="quiz-question__num">Q{qIdx + 1}.</span> {q.question}
                </p>
                <div className="quiz-options">
                  {q.options.map((option, oIdx) => (
                    <label
                      key={oIdx}
                      className={`quiz-option ${selectedAnswers[qIdx] === option ? 'quiz-option--selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        value={option}
                        checked={selectedAnswers[qIdx] === option}
                        onChange={() => handleSelectAnswer(qIdx, option)}
                        disabled={phase === 'submittingQuiz'}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-submit-row">
            <button className="btn btn--ghost" onClick={() => setPhase('summary')}>Cancel</button>
            <button
              className="btn btn--primary"
              onClick={handleSubmitQuiz}
              disabled={phase === 'submittingQuiz'}
            >
              {phase === 'submittingQuiz' ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Result Phase ──
  if (phase === 'result') {
    const { percentage, score, totalQuestions: total, answers, questions: origQuestions } = quizResult;
    const weakAreas = answers
      .filter(a => !a.isCorrect)
      .map((a, i) => {
        const origQ = origQuestions?.find(q => q.question === a.question);
        return origQ?.sourceConcept || null;
      })
      .filter(Boolean);
    const uniqueWeak = [...new Set(weakAreas)];

    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Quiz Result</h1>
            <p className="page-subtitle">{lecture?.title}</p>
          </div>
          <button className="btn btn--ghost" onClick={() => setPhase('summary')}>
            <ArrowLeft size={14} /> Back to Lecture
          </button>
        </div>

        <div className={`sl-result-banner ${percentage >= 70 ? 'sl-result-banner--good' : 'sl-result-banner--poor'}`}>
          <div className="sl-result-score">{percentage}%</div>
          <div className="sl-result-fraction">{score} / {total} correct</div>
          <div className="sl-result-msg">
            {percentage >= 70
              ? 'Excellent work! You have a strong grasp of this lecture.'
              : 'Keep studying — review the weak areas below and retry the quiz.'}
          </div>
          <div className="sl-result-actions">
            <button className="btn btn--ghost" onClick={handleGenerateQuiz}>
              <RotateCcw size={14} /> Retake Quiz
            </button>
            <button className="btn btn--primary" onClick={handleGenerateStudyPlan}>
              <ClipboardList size={14} /> Generate Study Plan
            </button>
          </div>
        </div>

        {uniqueWeak.length > 0 && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={16} color="#ef4444" />
                Weak Areas — Re-read These Concepts in Your Lecture
              </h2>
            </div>
            <p style={{ padding: '0 20px 10px', fontSize: '13px', color: 'var(--gray-500)' }}>
              These concepts appeared in questions you answered incorrectly. Find them in your uploaded lecture and re-read the relevant sections.
            </p>
            <div className="sl-concepts__grid" style={{ padding: '0 20px 16px' }}>
              {uniqueWeak.map((area, i) => (
                <span key={i} className="sl-concept-badge sl-concept-badge--weak">{area}</span>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Answer Review</h2>
            <span className="sl-pdf-badge">
              <BookOpen size={11} /> From your PDF
            </span>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            {answers.map((a, i) => {
              const origQ = origQuestions?.find(q => q.question === a.question);
              return (
                <div key={i} className={`sl-answer ${a.isCorrect ? 'sl-answer--correct' : 'sl-answer--wrong'}`}>
                  <div className="sl-answer__indicator">{a.isCorrect ? '✓' : '✗'}</div>
                  <div className="sl-answer__content">
                    <p className="sl-answer__question">Q{i + 1}. {a.question}</p>
                    <p className="sl-answer__selected">Your answer: <strong>{a.selectedAnswer}</strong></p>
                    {!a.isCorrect && (
                      <p className="sl-answer__correct">Correct answer: <strong>{a.correctAnswer}</strong></p>
                    )}
                    {origQ?.explanation && (
                      <p className="sl-answer__explanation">
                        <span className="sl-answer__exp-label">Explanation:</span> {origQ.explanation}
                      </p>
                    )}
                    {!a.isCorrect && origQ?.sourceText && (
                      <div className="sl-answer__source">
                        <span className="sl-answer__source-label">
                          <BookOpen size={11} /> Lecture source:
                        </span>
                        <span className="sl-answer__source-text">"{origQ.sourceText}"</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Study Plan Phase ──
  if (phase === 'plan') {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Study Plan</h1>
            <p className="page-subtitle">{lecture?.title}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn--ghost" onClick={() => setPhase('summary')}>
              <ArrowLeft size={14} /> Back
            </button>
            <button className="btn btn--primary" onClick={handleGenerateQuiz}>
              <PenSquare size={14} /> Take Quiz
            </button>
          </div>
        </div>

        {studyPlan?.keyConcepts?.length > 0 && (
          <div className="sl-summary-card" style={{ marginBottom: '20px' }}>
            <div className="sl-concepts__header">
              <Lightbulb size={15} color="#d97706" />
              <span>Key Concepts in This Plan</span>
            </div>
            <div className="sl-concepts__grid" style={{ marginTop: '10px' }}>
              {studyPlan.keyConcepts.map((c, i) => (
                <span key={i} className="sl-concept-badge">{c}</span>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="sl-plan-content">
            {studyPlan?.plan?.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h2 key={i} className="plan-h1">{line.replace('# ', '')}</h2>;
              if (line.startsWith('## ')) return <h3 key={i} className="plan-h2">{line.replace('## ', '')}</h3>;
              if (line.startsWith('### ')) return <h4 key={i} className="plan-h3">{line.replace('### ', '')}</h4>;
              if (line.startsWith('- ')) return <li key={i} className="plan-li">{line.slice(2)}</li>;
              if (line.startsWith('| ')) return <p key={i} className="plan-table-row">{line}</p>;
              if (line.trim() === '---') return <hr key={i} className="plan-hr" />;
              if (line.trim() === '') return <br key={i} />;
              // Render inline bold **text**
              const rendered = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
              return <p key={i} className="plan-p" dangerouslySetInnerHTML={{ __html: rendered }} />;
            })}
          </div>

          {studyPlan?.recommendations?.length > 0 && (
            <div className="recommendations" style={{ margin: '20px' }}>
              <h3 className="recommendations__title">Recommendations</h3>
              <ul>
                {studyPlan.recommendations.map((rec, i) => (
                  <li key={i} className="recommendations__item">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SmartLecture;
