// ============================================================================
// WEEK 9 COMPONENT - EXACT MATCH TO WEEK 1-8 STRUCTURE (7 PROMPTS)
// ============================================================================
// This component has only 7 prompts and 7 buttons in the circle
// when currentWeek === 9

import React, { useState } from 'react';

const Week9 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 9 Prompts - Only 7 prompts this week
  const prompts = {
    1: {
      number: 1,
      prompt: 'Read your morning pages! Print them out. This process is best undertaken with two colored markers, one to highlight insights and another to highlight actions needed. Do not judge your pages or yourself. This is very important. Yes, they will be boring. Yes, they may be painful. Consider them a map. Take them as information, not an indictment. Take Stock: Who have you consistently been complaining about? What have you procrastinated on? What blessedly have you allowed yourself to change or accept? Take Heart: Many of us notice an alarming tendency toward black-and-white thinking: "He\'s terrible. He\'s wonderful. I love him. I hate him. It\'s a great job. It\'s a terrible job," and so forth. Don\'t be thrown by this. Acknowledge: The pages have allowed us to vent without self-destruction, to plan without interference, to complain without an audience, to dream without restriction, to know our own minds. Give yourself credit for undertaking them. Give them credit for the changes and growth they have fostered.',
      hasTextBox: false,
    },
    2: {
      number: 2,
      prompt: 'You have already done work with naming your goal and identifying true north. The following exercise asks you to fully imagine having your goal accomplished. Please spend enough time to fill in the juicy details that would really make the experience wonderful for you. Name your goal: I am _______________________. In the present tense, describe yourself doing it at the height of your powers! This is your ideal scene. Read this aloud to yourself. Post this above your work area. Read this aloud, daily! For the next week collect actual pictures of yourself and combine them with magazine images to collage your ideal scene described above. Remember, seeing is believing, and the added visual cue of your real self in your ideal scene can make it far more real.',
      hasTextBox: true,
    },
    3: {
      number: 3,
      prompt: 'Priorities: List for yourself your creative goals for the year. List for yourself your creative goals for the month. List for yourself your creative goals for the week.',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    4: {
      number: 4,
      prompt: 'Creative U-Turns: All of us have taken creative U-turns. These are moments where we have foiled ourselves, prevented our own forward momentum, shut our opportunity down. Name one of yours. Name three more. Name the one that just kills you.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    5: {
      number: 5,
      prompt: 'Forgive yourself. Forgive yourself for all failures of nerve, timing, and initiative. Devise a personalized list of affirmations to help you do better in the future. Very gently, very gently, consider whether any aborted, abandoned, savaged, or sabotaged brainchildren can be rescued. Remember, you are not alone. All of us have taken creative U-turns. Choose one creative U-turn. Retrieve it. Mend it. Do not take a creative U-turn now. Instead, notice your resistance. Daily pages seeming difficult? Stupid? Pointless? Too obvious? Do them anyway. What creative dreams are lurching toward possibility? Admit that they frighten you.',
      hasTextBox: true,
    },
    6: {
      number: 6,
      prompt: 'Choose an artist totem. It might be a doll, a stuffed animal, a carved figuring, or a wind-up toy. The point is to choose something you immediately feel a protective fondness toward. Give your totem a place of honor and then honor it by not beating up on your artist child.',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Drink a warm cup of water.',
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
    if (!newArchiveData[today].week9Responses) {
      newArchiveData[today].week9Responses = {};
    }
    newArchiveData[today].week9Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week9:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week9Responses) {
      newArchiveData[today].week9Responses = {};
    }
    newArchiveData[today].week9Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week9:prompt${promptNumber}`, { text, items });
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
        week 9
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
        Seven prompts on the path
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
        {/* Buttons - 7 buttons arranged in circle */}
        {Object.values(prompts).map((prompt) => {
          const angle = ((prompt.number - 1) * (360 / 7) - 90) * (Math.PI / 180);
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

          {/* List Input Response (Prompts 3, 4) */}
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

          {/* Text Box Response (Prompts 2, 5) */}
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

          {/* No Response - Just Confirm Button (Prompts 1, 6, 7) */}
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

export default Week9;
