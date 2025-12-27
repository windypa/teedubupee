// ============================================================================
// WEEK 5 COMPONENT - EXACT MATCH TO WEEK 1, 2, 3, & 4 STRUCTURE
// ============================================================================
// This component should replace Week 1, 2, 3, & 4 rendering in the main app
// when currentWeek === 5

import React, { useState, useRef } from 'react';

const Week5 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [context, setContext] = useState(null);

  // Setup drawing context and keyboard listeners
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && expandedPrompt === 8) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);

      // Initialize canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [expandedPrompt]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && expandedPrompt === 8) {
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

  // Week 5 Prompts - Same structure as Week 1, 2, 3, & 4
  const prompts = {
    1: {
      number: 1,
      prompt: 'The reason I can\'t really believe in a supportive God is ... List five grievances. (God can take it.)',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    2: {
      number: 2,
      prompt: 'Starting an Image File: If I had either faith or money I would try ... List five desires. For the next week, be alert for images of these desires. When you spot them, clip them, buy them, photograph them, draw them, collect them somehow. With these images, begin a file of dreams that speak to you. Add to it continually for the duration of the course.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    3: {
      number: 3,
      prompt: 'One more time, list five imaginary lives. Have they changed? Are you doing more parts of them? You may want to add images of these lives to your image file.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    4: {
      number: 4,
      prompt: 'If I were in the peak of my youth and had money ... List five adventures. Again, add images of these to your visual image file.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    5: {
      number: 5,
      prompt: 'If I were sixty-five and had money ... List five postponed pleasures. And again, collect these images. This is a very potent tool. I now live in a house that I imaged for ten years.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    6: {
      number: 6,
      prompt: 'Ten ways I am mean to myself are ... Just as making the positive explicit helps allow it into our lives, making the negative explicit helps us to exorcise it.',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    7: {
      number: 7,
      prompt: 'Ten items I would like to own that I don\'t are ... And again, you may want to collect these images. In order to boost sales, experts in sales motivation often teach rookie salesmen to post images of what they would like to own. It works.',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    8: {
      number: 8,
      prompt: 'Honestly, my favorite creative block is ... TV, overreading, friends, work, rescuing others, overexercise. You name it. Whether you can draw or not, please cartoon yourself indulging in it.',
      hasTextBox: true,
      isDrawing: true,
    },
    9: {
      number: 9,
      prompt: 'My payoff for staying blocked is ... This you may want to explore in your morning pages.',
      hasTextBox: false,
    },
    10: {
      number: 10,
      prompt: 'The person I blame for being blocked is ... Again, use your pages to mull on this.',
      hasTextBox: false,
    },
  };

  // Drawing Canvas for Prompt 8
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

  const handleSaveListResponse = async (promptNumber, items) => {
    const text = items.join('\n');

    setPromptResponses({
      ...promptResponses,
      [promptNumber]: {
        completed: true,
        text,
        items,
        timestamp: new Date().toISOString(),
      },
    });

    // Save to archive
    const today = new Date().toISOString().split('T')[0];
    const newArchiveData = { ...archiveData };
    if (!newArchiveData[today]) {
      newArchiveData[today] = {};
    }
    if (!newArchiveData[today].week5Responses) {
      newArchiveData[today].week5Responses = {};
    }
    newArchiveData[today].week5Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week5:prompt${promptNumber}`, { text, items });
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
    if (!newArchiveData[today].week5Responses) {
      newArchiveData[today].week5Responses = {};
    }
    newArchiveData[today].week5Responses[promptNumber] = {
      drawing: dataUrl,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week5:prompt${promptNumber}:drawing`, dataUrl);
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
        week 5
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

          {/* List Input Response (Prompts 1-7) */}
          {prompts[expandedPrompt].isListInput && (
            <div>
              {[...Array(prompts[expandedPrompt].listCount)].map((_, index) => (
                <input
                  key={index}
                  id={`list-item-${expandedPrompt}-${index}`}
                  type="text"
                  placeholder={`Item ${index + 1}...`}
                  defaultValue={promptResponses[expandedPrompt]?.items?.[index] || ''}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid #030f42`,
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    color: '#030f42',
                    marginBottom: '12px',
                  }}
                />
              ))}
              <button
                onClick={() => {
                  const items = [...Array(prompts[expandedPrompt].listCount)].map((_, index) =>
                    document.getElementById(`list-item-${expandedPrompt}-${index}`).value
                  );
                  handleSaveListResponse(expandedPrompt, items);
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

          {/* Drawing Canvas (Prompt 8) */}
          {prompts[expandedPrompt].isDrawing && (
            <div>
              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
                Draw your favorite creative block. Hold <strong>SPACE</strong> to erase. {isEraserMode && <span style={{ color: '#030f42', fontWeight: 'bold' }}>ERASER MODE</span>}
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
          {!prompts[expandedPrompt].hasTextBox && !prompts[expandedPrompt].isListInput && !prompts[expandedPrompt].isDrawing && (
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

export default Week5;
