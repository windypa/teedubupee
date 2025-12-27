// ============================================================================
// WEEK 10 COMPONENT - EXACT MATCH TO WEEK 1-9 STRUCTURE (6 PROMPTS)
// ============================================================================
// This component has only 6 prompts and 6 buttons in the circle
// when currentWeek === 10

import React, { useState } from 'react';

const Week10 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 10 Prompts - Only 6 prompts this week
  const prompts = {
    1: {
      number: 1,
      prompt: 'The Deadlies: Take a piece of paper and cut seven small strips from it. On each strip write one of the following words: alcohol, drugs, sex, work, money, food, family/friends. Fold these strips of paper and place them in an envelope. We call these folded slips the deadlies. You\'ll see why in a minute. Now draw one of the deadlies from the envelope and write five ways in which it has had a negative impact on your life. (If the one you choose seems difficult or inapplicable to you, consider this resistance.) You will do this seven times, each time putting back the previous slip of paper so that you are always drawing from seven possible choices. Yes, you may draw the same deadly repeatedly. Yes, this is significant. Very often, it is the last impact on the final list of an annoying "Oh no, not again" that yields a break, through denial, into clarity.',
      hasTextBox: true,
      isListInput: true,
      listCount: 7,
    },
    2: {
      number: 2,
      prompt: 'Make a quick list of things you love, happiness touchstones for you. The smell of mint tea, a hot day, the feeling of velvet, a light touch, english revival folk music, jumping waves at the beach, the perfect fatty combination of raw salmon and cream cheese ... Well, that\'s me, anyways. Post this list where it can console you and remind you of your own personal touchstones. You may want to draw one of the items on your list—or acquire it. If you love velvet, get a remnant and use it as a runner on a sideboard or dresser, or tack it to the wall and mount images on it. Play a little.',
      hasTextBox: true,
    },
    3: {
      number: 3,
      prompt: 'Answer the following questions. Tell the truth. What habit do you have that gets in the way of your creativity? Tell the truth. What do you think might be a problem? It is. What do you plan to do about the habit or problem? What is your payoff in holding on to this block? If you can\'t figure out your payoff, ask a trusted friend. Tell the truth. Which friends make you doubt yourself? (The self-doubt is yours already, but they trigger it.) Tell the truth. Which friends believe in you and your talent? (The talent is yours, but they make you feel it.) What is the payoff in keeping your destructive friends? If the answer is, "I like them," the next question is, "Why?" Which destructive habits do your destructive friends share with your destructive self? Which constructive habits do your constructive friends share with your constructive self?',
      hasTextBox: true,
      isListInput: true,
      listCount: 10,
    },
    4: {
      number: 4,
      prompt: 'Working with your answers to the questions about the awful truth, try setting a bottom line for yourself. Begin with five of your most painful behaviors. You can always add more later. • If you notice that your evenings are typically gobbled by your boss\'s extra assignments, then a rule must come into play: no work after six. • If you wake at six and could write for an hour if you were not interrupted to look for socks and make breakfast and do ironing, the rules might be "No interrupting Mommy before 7:00 A.M." • If you are working too many jobs and too many hours, you may need to look at your billing. Are you pricing yourself appropriately? Do some footwork. What are others in your field receiving? Raise your prices and lower your work load. Example: Bottom Line 1. I will no longer work weekends. 2. I will no longer bring work with me on social occasions. 3. I will no longer place my work before my creative commitments. 4. I will no longer postpone lovemaking to do latenight reading for work. 5. I will no longer accept business calls at home after six.',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
    },
    5: {
      number: 5,
      prompt: 'Cherishing: 1. List five small victories. 2. List three nurturing actions you took for your artist. 3. List three actions you could take to comfort your artist. 4. Make three nice promises to yourself. Keep them. 5. Do one lovely thing for yourself each day this week.',
      hasTextBox: true,
      isListInput: true,
      listCount: 14,
    },
    6: {
      number: 6,
      prompt: 'The Workaholism Quiz - Answer each question with seldom, often, or never. 1. I work outside of office hours. 2. I cancel dates with loved ones to do more work. 3. I postpone outings until the deadline is over. 4. I take work with me on weekends. 5. I take work with me on vacations. 6. I take vacations. 7. My intimates complain I always work. 8. I try to do two things at once. 9. I allow myself free time between projects. 10. I allow myself to achieve closure on tasks. 11. I procrastinate in finishing up the last loose ends. 12. I set out to do one job and start on three more at the same time. 13. I work in the evenings during family time. 14. I allow calls to interrupt—and lengthen—my work day. 15. I prioritize my day to include an hour of creative work/play. 16. I place my creative dreams before my work. 17. I fall in with others\' plans and fill my free time with their agendas. 18. I allow myself down time to do nothing. 19. I use the word deadline to describe and rationalize my work load. 20. Going somewhere, even to dinner, with a notebook or my work numbers is something I do.',
      hasTextBox: true,
      isListInput: true,
      listCount: 20,
    },
  };

  // Handler functions
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
    if (!newArchiveData[today].week10Responses) {
      newArchiveData[today].week10Responses = {};
    }
    newArchiveData[today].week10Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week10:prompt${promptNumber}`, text);
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
    if (!newArchiveData[today].week10Responses) {
      newArchiveData[today].week10Responses = {};
    }
    newArchiveData[today].week10Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week10:prompt${promptNumber}`, { text, items });
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
        week 10
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
        Six prompts on the path
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
        {/* Buttons - 6 buttons arranged in circle */}
        {Object.values(prompts).map((prompt) => {
          const angle = ((prompt.number - 1) * (360 / 6) - 90) * (Math.PI / 180);
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

          {/* List Input Response (Prompts 1, 3, 4, 5, 6) */}
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

          {/* Text Box Response (Prompt 2) */}
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
        </div>
      )}
    </div>
  );
};

export default Week10;
