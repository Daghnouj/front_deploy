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
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

const getSeverity = (score) => {
  if (score <= 4) return "You're doing okay! 😊";
  if (score <= 9) return "Mild mood clouds 🐨";
  if (score <= 14) return "Moderate rain showers 🌧️";
  if (score <= 19) return "Heavy weather storm ⚡";
  return "Stormy seas 🌊 Please talk to someone!";
};

const PHQ9TeenCheck = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < phq9Questions.length) {
      alert("Please answer all the questions before submitting! 🌟");
      return;
    }
    const total = Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
    setScore(total);
    setSubmitted(true);
    window.scrollTo({
      top: 100,
      behavior: "smooth" // Optional smooth scrolling
    })
  };

  return (
    <div className="container mb-5" style={{marginTop:'120px'}}>
      <div className="card shadow-lg" style={{
        borderRadius: '25px',
        border: '4px solid #b3e5fc',
        background: 'linear-gradient(150deg, #f0f9ff 0%, #e6f4ff 100%)'
      }}>
        <div className="card-body p-4 mt-4">
          <div className="text-center mb-4">
            <div style={{
              width: '100px',
              height: '100px',
              background: '#e3f2fd',
              borderRadius: '50%',
              margin: '0 auto 15px',
              padding: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src="https://img.icons8.com/color/96/mental-health.png" 
                alt="Friendly brain icon"
                style={{ width: '70px' }}
              />
            </div>
            <h1 style={{
              fontFamily: "'Bubblegum Sans', cursive",
              color: '#2a5298',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '0.5rem'
            }}>
              Mood Checker 🌈
            </h1>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              color: '#4a4a4a',
              fontSize: '1.1rem'
            }}>
              Let's check how your feelings have been this week!
            </p>
          </div>

          {!submitted ? (
            <div className="px-3">
              {phq9Questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-4 p-3" style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '2px solid #e0f7fa'
                }}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: '35px',
                      height: '35px',
                      background: '#4CAF50',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      flexShrink: 0
                    }}>
                      <span style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {qIndex + 1}
                      </span>
                    </div>
                    <p style={{
                      margin: 0,
                      color: '#2c3e50',
                      fontSize: '1.1rem',
                      fontFamily: "'Nunito', sans-serif",
                      lineHeight: '1.4'
                    }}>
                      {question}
                    </p>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2">
                    {options.map((opt, oIndex) => (
                      <label 
                        key={oIndex}
                        className="d-flex align-items-center rounded-pill px-3 py-2"
                        style={{
                          background: answers[qIndex] === opt.value ? '#e8f5e9' : '#f5f5f5',
                          border: `2px solid ${answers[qIndex] === opt.value ? '#4CAF50' : '#ddd'}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          flex: '1 1 auto',
                          minWidth: '180px'
                        }}
                      >
                        <input
                          type="radio"
                          name={`q${qIndex}`}
                          value={opt.value}
                          checked={answers[qIndex] === opt.value}
                          onChange={() => handleChange(qIndex, opt.value)}
                          className="form-check-input"
                          style={{
                            width: '1.3em',
                            height: '1.3em',
                            marginRight: '10px'
                          }}
                        />
                        <span style={{
                          fontSize: '0.95rem',
                          color: '#424242',
                          fontFamily: "'Nunito', sans-serif"
                        }}>
                          {['😊', '😐', '😟', '😢'][oIndex]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-5">
                <button 
                  className="btn btn-lg rounded-pill px-5 py-3"
                  onClick={handleSubmit}
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    Show My Results 🚀
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-4" style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              margin: '20px 0',
              border: '3px solid #b3e5fc'
            }}>
              <div className="mb-4">
                <img 
                  src="https://img.icons8.com/color/96/cloud-lighting.png" 
                  alt="Weather illustration"
                  style={{ width: '100px' }}
                />
              </div>
              <h2 style={{
                color: '#2c3e50',
                fontSize: '2rem',
                fontFamily: "'Bubblegum Sans', cursive",
                marginBottom: '1.5rem'
              }}>
                Your Mood Weather Report ⛅
              </h2>
              <div className="display-4 mb-3" style={{
                color: '#2196F3',
                fontWeight: 'bold',
                fontSize: '2.5rem'
              }}>
                {score}/27
              </div>
              <div className="alert alert-success rounded-pill" 
                   style={{ 
                     background: '#e8f5e9',
                     border: '2px solid #4CAF50',
                     fontSize: '1.3rem',
                     fontFamily: "'Nunito', sans-serif"
                   }}>
                {getSeverity(score)}
              </div>
              <div className="mt-4 p-3 rounded" style={{
                background: '#fff3e0',
                border: '2px dashed #ffb74d'
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#6d4c41',
                  fontFamily: "'Nunito', sans-serif",
                  lineHeight: '1.6'
                }}>
                  🌟 Remember: This is just a weather report, not a final forecast!<br />
                  💬 If storms feel too big, talk to a trusted adult or counselor<br />
                  📞 You can always call a helpline for support
                </p>
              </div>
              <button
                className="btn btn-lg rounded-pill mt-4 px-5 py-2"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                }}
                style={{
                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                  color: 'white',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(33,150,243,0.3)'
                }}
              >
                Try Again 🔄
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center mt-5 p-4 rounded" style={{
        background: '#e3f2fd',
        border: '2px solid #90caf9'
      }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          color: '#2c3e50',
          margin: 0
        }}>
          🌈 You Matter! 🌟 Always reach out if you need help<br />
          National Crisis Hotline: 1-800-273-TALK (8255)
        </p>
      </footer>
    </div>
  );
};

export default PHQ9TeenCheck;