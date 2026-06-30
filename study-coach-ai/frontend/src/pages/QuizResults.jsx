import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchResults(); }, []);

  const fetchResults = async () => {
    try {
      const { data } = await api.get('/quizzes/results');
      setResults(data);
    } catch {
      setError('Failed to load quiz results.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  const allWeakAreas = [...new Set(results.flatMap((r) => r.weakAreas || []))].slice(0, 8);

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quiz Results</h1>
          <p className="page-subtitle">Review your performance and identify areas to improve</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {results.length === 0 ? (
        <div className="empty-state empty-state--centered">
          <div className="empty-state__icon">
            <TrendingUp size={28} />
          </div>
          <h3>No quiz results yet</h3>
          <p>Take a quiz to see your performance and identify areas to improve.</p>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
            <div className="stat-card stat-card--indigo">
              <div className="stat-card__value">{results.length}</div>
              <div className="stat-card__title">Quizzes Taken</div>
            </div>
            <div className={`stat-card ${avgScore >= 70 ? 'stat-card--green' : 'stat-card--orange'}`}>
              <div className="stat-card__value">{avgScore}%</div>
              <div className="stat-card__title">Average Score</div>
            </div>
            <div className="stat-card stat-card--red">
              <div className="stat-card__value">{allWeakAreas.length}</div>
              <div className="stat-card__title">Weak Areas Identified</div>
            </div>
          </div>

          {/* Weak areas summary */}
          {allWeakAreas.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <h2 className="card-title">Areas to Review</h2>
              </div>
              <ul className="weak-areas-list">
                {allWeakAreas.map((area, i) => (
                  <li key={i} className="weak-area-item">
                    <span className="weak-area-dot" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Individual results */}
          <div className="results-container">
            {results.map((result) => (
              <div key={result._id} className="card result-card">
                <div className="result-card__header" onClick={() => toggleExpand(result._id)}>
                  <div className="result-card__info">
                    <h3 className="result-card__title">{result.topicId?.title || 'Unknown Topic'}</h3>
                    <span className="result-card__subject">{result.subjectId?.name || ''}</span>
                    <span className="result-card__date">{new Date(result.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="result-card__right">
                    <div className={`result-badge ${result.percentage >= 70 ? 'result-badge--good' : 'result-badge--poor'}`}>
                      {result.percentage}%
                    </div>
                    <div className="result-card__fraction">
                      {result.score}/{result.totalQuestions}
                    </div>
                    {expandedId === result._id
                      ? <ChevronUp size={16} color="var(--gray-400)" />
                      : <ChevronDown size={16} color="var(--gray-400)" />
                    }
                  </div>
                </div>

                {expandedId === result._id && (
                  <div className="result-card__body">
                    <div className="result-answers">
                      {result.answers.map((a, i) => (
                        <div
                          key={i}
                          className={`answer-row ${a.isCorrect ? 'answer-row--correct' : 'answer-row--wrong'}`}
                        >
                          <div className="answer-row__indicator">{a.isCorrect ? '✓' : '✗'}</div>
                          <div className="answer-row__content">
                            <p className="answer-row__question">Q{i + 1}. {a.question}</p>
                            <p className="answer-row__selected">
                              Your answer: <strong>{a.selectedAnswer}</strong>
                            </p>
                            {!a.isCorrect && (
                              <p className="answer-row__correct">
                                Correct: <strong>{a.correctAnswer}</strong>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {result.weakAreas?.length > 0 && (
                      <div className="weak-areas-box">
                        <h4 className="weak-areas-box__title">Weak Areas from This Quiz</h4>
                        <ul>
                          {result.weakAreas.map((area, i) => (
                            <li key={i} className="weak-area-item">
                              <span className="weak-area-dot" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResults;
