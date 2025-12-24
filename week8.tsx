// ============================================================================
// WEEK 8 COMPONENT - EXACT MATCH TO WEEK 1-7 STRUCTURE
// ============================================================================
// This component should replace Week 1-7 rendering in the main app
// when currentWeek === 8

import React, { useState } from 'react';

const Week8 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 8 Prompts - Same structure as Week 1-7
  const prompts = {
    1: {
      number: 1,
      prompt: 'Goal Search: You may find the following exercise difficult. Allow yourself to do it anyway. If multiple dreams occur to you, do the exercise for each one of them. The simple act of imagining a dream in concrete detail helps us to bring it into reality. Think of your goal search as a preliminary architect\'s drawing for the life you would wish to have. The Steps: 1. Name your dream. That\'s right. Write it down. "In a perfect world, I would secretly love to be a _______." 2. Name one concrete goal that signals to you its accomplishment. On your emotional compass, this goal signifies true north. (Note: two people may want to be an actress. They share that dream. For one, an article in People magazine is the concrete goal. To her, glamour is the emotional center for her dream; glamour is true north. For the second actress, the concrete goal is a good review in a Broadway play. To her, respect as a creative artist is the emotional center of her dream; respect is true north. Actress one might be happy as a soap star. Actress two would need stage work to fulfill her dream. On the surface, both seem to desire the same thing.) 3. In a perfect world, where would you like to be in five years in relation to your dream and true north? 4. In the world we inhabit now, what action can you take, this year, to move you closer? 5. What action can you take this month? This week? This day? Right now? 6. List your dream (for example, to be a famous film director). List its true north (respect and higher consciousness, mass communication.) Select a role model (Walt Disney, Ron Howard, Michael Powell). Make an action plan. Five years. Three years. One year. One month. One week. Now. Choose an action. Reading this book is an action.',
      hasTextBox: true,
      isListInput: true,
      listCount: 6,
    },
    2: {
      number: 2,
      prompt: 'New Childhood: What might you have been if you\'d had perfect nurturing? Write a page of this fantasy childhood. What were you given? Can you reparent yourself in that direction now?',
      hasTextBox: true,
    },
    3: {
      number: 3,
      prompt: 'Color Schemes: Pick a color and write a quick few sentences describing yourself in the first person. ("I am silver, high-tech and ethereal, the color of dreams and accomplishment, the color of half-light and in between, I feel serene." Or "I am red. I am passion, sunset, anger, blood, wine and roses, armies, murder, lust, and apples." What is your favorite color? What do you have that is that color? What about an entire room? This is your life and your house.',
      hasTextBox: true,
    },
    4: {
      number: 4,
      prompt: 'List five things you are not allowed to do: kill your boss, scream in church, go outside naked, make a scene, quit your job. Now do that thing on paper. Write it, draw it, paint it, act it out, collage it.',
      hasTextBox: true,
    },
    5: {
      number: 5,
      prompt: 'Style Search: List twenty things you like to do. (Perhaps the same twenty you listed before, perhaps not.) Answer these questions for each item. Does it cost money or is it free? Expensive or cheap? Alone or with somebody? Job related? Physical risk? Fast-paced or slow? Mind, body, or spiritual?',
      hasTextBox: true,
      isListInput: true,
      listCount: 20,
    },
    6: {
      number: 6,
      prompt: 'Plan a perfect day in your life as it is now constituted, using the information gleaned from above.',
      hasTextBox: true,
    },
    7: {
      number: 7,
      prompt: 'Plan a perfect day in your life as you wish it were constituted. There are no restrictions. Allow yourself to be and to have whatever your heart desires. Your ideal environment, job, home, circle of friends, intimate relationship, stature in your art form—your wildest dreams.',
      hasTextBox: true,
    },
    8: {
      number: 8,
      prompt: 'Choose one festive aspect from your ideal day. Allow yourself to live it. You may not be able to move to Rome yet, but even in a still-grungy apartment you can enjoy a homemade cappuccino and a croissant.',
      hasTextBox: false,
    },
    9: {
      number: 9,
      prompt: 'We\'ve put a lot of effort into our manifestations-- mental effort, written effort. Try to get your body involved now. Turn the volume up and dance it.',
      hasTextBox: false,
    },
    10: {
      number: 10,
      prompt: 'What can you do, right now, in your life as it is currently constituted? Do that thing. Take one small daily action instead of indulging in the big questions.',
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
    if (!newArchiveData[today].week8Responses) {
      newArchiveData[today].week8Responses = {};
    }
    newArchiveData[today].week8Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week8:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week8Responses) {
      newArchiveData[today].week8Responses = {};
    }
    newArchiveData[today].week8Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week8:prompt${promptNumber}`, { text, items });
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
        week 8
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

          {/* List Input Response (Prompts 1, 5) */}
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

          {/* Text Box Response (Prompts 2, 3, 4, 6, 7) */}
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

          {/* No Response - Just Confirm Button (Prompts 8, 9, 10) */}
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

export default Week8;
