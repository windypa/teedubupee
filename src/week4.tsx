// ============================================================================
// WEEK 4 COMPONENT - EXACT MATCH TO WEEK 1, 2, & 3 STRUCTURE
// ============================================================================
// This component should replace Week 1, 2, & 3 rendering in the main app
// when currentWeek === 4

import React, { useState, useRef } from 'react';

const Week4 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [context, setContext] = useState(null);

  // Setup drawing context and keyboard listeners
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && expandedPrompt === 5) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);

      // Initialize canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [expandedPrompt]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && expandedPrompt === 5) {
        e.preventDefault();
        setIsEraserMode(true);
        if (context) {
          context.globalCompositeOperation = 'destination-out';
          context.strokeStyle = 'rgba(0,0,0,1)';
          context.lineWidth = 15;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsEraserMode(false);
        if (context) {
          context.globalCompositeOperation = 'source-over';
          context.strokeStyle = '#030f42';
          context.lineWidth = 2;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [context, expandedPrompt]);

  // Week 4 Prompts - Same structure as Week 1, 2, & 3
  const prompts = {
    1: {
      number: 1,
      prompt: 'Describe your ideal environment. Are you a city mouse or country mouse? One paragraph. Find one image that conveys this. What\'s your favorite season? Why? Find an image of this, too. Or draw it. Place it near your working area.',
      hasTextBox: true,
    },
    2: {
      number: 2,
      prompt: 'Describe yourself at eighty. What did you do after fifty that you enjoyed? Be very specific. Now, write a letter from you at eighty to you at your current age. What would you tell yourself? What interests would you urge yourself to pursue? What dreams would you encourage?',
      hasTextBox: true,
    },
    3: {
      number: 3,
      prompt: 'Remember yourself at eight. What did you like to do? What were your favorite things? Now, write a letter from you at eight to you at your current age. What would you tell yourself?',
      hasTextBox: true,
    },
    4: {
      number: 4,
      prompt: 'Look at your house. Is there any room that you could make into a secret, private space for yourself? Hang a blanket over fishing wire? Buy a folding screen? This is your dream area. It should be decorated for fun and not as an office. All you really need is a chair or pillow, something to write on, some kind of little altar area for flowers and candles. This is to help you center on the fact that creativity is a spiritual, not an ego, issue.',
      hasTextBox: false,
    },
    5: {
      number: 5,
      prompt: 'Review your life chart-- remember that drawing we did? Has that nasty tarantula changed shape yet? Haven\'t you been more active, less rigid, more expressive? Be careful not to expect too much too soon. That\'s raising the jumps. Growth must have time to solidify into health. One day at a time, you are building the habit patterns of a healthy artist. Easy does do it. Keep an ongoing list of self-nurturing toys you could buy your artist: books on tape, magazine subscriptions, theater tickets, a bowling ball.',
      hasTextBox: true,
      isDrawing: true,
    },
    6: {
      number: 6,
      prompt: 'Write your own Artist\'s Prayer. Use it every day for a week.',
      hasTextBox: true,
    },
    7: {
      number: 7,
      prompt: 'Plan a small vacation for yourself. (One weekend day. Get ready to execute it.)',
      hasTextBox: true,
    },
    8: {
      number: 8,
      prompt: 'Open your closet. Throw out—or hand on, or donate —one low-self-worth outfit. (You know the outfit.) Make space for the new.',
      hasTextBox: false,
    },
    9: {
      number: 9,
      prompt: 'Look at one situation in your life that you feel you should change but haven\'t yet. What is the payoff for you in staying stuck?',
      hasTextBox: true,
    },
    10: {
      number: 10,
      prompt: 'This week, try fasting from images and reading. See how long you can consciously last. Spend your idle time focused on something else. If you break your reading deprivation, write about how you did it. In a tantrum? A slip-up? A binge? How do you feel about it? Why?',
      hasTextBox: true,
    },
  };

  // Drawing Canvas for Prompt 5
  const startDrawingCanvas = (e) => {
    if (!canvasRef.current || !context) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    context.beginPath();
    context.moveTo(x, y);
  };

  const drawOnCanvas = (e) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (!isEraserMode) {
      context.strokeStyle = '#030f42';
      context.lineWidth = 2;
    }

    context.lineTo(x, y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  const stopDrawingCanvas = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Handler functions
  const handleConfirm = (promptNumber) => {
    setPromptResponses({
      ...promptResponses,
      [promptNumber]: { completed: true, timestamp: new Date().toISOString() },
    });
    setExpandedPrompt(null);
  };

  const handleSaveResponse = async (promptNumber, text) => {
    setPromptResponses({
      ...promptResponses,
      [promptNumber]: {
        completed: true,
        text,
        timestamp: new Date().toISOString(),
      },
    });

    // Save to archive
    const today = new Date().toISOString().split('T')[0];
    const newArchiveData = { ...archiveData };
    if (!newArchiveData[today]) {
      newArchiveData[today] = {};
    }
    if (!newArchiveData[today].week4Responses) {
      newArchiveData[today].week4Responses = {};
    }
    newArchiveData[today].week4Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week4:prompt${promptNumber}`, text);
    } catch (error) {
      console.error('Error saving response:', error);
    }

    setExpandedPrompt(null);
  };

  const handleSaveDrawing = async (promptNumber) => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL('image/png');

    setPromptResponses({
      ...promptResponses,
      [promptNumber]: {
        completed: true,
        drawing: dataUrl,
        timestamp: new Date().toISOString(),
      },
    });

    // Save to archive
    const today = new Date().toISOString().split('T')[0];
    const newArchiveData = { ...archiveData };
    if (!newArchiveData[today]) {
      newArchiveData[today] = {};
    }
    if (!newArchiveData[today].week4Responses) {
      newArchiveData[today].week4Responses = {};
    }
    newArchiveData[today].week4Responses[promptNumber] = {
      drawing: dataUrl,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week4:prompt${promptNumber}:drawing`, dataUrl);
    } catch (error) {
      console.error('Error saving drawing:', error);
    }

    setExpandedPrompt(null);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Title */}
      <h1
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#030f42',
          fontSize: '32px',
          marginBottom: '8px',
          fontWeight: 'normal',
        }}
      >
        week 4
      </h1>
      <p
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#030f42',
          fontSize: '14px',
          opacity: 0.7,
          marginBottom: '40px',
        }}
      >
        Ten prompts on the path
      </p>

      {/* Circular button container */}
      <div
        style={{
          position: 'relative',
          width: '500px',
          height: '500px',
          margin: '0 auto 40px',
        }}
      >
        {/* Buttons */}
        {Object.values(prompts).map((prompt) => {
          const angle = ((prompt.number - 1) * (360 / 10) - 90) * (Math.PI / 180);
          const radius = 200;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isCompleted = promptResponses[prompt.number]?.completed;

          return (
            <button
              key={prompt.number}
              onClick={() => setExpandedPrompt(expandedPrompt === prompt.number ? null : prompt.number)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `2px solid #030f42`,
                backgroundColor: isCompleted ? '#030f42' : 'white',
                color: isCompleted ? 'white' : '#030f42',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: expandedPrompt === prompt.number ? '0 0 0 3px #030f42' : 'none',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.1)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`;
              }}
            >
              {prompt.number}
            </button>
          );
        })}
      </div>

      {/* Expanded prompt box */}
      {expandedPrompt && (
        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '18px', fontWeight: 'bold' }}>
              Prompt {expandedPrompt}
            </h3>
            <button
              onClick={() => setExpandedPrompt(null)}
              style={{ fontSize: '20px', cursor: 'pointer', border: 'none', background: 'none', color: '#030f42' }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
            {prompts[expandedPrompt].prompt}
          </p>

          {/* Text Box Response */}
          {prompts[expandedPrompt].hasTextBox && !prompts[expandedPrompt].isDrawing && (
            <div>
              <textarea
                placeholder="Your response..."
                defaultValue={promptResponses[expandedPrompt]?.text || ''}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '12px',
                  border: `1px solid #030f42`,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#030f42',
                  marginBottom: '12px',
                  resize: 'vertical',
                }}
              />
              <button
                onClick={(e) => {
                  const textarea = e.target.previousElementSibling;
                  handleSaveResponse(expandedPrompt, textarea.value);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#030f42',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                Save Response
              </button>
            </div>
          )}

          {/* Drawing Canvas (Prompt 5) */}
          {prompts[expandedPrompt].isDrawing && (
            <div>
              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
                Draw your updated life chart. Hold <strong>SPACE</strong> to erase. {isEraserMode && <span style={{ color: '#030f42', fontWeight: 'bold' }}>ERASER MODE</span>}
              </p>
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
                onMouseDown={startDrawingCanvas}
                onMouseMove={drawOnCanvas}
                onMouseUp={stopDrawingCanvas}
                onMouseLeave={stopDrawingCanvas}
                style={{
                  border: `1px solid #030f42`,
                  width: '100%',
                  display: 'block',
                  marginBottom: '12px',
                  cursor: isEraserMode ? 'grab' : 'crosshair',
                  backgroundColor: 'white',
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={clearCanvas}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#030f42',
                    border: `1px solid #030f42`,
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={() => handleSaveDrawing(expandedPrompt)}
                  style={{
                    flex: 1,
                    padding: '10px 20px',
                    backgroundColor: '#030f42',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                  }}
                >
                  Save Drawing
                </button>
              </div>
            </div>
          )}

          {/* No Response - Just Confirm Button */}
          {!prompts[expandedPrompt].hasTextBox && (
            <button
              onClick={() => handleConfirm(expandedPrompt)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#030f42',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Helvetica, Arial, sans-serif',
              }}
            >
              Confirm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Week4;
