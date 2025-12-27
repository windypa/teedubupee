// ============================================================================
// WEEK 2 COMPONENT - EXACT MATCH TO WEEK 1 STRUCTURE
// ============================================================================
// This component should replace Week 1 rendering in the main app
// when currentWeek === 2

import React, { useState, useRef, useEffect } from 'react';

const Week2 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});
  const canvasRef = useRef(null);

  // Week 2 Prompts - Same structure as Week 1
  const prompts = {
    1: {
      number: 1,
      prompt: 'Every day, morning and night, find the time to get quiet and focused and read the Basic Principles letter over in the landscape tab to yourself. Be alert for any attitudinal shifts. Can you see yourself setting aside any skepticism yet?',
      hasTextBox: false,
    },
    2: {
      number: 2,
      prompt: 'Where does your time go? List your five major activities this week. How much time did you give to each one? Which were what you wanted to do and which were shoulds? How much of your time is spent helping others and ignoring your own desires? Have any of your blocked friends triggered doubts in you?\n\nDraw a circle. Inside that circle, place topics you need to protect. Place the names of those you find to be supportive. Outside the circle, place the names of those you must be selfprotective around just now. Place this safety map near where you write your morning pages. Use this map to support your autonomy. Add names to the inner and outer spheres as appropriate.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      prompt: 'List 20 things you enjoy doing (stretching all the way out, ice skating, riding your bike, visiting that one bakery, having sex, having sex again, perfectly unpeeling a hardboiled egg, going for a run.). When was the last time you let yourself do these things? Next to each entry, place a date. Don\'t be surprised if it\'s been years for some of your favorites. That will change. This list is an excellent resource for your pit stops.',
      hasTextBox: true,
    },
    4: {
      number: 4,
      prompt: 'Write down two favorite things that you\'ve avoided that could be this week\'s goals. These goals can be small: buy one roll of film and shoot it. Remember, we are trying to win you some autonomy with your time. Look for windows of time just for you, and use them in small creative acts. Get to the record store at lunch hour, even if only for fifteen minutes. Stop looking for big blocks of time when you will be free. Find small bits of time instead.',
      hasTextBox: true,
      isDualInput: true,
    },
    5: {
      number: 5,
      prompt: 'Dip back into Week One and read your affirmations. Note which ones cause the most reaction. Often the one that sounds the most ridiculous is the most significant. Write three chosen affirmations five times each day in your daily pages; be sure to include the affirmations you made yourself from your blurts.',
      hasTextBox: false,
    },
    6: {
      number: 6,
      prompt: 'Return to the list of imaginary lives from last week. Add five more lives. Again, check to see if you could be doing bits and pieces of these lives in the one you are living now. If you have listed a dancer\'s life, do you let yourself go dancing? If you have listed a monk\'s life, are you ever allowed to go on a retreat? Or spend your day in total silence?',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Draw a circle. Divide it into six pieces of pie. Label one piece spirituality, another exercise, another play, and so on with work, friends, and romance/adventure. Place a dot in each slice at the degree to which you are fulfilled in that area (outer rim indicates great; inner circle, not so great). Connect the dots. This will show you where you are lopsided. As you begin the course, it is not uncommon for your life pie to look like a tarantula. As recovery progresses, your tarantula may become a mandala.\n\nWorking with this tool, you will notice that there are areas of your life that feel impoverished and on which you spend little or no time. Use the time tidbits you are finding to alter this. If your spiritual life is minimal, even a five-minute pit stop into a synagogue or cathedral can restore a sense of wonder. Many of us find that five minutes of drum music can put us in touch with our spiritual core. For others, it\'s a trip to a greenhouse. The point is that even the slightest attention to our impoverished areas can nurture them.',
      hasTextBox: true,
      isDrawing: true,
    },
    8: {
      number: 8,
      prompt: 'List ten changes you\'d like to make for yourself, from the significant to the small or vice versa ("get new sheets so I have another set, go to China, paint my kitchen, dump my bitchy friend Alice"). Do it this way: I would like to ______________. I would like to ______________. As the morning pages nudge us increasingly into the present, where we pay attention to our current lives, a small shift like a newly painted bathroom can yield a luxuriously large sense of self-care.',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    9: {
      number: 9,
      prompt: 'Select one small item and make it a goal for this week.',
      hasTextBox: false,
    },
    10: {
      number: 10,
      prompt: 'Now do that item.',
      hasTextBox: false,
    },
  };

  // Drawing Canvas for Prompt 7
  const startDrawingCanvas = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawOnCanvas = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#030f42';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawingCanvas = () => {
    // Drawing stops
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (!newArchiveData[today].week2Responses) {
      newArchiveData[today].week2Responses = {};
    }
    newArchiveData[today].week2Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week2:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week2Responses) {
      newArchiveData[today].week2Responses = {};
    }
    newArchiveData[today].week2Responses[promptNumber] = {
      drawing: dataUrl,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week2:prompt${promptNumber}:drawing`, dataUrl);
    } catch (error) {
      console.error('Error saving drawing:', error);
    }

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
    if (!newArchiveData[today].week2Responses) {
      newArchiveData[today].week2Responses = {};
    }
    newArchiveData[today].week2Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week2:prompt${promptNumber}`, { text, items });
    } catch (error) {
      console.error('Error saving response:', error);
    }

    setExpandedPrompt(null);
  };

  const handleSaveDualInput = async (promptNumber, first, second) => {
    const text = `First: ${first}\nSecond: ${second}`;
    
    setPromptResponses({
      ...promptResponses,
      [promptNumber]: {
        completed: true,
        text,
        first,
        second,
        timestamp: new Date().toISOString(),
      },
    });

    // Save to archive
    const today = new Date().toISOString().split('T')[0];
    const newArchiveData = { ...archiveData };
    if (!newArchiveData[today]) {
      newArchiveData[today] = {};
    }
    if (!newArchiveData[today].week2Responses) {
      newArchiveData[today].week2Responses = {};
    }
    newArchiveData[today].week2Responses[promptNumber] = {
      text,
      first,
      second,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week2:prompt${promptNumber}`, { text, first, second });
    } catch (error) {
      console.error('Error saving response:', error);
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
        week 2
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
          {prompts[expandedPrompt].hasTextBox && !prompts[expandedPrompt].isDrawing && !prompts[expandedPrompt].isListInput && !prompts[expandedPrompt].isDualInput && (
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

          {/* Dual Input Response (Prompt 4) */}
          {prompts[expandedPrompt].isDualInput && (
            <div>
              <input
                id={`dual-first-${expandedPrompt}`}
                type="text"
                placeholder="First goal: I would like to..."
                defaultValue={promptResponses[expandedPrompt]?.first || ''}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid #030f42`,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#030f42',
                  marginBottom: '12px',
                }}
              />
              <input
                id={`dual-second-${expandedPrompt}`}
                type="text"
                placeholder="Second goal: I would like to..."
                defaultValue={promptResponses[expandedPrompt]?.second || ''}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid #030f42`,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#030f42',
                  marginBottom: '12px',
                }}
              />
              <button
                onClick={() => {
                  const first = document.getElementById(`dual-first-${expandedPrompt}`).value;
                  const second = document.getElementById(`dual-second-${expandedPrompt}`).value;
                  handleSaveDualInput(expandedPrompt, first, second);
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

          {/* List Input Response (Prompt 8) */}
          {prompts[expandedPrompt].isListInput && (
            <div>
              {[...Array(prompts[expandedPrompt].listCount)].map((_, index) => (
                <input
                  key={index}
                  id={`list-item-${expandedPrompt}-${index}`}
                  type="text"
                  placeholder={`I would like to ${index + 1}...`}
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

          {/* Drawing Canvas (Prompt 7) */}
          {prompts[expandedPrompt].isDrawing && (
            <div>
              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
                Draw your life pie chart below
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
                  cursor: 'crosshair',
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

export default Week2;
