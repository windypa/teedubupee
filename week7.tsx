// ============================================================================
// WEEK 7 COMPONENT - EXACT MATCH TO WEEK 1, 2, 3, 4, 5, & 6 STRUCTURE
// ============================================================================
// This component should replace Week 1, 2, 3, 4, 5, & 6 rendering in the main app
// when currentWeek === 7

import React, { useState } from 'react';

const Week7 = ({ archiveData, setArchiveData, storageSet }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  // Week 7 Prompts - Same structure as Week 1, 2, 3, 4, 5, & 6
  const prompts = {
    1: {
      number: 1,
      prompt: 'Make this phrase a mantra: Treating myself like a precious object will make me strong. Watercolor or crayon or calligraph this phrase. Post it where you will see it daily. We tend to think being hard on ourselves will make us strong. But it is cherishing ourselves that gives us strength.',
      hasTextBox: false,
    },
    2: {
      number: 2,
      prompt: 'Give yourself time out to listen to one side of an album, just for joy. You may want to doodle as you listen, allowing yourself to draw the shapes, emotions, thoughts you hear in the music. Notice how just twenty minutes can refresh you. Learn to take these mini—artist dates to break stress and allow insight.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      prompt: 'Take yourself into a sacred space—a church, synagogue, library, grove of trees—and allow yourself to savor the silence and healing solitude. Each of us has a personal idea of what sacred space is. For me, a large clock store or a great aquarium store can engender a sense of timeless wonder. Experiment.',
      hasTextBox: false,
    },
    4: {
      number: 4,
      prompt: 'Create one wonderful smell in your house—with soup, incense, fir branches, candles—whatever.',
      hasTextBox: false,
    },
    5: {
      number: 5,
      prompt: 'Wear your favorite item of clothing for no special occasion.',
      hasTextBox: false,
    },
    6: {
      number: 6,
      prompt: 'Buy yourself one wonderful pair of socks, one wonderful pair of gloves—one wonderfully comforting, self-loving something.',
      hasTextBox: false,
    },
    7: {
      number: 7,
      prompt: 'Collect a stack of at least ten magazines, newspapers, or print scraps of any kind which you will allow yourself to freely dismember. Setting a twenty-minute time limit for yourself, tear (literally) through the magazines, collecting any images that reflect your life or interests. Think of this collage as a form of pictorial autobiography. Include your past, present, future, and your dreams. It is okay to include images you simply like. Keep pulling until you have a good stack of images (at least twenty). Now take a sheet of newspaper, a stapler, or some tape or glue, and arrange your images in a way that pleases you.',
      hasTextBox: false,
    },
    8: {
      number: 8,
      prompt: 'Quickly list five favorite films. Do you see any common denominators among them? Are they romances, adventures, period pieces, political dramas, family epics, thrillers? Do you see traces of your cinematic themes in your collage?',
      hasTextBox: true,
      isListInput: true,
      listCount: 5,
      hasAdditionalResponse: true,
    },
    9: {
      number: 9,
      prompt: 'Name your favorite topics to read about: comparative religion, movies, ESP, physics, rags-to-riches, betrayal, love triangles, scientific breakthroughs, sports... Are these topics in your collage?',
      hasTextBox: true,
    },
    10: {
      number: 10,
      prompt: 'Give your collage a place of honor. Even a secret place of honor is all right—in your closet, in a drawer, anywhere that is yours. You may want to do a new one every few months, or collage more thoroughly a dream you are trying to accomplish.',
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
    if (!newArchiveData[today].week7Responses) {
      newArchiveData[today].week7Responses = {};
    }
    newArchiveData[today].week7Responses[promptNumber] = {
      text,
      items,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week7:prompt${promptNumber}`, { text, items });
    } catch (error) {
      console.error('Error saving response:', error);
    }

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
    if (!newArchiveData[today].week7Responses) {
      newArchiveData[today].week7Responses = {};
    }
    newArchiveData[today].week7Responses[promptNumber] = {
      text,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week7:prompt${promptNumber}`, text);
    } catch (error) {
      console.error('Error saving response:', error);
    }

    setExpandedPrompt(null);
  };

  const handleSaveListAndResponse = async (promptNumber, items, additionalText) => {
    const text = items.join('\n');
    const fullText = `Favorite Films:\n${text}\n\nCommon Denominators & Themes:\n${additionalText}`;

    setPromptResponses({
      ...promptResponses,
      [promptNumber]: {
        completed: true,
        text: fullText,
        items,
        additionalResponse: additionalText,
        timestamp: new Date().toISOString(),
      },
    });

    // Save to archive
    const today = new Date().toISOString().split('T')[0];
    const newArchiveData = { ...archiveData };
    if (!newArchiveData[today]) {
      newArchiveData[today] = {};
    }
    if (!newArchiveData[today].week7Responses) {
      newArchiveData[today].week7Responses = {};
    }
    newArchiveData[today].week7Responses[promptNumber] = {
      text: fullText,
      items,
      additionalResponse: additionalText,
      timestamp: new Date().toISOString(),
    };
    setArchiveData(newArchiveData);

    try {
      await storageSet(`windingPath:week7:prompt${promptNumber}`, { text: fullText, items, additionalResponse: additionalText });
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
        week 7
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

          {/* List Input with Additional Response (Prompt 8) */}
          {prompts[expandedPrompt].isListInput && prompts[expandedPrompt].hasAdditionalResponse && (
            <div>
              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
                Your Favorite Films:
              </p>
              {[...Array(prompts[expandedPrompt].listCount)].map((_, index) => (
                <input
                  key={index}
                  id={`list-item-${expandedPrompt}-${index}`}
                  type="text"
                  placeholder={`Film ${index + 1}...`}
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
              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', marginTop: '16px' }}>
                Common Denominators & Cinematic Themes:
              </p>
              <textarea
                id={`additional-response-${expandedPrompt}`}
                placeholder="Do you see common themes? Are they in your collage?"
                defaultValue={promptResponses[expandedPrompt]?.additionalResponse || ''}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: `1px solid #030f42`,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: '#030f42',
                  marginBottom: '12px',
                  resize: 'vertical',
                }}
              />
              <button
                onClick={() => {
                  const items = [...Array(prompts[expandedPrompt].listCount)].map((_, index) =>
                    document.getElementById(`list-item-${expandedPrompt}-${index}`).value
                  );
                  const additionalText = document.getElementById(`additional-response-${expandedPrompt}`).value;
                  handleSaveListAndResponse(expandedPrompt, items, additionalText);
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

          {/* Text Box Response (Prompt 9) */}
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

          {/* No Response - Just Confirm Button */}
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

export default Week7;
