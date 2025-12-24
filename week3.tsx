// ============================================================================
// WEEK 3 COMPONENT - EXACT MATCH TO WEEK 1 & WEEK 2 STRUCTURE
// ============================================================================
// This component should replace Week 1 & 2 rendering in the main app
// when currentWeek === 3

import React, { useState, useRef } from 'react';

const Week3 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});
  const canvasRef = useRef(null);

  // Week 3 Prompts - Same structure as Week 1 & Week 2
  const prompts = {
    1: {
      number: 1,
      prompt: 'Describe your childhood room. If you wish, you may sketch this room. What was your favorite thing about it? What\'s your favorite thing about your room right now? Nothing? Well, get something you like in there—maybe something from that old childhood room.',
      hasTextBox: true,
    },
    2: {
      number: 2,
      prompt: 'Describe five traits you like in yourself as a child.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    3: {
      number: 3,
      prompt: 'List five childhood accomplishments. (straight A\'s in seventh grade, trained the dog, punched out the class bully, short-sheeted the priest\'s bed). And a treat: list five favorite childhood foods. Buy yourself one of them this week. Yes, Jell-O with bananas is okay.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    4: {
      number: 4,
      prompt: 'Take a look at your habits. Many of them may interfere with your self-nurturing and cause shame. Some of the oddest things are self-destructive. Do you have a habit of watching TV you don\'t like? Do you have a habit of hanging out with a really boring friend and just killing time (there\'s an expression!)? Some rotten habits are obvious, overt (drinking too much, smoking, eating instead of writing). List three obvious rotten habits. What\'s the payoff in continuing them? Some rotten habits are more subtle (no time to exercise, little time to pray, always helping others, not getting any self-nurturing, hanging out with people who belittle your dreams). List three of your subtle foes. What use do these forms of sabotage have? Be specific.',
      hasTextBox: true,
      isListInput: true,
      listCount: 6,
    },
    5: {
      number: 5,
      prompt: 'Make a list of friends who nurture you—that\'s nurture (give you a sense of your own competency and possibility), not enable (give you the message that you will never get it straight without their help). There is a big difference between being helped and being treated as though we are helpless. List three nurturing friends. Which of their traits, particularly, serve you well?',
      hasTextBox: true,
      isListInput: true,
      listCount: 3,
    },
    6: {
      number: 6,
      prompt: 'Call a friend who treats you like you are a really good and bright person who can accomplish things. Part of your recovery is reaching out for support. This support will be critical as you undertake new risks.',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Each of us has an inner compass. This is an instinct that points us toward health. It warns us when we are on dangerous ground, and it tells us when something is safe and good for us. The pages are one way to contact it. So are some other artist-brain activities—painting, driving, walking, scrubbing, running. This week, take an hour to follow your inner compass by doing an artist-brain activity and listening to what insights bubble up.',
      hasTextBox: false,
    },
    8: {
      number: 8,
      prompt: 'List five people you admire. Now, list five people you secretly admire. What traits do these people have that you can cultivate further in yourself?',
      hasTextBox: true,
    },
    9: {
      number: 9,
      prompt: 'List five people you wish you had met who are dead. Now, list five people who are dead whom you\'d like to hang out with for a while in eternity. What traits do you find in these people that you can look for in your friends?',
      hasTextBox: true,
    },
    10: {
      number: 10,
      prompt: 'Compare the two sets of lists. Take a look at what you really like and really admire—and a look at what you think you should like and admire. Your shoulds might tell you to admire Edison while your heart belongs to Houdini. Go with the Houdini side of you for a while.',
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
    if (!newArchiveData[today].week3Responses) {
      newArchiveData[today].week3Responses = {};
    }
    newArchiveData[today].week3Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week3:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week3Responses) {
      newArchiveData[today].week3Responses = {};
    }
    newArchiveData[today].week3Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week3:prompt${promptNumber}`, { text, items });
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
        week 3
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

          {/* List Input Response (Prompts 2, 3, 4, 5) */}
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

export default Week3;
