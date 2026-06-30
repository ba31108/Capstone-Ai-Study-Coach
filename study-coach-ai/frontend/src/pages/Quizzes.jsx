import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';
import { PenSquare, RotateCcw } from 'lucide-react';

const Quizzes = () => {
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    Promise.all([fetchTopics(), fetchQuizzes()]).finally(() => setLoading(false));
  }, []);

  const fetchTopics = async () => {
    try {
      const { data } = await api.get('/topics');
      setTopics(data);
    } catch {}
  };

  const fetchQuizzes = async () => {
    try {
      const { data } = await api.get('/quizzes');
      setQuizzes(data);
    } catch {
      setError('Failed to load quizzes.');
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopicId) return setError('Please select a topic.');
    setError('');
    setSuccess('');
    setGenerating(true);
    setQuizResult(null);
    try {
      const { data } = await api.post('/quizzes/generate', { topicId: selectedTopicId });
      setActiveQuiz(data);
      setSelectedAnswers(new Array(data.questions.length).fill(''));
      fetchQuizzes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (qIndex, answer) => {
    const updated = [...selectedAnswers];
    updated[qIndex] = answer;
    setSelectedAnswers(updated);
  };

  const answeredCount = selectedAnswers.filter(Boolean).length;
  const totalQuestions = activeQuiz?.questions?.length || 0;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSubmitQuiz = async () => {
    if (selectedAnswers.some((a) => !a)) {
      return setError('Please answer all questions before submitting.');
    }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/quizzes/submit', {
        quizId: activeQuiz._id,
        answers: selectedAnswers,
      });
      setQuizResult(data);
      setActiveQuiz(null);
      setSuccess('Quiz submitted! See your results below.');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadExistingQuiz = async (quizId) => {
    try {
      const { data } = await api.get(`/quizzes/${quizId}`);
      setActiveQuiz(data);
      setSelectedAnswers(new Array(data.questions.length).fill(''));
      setQuizResult(null);
      setError('');
      setSuccess('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Failed to load quiz.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle">Test your knowledge with AI-generated quizzes</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      {/* Generate Quiz */}
      <div className="card form-card">
        <h2 className="card-title">Generate a New Quiz</h2>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Select Topic</label>
            <select
              className="form-input"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              <option value="">Choose a topic to quiz on</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title} — {t.subjectId?.name || ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button
              className="btn btn--primary"
              onClick={handleGenerate}
              disabled={generating}
              style={{ whiteSpace: 'nowrap' }}
            >
              {generating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
        {topics.length === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '4px' }}>
            You need to add topics before generating a quiz.
          </p>
        )}
      </div>

      {/* Active Quiz */}
      {activeQuiz && (
        <div className="card quiz-card">
          <div className="card-header">
            <h2 className="card-title">{activeQuiz.title}</h2>
            <span className="badge badge--blue">{activeQuiz.questions.length} Questions</span>
          </div>

          {/* Progress indicator */}
          <div className="quiz-progress">
            <span>{answeredCount}/{totalQuestions} answered</span>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-bar__fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span>{progressPct}%</span>
          </div>

          <div className="quiz-questions">
            {activeQuiz.questions.map((q, qIdx) => (
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
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-submit-row">
            <button className="btn btn--ghost" onClick={() => setActiveQuiz(null)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSubmitQuiz} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Result */}
      {quizResult && (
        <div className="card quiz-result-card">
          <div
            className={`quiz-result-banner ${
              quizResult.percentage >= 70 ? 'quiz-result-banner--good' : 'quiz-result-banner--poor'
            }`}
          >
            <div className="quiz-result-score">{quizResult.percentage}%</div>
            <div className="quiz-result-label">
              {quizResult.score} / {quizResult.totalQuestions} correct
            </div>
            <div className="quiz-result-msg">
              {quizResult.percentage >= 70
                ? 'Great job! Keep up the excellent work.'
                : 'Keep practicing — review your weak areas to improve.'}
            </div>
          </div>
          <div className="quiz-answers">
            {quizResult.answers.map((a, i) => (
              <div key={i} className={`quiz-answer ${a.isCorrect ? 'quiz-answer--correct' : 'quiz-answer--wrong'}`}>
                <p className="quiz-answer__question">Q{i + 1}. {a.question}</p>
                <p className="quiz-answer__selected">Your answer: <strong>{a.selectedAnswer}</strong></p>
                {!a.isCorrect && (
                  <p className="quiz-answer__correct">Correct answer: <strong>{a.correctAnswer}</strong></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Quizzes */}
      {quizzes.length > 0 && !activeQuiz && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Previous Quizzes</h2>
            <span className="badge badge--gray">{quizzes.length}</span>
          </div>
          <div className="items-list">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="list-item">
                <div className="list-item__info">
                  <span className="list-item__title">{quiz.title}</span>
                  <span className="list-item__meta">
                    {quiz.subjectId?.name || ''} · {quiz.questions?.length || 5} questions ·{' '}
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => handleLoadExistingQuiz(quiz._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <RotateCcw size={13} />
                  Retake
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {quizzes.length === 0 && !activeQuiz && !quizResult && (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <PenSquare size={28} />
          </div>
          <h3>No quizzes yet</h3>
          <p>Select a topic above and generate your first quiz to test your knowledge.</p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
