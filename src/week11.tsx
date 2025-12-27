// ============================================================================
// WEEK 11 COMPONENT - EXACT MATCH TO WEEK 1-8 STRUCTURE (10 PROMPTS)
// ============================================================================
// This component has 10 prompts and 10 buttons in the circle
// when currentWeek === 11

import React, { useState } from 'react';

const Week11 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 11 Prompts - 10 prompts this week
  const prompts = {
    1: {
      number: 1,
      prompt: 'Tape your own voice reading the Basic Principles (See the landscape). Use this tape for meditation.',
      hasTextBox: false,
    },
    2: {
      number: 2,
      prompt: 'Write out, in longhand, your Artist\'s Prayer from Week Four. Place it in your wallet.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      prompt: 'Buy yourself a special creativity notebook. Number pages one through seven. Give one page each to the following categories: health, possessions, leisure, relationships, creativity, career, and spirituality. With no thought as to practicality, list ten wishes in each area. All right, it\'s a lot. Let yourself dream a little here.',
      hasTextBox: false,
    },
    4: {
      number: 4,
      prompt: 'Inventory for yourself the ways you have changed since beginning your recovery.',
      hasTextBox: true,
    },
    5: {
      number: 5,
      prompt: 'List five ways you will change as you continue. List five ways you plan to nurture yourself in the next six months: courses you will take, supplies you will allow yourself, artist\'s dates, and vacations just for you.',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    6: {
      number: 6,
      prompt: 'Plan one week\'s nurturing for yourself. This means one concrete, loving action every single day for one week: please binge!',
      hasTextBox: true,
    },
    7: {
      number: 7,
      prompt: 'Write (and mail!) an encouraging letter to your inner artist. This sounds silly and feels very, very good to receive. Remember that your artist is a child and loves praise and encouragement and festive plans.',
      hasTextBox: true,
    },
    8: {
      number: 8,
      prompt: 'Reexamine your God concept. Does your belief system limit or support your creative expansion? Are you open minded about altering your concept of God?',
      hasTextBox: true,
    },
    9: {
      number: 9,
      prompt: 'List ten examples of personal synchronicity that support the possibility of a nurturing creative force.',
      hasTextBox: true,
    },
    10: {
      number: 10,
      prompt: 'In order to stay easily and happily creative, we need to stay spiritually centered. This is easier to do if we allow ourselves centering rituals. It is important that we devise these ourselves from the elements that feel holy and happy to us. Many blocked creatives grew up in punitively religious homes. For us to stay happily and easily creative, we need to heal from this, becoming spiritually centered through creative rituals of our own. A spiritual room or even a spiritual corner is an excellent way to do this. This haven can be a corner of a room, a nook under the stairs, even a window ledge. It is a reminder and an acknowledgment of the fact that our creator unfolds our creativity. Fill it with things that make you happy. Remember that your artist is fed by images. We need to unlearn our old notion that spirituality and sensuality don\'t mix. An artist\'s altar should be a sensory experience. We are meant to celebrate the good things of this earth. Pretty leaves, rocks, candles, sea treasures—all these remind us of our creator. Small rituals, self-devised, are good for the soul. Burning incense while reading affirmations or writing them, lighting a candle, dancing to drum music, holding a smooth rock and listening to Gregorian chant—all of these tactile, physical techniques reinforce spiritual growth. Remember, the artist child speaks the language of the soul: music, dance, scent, shells ... Your artist\'s altar to the creator should be fun to look at, even silly. Remember how much little kids like gaudy stuff. Your artist is a little kid, so...',
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
    if (!newArchiveData[today].week11Responses) {
      newArchiveData[today].week11Responses = {};
    }
    newArchiveData[today].week11Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week11:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week11Responses) {
      newArchiveData[today].week11Responses = {};
    }
    newArchiveData[today].week11Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week11:prompt${promptNumber}`, { text, items });
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
        week 11
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

          {/* List Input Response (Prompt 5) */}
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

          {/* Text Box Response (Prompts 4, 6, 7, 8, 9) */}
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

          {/* No Response - Just Confirm Button (Prompts 1, 2, 3, 10) */}
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

export default Week11;
