// ============================================================================
// WEEK 12 COMPONENT - EXACT MATCH TO WEEK 1-8, 11 STRUCTURE (10 PROMPTS)
// ============================================================================
// This component has 10 prompts and 10 buttons in the circle
// when currentWeek === 12

import React, { useState } from 'react';

const Week12 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 12 Prompts - 10 prompts this week
  const prompts = {
    1: {
      number: 1,
      prompt: 'Write down any resistance, angers, and fears you have about going on from here. We all have them.',
      hasTextBox: true,
    },
    2: {
      number: 2,
      prompt: 'Take a look at your current areas of procrastination. What are the payoffs in your waiting? Locate the hidden fears. Do a list on paper.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      prompt: 'Sneak a peek at Week One. Laugh. Yes, the nasty critters are still there. Note your progress. Read yourself your affirmations. Write some affirmations about your continued creativity as you end the course.',
      hasTextBox: true,
    },
    4: {
      number: 4,
      prompt: 'Mend any mending.',
      hasTextBox: false,
    },
    5: {
      number: 5,
      prompt: 'Repot any pinched and languishing plants.',
      hasTextBox: false,
    },
    6: {
      number: 6,
      prompt: 'Select a God jar. A what? A jar, a box, a vase, a container. Something to put your fears, your resentments, your hopes, your dreams, your worries into.',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Use your God jar. Start with your fear list from the first task. When worried, remind yourself it\'s in the jar —"God\'s got it." Then take the next action.',
      hasTextBox: false,
    },
    8: {
      number: 8,
      prompt: 'Now, check how: Honestly, what would you most like to create? Open-minded, what oddball paths would you dare to try? Willing, what appearances are you willing to shed to pursue your dream?',
      hasTextBox: true,
    },
    9: {
      number: 9,
      prompt: 'List five people you can talk to about your dreams and with whom you feel supported to dream and then plan.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    10: {
      number: 10,
      prompt: 'Restart this path. Share it with a friend. Remember that the miracle is one artist sharing with another.',
      hasTextBox: false,
    },
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
    if (!newArchiveData[today].week12Responses) {
      newArchiveData[today].week12Responses = {};
    }
    newArchiveData[today].week12Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week12:prompt${promptNumber}`, text);
    } catch (error) {
      console.error('Error saving response:', error);
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
    if (!newArchiveData[today].week12Responses) {
      newArchiveData[today].week12Responses = {};
    }
    newArchiveData[today].week12Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week12:prompt${promptNumber}`, { text, items });
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
        week 12
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
        {/* Buttons - 10 buttons arranged in circle */}
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

          {/* List Input Response (Prompt 9) */}
          {prompts[expandedPrompt].isListInput && (
            <div>
              {[...Array(prompts[expandedPrompt].listCount)].map((_, index) => (
                <input
                  key={index}
                  id={`list-item-${expandedPrompt}-${index}`}
                  type="text"
                  placeholder={`Person ${index + 1}...`}
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

          {/* Text Box Response (Prompts 1, 3, 8) */}
          {prompts[expandedPrompt].hasTextBox && !prompts[expandedPrompt].isListInput && (
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

          {/* No Response - Just Confirm Button (Prompts 2, 4, 5, 6, 7, 10) */}
          {!prompts[expandedPrompt].hasTextBox && !prompts[expandedPrompt].isListInput && (
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

export default Week12;
