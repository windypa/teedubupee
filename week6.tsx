// ============================================================================
// WEEK 6 COMPONENT - EXACT MATCH TO WEEK 1, 2, 3, 4, & 5 STRUCTURE
// ============================================================================
// This component should replace Week 1, 2, 3, 4, & 5 rendering in the main app
// when currentWeek === 6

import React, { useState } from 'react';

const Week6 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 6 Prompts - Same structure as Week 1, 2, 3, 4, & 5
  const prompts = {
    1: {
      number: 1,
      prompt: 'Natural Abundance: Find five pretty or interesting rocks. I enjoy this exercise particularly because rocks can be carried in pockets, fingered in business meetings. They can be small, constant reminders of our creative consciousness.',
      hasTextBox: false,
    },
    2: {
      number: 2,
      prompt: 'Pick five flowers or leaves. You may want to press these between wax paper and save them in a book. If you did this in kindergarten, that\'s fine. Some of the best creative play is done there. Let yourself do it again.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      prompt: 'Clearing: Throw out or give away five ratty pieces of clothing.',
      hasTextBox: false,
    },
    4: {
      number: 4,
      prompt: 'Creation: Bake something. Creativity does not have to always involve capital-A art. Very often, the act of cooking something can help you cook something up in another creative mode. Reach for something outside of your normal repertoire. Maybe something you love, but never tried pulling off at home?',
      hasTextBox: false,
    },
    5: {
      number: 5,
      prompt: 'Communication: Send postcards to five friends. This is not a goody-two-shoes exercise. Send to people you would love to hear from. Communicate beyond your normal means.',
      hasTextBox: false,
    },
    6: {
      number: 6,
      prompt: 'Reread your artist prayer from the previous week. Review some files from the landscape.',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Clearing: Any new changes in your home environment? Make some.',
      hasTextBox: false,
    },
    8: {
      number: 8,
      prompt: 'When was the last time you spoke to a stranger? Let some fresh air in. Turn to someone next to you at the bar, on a train, waiting in line, and check the temperature.',
      hasTextBox: false,
    },
    9: {
      number: 9,
      prompt: 'Acceptance: Any new flow in your life? Practice saying yes to freebies.',
      hasTextBox: false,
    },
    10: {
      number: 10,
      prompt: 'Prosperity: Any changes in your financial situation or your perspective on it? Any new—even crazy— ideas about what you would love doing? Pull images around this and add to your image file.',
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
        week 6
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

          {/* No Response - Just Confirm Button (All prompts in Week 6) */}
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
        </div>
      )}
    </div>
  );
};

export default Week6;
