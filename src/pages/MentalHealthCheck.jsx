import React, { useState } from 'react';

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, like schoolwork or games",
  "Moving or speaking so slowly that others noticed, or being extra fidgety",
  "Thoughts that you would be better off dead or of hurting yourself",
];

const options = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const getSeverity = (score) => {
  if (score <= 4) return "You're doing great! Keep it up! 🌟";
  if (score <= 9) return "Mild mood fluctuations 🌤️";
  if (score <= 14) return "Moderate emotional showers 🌧️";
  if (score <= 19) return "Heavy emotional weather ⛈️";
  return "Stormy emotional seas 🌊 Please reach out for support!";
};

const getSeverityColor = (score) => {
  if (score <= 4) return "#4CAF50";
  if (score <= 9) return "#FFC107";
  if (score <= 14) return "#FF9800";
  if (score <= 19) return "#F44336";
  return "#9C27B0";
};

const PHQ9TeenCheck = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < phq9Questions.length) {
      alert("Please answer all questions before submitting! ✨");
      return;
    }
    const total = Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
    setScore(total);
    setShowResults(true);
  };

  const resetForm = () => {
    setAnswers({});
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="container py-5" style={{maxWidth: '800px'}}>
      <div className="card shadow-lg border-0 overflow-hidden mt-5">
        {/* Gradient Header */}
        <div className="py-4 px-5 text-white" style={{
          background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)'
        }}>
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-2 me-3" style={{width: '60px', height: '60px'}}>
              <img 
                src="https://img.icons8.com/ios-filled/100/6A11CB/mental-health.png" 
                alt="Mental health icon"
                style={{width: '40px'}}
              />
            </div>
            <div>
              <h1 className="h2 mb-1" style={{fontWeight: '700'}}>Mood Tracker</h1>
              <p className="mb-0 opacity-75">How have you been feeling this week?</p>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="card-body p-4 p-md-5">
          {phq9Questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 pb-3 border-bottom">
              <div className="d-flex mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                  style={{width: '32px', height: '32px', flexShrink: 0}}>
                  {qIndex + 1}
                </div>
                <h3 className="h5 mb-0" style={{color: '#2c3e50'}}>{question}</h3>
              </div>
              
              <div className="d-flex flex-wrap gap-2">
                {options.map((opt, oIndex) => (
                  <button
                    key={oIndex}
                    className={`btn btn-sm rounded-pill px-3 py-2 ${answers[qIndex] === opt.value ? 'active' : ''}`}
                    style={{
                      background: answers[qIndex] === opt.value 
                        ? 'rgba(106, 17, 203, 0.1)' 
                        : '#f8f9fa',
                      border: `1px solid ${answers[qIndex] === opt.value ? '#6A11CB' : '#dee2e6'}`,
                      color: answers[qIndex] === opt.value ? '#6A11CB' : '#495057',
                      fontWeight: answers[qIndex] === opt.value ? '600' : '400',
                      flex: '1 1 auto',
                      minWidth: '120px'
                    }}
                    onClick={() => handleChange(qIndex, opt.value)}
                  >
                    {['😊', '😐', '😟', '😢'][oIndex]} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="text-center mt-5 pt-2">
            <button 
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow"
              onClick={handleSubmit}
              style={{
                background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
                border: 'none',
                fontSize: '1.1rem',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}
            >
              Get My Results
              <span className="ms-2">📊</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 position-relative">
                <div className="position-absolute top-0 start-0 w-100 h-100" 
                  style={{
                    background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
                    opacity: '0.9',
                    zIndex: '-1'
                  }}></div>
                <div className="w-100 text-center py-4">
                  <h2 className="modal-title text-white mb-2">Your Mood Report</h2>
                  <div className="text-white opacity-75">Here's your emotional weather forecast</div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
                  onClick={resetForm}
                ></button>
              </div>
              
              <div className="modal-body py-4 px-4 px-md-5">
                <div className="text-center mb-4">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '120px',
                        height: '120px',
                        background: `linear-gradient(135deg, ${getSeverityColor(score)} 0%, ${getSeverityColor(score)}80 100%)`,
                        boxShadow: `0 8px 16px ${getSeverityColor(score)}40`
                      }}>
                      <span className="display-4 fw-bold text-white">{score}</span>
                    </div>
                  </div>
                  
                  <h3 className="h4 mb-3" style={{color: getSeverityColor(score)}}>
                    {getSeverity(score)}
                  </h3>
                  
                  <div className="progress mb-4" style={{height: '12px', borderRadius: '6px'}}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{
                        width: `${(score/27)*100}%`,
                        background: `linear-gradient(90deg, ${getSeverityColor(score)} 0%, ${getSeverityColor(score)}80 100%)`,
                        borderRadius: '6px'
                      }}
                    ></div>
                  </div>
                  
                  <div className="alert bg-light border rounded p-3 mb-0">
                    <p className="mb-2"><strong>Remember:</strong></p>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">🌱 This is just a snapshot of your current feelings</li>
                      <li className="mb-2">💬 Talking to someone can help clear emotional clouds</li>
                      <li className="mb-0">📞 Crisis support: 1-800-273-TALK (8255)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer border-0 justify-content-center pt-0">
                <button
                  className="btn btn-outline-primary rounded-pill px-4"
                  onClick={resetForm}
                >
                  Retake Assessment
                </button>
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={resetForm}
                  style={{
                    background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
                    border: 'none'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center mt-5 p-3 rounded-3 bg-light">
        <p className="mb-0 text-muted">
          <small>
            🌈 Your feelings are valid and important<br />
            This tool is not a diagnostic instrument. If you're struggling, please reach out to a mental health professional.
          </small>
        </p>
      </footer>
    </div>
  );
};

export default PHQ9TeenCheck;