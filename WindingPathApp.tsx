import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

// ============================================================================
// SUPABASE CONFIGURATION
// ============================================================================
const SUPABASE_URL = 'https://ycbiujwhcyeaiqbkwmjr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljYml1andoY3llYWlxYmt3bWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzg5MDQsImV4cCI6MjA4MTgxNDkwNH0.qeuGfuRxAmL6R5H7pa8wvbtLDJ9aayCp5PhrHlvC3CQ';

// Supabase client will be initialized in the component if credentials are provided
// This avoids import errors in environments where @supabase/supabase-js isn't available

/*
 * ============================================================================
 * SUPABASE DATABASE SCHEMA
 * ============================================================================
 * 
 * Table: users
 * - id: uuid (primary key, auto-generated)
 * - email: text (unique, not null)
 * - name: text
 * - signature: text
 * - check_in_day: text
 * - start_date: date
 * - created_at: timestamp with time zone (default now())
 * - updated_at: timestamp with time zone (default now())
 * 
 * Table: page_entries
 * - id: uuid (primary key, auto-generated)
 * - user_id: uuid (foreign key to users.id)
 * - content: text
 * - word_count: integer
 * - week: integer
 * - entry_date: date
 * - created_at: timestamp with time zone (default now())
 * 
 * Table: landscape_responses
 * - id: uuid (primary key, auto-generated)
 * - user_id: uuid (foreign key to users.id)
 * - prompt_key: text
 * - response: text
 * - week: integer
 * - created_at: timestamp with time zone (default now())
 * 
 * Table: check_in_responses
 * - id: uuid (primary key, auto-generated)
 * - user_id: uuid (foreign key to users.id)
 * - responses: jsonb
 * - check_in_date: date
 * - created_at: timestamp with time zone (default now())
 * 
 * Table: collages
 * - id: uuid (primary key, auto-generated)
 * - user_id: uuid (foreign key to users.id)
 * - collage_data: jsonb
 * - created_at: timestamp with time zone (default now())
 * 
 * Table: email_events
 * - id: uuid (primary key, auto-generated)
 * - user_id: uuid (foreign key to users.id)
 * - event_type: text (e.g., 'daily_reminder', 'weekly_greeting', 'check_in_reminder')
 * - scheduled_for: timestamp with time zone
 * - sent_at: timestamp with time zone
 * - status: text (e.g., 'pending', 'sent', 'failed')
 * - created_at: timestamp with time zone (default now())
 * 
 * ============================================================================
 */

/*
 * ============================================================================
 * STYLING REFERENCE - DO NOT MODIFY THESE VALUES
 * ============================================================================
 * 
 * GLOBAL LAYOUT:
 * - Main container: min-h-screen bg-white flex
 * - Sidebar: w-48, p-6, border-r
 * - Main content: flex-1, p-12, marginLeft: 3rem, marginRight: 3rem
 * 
 * TYPOGRAPHY:
 * - Font family: 'Helvetica, Arial, sans-serif'
 * - Primary color: #030f42
 * - Headers: text-4xl, fontWeight: normal
 * - Body text: fontSize 13-15px
 * - Small text: fontSize 10-12px
 * 
 * SPACING PATTERNS:
 * - Section margins: mb-8, mb-12
 * - Inner padding: p-6, p-8, p-12
 * - Element gaps: gap-2, gap-6, gap-8
 * - Button padding: px-3 py-2, px-4 py-3
 * - List spacing: space-y-3, space-y-4, space-y-6
 * 
 * COMPONENT-SPECIFIC:
 * - Archive toggle: mb-8 p-6 border
 * - Calendar grid: gap-1
 * - Collage editor controls: mb-6 p-3 border
 * - Weekly prompts container: padding: 24px
 * - Progress indicator: mb-12 p-8 border
 * - Check-in section: mt-8 p-8 border
 * 
 * BORDERS:
 * - Standard: border, borderColor: #030f42
 * - Light borders: borderColor: #e5e7eb
 * 
 * ============================================================================
 */

// Clocktower Archive Component
const ClocktowerArchive = ({ archiveData = {} }) => {
  const [showArchive, setShowArchive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [archivedDates, setArchivedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayData, setDisplayData] = useState({});
  const [selectedCollageIndex, setSelectedCollageIndex] = useState(0);

  // Use provided archive data
  useEffect(() => {
    if (Object.keys(archiveData).length > 0) {
      setDisplayData(archiveData);
      const dates = Object.keys(archiveData).sort().reverse();
      setArchivedDates(dates);
      console.log('Archive data loaded. Total dates with data:', dates.length);
    }
  }, [archiveData, showArchive]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const dateToString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const dateHasArchive = (date) => {
    return archivedDates.includes(dateToString(date));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = dateToString(date);
    if (archivedDates.includes(dateStr)) {
      setSelectedDate(dateStr);
      setSelectedCollageIndex(0); // Reset to first collage
    }
  };

  const selectedArchive = selectedDate ? displayData[selectedDate] : null;

  const calendarDays = generateCalendar();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <h1 
        className="text-4xl mb-2"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
      >
        the clocktower
      </h1>
      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.7, marginBottom: '24px' }}>
        Browse your creative archive by date
      </p>

      {/* Archive Toggle */}
      <div className="mb-8 p-6 border" style={{ borderColor: '#030f42' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '15px', marginBottom: '4px' }}>
              {showArchive ? 'i need to see my archive' : "i don't need to see my archive"}
            </h2>
          </div>
          <button
            onClick={() => setShowArchive(!showArchive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all`}
            style={{ 
              backgroundColor: showArchive ? '#030f42' : '#d1d5db',
            }}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                showArchive ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Calendar and Archive View */}
      {showArchive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="border p-6" style={{ borderColor: '#030f42' }}>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="px-3 py-2 border hover:opacity-70 transition-all"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '12px' }}
                >
                  ←
                </button>
                <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold' }}>
                  {monthName}
                </h3>
                <button
                  onClick={nextMonth}
                  className="px-3 py-2 border hover:opacity-70 transition-all"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '12px' }}
                >
                  →
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '10px', textAlign: 'center', fontWeight: 'bold', opacity: 0.6, padding: '4px' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const hasArchive = day ? dateHasArchive(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) : false;
                  const dateStr = day ? dateToString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)) : null;
                  const isSelected = dateStr === selectedDate;
                  const today = dateToString(new Date());
                  const isToday = dateStr === today;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      disabled={!day || !hasArchive}
                      className={`p-2 border text-xs transition-all relative ${
                        isSelected ? '' : hasArchive ? 'hover:opacity-70' : ''
                      }`}
                      style={{
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: isToday ? '#030f42' : '#030f42',
                        backgroundColor: isSelected ? '#030f42' : hasArchive ? '#f8f9fa' : 'transparent',
                        color: isSelected ? 'white' : '#030f42',
                        opacity: !day || !hasArchive ? 0.2 : 1,
                        cursor: hasArchive ? 'pointer' : 'default',
                        borderWidth: isToday ? '2px' : '1px',
                        fontWeight: isToday ? 'bold' : 'normal',
                      }}
                      title={isToday ? 'Today' : ''}
                    >
                      {day}
                      {isToday && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '1px',
                            right: '1px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'white' : '#030f42',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '10px', opacity: 0.5, marginTop: '12px' }}>
                {archivedDates.length} date{archivedDates.length !== 1 ? 's' : ''} with saved data
              </p>
            </div>
          </div>

          {/* Archive Details */}
          <div className="lg:col-span-2">
            {selectedArchive ? (
              <div className="border p-6" style={{ borderColor: '#030f42' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '16px', fontWeight: 'bold' }}>
                    {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  {selectedDate === new Date().toISOString().split('T')[0] && (
                    <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', padding: '4px 8px', backgroundColor: '#f8f9fa', border: '1px solid #030f42' }}>
                      today
                    </span>
                  )}
                </div>

                {selectedArchive.pages && (
                  <div className="mb-8">
                    <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      The Pages Entry
                    </h4>
                    <div className="p-4 border bg-gray-50 max-h-64 overflow-y-auto" style={{ borderColor: '#030f42' }}>
                      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {selectedArchive.pages}
                      </p>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                      {selectedArchive.pages.split(/\s+/).filter((w) => w.length > 0).length} words
                    </p>
                  </div>
                )}

                {/* Daily Page Entry */}
                {selectedArchive.pageEntry && (
                  <div className="mb-8">
                    <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Daily Page Entry {selectedArchive.week && `(Week ${selectedArchive.week})`}
                    </h4>
                    <div className="p-4 border bg-gray-50 max-h-64 overflow-y-auto" style={{ borderColor: '#030f42' }}>
                      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {selectedArchive.pageEntry}
                      </p>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                      {selectedArchive.pageEntry.split(/\s+/).filter((w) => w.length > 0).length} words
                    </p>
                  </div>
                )}

                {/* Landscape Responses */}
                {selectedArchive.landscapeResponses && Object.keys(selectedArchive.landscapeResponses).length > 0 && (
                  <div className="mb-8">
                    <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Landscape Prompts ({Object.keys(selectedArchive.landscapeResponses).length} responses)
                    </h4>
                    <div className="p-4 border bg-gray-50 max-h-96 overflow-y-auto space-y-3" style={{ borderColor: '#030f42' }}>
                      {Object.entries(selectedArchive.landscapeResponses).map(([key, value]) => (
                        <div key={key} className="pb-2 border-b border-gray-200 last:border-0">
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.6, marginBottom: '2px' }}>
                            {key}
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.5' }}>
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArchive.responses && (
                  <div className="mb-8">
                    <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Check-in Responses
                    </h4>
                    <div className="space-y-4">
                      {selectedArchive.responses.pages && (
                        <div className="p-4 border" style={{ borderColor: '#030f42' }}>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                            The Pages
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {selectedArchive.responses.pages}
                          </p>
                        </div>
                      )}
                      {selectedArchive.responses.pitStop && (
                        <div className="p-4 border" style={{ borderColor: '#030f42' }}>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                            Pit Stop
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {selectedArchive.responses.pitStop}
                          </p>
                        </div>
                      )}
                      {selectedArchive.responses.synchronicity && (
                        <div className="p-4 border" style={{ borderColor: '#030f42' }}>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                            Synchronicity
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {selectedArchive.responses.synchronicity}
                          </p>
                        </div>
                      )}
                      {selectedArchive.responses.otherIssues && (
                        <div className="p-4 border" style={{ borderColor: '#030f42' }}>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                            Other Issues
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                            {selectedArchive.responses.otherIssues}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedArchive.collages && selectedArchive.collages.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Collage Gallery ({selectedArchive.collages.length})
                    </h4>
                    
                    {/* Slide Gallery */}
                    <div style={{ 
                      border: `2px solid #030f42`,
                      backgroundColor: '#f8f9fa',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      {/* Current slide - Render entire collage composition */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundColor: 'white',
                        border: `1px solid #030f42`,
                        marginBottom: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: '400px',
                      }}>
                        {/* Collage canvas area - scaled to fit all content */}
                        {(() => {
                          const currentCollage = selectedArchive.collages[selectedCollageIndex];
                          if (!currentCollage.items || currentCollage.items.length === 0) {
                            return (
                              <div style={{
                                width: '100%',
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5 }}>
                                  No items in composition
                                </p>
                              </div>
                            );
                          }

                          // Calculate bounding box of all items
                          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                          
                          currentCollage.items.forEach(item => {
                            const x1 = item.x;
                            const y1 = item.y;
                            const x2 = item.x + item.width;
                            const y2 = item.y + item.height;
                            
                            minX = Math.min(minX, x1);
                            maxX = Math.max(maxX, x2);
                            minY = Math.min(minY, y1);
                            maxY = Math.max(maxY, y2);
                          });

                          const canvasWidth = maxX - minX + 40; // Add padding
                          const canvasHeight = maxY - minY + 40;
                          const scale = Math.min(550 / canvasWidth, 350 / canvasHeight, 1); // Max 550x350, don't scale up
                          const scaledWidth = canvasWidth * scale;
                          const scaledHeight = canvasHeight * scale;

                          return (
                            <div style={{
                              position: 'relative',
                              width: `${scaledWidth}px`,
                              height: `${scaledHeight}px`,
                              backgroundColor: 'white',
                              margin: '20px',
                            }}>
                              {currentCollage.items.map(item => (
                                <div
                                  key={item.id}
                                  style={{
                                    position: 'absolute',
                                    left: `${(item.x - minX + 20) * scale}px`,
                                    top: `${(item.y - minY + 20) * scale}px`,
                                    width: `${item.width * scale}px`,
                                    height: `${item.height * scale}px`,
                                    zIndex: item.zIndex,
                                    transform: `rotate(${item.rotation}deg) scaleX(${item.scaleX}) scaleY(${item.scaleY})`,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <img
                                    src={item.src}
                                    alt="collage item"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      pointerEvents: 'none',
                                      userSelect: 'none',
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Info bar */}
                        <div style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          borderTop: `1px solid #030f42`,
                          textAlign: 'center',
                        }}>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {selectedArchive.collages[selectedCollageIndex].title}
                          </p>
                          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '10px', opacity: 0.6, margin: '0' }}>
                            {new Date(selectedArchive.collages[selectedCollageIndex].timestamp).toLocaleDateString()} at {new Date(selectedArchive.collages[selectedCollageIndex].timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setSelectedCollageIndex(prev => prev === 0 ? selectedArchive.collages.length - 1 : prev - 1)}
                          style={{
                            padding: '8px 12px',
                            border: `1px solid #030f42`,
                            backgroundColor: 'white',
                            color: '#030f42',
                            cursor: 'pointer',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          ← Previous
                        </button>
                        
                        <div style={{
                          flex: 1,
                          textAlign: 'center',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          color: '#030f42',
                          fontSize: '12px'
                        }}>
                          {selectedCollageIndex + 1} / {selectedArchive.collages.length}
                        </div>

                        <button
                          onClick={() => setSelectedCollageIndex(prev => prev === selectedArchive.collages.length - 1 ? 0 : prev + 1)}
                          style={{
                            padding: '8px 12px',
                            border: `1px solid #030f42`,
                            backgroundColor: 'white',
                            color: '#030f42',
                            cursor: 'pointer',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontSize: '14px',
                          }}
                        >
                          Next →
                        </button>
                      </div>

                      {/* Thumbnail strip */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        marginTop: '12px',
                        overflowX: 'auto',
                        paddingBottom: '4px'
                      }}>
                        {selectedArchive.collages.map((collage, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCollageIndex(idx)}
                            style={{
                              padding: '6px 12px',
                              border: `2px solid ${selectedCollageIndex === idx ? '#030f42' : '#030f42'}`,
                              backgroundColor: selectedCollageIndex === idx ? '#030f42' : 'white',
                              color: selectedCollageIndex === idx ? 'white' : '#030f42',
                              cursor: 'pointer',
                              fontFamily: 'Helvetica, Arial, sans-serif',
                              fontSize: '11px',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!selectedArchive.pages && !selectedArchive.responses && !selectedArchive.pageEntry && !selectedArchive.landscapeResponses && (!selectedArchive.collages || selectedArchive.collages.length === 0) && (
                  <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5, fontSize: '13px' }}>
                    No archived data for this date
                  </p>
                )}
              </div>
            ) : (
              <div className="border p-6 text-center" style={{ borderColor: '#030f42' }}>
                <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5 }}>
                  Select a date with archived data to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!showArchive && (
        <div className="p-12 text-center">
          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5 }}>
            Enable the archive toggle to view your saved work by date
          </p>
        </div>
      )}
    </div>
  );
};


// Collage Editor Component
const CollageEditor = ({ storageSet, archiveData, setArchiveData }) => {
  const [items, setItems] = useState([
    { id: 1, src: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEsASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==', x: 50, y: 50, rotation: 0, scaleX: 1, scaleY: 1, zIndex: 1, width: 200, height: 200 },
  ]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [collageTitle, setCollageTitle] = useState('Untitled Collage');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [transparencyThreshold, setTransparencyThreshold] = useState(220);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const saveCollage = async () => {
    setSaveStatus('saving');
    const collageData = {
      title: collageTitle || 'Untitled Collage',
      items: items,
      timestamp: new Date().toISOString(),
    };
    
    try {
      // Save to local storage using the storageSet function passed as prop
      await storageSet('windingPath:collage:current', collageData);
      console.log('Collage saved to local storage:', collageData.title);
      
      // Also add to archiveData state so it appears immediately in clocktower
      const today = new Date().toISOString().split('T')[0];
      const newArchiveData = { ...archiveData };
      if (!newArchiveData[today]) {
        newArchiveData[today] = {};
      }
      if (!newArchiveData[today].collages) {
        newArchiveData[today].collages = [];
      }
      
      // Check if collage with same title already exists for today
      const existingIndex = newArchiveData[today].collages.findIndex(c => c.title === collageData.title);
      if (existingIndex >= 0) {
        newArchiveData[today].collages[existingIndex] = {
          title: collageData.title,
          itemCount: items.length,
          timestamp: collageData.timestamp,
          items: items, // Store full composition data for display
        };
      } else {
        newArchiveData[today].collages.push({
          title: collageData.title,
          itemCount: items.length,
          timestamp: collageData.timestamp,
          items: items, // Store full composition data for display
        });
      }
      
      setArchiveData(newArchiveData);
      console.log('Collage added to archive state for date:', today);
      
      setSaveStatus('saved');
      setTimeout(() => {
        alert('Collage saved successfully!');
      }, 100);
    } catch (err) {
      console.error('Error saving collage:', err);
      setSaveStatus('saved');
      setTimeout(() => {
        alert('Collage saved locally');
      }, 100);
    }
  };

  const exportCollage = () => {
    try {
      // Calculate bounding box
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      
      if (items.length === 0) {
        alert('No items to export');
        return;
      }

      items.forEach(item => {
        minX = Math.min(minX, item.x);
        maxX = Math.max(maxX, item.x + item.width);
        minY = Math.min(minY, item.y);
        maxY = Math.max(maxY, item.y + item.height);
      });

      const padding = 20;
      const canvasWidth = maxX - minX + padding * 2;
      const canvasHeight = maxY - minY + padding * 2;

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        alert('Could not get canvas context');
        return;
      }

      // Fill with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw each item
      let loadedCount = 0;
      const totalItems = items.length;

      items.forEach((item, index) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          loadedCount++;
          
          const x = item.x - minX + padding;
          const y = item.y - minY + padding;

          ctx.save();
          ctx.translate(x + item.width / 2, y + item.height / 2);
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.scale(item.scaleX, item.scaleY);
          ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);
          ctx.restore();

          // Once all images are loaded, download
          if (loadedCount === totalItems) {
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${collageTitle || 'collage'}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 'image/png');
          }
        };

        img.onerror = () => {
          console.error('Failed to load image:', item.src);
          loadedCount++;
          
          // Continue anyway with remaining images
          if (loadedCount === totalItems) {
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${collageTitle || 'collage'}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 'image/png');
          }
        };

        img.src = item.src;
      });

    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting collage: ' + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Load the image to get its dimensions and maintain aspect ratio
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const baseWidth = 200;
          const baseHeight = baseWidth / aspectRatio;
          
          const newItem = {
            id: Date.now(),
            src: event.target.result,
            x: Math.random() * 200 + 100,
            y: Math.random() * 200 + 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: Math.max(...items.map(i => i.zIndex)) + 1,
            width: baseWidth,
            height: baseHeight,
          };
          setItems([...items, newItem]);
          setSelectedId(newItem.id);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlUpload = async () => {
    if (!imageUrl.trim()) return;

    setIsLoadingUrl(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const baseWidth = 200;
        const baseHeight = baseWidth / aspectRatio;

        const newItem = {
          id: Date.now(),
          src: imageUrl,
          x: Math.random() * 200 + 100,
          y: Math.random() * 200 + 100,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          zIndex: Math.max(...items.map(i => i.zIndex)) + 1,
          width: baseWidth,
          height: baseHeight,
        };
        setItems([...items, newItem]);
        setSelectedId(newItem.id);
        setImageUrl('');
        setIsLoadingUrl(false);
      };

      img.onerror = () => {
        alert('Failed to load image from URL. Make sure the URL is correct and the image is accessible.');
        setIsLoadingUrl(false);
      };

      img.src = imageUrl;
    } catch (error) {
      alert('Error loading image from URL');
      setIsLoadingUrl(false);
    }
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    setSelectedId(id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedId) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setItems(items.map(item =>
      item.id === selectedId
        ? { ...item, x: item.x + deltaX, y: item.y + deltaY }
        : item
    ));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateItem = (id, updates) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const sendToBack = () => {
    if (!selectedId) return;
    const minZ = Math.min(...items.map(i => i.zIndex));
    updateItem(selectedId, { zIndex: minZ - 1 });
  };

  const sendToFront = () => {
    if (!selectedId) return;
    const maxZ = Math.max(...items.map(i => i.zIndex));
    updateItem(selectedId, { zIndex: maxZ + 1 });
  };

  const flipH = () => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    updateItem(selectedId, { scaleX: item.scaleX * -1 });
  };

  const flipV = () => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    updateItem(selectedId, { scaleY: item.scaleY * -1 });
  };

  const rotate = (degrees) => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    updateItem(selectedId, { rotation: (item.rotation + degrees) % 360 });
  };

  const deleteItem = () => {
    if (!selectedId) return;
    setItems(items.filter(i => i.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateItem = () => {
    if (!selectedId) return;
    const original = items.find(i => i.id === selectedId);
    const newItem = {
      ...original,
      id: Date.now(),
      x: original.x + 20,
      y: original.y + 20,
      zIndex: original.zIndex + 1,
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const makeTransparent = async () => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    if (!item) return;

    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Replace white/light pixels with transparency
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is light (near white)
        if (r > transparencyThreshold && g > transparencyThreshold && b > transparencyThreshold) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const newSrc = canvas.toDataURL('image/png');
      updateItem(selectedId, { src: newSrc });
    };

    img.src = item.src;
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedId, dragStart, items]);

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div>
      <h1 
        className="text-4xl mb-2"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
      >
        the well
      </h1>
      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.7, marginBottom: '24px' }}>
        Create collages by uploading and arranging images
      </p>

      {/* Transform Controls - Always Visible & Compact */}
      <div className="mb-6 p-3 border" style={{ borderColor: '#030f42' }}>
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-1">
          <button
            onClick={() => rotate(15)}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Rotate 15°"
          >
            ↻
          </button>
          <button
            onClick={flipH}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Flip Horizontal"
          >
            ⇄
          </button>
          <button
            onClick={flipV}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Flip Vertical"
          >
            ⇅
          </button>
          <button
            onClick={sendToFront}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Send to Front"
          >
            ↑
          </button>
          <button
            onClick={sendToBack}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Send to Back"
          >
            ↓
          </button>
          <button
            onClick={deleteItem}
            disabled={!selectedItem}
            className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all disabled:opacity-30"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '10px' }}
            title="Delete"
          >
            ✕
          </button>

          {/* Size Controls - Inline */}
          {selectedItem && (
            <>
              <div className="flex items-center gap-1 col-span-3">
                <label style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap' }}>
                  W
                </label>
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={selectedItem.width}
                  onChange={(e) => updateItem(selectedId, { width: parseInt(e.target.value) })}
                  className="w-full flex-1"
                  style={{ accentColor: '#030f42', height: '3px' }}
                />
                <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap', minWidth: '28px' }}>
                  {selectedItem.width}
                </span>
              </div>

              <div className="flex items-center gap-1 col-span-3">
                <label style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap' }}>
                  H
                </label>
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={selectedItem.height}
                  onChange={(e) => updateItem(selectedId, { height: parseInt(e.target.value) })}
                  className="w-full flex-1"
                  style={{ accentColor: '#030f42', height: '3px' }}
                />
                <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap', minWidth: '28px' }}>
                  {selectedItem.height}
                </span>
              </div>

              {/* Transparency Control - Inline */}
              <div className="flex items-center gap-1 col-span-6">
                <label style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap' }}>
                  ✨
                </label>
                <input
                  type="range"
                  min="150"
                  max="255"
                  value={transparencyThreshold}
                  onChange={(e) => setTransparencyThreshold(parseInt(e.target.value))}
                  className="w-full flex-1"
                  style={{ accentColor: '#030f42', height: '3px' }}
                />
                <button
                  onClick={makeTransparent}
                  className="px-1.5 py-1 border text-xs hover:opacity-70 transition-all"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', fontSize: '9px', whiteSpace: 'nowrap' }}
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Canvas - Wider */}
        <div className="flex-1 min-w-0">
          <div
            ref={canvasRef}
            className="relative border bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
            style={{
              borderColor: '#030f42',
              width: '100%',
              height: '600px',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {items.map(item => (
              <div
                key={item.id}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                className={`absolute transition-shadow cursor-grab active:cursor-grabbing border-2 ${
                  selectedId === item.id ? 'ring-2' : 'border-transparent hover:border-dashed'
                }`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                  zIndex: item.zIndex,
                  borderColor: selectedId === item.id ? '#030f42' : 'transparent',
                  transform: `rotate(${item.rotation}deg) scaleX(${item.scaleX}) scaleY(${item.scaleY})`,
                  boxShadow: selectedId === item.id ? '0 0 0 2px #030f42' : 'none',
                  cursor: 'grab',
                }}
              >
                <img
                  src={item.src}
                  alt="collage item"
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ))}

            {items.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.3 }}>
                  Upload or drag images to start
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel - Image Library & Save */}
        <div className="w-72">
          <div className="border p-4 space-y-4 sticky top-0" style={{ borderColor: '#030f42', maxHeight: '100vh', overflowY: 'auto' }}>
            {/* Collage Title */}
            <div>
              <label style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                Collage Title
              </label>
              <input
                type="text"
                value={collageTitle}
                onChange={(e) => setCollageTitle(e.target.value)}
                className="w-full px-3 py-2 border text-sm focus:outline-none"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  color: '#030f42',
                }}
              />
            </div>

            {/* Save & Export Buttons */}
            <div className="space-y-2 border-b pb-6" style={{ borderColor: '#030f42' }}>
              <button
                onClick={saveCollage}
                className="w-full px-4 py-2 border text-sm hover:opacity-70 transition-all"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  color: '#030f42',
                }}
              >
                💾 {saveStatus === 'saving' ? 'Saving...' : 'Save Collage'}
              </button>
              <button
                onClick={exportCollage}
                className="w-full px-4 py-2 border text-sm hover:opacity-70 transition-all"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  color: '#030f42',
                }}
              >
                ↓ Export as PNG
              </button>
            </div>

            {/* Image Library */}
            <div>
              <p className="text-sm font-semibold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}>
                Image Library
              </p>
              
              {/* Upload from File */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border font-semibold hover:opacity-70 transition-all mb-3"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  color: '#030f42',
                }}
              >
                + Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload from URL */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleImageUrlUpload()}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 border text-sm focus:outline-none"
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    borderColor: '#030f42',
                    color: '#030f42',
                  }}
                />
                <button
                  onClick={handleImageUrlUpload}
                  disabled={!imageUrl.trim() || isLoadingUrl}
                  className="px-3 py-2 border hover:opacity-70 transition-all disabled:opacity-30"
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    borderColor: '#030f42',
                    color: '#030f42',
                  }}
                >
                  {isLoadingUrl ? '...' : '→'}
                </button>
              </div>

              {/* Images in Collage */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.6, marginBottom: '8px' }}>
                  {items.length} image{items.length !== 1 ? 's' : ''} in collage
                </p>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-2 border cursor-pointer hover:opacity-80 transition-all ${
                      selectedId === item.id ? 'ring-2' : ''
                    }`}
                    style={{
                      borderColor: '#030f42',
                      backgroundColor: selectedId === item.id ? '#f8f9fa' : 'transparent',
                      ringColor: selectedId === item.id ? '#030f42' : 'transparent',
                    }}
                  >
                    <div
                      className="w-full h-24 bg-gray-200 mb-2 border overflow-hidden"
                      style={{ borderColor: '#030f42', opacity: 0.5 }}
                    >
                      <img
                        src={item.src}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px' }}>
                      Image {index + 1}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                          duplicateItem();
                        }}
                        className="flex-1 px-2 py-1 border text-xs hover:opacity-70 transition-all"
                        style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42' }}
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                          deleteItem();
                        }}
                        className="flex-1 px-2 py-1 border text-xs hover:opacity-70 transition-all"
                        style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!selectedItem && items.length > 0 && (
              <p className="text-sm text-center" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5 }}>
                Select an image on canvas or library to edit
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
// Weekly Prompts Component
const WeeklyPrompts = ({ currentWeek, storageSet, checkInDay, userEmail }) => {
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [promptResponses, setPromptResponses] = useState({});

  const prompts = {
    1: {
      number: 1,
      title: 'The Pages',
      prompt: 'Every morning, set your clock one-half hour early; get up and write three pages of longhand, stream-of-consciousness morning writing. Do not reread these pages or allow anyone else to read them. Ideally, stick these pages in a large manila envelope, or hide them somewhere. Welcome to the pages. They will change you. Go confidently in the direction of your dreams! Live the life you\'ve imagined. This week, pay attention to the affirmations that move you, as well as the negative voices that start to surface along the way. Work with them at the end of your morning pages. Convert all negative blurts into positive affirmations.',
      hasTextBox: false,
    },
    2: {
      number: 2,
      title: 'Pit Stop',
      prompt: 'It has many names, but we call it the pit stop. You will do this every week for the duration of the road. A sample pit stop: take five dollars and buy what you please. Toothpicks, nail polish, a kid\'s scissors, a pen that glides just right. Give yourself the meager tools for inspiration and heart\'s content.',
      hasTextBox: false,
    },
    3: {
      number: 3,
      title: 'Time Travel: Enemies',
      prompt: 'Time Travel: List three old enemies of your creative self-worth. Please be as specific as possible in doing this exercise. Your historic monsters are the building blocks of your core negative beliefs. It is necessary to acknowledge creative injuries and grieve them. Otherwise, they become creative scar tissue and block your growth.',
      hasTextBox: true,
    },
    4: {
      number: 4,
      title: 'Monster Stories',
      prompt: 'Time Travel: Select and write out one horror story from your monster hall of fame. You do not need to write long or much, but do jot down whatever details come back to you—the room you were in, the way people looked at you, the way you felt, what your parent said or didn\'t say when you told about it.',
      hasTextBox: true,
    },
    5: {
      number: 5,
      title: 'Letter of Defense',
      prompt: 'Write a "letter to the editor" in your defense. Mail it to yourself. Why not try on the voice of your wounded artist child: "To whom it may concern: Sister Ann Rita is a jerk and has pig eyes and I can too spell!"',
      hasTextBox: true,
      isMailable: true,
    },
    6: {
      number: 6,
      title: 'Hall of Champions',
      prompt: 'Time Travel: List three old champions of your creative self-worth. This is your hall of champions, those who wish you and your creativity well. Be specific. Every encouraging word counts. Even if you disbelieve a compliment, record it. It may well be true. If you are stuck for compliments, go back through your time-travel log and look for positive memories. When, where, and why did you feel good about yourself? Who gave you affirmation? Additionally, you may wish to write the compliment out and decorate it. Post it near where you do your morning pages or on the dashboard of your car.',
      hasTextBox: true,
    },
    7: {
      number: 7,
      title: 'Happy Encouragement',
      prompt: 'Select and write out one happy piece of encouragement. Write a thank-you letter. Mail it to yourself or to the long-lost mentor.',
      hasTextBox: false,
    },
    8: {
      number: 8,
      title: 'Imaginary Lives',
      prompt: 'Imaginary Lives: If you had five other lives to lead, what would you do in each of them? Whatever occurs to you, jot it down. Do not overthink this exercise. The point of these lives is to have fun in them— more fun than you might be having in this one. Look over your list and select one. Then do it this week. For instance, if you put down country singer, can you pick a guitar? If you dream of being a cowhand, what about some horseback riding?',
      hasTextBox: true,
    },
    9: {
      number: 9,
      title: 'Affirmations & Blurts',
      prompt: 'In working with affirmations and blurts, very often injuries and monsters swim back to us. Add these to your writing as it occurs to you. Work with each blurt individually. Turn each negative into an affirmative positive.',
      hasTextBox: false,
    },
    10: {
      number: 10,
      title: 'Artist Walk',
      prompt: 'Take your artist for a walk, the two of you. A brisk twenty-minute walk.',
      hasTextBox: false,
    },
  };

  const handleConfirm = (promptNumber) => {
    setPromptResponses({
      ...promptResponses,
      [promptNumber]: { completed: true, timestamp: new Date().toISOString() },
    });
    setExpandedPrompt(null);
  };

  const handleSaveResponse = async (promptNumber, text) => {
    const response = {
      completed: true,
      text: text,
      timestamp: new Date().toISOString(),
      week: currentWeek,
    };
    setPromptResponses({
      ...promptResponses,
      [promptNumber]: response,
    });
    
    // Save to storage
    await storageSet(`windingPath:weeklyPrompt:w${currentWeek}-p${promptNumber}`, response);
    
    // If this is a mailable prompt (5), schedule it to send in 3 days
    if (promptNumber === 5 && userEmail) {
      const sendDate = new Date();
      sendDate.setDate(sendDate.getDate() + 3);
      
      await storageSet(`windingPath:mailablePrompt:w${currentWeek}-p${promptNumber}`, {
        ...response,
        sendOn: sendDate.toISOString().split('T')[0],
        recipientEmail: userEmail,
        scheduledSend: true,
      });
    }
    
    setExpandedPrompt(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Circular prompt buttons */}
      <div style={{ position: 'relative', width: '100%', height: '600px', margin: '0 auto' }}>
        {/* Center image/text - can be replaced with external image */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', margin: '0', opacity: 0.5 }}>
            coming soon
          </p>
        </div>

        {/* 10 circular prompt buttons floating around - clockwise from top */}
        {Object.entries(prompts).map(([key, prompt]) => {
          // Clockwise from top: -90 degrees offset so 0 is at top
          const angle = ((parseInt(key) - 1) * (360 / 10) - 90) * (Math.PI / 180);
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
              Prompt {expandedPrompt}: {prompts[expandedPrompt].title}
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

          {prompts[expandedPrompt].hasTextBox ? (
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
                {prompts[expandedPrompt].isMailable ? 'Save & Mail in 3 Days' : 'Save Response'}
              </button>
            </div>
          ) : (
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

const WindingPathApp = () => {
  // App State
  const [appState, setAppState] = useState('loading');
  const [currentPage, setCurrentPage] = useState('path');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Supabase client ref (initialized once in useEffect)
  const supabaseRef = useRef(null);

  // User Data
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [userSignature, setUserSignature] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [checkInDay, setCheckInDay] = useState('');
  const [delayFirstCheckIn, setDelayFirstCheckIn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Landscape Page State
  const [landscapeActiveLayer, setLandscapeActiveLayer] = useState(null); // null = show all, 1-12 = specific week
  const [landscapePopup, setLandscapePopup] = useState(null); // null, 'principles', 'stop', 'affirmations', 'rules', etc.
  const [landscapeDragging, setLandscapeDragging] = useState(null); // which object is being dragged
  const [landscapePositions, setLandscapePositions] = useState({
    // Week 1 - Stars in the sky
    star1: { x: 25, y: 10 },
    star2: { x: 50, y: 7 },
    star3: { x: 72, y: 13 },
    // Week 2 - Floating words and signpost
    word_sanity: { x: 20, y: 22 },
    word_skepticism: { x: 55, y: 18 },
    word_attention: { x: 80, y: 25 },
    signpost: { x: 35, y: 35 },
    // Week 3 - Words and trees
    word_anger: { x: 15, y: 15 },
    word_synchronicity: { x: 42, y: 12 },
    word_shame: { x: 68, y: 18 },
    word_growth: { x: 88, y: 10 },
    tree1: { x: 20, y: 75 },
    tree2: { x: 50, y: 70 },
    tree3: { x: 78, y: 78 },
    // Week 4 - Flying birds
    bird1: { x: 30, y: 28 },
    bird2: { x: 55, y: 32 },
    bird3: { x: 75, y: 26 },
    bird4: { x: 18, y: 38 },
    // Week 5 - Clouds
    cloud1: { x: 15, y: 18 },
    cloud2: { x: 58, y: 14 },
    cloud3: { x: 85, y: 20 },
    // Week 6 - House
    house: { x: 65, y: 72 },
    // Week 7 - Wind swirls
    wind1: { x: 10, y: 45 },
    wind2: { x: 40, y: 42 },
    wind3: { x: 70, y: 48 },
    wind4: { x: 90, y: 40 },
    // Week 8 - Deer
    deer1: { x: 22, y: 78 },
    deer2: { x: 48, y: 82 },
    deer3: { x: 78, y: 80 },
    // Week 9 - Sun
    sun: { x: 88, y: 12 },
    // Week 10 - Moon
    moon: { x: 8, y: 12 },
    // Week 11 - Walking people
    walker1: { x: 50, y: 68 },
    walker2: { x: 38, y: 72 },
    // Week 12 - Winding road
    road: { x: 50, y: 55 },
  });
  const [landscapeDragStart, setLandscapeDragStart] = useState({ x: 0, y: 0 });
  const landscapeRef = useRef(null);
  
  // Landscape interactive responses (for prompts with input fields)
  const [landscapeResponses, setLandscapeResponses] = useState({
    synchronicity1: '',
    synchronicity2: '',
    synchronicity3: '',
    synchronicity4: '',
  });

  // Program Data
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedPath, setSelectedPath] = useState({});
  const [journalEntries, setJournalEntries] = useState({});
  const [pageEntry, setPageEntry] = useState('');
  const [archiveData, setArchiveData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [supabaseUserId, setSupabaseUserId] = useState(null);

  // Notification preferences
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(false);
  const [weeklyGreetings, setWeeklyGreetings] = useState(false);
  const [checkInReminders, setCheckInReminders] = useState(false);

  // Dev/test controls
  const [devStartDate, setDevStartDate] = useState('');
  const [devJumpWeek, setDevJumpWeek] = useState('');

  // Check-in responses
  const [checkInResponses, setCheckInResponses] = useState({
    pages: '',
    pitStop: '',
    synchronicity: '',
    otherIssues: ''
  });

  // Inspirational quotes for splash screen
  const splashQuotes = [
    "The primary imagination I hold to be the Living Power. — Samuel Taylor Coleridge",
    "Man is asked to make of himself what he is supposed to become to fulfill his destiny. — Paul Tillich",
    "I myself do nothing. The Holy Spirit accomplishes all through me. — William Blake",
    "Why indeed must God be a noun? Why not a verb... the most active and dynamic of all? — Mary Daly",
    "In the brush doing what it's doing, it will stumble on what one couldn't do by oneself. — Robert Motherwell",
    "The position of the artist is humble. He is essentially a channel. — Piet Mondrian",
    "God must become an activity in our consciousness. — Joel S. Goldsmith",
    "The music of this opera was dictated to me by God; I was merely instrumental in putting it on paper. — Giacomo Puccini",
    "Straight away the ideas flowing, upon me, directly from God. — Johannes Brahms",
    "We must accept that this creative pulse within us is God's creative pulse itself. — Joseph Chilton Pearce",
    "It is the creative potential itself in human beings that is the image of God. — Mary Daly",
    "Every blade of grass has its Angel that bends over it and whispers, Grow, grow. — The Talmud",
    "Great improvisors are like priests. They are thinking only of their god. — Stéphane Grappelli",
    "What we play is life. — Louis Armstrong",
    "Creativity is harnessing universality and making it flow through your eyes. — Peter Koestenbaum",
    "Why should we all use our creative power? Because there is nothing that makes people so generous, joyful, lively, bold and compassionate. — Brenda Ueland",
    "The purpose of art is not a rarified, intellectual distillate—it is life, intensified, brilliant life. — Alain Arias-Misson",
    "What lies behind us and what lies before us are tiny matters, compared to what lies within us. — Ralph Waldo Emerson",
    "Words are a form of action, capable of influencing change. — Ingrid Bengis",
    "You need to claim the events of your life to make yourself yours. — Anne-Wilson Schaef",
    "A mind too active is no mind at all. — Theodore Roethke",
    "Poetry often enters through the window of irrelevance. — M. C. Richards",
    "Inspiration may be a form of superconsciousness, or perhaps of subconsciousness. But I am sure it is the antithesis of self-consciousness. — Aaron Copland",
    "It always comes back to the same necessity: go deep enough and there is a bedrock of truth, however hard. — May Sarton",
    "Like an ability or a muscle, hearing your inner wisdom is strengthened by doing it. — Robbie Gass",
    "It is in the knowledge of the genuine conditions of our lives that we must draw our strength to live. — Simone de Beauvoir",
    "Painting is just another way of keeping a diary. — Pablo Picasso",
    "Experience, even for a painter, is not exclusively visual. — Walter Meigs",
    "The most potent muse of all is our own inner child. — Stephen Nachmanovitch",
    "At the height of laughter, the universe is flung into a kaleidoscope of new possibilities. — Jean Houston",
    "The creation of something new is not accomplished by the intellect but by the play instinct acting from inner necessity. — C. G. Jung",
    "Every child is an artist. The problem is how to remain an artist once he grows up. — Pablo Picasso",
    "Nothing has a stronger influence psychologically on their environment than the unlived life of the parent. — C. G. Jung",
    "I believe that if it were left to artists to choose their own labels, most would choose none. — Ben Shahn",
    "Go confidently in the direction of your dreams! Live the life you've imagined. — Henry David Thoreau",
    "Make your own recovery the first priority in your life. — Robin Norwood",
    "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed. — C. G. Jung",
    "Affirmations are like prescriptions for certain aspects of yourself you want to change. — Jerry Frankhauser",
    "I cannot believe that the inscrutable universe turns on an axis of suffering; surely the strange beauty of the world must rest on pure joy! — Louise Bogan",
    "Painting is an attempt to come to terms with life. There are as many solutions as there are human beings. — George Tooker",
    "To live a creative life, we must lose our fear of being wrong. — Joseph Chilton Pearce",
    "When you are feeling depreciated, angry or drained, it is a sign that other people are not open to your energy. — Sanaya Roman",
    "Do not weep; do not wax indignant. Understand. — Baruch Spinoza",
    "We have been taught to believe that negative equals realistic and positive equals unrealistic. — Susan Jeffers",
    "So you see, imagination needs moodling—long, inefficient, happy idling, dawdling and puttering. — Brenda Ueland",
    "Nobody sees a flower really—it takes time. — Georgia O'Keeffe",
    "All sanity depends on this: that it should be a delight to feel heat strike the skin. — Doris Lessing",
    "Snipers are people who undermine your efforts to break unhealthy relationship patterns. — Jody Hayes",
    "To know what you prefer instead of humbly saying Amen to what the world tells you is to have kept your soul alive. — Robert Louis Stevenson",
    "Every time you don't follow your inner guidance, you feel a loss of energy, loss of power, a sense of spiritual deadness. — Shakti Gawain",
    "Learn to get in touch with the silence within yourself and know that everything in this life has a purpose. — Elisabeth Kübler-Ross",
    "What I am actually saying is that we need to be willing to let our intuition guide us, and then be willing to follow that guidance directly and fearlessly. — Shakti Gawain",
    "Slow down and enjoy life. It's not only the scenery you miss by going too fast. — Eddie Cantor",
    "Whatever God's dream about man may be, it seems certain it cannot come true unless man cooperates. — Stella Terrill Mann",
    "To believe in God because someone tells you to is the height of stupidity. We are given senses to receive our information with. — Sophy Burnham",
    "No matter how slow the film, Spirit always stands still long enough for the photographer it has chosen. — Minor White",
    "Develop interest in life as you see it; in people, things, literature, music. — Henry Miller",
    "Attention is a way to connect and survive. — Julia Cameron",
    "The noun of self becomes a verb. This flashpoint of creation is where work and play merge. — Stephen Nachmanovitch",
    "The painting has a life of its own. I try to let it come through. — Jackson Pollock",
    "I merely took the energy it takes to pout and wrote some blues. — Duke Ellington",
    "When a man takes one step toward God, God takes more steps toward that man than there are sands in the worlds of time. — The Work of the Chariot",
    "The universe will reward you for taking risks on its behalf. — Shakti Gawain",
    "This is the use. If there is a responsive creative force that does hear us and act on our behalf, then we may really be able to do some things. — Julia Cameron",
    "Anyone honest will tell you that possibility is far more frightening than impossibility. — Julia Cameron",
    "A discovery is said to be an accident meeting a prepared mind. — Albert Szent-Gyorgyi",
    "Chance favors only the prepared mind. — Louis Pasteur",
    "Chance is always powerful. Let your hook be always cast. — Ovid",
    "Desire, ask, believe, receive. — Stella Terrill Mann",
    "Whatever you think you can do or believe you can do, begin it. Action has magic, grace, and power in it. — Goethe",
    "Genuine beginnings begin within us, even when they are brought to our attention by external opportunities. — William Bridges",
    "We will discover the nature of our particular genius when we stop trying to conform to our own or to other peoples' models. — Shakti Gawain",
    "Since you are like no other being ever created since the beginning of time, you are incomparable. — Brenda Ueland",
    "I have made my world and it is a much better world than I ever saw outside. — Louise Nevelson",
    "What doesn't kill me makes me stronger. — Albert Camus",
    "The words that enlighten the soul are more precious than jewels. — Hazrat Inayat Khan",
    "Artists who seek perfection in everything are those who cannot attain it in anything. — Eugène Delacroix",
    "Take your life in your own hands and what happens? A terrible thing: no one to blame. — Erica Jong",
    "There is a vitality, a life force, an energy that is translated through you into action. — Martha Graham",
    "Whenever I have to choose between two evils, I always like to try the one I haven't tried before. — Mae West",
    "Creative work is play. It is free speculation using the materials of one's chosen form. — Stephen Nachmanovitch",
    "Creativity is seeing something that doesn't exist already. You need to find out how you can bring it into being. — Michele Shea",
    "Each painting has its own way of evolving. When the painting is finished, the subject reveals itself. — William Baziotes",
    "Eliminate something superfluous from your life. Break a habit. Do something that makes you feel insecure. — Piero Ferrucci",
    "Stop thinking and talking about it and there is nothing you will not be able to know. — Zen Paradigm",
    "Art lies in the moment of encounter: we meet our truth and we meet ourselves. — Julia Cameron",
    "All the arts we practice are apprenticeships. The big art is our life. — M. C. Richards",
    "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult. — Seneca",
    "To become truly immortal, a work of art must escape all human limits. — Giorgio de Chirico",
    "The center that I cannot find is known to my unconscious mind. — W. H. Auden",
    "All you need to do to receive guidance is to ask for it and then listen. — Sanaya Roman",
    "We are always doing something, talking, reading, listening to the radio, planning what next. — Brenda Ueland",
    "In a dark time, the eye begins to see. — Theodore Roethke",
    "Expect your every need to be met, expect the answer to every problem, expect abundance on every level. — Eileen Caddy",
    "Look and you will find it—what is unsought will go undetected. — Sophocles",
    "It is within my power either to serve God or not to serve him. Serving him, I add to my own good. — Leo Tolstoy",
    "You must first be who you really are, then do what you need to do, in order to have what you want. — Margaret Young",
    "We are traditionally rather proud of ourselves for having slipped creative work in there between the domestic chores. — Toni Morrison",
    "There is the risk you cannot afford to take, and there is the risk you cannot afford not to take. — Peter Drucker",
    "You will do foolish things, but do them with enthusiasm. — Colette",
    "The specific meaning of God depends on what is the most desirable good for a person. — Erich Fromm",
    "To accept the responsibility of being a child of God is to accept the best that life has to offer. — Stella Terrill Mann",
    "Always leave enough time in your life to do something that makes you happy, satisfied, even joyous. — Paul Hawken",
    "I'd rather have roses on my table than diamonds on my neck. — Emma Goldman",
    "Explore daily the will of God. — C. G. Jung",
    "True life is lived when tiny changes occur. — Leo Tolstoy",
    "As an artist, it is central to be unsatisfied! This isn't greed, though it might be appetite. — Lawrence Calcagno"
  ];

  const [splashQuote, setSplashQuote] = useState('');
  const [dashboardQuote, setDashboardQuote] = useState('');

  // Set random quotes on mount
  useEffect(() => {
    const randomIndex1 = Math.floor(Math.random() * splashQuotes.length);
    setSplashQuote(splashQuotes[randomIndex1]);
    
    // Different quote for dashboard
    let randomIndex2 = Math.floor(Math.random() * splashQuotes.length);
    while (randomIndex2 === randomIndex1 && splashQuotes.length > 1) {
      randomIndex2 = Math.floor(Math.random() * splashQuotes.length);
    }
    setDashboardQuote(splashQuotes[randomIndex2]);
  }, []);

  // Literary quotes for watermark (keeping existing for other uses)
  const quotes = [
    "The world breaks everyone, and afterward, many are strong in the broken places.",
    "It was the best of times, it was the worst of times.",
    "Call me Ishmael.",
    "Happy families are all alike; every unhappy family is unhappy in its own way.",
    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    "Whether I shall turn out to be the hero of my own life depends wholly on these pages."
  ];

  const [currentQuote, setCurrentQuote] = useState('');

  // ============================================================================
  // SUPABASE FUNCTIONS
  // ============================================================================

  // Upload signature to Supabase Storage and return public URL
  const uploadSignatureToStorage = async (signatureDataUrl, userEmail) => {
    if (!supabaseRef.current || !signatureDataUrl) return null;
    
    try {
      // Convert base64 data URL to blob
      const base64Data = signatureDataUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      // Create unique filename
      const fileName = `signatures/${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabaseRef.current.storage
        .from('user-files')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (error) {
        console.error('Error uploading signature:', error);
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabaseRef.current.storage
        .from('user-files')
        .getPublicUrl(fileName);
      
      return urlData?.publicUrl || null;
    } catch (err) {
      console.error('Signature upload error:', err);
      return null;
    }
  };

  // Get or create user by email
  const getOrCreateSupabaseUser = async (email, name, signature, checkInDayValue, startDate) => {
    if (!supabaseRef.current || !email) return null;
    
    try {
      // Upload signature to storage and get URL
      let signatureUrl = signature;
      if (signature && signature.startsWith('data:')) {
        const uploadedUrl = await uploadSignatureToStorage(signature, email);
        if (uploadedUrl) {
          signatureUrl = uploadedUrl;
        }
      }
      
      // First, try to find existing user
      const { data: existingUser, error: findError } = await supabaseRef.current
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        // Update user data if it changed
        const { data: updatedUser, error: updateError } = await supabaseRef.current
          .from('users')
          .update({
            name: name,
            signature_url: signatureUrl,
            check_in_day: checkInDayValue,
            start_date: startDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select()
          .single();
        
        return updatedUser || existingUser;
      }
      
      // Create new user
      const { data: newUser, error: createError } = await supabaseRef.current
        .from('users')
        .insert({
          email: email,
          name: name,
          signature_url: signatureUrl,
          check_in_day: checkInDayValue,
          start_date: startDate
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }
      
      return newUser;
    } catch (err) {
      console.error('Supabase user error:', err);
      return null;
    }
  };

  // Save page entry to Supabase
  const savePageEntryToSupabase = async (content) => {
    if (!supabaseRef.current || !supabaseUserId || !content?.trim()) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
      
      // Upsert - update if exists for today, insert if not
      const { data, error } = await supabaseRef.current
        .from('page_entries')
        .upsert({
          user_id: supabaseUserId,
          content: content,
          word_count: wordCount,
          week: currentWeek,
          entry_date: today
        }, {
          onConflict: 'user_id,entry_date'
        });
      
      if (error) {
        console.error('Error saving page entry:', error);
      }
    } catch (err) {
      console.error('Supabase page entry error:', err);
    }
  };

  // Save landscape response to Supabase
  const saveLandscapeResponseToSupabase = async (promptKey, response) => {
    if (!supabaseRef.current || !supabaseUserId || !response?.trim()) return;
    
    try {
      const { data, error } = await supabaseRef.current
        .from('landscape_responses')
        .upsert({
          user_id: supabaseUserId,
          prompt_key: promptKey,
          response: response,
          week: currentWeek
        }, {
          onConflict: 'user_id,prompt_key'
        });
      
      if (error) {
        console.error('Error saving landscape response:', error);
      }
    } catch (err) {
      console.error('Supabase landscape error:', err);
    }
  };

  // Save check-in responses to Supabase
  const saveCheckInToSupabase = async (responses) => {
    if (!supabaseRef.current || !supabaseUserId) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabaseRef.current
        .from('check_in_responses')
        .upsert({
          user_id: supabaseUserId,
          responses: responses,
          check_in_date: today
        }, {
          onConflict: 'user_id,check_in_date'
        });
      
      if (error) {
        console.error('Error saving check-in:', error);
      }
    } catch (err) {
      console.error('Supabase check-in error:', err);
    }
  };

  // Save collage to Supabase
  const saveCollageToSupabase = async (collageData) => {
    if (!supabaseRef.current || !supabaseUserId) return;
    
    try {
      const { data, error } = await supabaseRef.current
        .from('collages')
        .insert({
          user_id: supabaseUserId,
          collage_data: collageData
        });
      
      if (error) {
        console.error('Error saving collage:', error);
      }
    } catch (err) {
      console.error('Supabase collage error:', err);
    }
  };

  // Schedule email event
  const scheduleEmailEvent = async (eventType, scheduledFor) => {
    if (!supabaseRef.current || !supabaseUserId) return;
    
    try {
      const { data, error } = await supabaseRef.current
        .from('email_events')
        .insert({
          user_id: supabaseUserId,
          event_type: eventType,
          scheduled_for: scheduledFor,
          status: 'pending'
        });
      
      if (error) {
        console.error('Error scheduling email:', error);
      }
      return data;
    } catch (err) {
      console.error('Supabase email event error:', err);
    }
  };

  // Update email preferences and schedule events
  const updateEmailPreferences = async (preferences) => {
    if (!supabaseRef.current || !supabaseUserId) return;
    
    try {
      // Update user preferences
      const { error: updateError } = await supabaseRef.current
        .from('users')
        .update({
          email_preferences: preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseUserId);
      
      if (updateError) {
        console.error('Error updating email preferences:', updateError);
        return;
      }

      // Cancel pending email events if reminders disabled
      if (!preferences.emailRemindersEnabled) {
        await supabaseRef.current
          .from('email_events')
          .update({ status: 'cancelled' })
          .eq('user_id', supabaseUserId)
          .eq('status', 'pending');
      } else {
        // Schedule next events based on preferences
        const now = new Date();
        
        if (preferences.dailyReminders) {
          // Schedule next morning reminder (6am next day)
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(6, 0, 0, 0);
          await scheduleEmailEvent('daily_reminder', tomorrow.toISOString());
        }
        
        if (preferences.weeklyGreetings) {
          // Schedule weekly greeting for Monday 9am
          const nextMonday = new Date(now);
          nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
          nextMonday.setHours(9, 0, 0, 0);
          await scheduleEmailEvent('weekly_greeting', nextMonday.toISOString());
        }
        
        if (preferences.checkInReminders && checkInDay) {
          // Schedule check-in reminder for check-in day morning
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const checkInDayIndex = daysOfWeek.indexOf(checkInDay);
          const nextCheckIn = new Date(now);
          const daysUntilCheckIn = (checkInDayIndex + 7 - now.getDay()) % 7 || 7;
          nextCheckIn.setDate(nextCheckIn.getDate() + daysUntilCheckIn);
          nextCheckIn.setHours(8, 0, 0, 0);
          await scheduleEmailEvent('check_in_reminder', nextCheckIn.toISOString());
        }
      }
    } catch (err) {
      console.error('Supabase email preferences error:', err);
    }
  };

  // Load user data from Supabase
  const loadUserDataFromSupabase = async (email) => {
    if (!supabaseRef.current || !email) return null;
    
    try {
      const { data: user, error } = await supabaseRef.current
        .from('users')
        .select(`
          *,
          page_entries (content, word_count, week, entry_date),
          landscape_responses (prompt_key, response, week),
          check_in_responses (responses, check_in_date),
          collages (collage_data, created_at)
        `)
        .eq('email', email)
        .single();
      
      if (error || !user) return null;
      
      return user;
    } catch (err) {
      console.error('Error loading user data:', err);
      return null;
    }
  };

  // ============================================================================
  // END SUPABASE FUNCTIONS
  // ============================================================================

  // Helper function to check if today is check-in day
  const isCheckInDay = () => {
    if (!checkInDay) return false;
    
    // If first check-in is delayed (user selected today during onboarding), don't show it
    if (delayFirstCheckIn && currentWeek === 1) {
      return false;
    }
    
    // If it's the user's first day with the service, delay check-in until next week
    const startDateStr = devStartDate;
    if (startDateStr) {
      const startDate = new Date(startDateStr + 'T00:00:00');
      const today = new Date();
      const todayDateStr = today.toISOString().split('T')[0];
      const startDateOnlyStr = startDate.toISOString().split('T')[0];
      
      // If today is the start date, skip check-in
      if (todayDateStr === startDateOnlyStr) {
        return false;
      }
    }
    
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = daysOfWeek[today.getDay()];
    return todayName === checkInDay;
  };

  // Persistent storage helper functions
  const storageSet = async (key, value) => {
    try {
      if (window.storage) {
        await window.storage.set(key, JSON.stringify(value));
      }
    } catch (err) {
      // Storage is broken, silently ignore
    }
  };

  const storageGet = async (key) => {
    try {
      if (window.storage) {
        const result = await window.storage.get(key);
        return result ? JSON.parse(result.value) : null;
      }
    } catch (err) {
      // Storage is broken, silently ignore
      return null;
    }
  };

  // Compute current week from start date
  const computeWeekFromStart = (startDateStr) => {
    if (!startDateStr) return 1;
    const start = new Date(startDateStr + 'T00:00:00');
    const todayDate = new Date();
    const days = Math.floor((todayDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    // Wrap every 12 weeks
    return ((Math.floor(days / 7)) % 12) + 1;
  };

  // Initialize app + set persistent start date and derive current week
  useEffect(() => {
    (async () => {
      setIsLoading(false);

      // Initialize Supabase if credentials are available
      if (SUPABASE_ANON_KEY && !supabaseRef.current) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          supabaseRef.current = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          console.log('Supabase initialized successfully');
        } catch (e) {
          console.warn('Supabase library not available:', e.message);
        }
      }

      // Check if user has completed onboarding by looking for userName
      const savedUserName = await storageGet('windingPath:userName');
      const savedSignature = await storageGet('windingPath:userSignature');
      const savedCheckInDay = await storageGet('windingPath:checkInDay');
      
      if (savedUserName) {
        setUserName(savedUserName);
      }
      if (savedSignature) {
        setUserSignature(savedSignature);
      }
      if (savedCheckInDay) {
        setCheckInDay(savedCheckInDay);
      }

      // If user hasn't completed full onboarding, show splash
      if (!savedUserName || !savedSignature || !savedCheckInDay) {
        setAppState('splash');
      } else {
        setAppState('main');
      }

      let start = await storageGet('windingPath:startDate');
      if (!start) {
        const todayStr = new Date().toISOString().split('T')[0];
        await storageSet('windingPath:startDate', todayStr);
        start = todayStr;
      }

      setCurrentWeek(computeWeekFromStart(start));
      setDevStartDate(start);

      // Load landscape responses
      const savedLandscapeResponses = await storageGet('windingPath:landscapeResponses');
      if (savedLandscapeResponses) {
        setLandscapeResponses(savedLandscapeResponses);
      }

      // Load page entry for today
      const today = new Date().toISOString().split('T')[0];
      const savedPageEntry = await storageGet(`windingPath:pageEntry:${today}`);
      if (savedPageEntry) {
        setPageEntry(savedPageEntry);
      }

      // Load email settings
      const savedEmail = await storageGet('windingPath:userEmail');
      if (savedEmail) {
        setUserEmail(savedEmail);
        setEmailOptIn(true);
        
        // Initialize Supabase user if email exists and onboarding complete
        if (savedUserName && savedSignature && savedCheckInDay && supabaseRef.current) {
          const user = await getOrCreateSupabaseUser(
            savedEmail,
            savedUserName,
            savedSignature,
            savedCheckInDay,
            start
          );
          if (user) {
            setSupabaseUserId(user.id);
            console.log('Supabase user initialized:', user.id);
          }
        }
      }

      // Load selected paths
      const savedPaths = await storageGet('windingPath:selectedPaths');
      if (savedPaths) {
        setSelectedPath(savedPaths);
      }

      // Load archived data from storage
      try {
        if (window.storage) {
          const keys = await window.storage.list('windingPath:archive:');
          if (keys && keys.keys) {
            const loadedArchive = {};
            for (const key of keys.keys) {
              try {
                const data = await window.storage.get(key);
                if (data && data.value) {
                  const parsed = JSON.parse(data.value);
                  // Extract date from key (e.g., windingPath:archive:page:2025-01-15)
                  const dateMatch = key.match(/\d{4}-\d{2}-\d{2}/);
                  if (dateMatch) {
                    const dateStr = dateMatch[0];
                    if (!loadedArchive[dateStr]) {
                      loadedArchive[dateStr] = { date: dateStr };
                    }
                    if (key.includes(':page:')) {
                      loadedArchive[dateStr].pageEntry = parsed.content;
                      loadedArchive[dateStr].week = parsed.week;
                      loadedArchive[dateStr].pageSavedAt = parsed.savedAt;
                    } else if (key.includes(':landscape:')) {
                      loadedArchive[dateStr].landscapeResponses = parsed.responses;
                      loadedArchive[dateStr].landscapeSavedAt = parsed.savedAt;
                    } else if (key.includes(':checkIn:')) {
                      loadedArchive[dateStr].responses = parsed;
                    }
                  }
                }
              } catch (e) {
                console.warn('Error loading archive key:', key, e);
              }
            }
            if (Object.keys(loadedArchive).length > 0) {
              setArchiveData(loadedArchive);
            }
          }
        }
      } catch (e) {
        console.warn('Could not load archive data:', e);
      }
    })();
  }, []);

  // Autosave page entry with debounce - also saves to archive
  useEffect(() => {
    if (appState !== 'main') return;

    const timer = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        
        const today = new Date().toISOString().split('T')[0];
        
        // Try to save page entry for today
        try {
          await storageSet(`windingPath:pageEntry:${today}`, pageEntry);
          
          // Also save to date-specific archive key if there's content
          if (pageEntry && pageEntry.trim()) {
            await storageSet(`windingPath:archive:page:${today}`, {
              content: pageEntry,
              savedAt: new Date().toISOString(),
              week: currentWeek
            });
            
            // Update archiveData state for immediate display in clocktower
            setArchiveData(prev => ({
              ...prev,
              [today]: {
                ...prev[today],
                date: today,
                pageEntry: pageEntry,
                week: currentWeek,
                pageSavedAt: new Date().toISOString()
              }
            }));
          }
        } catch (e) {
          console.warn('Could not save page entry:', e);
        }
        
        await savePageEntryToSupabase(pageEntry);
        
        setSaveStatus('saved');
        setLastSaveTime(new Date());
      } catch (err) {
        console.warn('Autosave error:', err);
        setSaveStatus('saved');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [pageEntry, appState, currentWeek]);

  // Autosave landscape responses to archive with debounce
  useEffect(() => {
    if (appState !== 'main') return;
    if (Object.keys(landscapeResponses).length === 0) return;

    const timer = setTimeout(async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Save landscape responses to date-specific archive key
        await storageSet(`windingPath:archive:landscape:${today}`, {
          responses: landscapeResponses,
          savedAt: new Date().toISOString(),
          week: currentWeek
        });
        
        // Update archiveData state for immediate display in clocktower
        setArchiveData(prev => ({
          ...prev,
          [today]: {
            ...prev[today],
            date: today,
            landscapeResponses: landscapeResponses,
            week: currentWeek,
            landscapeSavedAt: new Date().toISOString()
          }
        }));
      } catch (err) {
        console.warn('Landscape archive save error:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [landscapeResponses, appState, currentWeek]);

  // Onboarding handlers
  const handleBegin = () => {
    setAppState('onboarding-name');
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      const name = nameInput.trim();
      setUserName(name);
      storageSet('windingPath:userName', name);
      setAppState('onboarding-contract');
    }
  };

  const handleContractComplete = async () => {
    if (userSignature) {
      await storageSet('windingPath:userSignature', userSignature);
      if (emailOptIn && userEmail.trim()) {
        await storageSet('windingPath:userEmail', userEmail.trim());
      }
      setAppState('onboarding-checkin');
    }
  };

  const handleCheckInDaySelect = async (day) => {
    // Check if today is the selected check-in day
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = daysOfWeek[today.getDay()];
    
    // If the selected day is today, we'll store a flag to delay the first check-in
    let delayedFirstCheckIn = false;
    if (todayName === day) {
      delayedFirstCheckIn = true;
      alert(`You've selected ${day}, which is today. Your first check-in will be ${day} of next week.`);
    }
    
    setCheckInDay(day);
    await storageSet('windingPath:checkInDay', day);
    if (delayedFirstCheckIn) {
      await storageSet('windingPath:delayFirstCheckIn', true);
    }
    
    // Create/update Supabase user if email was provided
    if (emailOptIn && userEmail.trim() && supabaseRef.current) {
      const startDate = await storageGet('windingPath:startDate') || new Date().toISOString().split('T')[0];
      const user = await getOrCreateSupabaseUser(
        userEmail.trim(),
        userName,
        userSignature,
        day,
        startDate
      );
      if (user) {
        setSupabaseUserId(user.id);
        console.log('Supabase user created:', user.id);
        
        // Schedule initial email events if reminders are enabled
        if (emailRemindersEnabled) {
          await updateEmailPreferences({
            emailRemindersEnabled,
            dailyReminders,
            weeklyGreetings,
            checkInReminders
          });
        }
      }
    }
    
    setAppState('onboarding-welcome');
  };

  // Canvas drawing for signature
  const canvasRef = React.useRef(null);

  const getScaledCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getScaledCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getScaledCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#030f42';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setUserSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUserSignature('');
  };

  // Weekly paths data
  const weeklyPaths = {
    1: { pathA: 'Foundation Building', pathB: 'Quick Start Intensive' },
    2: { pathA: 'Deep Work Sessions', pathB: 'Collaborative Projects' },
    3: { pathA: 'Skill Refinement', pathB: 'Creative Exploration' },
    4: { pathA: 'Strength Training', pathB: 'Flexibility Focus' },
    5: { pathA: 'Advanced Techniques', pathB: 'Fundamentals Review' },
    6: { pathA: 'Solo Practice', pathB: 'Group Integration' },
    7: { pathA: 'Challenge Week', pathB: 'Recovery & Reflection' },
    8: { pathA: 'Innovation Sprint', pathB: 'Consistency Building' },
    9: { pathA: 'Performance Focus', pathB: 'Learning Focus' },
    10: { pathA: 'External Projects', pathB: 'Internal Development' },
    11: { pathA: 'Intensive Practice', pathB: 'Strategic Planning' },
    12: { pathA: 'Final Sprint', pathB: 'Integration & Reflection' }
  };

  const getDayKey = (week, day) => `w${week}-d${day}`;

  const handlePathSelection = async (week, path) => {
    const newPaths = { ...selectedPath, [week]: path };
    setSelectedPath(newPaths);
    await storageSet('windingPath:selectedPaths', newPaths);
  };

  const getCompletedDaysForCurrentWeek = () => {
    const completedDays = [];
    for (let day = 1; day <= 7; day++) {
      const key = getDayKey(currentWeek, day);
      if (journalEntries[key] && journalEntries[key].trim() !== '') {
        completedDays.push(day);
      }
    }
    return completedDays;
  };

  const wordCount = pageEntry.split(/\s+/).filter(word => word.length > 0).length;
  const wordProgress = Math.min((wordCount / 1000) * 100, 100);

  const handleEmailRemindersToggle = async (enabled) => {
    setEmailRemindersEnabled(enabled);
    await storageSet('windingPath:emailRemindersEnabled', enabled);
    if (enabled) {
      // When toggling ON, enable all mailing options by default
      setDailyReminders(true);
      setWeeklyGreetings(true);
      setCheckInReminders(true);
      await storageSet('windingPath:dailyReminders', true);
      await storageSet('windingPath:weeklyGreetings', true);
      await storageSet('windingPath:checkInReminders', true);
    } else {
      // When toggling OFF, disable all mailing options
      setDailyReminders(false);
      setWeeklyGreetings(false);
      setCheckInReminders(false);
      await storageSet('windingPath:dailyReminders', false);
      await storageSet('windingPath:weeklyGreetings', false);
      await storageSet('windingPath:checkInReminders', false);
    }
  };

  const handleDailyRemindersToggle = async (enabled) => {
    setDailyReminders(enabled);
    await storageSet('windingPath:dailyReminders', enabled);
  };

  const handleWeeklyGreetingsToggle = async (enabled) => {
    setWeeklyGreetings(enabled);
    await storageSet('windingPath:weeklyGreetings', enabled);
  };

  const handleCheckInRemindersToggle = async (enabled) => {
    setCheckInReminders(enabled);
    await storageSet('windingPath:checkInReminders', enabled);
  };

  const handleCheckInDayChange = async (newDay) => {
    setCheckInDay(newDay);
    await storageSet('windingPath:checkInDay', newDay);
  };

  const handleRestartWeek = async () => {
    const confirmed = window.confirm('Reset progress for the current week?');
    if (!confirmed) return;
    
    const newJournalEntries = { ...journalEntries };
    for (let day = 1; day <= 7; day++) {
      const key = getDayKey(currentWeek, day);
      if (newJournalEntries[key]) {
        delete newJournalEntries[key];
      }
    }
    setJournalEntries(newJournalEntries);
    await storageSet('windingPath:journalEntries', newJournalEntries);
    alert('Current week has been reset.');
  };

  const handleRestartProgram = async () => {
    const confirmed = window.confirm('Restart the program? This will reset progress to week 1 but keep archive data.');
    if (!confirmed) return;

    setCurrentWeek(1);
    setJournalEntries({});
    setPageEntry('');
    setSelectedPath({});

    await storageSet('windingPath:journalEntries', {});
    const todayForReset = new Date().toISOString().split('T')[0];
    await storageSet(`windingPath:pageEntry:${todayForReset}`, '');
    await storageSet('windingPath:selectedPaths', {});

    const todayStr = new Date().toISOString().split('T')[0];
    await storageSet('windingPath:startDate', todayStr);
    setDevStartDate(todayStr);
    setCurrentWeek(computeWeekFromStart(todayStr));

    alert('Program restarted. You are now at week 1.');
  };

  // Developer / testing controls
  const handleSetStartDate = async (dateStr) => {
    if (!dateStr) return;
    await storageSet('windingPath:startDate', dateStr);
    setDevStartDate(dateStr);
    setCurrentWeek(computeWeekFromStart(dateStr));
    alert('Start date updated.');
  };

  const handleJumpToWeek = async (weekNum) => {
    if (!weekNum || weekNum < 1) return;
    const n = Math.min(Math.max(parseInt(weekNum, 10), 1), 12);
    const start = new Date();
    start.setDate(start.getDate() - ((n - 1) * 7));
    const startStr = start.toISOString().split('T')[0];
    await storageSet('windingPath:startDate', startStr);
    setDevStartDate(startStr);
    setCurrentWeek(computeWeekFromStart(startStr));
    alert(`Jumped to week ${n}.`);
  };

  const handleFullReset = async () => {
    console.log('handleFullReset called');
    
    // Close modal first
    setShowResetConfirm(false);
    
    // Clear all persistent storage
    try {
      if (window.storage) {
        // Get all keys and delete them
        const allKeys = await window.storage.list('windingPath:');
        if (allKeys && allKeys.keys) {
          for (const key of allKeys.keys) {
            await window.storage.delete(key);
            console.log('Deleted:', key);
          }
        }
        
        // Also clear any collage keys
        const collageKeys = await window.storage.list('windingPath:collage:');
        if (collageKeys && collageKeys.keys) {
          for (const key of collageKeys.keys) {
            await window.storage.delete(key);
            console.log('Deleted collage:', key);
          }
        }
        
        // Clear archive keys
        const archiveKeys = await window.storage.list('windingPath:archive:');
        if (archiveKeys && archiveKeys.keys) {
          for (const key of archiveKeys.keys) {
            await window.storage.delete(key);
            console.log('Deleted archive:', key);
          }
        }
        
        // Clear check-in keys
        const checkInKeys = await window.storage.list('windingPath:checkIn:');
        if (checkInKeys && checkInKeys.keys) {
          for (const key of checkInKeys.keys) {
            await window.storage.delete(key);
            console.log('Deleted check-in:', key);
          }
        }
      }
      console.log('All persistent storage cleared');
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
    
    // Clear all app state
    setUserName('');
    setUserSignature('');
    setCheckInDay('');
    setUserEmail('');
    setEmailOptIn(false);
    setCurrentWeek(1);
    setSelectedPath({});
    setJournalEntries({});
    setPageEntry('');
    setArchiveData({});
    setCurrentPage('path');
    setDelayFirstCheckIn(false);
    setEmailRemindersEnabled(false);
    setDailyReminders(false);
    setWeeklyGreetings(false);
    setCheckInReminders(false);
    setCheckInResponses({});
    setDevStartDate('');
    setDevJumpWeek('');
    setSupabaseUserId(null);
    setLandscapeResponses({
      synchronicity1: '',
      synchronicity2: '',
      synchronicity3: '',
      synchronicity4: '',
    });
    
    console.log('All state cleared, setting appState to splash');
    
    // Return to splash screen
    setAppState('splash');
    console.log('Reset complete');
  };

  const getCompletionStats = () => {
    const totalDays = currentWeek * 7;
    const completedDays = Object.keys(journalEntries).filter(key => {
      const week = parseInt(key.split('-')[0].substring(1));
      return week <= currentWeek && journalEntries[key].trim() !== '';
    }).length;
    return { completedDays, totalDays };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Splash Screen
  if (appState === 'splash') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
          .fade-in-delay-2 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.6s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <h1 
            className="text-6xl mb-12 fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            the winding path
          </h1>
          <button
            onClick={handleBegin}
            className="px-12 py-4 text-xl transition-all hover:opacity-80 fade-in-delay-1 mb-12"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            begin
          </button>
          {splashQuote && (
            <p 
              className="text-base fade-in-delay-2"
              style={{ fontFamily: 'Arial Black, Arial, sans-serif', color: '#c5d2ed', lineHeight: 1.6 }}
            >
              {splashQuote}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Onboarding Screen - Name
  if (appState === 'onboarding-name') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
          .fade-in-delay-2 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.6s forwards;
          }
        `}</style>
        <div className="text-center max-w-md w-full">
          <h2 
            className="text-3xl mb-8 fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            first things first
          </h2>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            placeholder="your name"
            autoFocus
            className="w-full px-2 py-3 text-lg text-center focus:outline-none border-b-2 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif',
              borderColor: '#030f42',
              color: '#030f42',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none'
            }}
          />
          <button
            onClick={handleNameSubmit}
            disabled={!nameInput.trim()}
            className="mt-8 px-12 py-3 text-lg transition-all hover:opacity-80 disabled:opacity-30 fade-in-delay-2"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Contract
  if (appState === 'onboarding-contract') {
    return (
      <div className="min-h-screen bg-white p-8 overflow-y-auto">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
          .fade-in-delay-2 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.6s forwards;
          }
        `}</style>
        <div className="max-w-3xl mx-auto">
          <div className="border p-8 mb-8 fade-in" style={{ borderColor: '#030f42' }}>
            <p 
              className="text-base leading-relaxed mb-4"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
            >
              I, <span className="font-bold">{userName}</span>, understand that I am undertaking an intensive, guided encounter with my own creativity. I commit myself to the twelve-week duration of the course.
            </p>
            <p 
              className="text-base leading-relaxed mb-4"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
            >
              I, <span className="font-bold">{userName}</span>, commit to weekly reading, daily pages, a weekly pit stop, and the fulfillment of each week's tasks.
            </p>
            <p 
              className="text-base leading-relaxed mb-4"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
            >
              I, <span className="font-bold">{userName}</span>, further understand that this course will raise issues and emotions for me to deal with.
            </p>
            <p 
              className="text-base leading-relaxed"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
            >
              I, <span className="font-bold">{userName}</span>, commit myself to excellent self-care—adequate sleep, diet, exercise, and pampering—for the duration of the course.
            </p>
          </div>

          {/* Signature Box */}
          <div className="mb-6 fade-in-delay-1">
            <p 
              className="text-sm mb-2"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.7 }}
            >
              Sign here
            </p>
            <canvas
              ref={canvasRef}
              width={600}
              height={150}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border w-full bg-white"
              style={{ 
                borderColor: '#030f42',
                cursor: 'crosshair'
              }}
            />
            {userSignature && (
              <button
                onClick={clearSignature}
                className="mt-2 text-sm hover:opacity-70"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
              >
                Clear signature
              </button>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (e.target.value.trim()) {
                    setEmailOptIn(true);
                  }
                }}
                placeholder="your email address"
                disabled={!emailOptIn}
                className={`flex-1 px-4 py-3 border focus:outline-none ${!emailOptIn ? 'opacity-40' : ''}`}
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  color: '#030f42'
                }}
              />
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={!emailOptIn}
                  onChange={(e) => {
                    setEmailOptIn(!e.target.checked);
                    if (e.target.checked) {
                      setUserEmail('');
                    }
                  }}
                  className="w-4 h-4"
                  style={{ accentColor: '#030f42' }}
                />
                <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px' }}>
                  no thanks
                </span>
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContractComplete}
            disabled={!userSignature}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 disabled:opacity-30"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Screen - Check-in Day
  if (appState === 'onboarding-checkin') {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
          .fade-in-delay-2 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.6s forwards;
          }
        `}</style>
        <div className="text-center max-w-4xl w-full">
          <p 
            className="text-2xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            The path is a daily commitment.<br/>
            When would be the best day for a check in?
          </p>
          <div className="flex justify-center items-center gap-0 max-w-3xl mx-auto mb-8 fade-in-delay-1">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setCheckInDay(day)}
                className={`flex-1 px-3 py-4 text-sm border-t border-b transition-all ${
                  checkInDay === day ? '' : 'opacity-50 hover:opacity-100'
                }`}
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  borderColor: '#030f42',
                  borderLeft: index === 0 ? `1px solid #030f42` : 'none',
                  borderRight: '1px solid #030f42',
                  color: '#030f42',
                  backgroundColor: checkInDay === day ? '#f8f9fa' : 'white'
                }}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleCheckInDaySelect(checkInDay)}
            disabled={!checkInDay}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 disabled:opacity-30 fade-in-delay-2"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Orientation Screen 1 - Welcome
  if (appState === 'onboarding-welcome') {
    return (
      <div key="onboarding-welcome" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
          .fade-in-delay-2 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.6s forwards;
          }
        `}</style>
        <div className="flex items-center justify-center max-w-4xl w-full gap-12">
          <div className="text-center flex-1">
            <h1 
              className="text-4xl mb-12 fade-in"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
            >
              Welcome to the winding path
            </h1>
            <button
              onClick={() => setAppState('onboarding-pages')}
              className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif', 
                backgroundColor: '#030f42',
                color: 'white'
              }}
            >
              continue
            </button>
          </div>
          {/* Image placeholder - update src with correct GitHub raw URL */}
          <div className="fade-in-delay-2" style={{ flexShrink: 0 }}>
            <img 
              src="https://github.com/sulfuricT/thewanderingpath/blob/main/1.png?raw=true" 
              alt="The Winding Path"
              style={{ maxWidth: '280px', height: 'auto' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Orientation Screen 2 - Pages
  if (appState === 'onboarding-pages') {
    return (
      <div key="onboarding-pages" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <p 
            className="text-xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            Each day of your journey, you will wake up and write three pages, or one thousand words. The important thing is to just write. You will see the pages input box on your dashboard.
          </p>
          <button
            onClick={() => setAppState('onboarding-tasks')}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Orientation Screen 3 - Tasks
  if (appState === 'onboarding-tasks') {
    return (
      <div key="onboarding-tasks" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <p 
            className="text-xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            Every week of your journey, you will have a few tasks to help guide you on your creative recovery. You can find your tasks on the wheel underneath the pages box.
          </p>
          <button
            onClick={() => setAppState('onboarding-well')}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Orientation Screen 4 - The Well
  if (appState === 'onboarding-well') {
    return (
      <div key="onboarding-well" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <p 
            className="text-xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            The well is a tool for creative thinking and play. Try collaging images and creating sequences to accompany your experience on your path.
          </p>
          <button
            onClick={() => setAppState('onboarding-landscape')}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Orientation Screen 5 - The Landscape
  if (appState === 'onboarding-landscape') {
    return (
      <div key="onboarding-landscape" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <p 
            className="text-xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            The landscape is full of important weekly considerations that will help contextualize your path. Be sure to check back to see how your bigger picture develops over time.
          </p>
          <button
            onClick={() => setAppState('onboarding-watchtower')}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            continue
          </button>
        </div>
      </div>
    );
  }

  // Orientation Screen 6 - The Watchtower
  if (appState === 'onboarding-watchtower') {
    return (
      <div key="onboarding-watchtower" className="min-h-screen bg-white flex items-center justify-center p-4">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 0.8s ease-out 0.3s forwards;
          }
        `}</style>
        <div className="text-center max-w-2xl">
          <p 
            className="text-xl mb-12 leading-relaxed fade-in"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
          >
            The watchtower is an archive of your pages, responses, and collages. Try to be mindful about reviewing your archive. It's best not to check on your pages for the first few weeks.
          </p>
          <button
            onClick={() => setAppState('main')}
            className="px-12 py-3 text-lg transition-all hover:opacity-80 fade-in-delay-1"
            style={{ 
              fontFamily: 'Helvetica, Arial, sans-serif', 
              backgroundColor: '#030f42',
              color: 'white'
            }}
          >
            let's begin
          </button>
        </div>
      </div>
    );
  }

  // Main App - Dashboard
  if (appState === 'main') {
    const completedDaysCurrentWeek = getCompletedDaysForCurrentWeek();
    const stats = getCompletionStats();

    return (
      <div className="min-h-screen bg-white flex">
        {/* Sidebar Navigation */}
        <div className="w-48 border-r p-6" style={{ borderColor: '#030f42', minHeight: '100vh' }}>
          <nav className="space-y-6">
            <button
              onClick={() => setCurrentPage('path')}
              className={`w-full text-left px-0 py-2 text-sm transition-all font-semibold ${
                currentPage === 'path' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
            >
              the winding path
            </button>
            
            <div className="space-y-3">
              <button
                onClick={() => setCurrentPage('well')}
                className={`w-full text-left px-6 py-2 text-sm transition-all ${
                  currentPage === 'well' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
              >
                the well
              </button>
              <button
                onClick={() => setCurrentPage('clocktower')}
                className={`w-full text-left px-6 py-2 text-sm transition-all ${
                  currentPage === 'clocktower' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
              >
                the clocktower
              </button>
              <button
                onClick={() => setCurrentPage('landscape')}
                className={`w-full text-left px-6 py-2 text-sm transition-all ${
                  currentPage === 'landscape' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
              >
                the landscape
              </button>
              <button
                onClick={() => setCurrentPage('profile')}
                className={`w-full text-left px-6 py-2 text-sm transition-all ${
                  currentPage === 'profile' ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
              >
                user profile
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-12" style={{ marginLeft: '3rem', marginRight: '3rem' }}>
          {/* Winding Path Page */}
          {currentPage === 'path' && (
            <div>
              {/* Header */}
              <div className="mb-12">
                <h1 
                  className="text-4xl mb-2"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
                >
                  the winding path
                </h1>
                <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.7 }}>
                  {userName} • Check-in: {checkInDay}s
                </p>
              </div>

              {/* Progress Indicator with Minimal Dots */}
              <div className="mb-12 p-8 border" style={{ borderColor: '#030f42' }}>
                <div className="flex items-center gap-6">
                  <div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', marginBottom: '8px' }}>
                      Week {currentWeek} of 12
                    </p>
                    <div className="flex gap-2">
                      {[...Array(12)].map((_, week) => (
                        <div
                          key={week + 1}
                          className="w-5 h-5 rounded-full border-2"
                          style={{
                            borderColor: '#030f42',
                            backgroundColor: week + 1 <= currentWeek ? '#030f42' : 'transparent',
                            opacity: week + 1 <= currentWeek ? 1 : 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="border-l" style={{ borderColor: '#030f42', height: '60px', opacity: 0.3 }} />
                  <div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px', marginBottom: '8px' }}>
                      {stats.completedDays} / {stats.totalDays} days
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map(day => {
                        const isCompleted = completedDaysCurrentWeek.includes(day);
                        return (
                          <div
                            key={day}
                            className="w-5 h-5 rounded-full border-2"
                            style={{
                              borderColor: '#030f42',
                              backgroundColor: isCompleted ? '#030f42' : 'transparent',
                              opacity: isCompleted ? 1 : 0.3
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* The Pages */}
              <div className="p-8 border mb-12" style={{ borderColor: '#030f42' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 
                    className="text-2xl"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
                  >
                    the pages
                  </h2>
                  <span className="text-xs" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.5 }}>
                    {saveStatus === 'saving' ? 'saving...' : 'saved'}
                  </span>
                </div>

                <div className="mb-6">
                  <textarea
                    value={pageEntry}
                    onChange={(e) => setPageEntry(e.target.value)}
                    placeholder="Do anything, until you have three pages."
                    className="w-full h-64 p-4 border focus:outline-none resize-none"
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      borderColor: '#030f42',
                      color: '#030f42'
                    }}
                  />
                </div>

                {/* Word Count Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.7 }}>
                    <span>{wordCount} words</span>
                    <span>1000 words</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: '#e5e7eb' }}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${wordProgress}%`, backgroundColor: '#030f42' }}
                    />
                  </div>
                </div>

                {/* Quote Watermark */}
                <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: '#030f42' }}>
                  <p className="text-sm" style={{ fontFamily: 'Arial Black, Arial, sans-serif', color: '#c5d2ed' }}>
                    {dashboardQuote}
                  </p>
                </div>
              </div>

              {/* Check-In Section - Only visible on check-in day */}
              {isCheckInDay() && (
                <div className="p-8 border mb-12" style={{ borderColor: '#030f42' }}>
                  <h2 
                    className="text-2xl mb-8"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
                  >
                    check in
                  </h2>
                  
                  {/* Question 1 */}
                  <div className="mb-8">
                    <label 
                      className="block text-sm font-semibold mb-3"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
                    >
                      1. How many days this week did you do your pages? How was the experience for you?
                    </label>
                    <textarea
                      value={checkInResponses.pages}
                      onChange={(e) => setCheckInResponses({ ...checkInResponses, pages: e.target.value })}
                      placeholder="Your response..."
                      className="w-full h-32 p-4 border focus:outline-none resize-none"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    />
                  </div>

                  {/* Question 2 */}
                  <div className="mb-8">
                    <label 
                      className="block text-sm font-semibold mb-3"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
                    >
                      2. Did you do your pit stop this week? What did you do? How did it feel?
                    </label>
                    <textarea
                      value={checkInResponses.pitStop}
                      onChange={(e) => setCheckInResponses({ ...checkInResponses, pitStop: e.target.value })}
                      placeholder="Your response..."
                      className="w-full h-32 p-4 border focus:outline-none resize-none"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    />
                  </div>

                  {/* Question 3 */}
                  <div className="mb-8">
                    <label 
                      className="block text-sm font-semibold mb-3"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
                    >
                      3. Did you experience any synchronicity this week? What was it?
                    </label>
                    <textarea
                      value={checkInResponses.synchronicity}
                      onChange={(e) => setCheckInResponses({ ...checkInResponses, synchronicity: e.target.value })}
                      placeholder="Your response..."
                      className="w-full h-32 p-4 border focus:outline-none resize-none"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    />
                  </div>

                  {/* Question 4 */}
                  <div className="mb-8">
                    <label 
                      className="block text-sm font-semibold mb-3"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
                    >
                      4. Were there any other issues this week that you consider significant for your recovery? Describe them.
                    </label>
                    <textarea
                      value={checkInResponses.otherIssues}
                      onChange={(e) => setCheckInResponses({ ...checkInResponses, otherIssues: e.target.value })}
                      placeholder="Your response..."
                      className="w-full h-32 p-4 border focus:outline-none resize-none"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    />
                  </div>

                  {/* Save Check-In Button */}
                  <button
                    onClick={async () => {
                      const today = new Date().toISOString().split('T')[0];
                      
                      // Save to check-in storage
                      await storageSet(`windingPath:checkIn:${today}`, checkInResponses);
                      
                      // Save to Supabase
                      await saveCheckInToSupabase(checkInResponses);
                      
                      // Update app state archive
                      const newArchiveData = { ...archiveData };
                      newArchiveData[today] = {
                        date: today,
                        checkInDay: checkInDay,
                        responses: checkInResponses,
                        savedAt: new Date().toISOString()
                      };
                      setArchiveData(newArchiveData);
                      
                      alert('Check-in saved successfully!');
                    }}
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif', 
                      backgroundColor: '#030f42',
                      color: 'white'
                    }}
                    className="px-6 py-3 hover:opacity-80 transition-all"
                  >
                    save check-in
                  </button>
                </div>
              )}

              {/* Weekly Prompts */}
              <WeeklyPrompts 
                currentWeek={currentWeek} 
                storageSet={storageSet}
                checkInDay={checkInDay}
                userEmail={userEmail}
              />
            </div>
          )}

          {/* The Well - Collage Editor */}
          {currentPage === 'well' && (
            <CollageEditor storageSet={storageSet} archiveData={archiveData} setArchiveData={setArchiveData} />
          )}

          {/* The Clocktower Page */}
          {currentPage === 'clocktower' && (
            <ClocktowerArchive archiveData={archiveData} />
          )}

          {/* The Landscape Page */}
          {currentPage === 'landscape' && (
            <div 
              className="flex"
              style={{ 
                position: 'relative',
                minHeight: 'calc(100vh - 96px)',
                marginLeft: '-3rem', 
                marginRight: '-3rem',
              }}
            >
              {/* Week Index - Visible on left side */}
              <div 
                className="flex flex-col items-center py-6" 
                style={{ 
                  width: '48px',
                  minWidth: '48px',
                  borderRight: '1px solid #030f42',
                  backgroundColor: 'white',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((week) => {
                  const isUnlocked = week <= currentWeek;
                  const isActive = week === landscapeActiveLayer;
                  return (
                    <button
                      key={week}
                      onClick={() => {
                        if (isUnlocked) {
                          setLandscapeActiveLayer(isActive ? null : week);
                        }
                      }}
                      disabled={!isUnlocked}
                      className="w-7 h-7 flex items-center justify-center transition-all"
                      style={{
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '10px',
                        color: isActive ? 'white' : '#030f42',
                        backgroundColor: isActive ? '#030f42' : 'transparent',
                        opacity: isUnlocked ? 1 : 0.3,
                        cursor: isUnlocked ? 'pointer' : 'default',
                        borderRadius: '50%',
                        border: isUnlocked ? '1px solid #030f42' : 'none',
                        marginBottom: '6px',
                      }}
                    >
                      {week}
                    </button>
                  );
                })}
              </div>

              {/* Landscape Canvas - Full page, white background */}
              <div 
                ref={landscapeRef}
                className="flex-1 relative"
                style={{ 
                  backgroundColor: 'white',
                  cursor: landscapeDragging ? 'grabbing' : 'default',
                }}
                onMouseMove={(e) => {
                  if (landscapeDragging && landscapeRef.current) {
                    const rect = landscapeRef.current.getBoundingClientRect();
                    const newX = ((e.clientX - rect.left) / rect.width) * 100;
                    const newY = ((e.clientY - rect.top) / rect.height) * 100;
                    setLandscapePositions(prev => ({
                      ...prev,
                      [landscapeDragging]: { 
                        x: Math.max(5, Math.min(95, newX)), 
                        y: Math.max(5, Math.min(95, newY)) 
                      }
                    }));
                  }
                }}
                onMouseUp={() => setLandscapeDragging(null)}
                onMouseLeave={() => setLandscapeDragging(null)}
              >
                {/* Week 1: Three Stars in the Sky */}
                {currentWeek >= 1 && (
                  <>
                    {/* Star 1 - Basic Principles */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.star1.x}%`, 
                        top: `${landscapePositions.star1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 1 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'star1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('star1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'principles' ? null : 'principles');
                        }
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M16 0 L18 12 L30 14 L20 18 L22 30 L16 22 L10 30 L12 18 L2 14 L14 12 Z" 
                          stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <circle cx="16" cy="16" r="3" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>

                    {/* Star 2 - Stop Telling Yourself */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.star2.x}%`, 
                        top: `${landscapePositions.star2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 1 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'star2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('star2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'stop' ? null : 'stop');
                        }
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M14 0 L16 10 L26 12 L18 16 L20 26 L14 20 L8 26 L10 16 L2 12 L12 10 Z" 
                          stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <circle cx="14" cy="14" r="2.5" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>

                    {/* Star 3 - Affirmations */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.star3.x}%`, 
                        top: `${landscapePositions.star3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 1 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'star3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('star3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'affirmations' ? null : 'affirmations');
                        }
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M12 0 L14 8 L22 10 L16 14 L18 22 L12 17 L6 22 L8 14 L2 10 L10 8 Z" 
                          stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <circle cx="12" cy="12" r="2" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 2: Floating words and signpost */}
                {currentWeek >= 2 && (
                  <>
                    {/* Floating word - SANITY */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_sanity.x}%`, 
                        top: `${landscapePositions.word_sanity.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 2 || landscapeActiveLayer === null ? 0.4 : 0.08,
                        cursor: landscapeDragging === 'word_sanity' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '14px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_sanity');
                      }}
                    >
                      SANITY
                    </div>

                    {/* Floating word - SKEPTICISM */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_skepticism.x}%`, 
                        top: `${landscapePositions.word_skepticism.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 2 || landscapeActiveLayer === null ? 0.4 : 0.08,
                        cursor: landscapeDragging === 'word_skepticism' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '12px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_skepticism');
                      }}
                    >
                      SKEPTICISM
                    </div>

                    {/* Floating word - ATTENTION */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_attention.x}%`, 
                        top: `${landscapePositions.word_attention.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 2 || landscapeActiveLayer === null ? 0.4 : 0.08,
                        cursor: landscapeDragging === 'word_attention' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '11px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_attention');
                      }}
                    >
                      ATTENTION
                    </div>

                    {/* Signpost - Rules of the Road */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.signpost.x}%`, 
                        top: `${landscapePositions.signpost.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 2 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'signpost' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('signpost');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'rules' ? null : 'rules');
                        }
                      }}
                    >
                      <svg width="48" height="72" viewBox="0 0 48 72" fill="none" className="hover:scale-110 transition-transform">
                        {/* Post - two parallel lines */}
                        <line x1="22" y1="32" x2="22" y2="68" stroke="#030f42" strokeWidth="0.75"/>
                        <line x1="26" y1="32" x2="26" y2="68" stroke="#030f42" strokeWidth="0.75"/>
                        {/* Post cap */}
                        <rect x="20" y="2" width="8" height="8" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Sign board */}
                        <path d="M4 10 L4 32 L44 32 L44 10 L4 10" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Wood grain lines on sign - left side */}
                        <line x1="7" y1="14" x2="12" y2="14" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="7" y1="18" x2="10" y2="18" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="7" y1="22" x2="13" y2="22" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="7" y1="26" x2="9" y2="26" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        {/* Wood grain lines on sign - right side */}
                        <line x1="36" y1="15" x2="41" y2="15" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="35" y1="20" x2="41" y2="20" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        <line x1="38" y1="25" x2="41" y2="25" stroke="#030f42" strokeWidth="0.5" opacity="0.5"/>
                        {/* Nails */}
                        <circle cx="24" cy="13" r="1.5" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        <circle cx="24" cy="29" r="1.5" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        {/* Grass at base */}
                        <path d="M14 68 L17 62 L19 68" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        <path d="M21 68 L24 60 L27 68" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        <path d="M29 68 L31 63 L34 68" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 3: Floating words and barren trees */}
                {currentWeek >= 3 && (
                  <>
                    {/* Floating word - ANGER */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_anger.x}%`, 
                        top: `${landscapePositions.word_anger.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 0.35 : 0.08,
                        cursor: landscapeDragging === 'word_anger' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '11px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_anger');
                      }}
                    >
                      ANGER
                    </div>

                    {/* Floating word - SYNCHRONICITY */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_synchronicity.x}%`, 
                        top: `${landscapePositions.word_synchronicity.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 0.35 : 0.08,
                        cursor: landscapeDragging === 'word_synchronicity' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '10px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_synchronicity');
                      }}
                    >
                      SYNCHRONICITY
                    </div>

                    {/* Floating word - SHAME */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_shame.x}%`, 
                        top: `${landscapePositions.word_shame.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 0.35 : 0.08,
                        cursor: landscapeDragging === 'word_shame' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '12px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_shame');
                      }}
                    >
                      SHAME
                    </div>

                    {/* Floating word - GROWTH */}
                    <div
                      className="absolute transition-opacity select-none"
                      style={{ 
                        left: `${landscapePositions.word_growth.x}%`, 
                        top: `${landscapePositions.word_growth.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 0.35 : 0.08,
                        cursor: landscapeDragging === 'word_growth' ? 'grabbing' : 'grab',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontSize: '11px',
                        color: '#030f42',
                        letterSpacing: '2px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('word_growth');
                      }}
                    >
                      GROWTH
                    </div>

                    {/* Tree 1 - Criticism */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.tree1.x}%`, 
                        top: `${landscapePositions.tree1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'tree1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('tree1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'criticism' ? null : 'criticism');
                        }
                      }}
                    >
                      <svg width="85" height="140" viewBox="0 0 228.37 369.78" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M183.81,289.51s-15.68,4.36-29.6-15.4c0,0-36.33-40.15-38.87-102.89-2.53-62.74,38.87-52.02,38.87-52.02,0,0,14.85,2.58,17.15,15.43,0,0-1.87-14.56-11.9-19.03-29.84-13.29-44.23,17.32-44.23,17.32,0,0,12.78-35.47,59.44-17.08,43.6,17.19,67.04-48.15,45.41-78.59-5.42-7.62-12.61-11.92-20.88-13.69-8-15.73-26.62-27.41-52.66-22.16-13.38,2.69-24.85,7.86-34.65,14.45C58.08,25.85,25.63,86.72,42.59,178.28l14.01,96.88c4.26,29.43-27.68-4.82-49.95,5.64-12.88,6.05-2.74,21.92-2.74,21.92,1.53,1.65,2.04,2.26,4.6,5.13,3.88,4.35,7.69,8.68,7.69,8.68,13.19,15.21,5.84,22.51,3.64,24.18,12.99-8.96,1.91-21.61-10.71-39.3,0,0-12.73-31.26,34.75-3.22,47.49,28.03,38.47-10.77,38.47-10.77,7.56-.82,31.15,55.51-7.04,59.59-31.13,3.32-10.01,22.38-10.01,22.38-1.01-3.45-22.2-21.49,22.09-20.09,33.36,1.05,11.51-71.53,17.31-62.66,0,0,24.42,2.27,44.45,10.28,20.02,8.01,33.18-9.01,52.73-3.34,13.29,3.85,8.52,21.71,5.15,27.28,7.13-11.53,6.5-37.67-23.25-31.35ZM146.31,7.31c15.46-3.14,27.94.49,36.66,7.5,2.11,1.7,4,3.59,5.67,5.63-8.14-1.48-15.83-.76-22.8,1.35-8.36-3.85-19.16-6.61-33.14-7.29-.65-.03-1.29-.04-1.94-.06,0,0,.01,0,.02-.01,5.69-3.86,11.04-6.2,15.54-7.12ZM196.48,51.36c-.45,2.05-1.29,3.93-2.46,5.65-1.07-6.89-5.59-23.07-24.57-33.41,7.49-1,15.21-.49,22.4,1.44,4.79,8.03,6.52,17.55,4.63,26.31ZM58.89,96.82c-.08-23.5,12.14-48.66,32.89-63.32-25.16,28.1-32.89,63.32-32.89,63.32ZM79.62,163.24c-3.07-12.22-3.76-27.04-.67-45.99,5.96-48.16,24.89-79.19,42.91-95.72,3.72-.52,7.56-.76,11.52-.66,7.6.18,15.64,1.54,24.06,4.29-6.97,3.5-12.91,8.3-17.42,13.36,5.28-5.98,12.08-10.16,19.52-12.64,2.43.86,4.89,1.82,7.38,2.92,18,7.91,24.64,22.77,26.67,28.83-1.68,2.26-3.95,4.24-6.64,5.97-2.17-5.82-6.15-9.33-10.96-11.34-5.89-2.47-17.07-1.14-20.99,2.89-6.61,6.79-7.59,13.87-7,19.08-10.44,1.05-19.83,1.16-24.86,1.1,2.44.11,6.11.32,11.25.66,4.96.33,9.61.49,13.98.49.92,4.32,2.67,6.7,1.9,5.35-.76-1.33-1.1-3.42-1.24-5.34,14.74-.05,26.13-1.98,34.61-5.59-.23,11.28-16.24,29.25-52.47,15.04,0,0-21.34-9.27-39.41,11.38-18.07,20.65-12.13,65.94-12.13,65.94ZM148.98,71.92s1.58-22.14,22.38-16.35c5.79,1.61,9.6,6.5,11.27,10.43-9.42,4.55-22.13,6.92-33.69,8.13,0-1.3.05-2.21.05-2.21ZM93.11,143.45s.42-56.37,37.82-47c36.73,9.2,57.94-5.94,57.8-22.12-.02-2.09-.19-3.99-.48-5.75,7.14-4.14,11.62-9.84,13.79-16.95,2.27-7.42,1.93-15.5-.69-23.02,15.41,7.59,25.88,22.83,21.28,44.56-2.89,13.65-12.67,31.53-27.87,36.37-6.96,2.22-17.96-1.88-24.47-3.95,0,0-13.07-6.56-40.72,0-21.95,5.21-36.47,37.86-36.47,37.86Z" fill="#fff" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>

                    {/* Tree 2 - Synchronicity - larger */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.tree2.x}%`, 
                        top: `${landscapePositions.tree2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'tree2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('tree2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'synchronicity' ? null : 'synchronicity');
                        }
                      }}
                    >
                      <svg width="90" height="148" viewBox="0 0 228.37 369.78" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M183.81,289.51s-15.68,4.36-29.6-15.4c0,0-36.33-40.15-38.87-102.89-2.53-62.74,38.87-52.02,38.87-52.02,0,0,14.85,2.58,17.15,15.43,0,0-1.87-14.56-11.9-19.03-29.84-13.29-44.23,17.32-44.23,17.32,0,0,12.78-35.47,59.44-17.08,43.6,17.19,67.04-48.15,45.41-78.59-5.42-7.62-12.61-11.92-20.88-13.69-8-15.73-26.62-27.41-52.66-22.16-13.38,2.69-24.85,7.86-34.65,14.45C58.08,25.85,25.63,86.72,42.59,178.28l14.01,96.88c4.26,29.43-27.68-4.82-49.95,5.64-12.88,6.05-2.74,21.92-2.74,21.92,1.53,1.65,2.04,2.26,4.6,5.13,3.88,4.35,7.69,8.68,7.69,8.68,13.19,15.21,5.84,22.51,3.64,24.18,12.99-8.96,1.91-21.61-10.71-39.3,0,0-12.73-31.26,34.75-3.22,47.49,28.03,38.47-10.77,38.47-10.77,7.56-.82,31.15,55.51-7.04,59.59-31.13,3.32-10.01,22.38-10.01,22.38-1.01-3.45-22.2-21.49,22.09-20.09,33.36,1.05,11.51-71.53,17.31-62.66,0,0,24.42,2.27,44.45,10.28,20.02,8.01,33.18-9.01,52.73-3.34,13.29,3.85,8.52,21.71,5.15,27.28,7.13-11.53,6.5-37.67-23.25-31.35ZM146.31,7.31c15.46-3.14,27.94.49,36.66,7.5,2.11,1.7,4,3.59,5.67,5.63-8.14-1.48-15.83-.76-22.8,1.35-8.36-3.85-19.16-6.61-33.14-7.29-.65-.03-1.29-.04-1.94-.06,0,0,.01,0,.02-.01,5.69-3.86,11.04-6.2,15.54-7.12ZM196.48,51.36c-.45,2.05-1.29,3.93-2.46,5.65-1.07-6.89-5.59-23.07-24.57-33.41,7.49-1,15.21-.49,22.4,1.44,4.79,8.03,6.52,17.55,4.63,26.31ZM58.89,96.82c-.08-23.5,12.14-48.66,32.89-63.32-25.16,28.1-32.89,63.32-32.89,63.32ZM79.62,163.24c-3.07-12.22-3.76-27.04-.67-45.99,5.96-48.16,24.89-79.19,42.91-95.72,3.72-.52,7.56-.76,11.52-.66,7.6.18,15.64,1.54,24.06,4.29-6.97,3.5-12.91,8.3-17.42,13.36,5.28-5.98,12.08-10.16,19.52-12.64,2.43.86,4.89,1.82,7.38,2.92,18,7.91,24.64,22.77,26.67,28.83-1.68,2.26-3.95,4.24-6.64,5.97-2.17-5.82-6.15-9.33-10.96-11.34-5.89-2.47-17.07-1.14-20.99,2.89-6.61,6.79-7.59,13.87-7,19.08-10.44,1.05-19.83,1.16-24.86,1.1,2.44.11,6.11.32,11.25.66,4.96.33,9.61.49,13.98.49.92,4.32,2.67,6.7,1.9,5.35-.76-1.33-1.1-3.42-1.24-5.34,14.74-.05,26.13-1.98,34.61-5.59-.23,11.28-16.24,29.25-52.47,15.04,0,0-21.34-9.27-39.41,11.38-18.07,20.65-12.13,65.94-12.13,65.94ZM148.98,71.92s1.58-22.14,22.38-16.35c5.79,1.61,9.6,6.5,11.27,10.43-9.42,4.55-22.13,6.92-33.69,8.13,0-1.3.05-2.21.05-2.21ZM93.11,143.45s.42-56.37,37.82-47c36.73,9.2,57.94-5.94,57.8-22.12-.02-2.09-.19-3.99-.48-5.75,7.14-4.14,11.62-9.84,13.79-16.95,2.27-7.42,1.93-15.5-.69-23.02,15.41,7.59,25.88,22.83,21.28,44.56-2.89,13.65-12.67,31.53-27.87,36.37-6.96,2.22-17.96-1.88-24.47-3.95,0,0-13.07-6.56-40.72,0-21.95,5.21-36.47,37.86-36.47,37.86Z" fill="#fff" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>

                    {/* Tree 3 - Questions - smaller */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.tree3.x}%`, 
                        top: `${landscapePositions.tree3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 3 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'tree3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('tree3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'questions' ? null : 'questions');
                        }
                      }}
                    >
                      <svg width="60" height="98" viewBox="0 0 228.37 369.78" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M183.81,289.51s-15.68,4.36-29.6-15.4c0,0-36.33-40.15-38.87-102.89-2.53-62.74,38.87-52.02,38.87-52.02,0,0,14.85,2.58,17.15,15.43,0,0-1.87-14.56-11.9-19.03-29.84-13.29-44.23,17.32-44.23,17.32,0,0,12.78-35.47,59.44-17.08,43.6,17.19,67.04-48.15,45.41-78.59-5.42-7.62-12.61-11.92-20.88-13.69-8-15.73-26.62-27.41-52.66-22.16-13.38,2.69-24.85,7.86-34.65,14.45C58.08,25.85,25.63,86.72,42.59,178.28l14.01,96.88c4.26,29.43-27.68-4.82-49.95,5.64-12.88,6.05-2.74,21.92-2.74,21.92,1.53,1.65,2.04,2.26,4.6,5.13,3.88,4.35,7.69,8.68,7.69,8.68,13.19,15.21,5.84,22.51,3.64,24.18,12.99-8.96,1.91-21.61-10.71-39.3,0,0-12.73-31.26,34.75-3.22,47.49,28.03,38.47-10.77,38.47-10.77,7.56-.82,31.15,55.51-7.04,59.59-31.13,3.32-10.01,22.38-10.01,22.38-1.01-3.45-22.2-21.49,22.09-20.09,33.36,1.05,11.51-71.53,17.31-62.66,0,0,24.42,2.27,44.45,10.28,20.02,8.01,33.18-9.01,52.73-3.34,13.29,3.85,8.52,21.71,5.15,27.28,7.13-11.53,6.5-37.67-23.25-31.35ZM146.31,7.31c15.46-3.14,27.94.49,36.66,7.5,2.11,1.7,4,3.59,5.67,5.63-8.14-1.48-15.83-.76-22.8,1.35-8.36-3.85-19.16-6.61-33.14-7.29-.65-.03-1.29-.04-1.94-.06,0,0,.01,0,.02-.01,5.69-3.86,11.04-6.2,15.54-7.12ZM196.48,51.36c-.45,2.05-1.29,3.93-2.46,5.65-1.07-6.89-5.59-23.07-24.57-33.41,7.49-1,15.21-.49,22.4,1.44,4.79,8.03,6.52,17.55,4.63,26.31ZM58.89,96.82c-.08-23.5,12.14-48.66,32.89-63.32-25.16,28.1-32.89,63.32-32.89,63.32ZM79.62,163.24c-3.07-12.22-3.76-27.04-.67-45.99,5.96-48.16,24.89-79.19,42.91-95.72,3.72-.52,7.56-.76,11.52-.66,7.6.18,15.64,1.54,24.06,4.29-6.97,3.5-12.91,8.3-17.42,13.36,5.28-5.98,12.08-10.16,19.52-12.64,2.43.86,4.89,1.82,7.38,2.92,18,7.91,24.64,22.77,26.67,28.83-1.68,2.26-3.95,4.24-6.64,5.97-2.17-5.82-6.15-9.33-10.96-11.34-5.89-2.47-17.07-1.14-20.99,2.89-6.61,6.79-7.59,13.87-7,19.08-10.44,1.05-19.83,1.16-24.86,1.1,2.44.11,6.11.32,11.25.66,4.96.33,9.61.49,13.98.49.92,4.32,2.67,6.7,1.9,5.35-.76-1.33-1.1-3.42-1.24-5.34,14.74-.05,26.13-1.98,34.61-5.59-.23,11.28-16.24,29.25-52.47,15.04,0,0-21.34-9.27-39.41,11.38-18.07,20.65-12.13,65.94-12.13,65.94ZM148.98,71.92s1.58-22.14,22.38-16.35c5.79,1.61,9.6,6.5,11.27,10.43-9.42,4.55-22.13,6.92-33.69,8.13,0-1.3.05-2.21.05-2.21ZM93.11,143.45s.42-56.37,37.82-47c36.73,9.2,57.94-5.94,57.8-22.12-.02-2.09-.19-3.99-.48-5.75,7.14-4.14,11.62-9.84,13.79-16.95,2.27-7.42,1.93-15.5-.69-23.02,15.41,7.59,25.88,22.83,21.28,44.56-2.89,13.65-12.67,31.53-27.87,36.37-6.96,2.22-17.96-1.88-24.47-3.95,0,0-13.07-6.56-40.72,0-21.95,5.21-36.47,37.86-36.47,37.86Z" fill="#fff" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 4: Flying birds */}
                {currentWeek >= 4 && (
                  <>
                    {/* Bird 1 - Hobbies/Lists (larger) */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.bird1.x}%`, 
                        top: `${landscapePositions.bird1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 4 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'bird1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('bird1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'hobbies' ? null : 'hobbies');
                        }
                      }}
                    >
                      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="hover:scale-110 transition-transform">
                        {/* Save the Bay style bird - simple curved wings */}
                        <path d="M0 12 Q10 4 20 10 Q30 4 40 12" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M18 10 Q20 8 22 10" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>

                    {/* Bird 2 - Kriya (medium) */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.bird2.x}%`, 
                        top: `${landscapePositions.bird2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 4 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'bird2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('bird2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'kriya' ? null : 'kriya');
                        }
                      }}
                    >
                      <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M0 10 Q8 3 16 8 Q24 3 32 10" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M14 8 Q16 6 18 8" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>

                    {/* Bird 3 - Reading Deprivation (smaller, distant) */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.bird3.x}%`, 
                        top: `${landscapePositions.bird3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 4 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'bird3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('bird3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'deprivation' ? null : 'deprivation');
                        }
                      }}
                    >
                      <svg width="26" height="14" viewBox="0 0 26 14" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M0 9 Q6 2 13 7 Q20 2 26 9" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M11 7 Q13 5 15 7" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>

                    {/* Bird 4 - Prayer/Creator */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.bird4.x}%`, 
                        top: `${landscapePositions.bird4.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 4 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'bird4' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('bird4');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'prayer' ? null : 'prayer');
                        }
                      }}
                    >
                      <svg width="30" height="16" viewBox="0 0 30 16" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M0 11 Q7 3 15 9 Q23 3 30 11" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M13 9 Q15 7 17 9" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 5: Clouds */}
                {currentWeek >= 5 && (
                  <>
                    {/* Cloud 1 - Virtue Trap Quiz */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.cloud1.x}%`, 
                        top: `${landscapePositions.cloud1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 5 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'cloud1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('cloud1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'virtutrap' ? null : 'virtutrap');
                        }
                      }}
                    >
                      <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M12 22 Q4 22 4 16 Q4 10 12 10 Q14 4 24 4 Q34 4 38 10 Q42 6 50 8 Q58 10 56 18 Q58 24 48 24 Q40 26 30 24 Q20 26 12 22" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>

                    {/* Cloud 2 - Forbidden Joys */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.cloud2.x}%`, 
                        top: `${landscapePositions.cloud2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 5 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'cloud2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('cloud2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'forbidden' ? null : 'forbidden');
                        }
                      }}
                    >
                      <svg width="70" height="35" viewBox="0 0 70 35" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M14 26 Q4 26 5 18 Q2 12 10 10 Q12 4 24 4 Q32 2 40 6 Q48 2 56 6 Q66 8 65 18 Q68 26 56 28 Q44 30 32 28 Q20 30 14 26" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>

                    {/* Cloud 3 - Wishes */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.cloud3.x}%`, 
                        top: `${landscapePositions.cloud3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 5 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'cloud3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('cloud3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'wishes' ? null : 'wishes');
                        }
                      }}
                    >
                      <svg width="55" height="28" viewBox="0 0 55 28" fill="none" className="hover:scale-105 transition-transform">
                        <path d="M10 20 Q2 20 4 14 Q2 8 10 8 Q14 2 24 4 Q32 2 40 6 Q50 4 52 14 Q54 22 44 22 Q34 24 24 22 Q14 24 10 20" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 6: House */}
                {currentWeek >= 6 && (
                  <>
                    {/* House - Money beliefs */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.house.x}%`, 
                        top: `${landscapePositions.house.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 6 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'house' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('house');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'money' ? null : 'money');
                        }
                      }}
                    >
                      <svg width="50" height="55" viewBox="0 0 50 55" fill="none" className="hover:scale-105 transition-transform">
                        {/* Roof */}
                        <path d="M25 5 L5 25 L45 25 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* House body */}
                        <path d="M8 25 L8 50 L42 50 L42 25" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Door */}
                        <path d="M20 50 L20 35 L30 35 L30 50" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Door knob */}
                        <circle cx="28" cy="42" r="1" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        {/* Left window */}
                        <path d="M11 30 L11 38 L17 38 L17 30 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M14 30 L14 38" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        <path d="M11 34 L17 34" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        {/* Right window */}
                        <path d="M33 30 L33 38 L39 38 L39 30 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M36 30 L36 38" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        <path d="M33 34 L39 34" stroke="#030f42" strokeWidth="0.5" fill="none"/>
                        {/* Chimney */}
                        <path d="M35 8 L35 18 L40 18 L40 12" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 7: Wind swirls */}
                {currentWeek >= 7 && (
                  <>
                    {/* Wind 1 - Perfectionism */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.wind1.x}%`, 
                        top: `${landscapePositions.wind1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 7 || landscapeActiveLayer === null ? 0.7 : 0.12,
                        cursor: landscapeDragging === 'wind1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('wind1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'perfectionism' ? null : 'perfectionism');
                        }
                      }}
                    >
                      <svg width="50" height="20" viewBox="0 0 71.18 28.53" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M47.82,8.03s1.98-2.59,4.6-.35c1.46,1.24,1.29,3.38,1.05,4.4-.19.84-.66,1.53-1.23,2.04-1.19,1.04-3.86,2.76-6.91.85-4.14-2.61-2.35-9.05-2.35-9.05,0,0,1.48-6.54,9.02-5.71,10.72,1.18,10.29,11.57,9.36,14.89-.91,3.27-2.34,7.65-8.56,9.8-11.11,3.85-28.6-12.75-47.61-2.55L.15,25.4c-.56.18,7.72-4.33,13.14-4.68,9.03-.58,23.89,4.68,33.47,7.4,2.14.61,6.62.36,10.46-1.52s8.21-5.77,8.91-6.35c1.38-1.16,3.19-1.91,5.03-2.12" fill="none" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>

                    {/* Wind 2 - Jealousy Map */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.wind2.x}%`, 
                        top: `${landscapePositions.wind2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 7 || landscapeActiveLayer === null ? 0.7 : 0.12,
                        cursor: landscapeDragging === 'wind2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('wind2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'jealousy' ? null : 'jealousy');
                        }
                      }}
                    >
                      <svg width="55" height="22" viewBox="0 0 71.18 28.53" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M47.82,8.03s1.98-2.59,4.6-.35c1.46,1.24,1.29,3.38,1.05,4.4-.19.84-.66,1.53-1.23,2.04-1.19,1.04-3.86,2.76-6.91.85-4.14-2.61-2.35-9.05-2.35-9.05,0,0,1.48-6.54,9.02-5.71,10.72,1.18,10.29,11.57,9.36,14.89-.91,3.27-2.34,7.65-8.56,9.80-11.11,3.85-28.6-12.75-47.61-2.55L.15,25.4c-.56.18,7.72-4.33,13.14-4.68,9.03-.58,23.89,4.68,33.47,7.4,2.14.61,6.62.36,10.46-1.52s8.21-5.77,8.91-6.35c1.38-1.16,3.19-1.91,5.03-2.12" fill="none" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>

                    {/* Wind 3 - Childhood losses */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.wind3.x}%`, 
                        top: `${landscapePositions.wind3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 7 || landscapeActiveLayer === null ? 0.7 : 0.12,
                        cursor: landscapeDragging === 'wind3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('wind3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'childhood' ? null : 'childhood');
                        }
                      }}
                    >
                      <svg width="45" height="18" viewBox="0 0 71.18 28.53" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M47.82,8.03s1.98-2.59,4.6-.35c1.46,1.24,1.29,3.38,1.05,4.4-.19.84-.66,1.53-1.23,2.04-1.19,1.04-3.86,2.76-6.91.85-4.14-2.61-2.35-9.05-2.35-9.05,0,0,1.48-6.54,9.02-5.71,10.72,1.18,10.29,11.57,9.36,14.89-.91,3.27-2.34,7.65-8.56,9.80-11.11,3.85-28.6-12.75-47.61-2.55L.15,25.4c-.56.18,7.72-4.33,13.14-4.68,9.03-.58,23.89,4.68,33.47,7.4,2.14.61,6.62.36,10.46-1.52s8.21-5.77,8.91-6.35c1.38-1.16,3.19-1.91,5.03-2.12" fill="none" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>

                    {/* Wind 4 - Gains */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.wind4.x}%`, 
                        top: `${landscapePositions.wind4.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 7 || landscapeActiveLayer === null ? 0.7 : 0.12,
                        cursor: landscapeDragging === 'wind4' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('wind4');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'gains' ? null : 'gains');
                        }
                      }}
                    >
                      <svg width="52" height="21" viewBox="0 0 71.18 28.53" fill="none" className="hover:scale-110 transition-transform">
                        <path d="M47.82,8.03s1.98-2.59,4.6-.35c1.46,1.24,1.29,3.38,1.05,4.4-.19.84-.66,1.53-1.23,2.04-1.19,1.04-3.86,2.76-6.91.85-4.14-2.61-2.35-9.05-2.35-9.05,0,0,1.48-6.54,9.02-5.71,10.72,1.18,10.29,11.57,9.36,14.89-.91,3.27-2.34,7.65-8.56,9.80-11.11,3.85-28.6-12.75-47.61-2.55L.15,25.4c-.56.18,7.72-4.33,13.14-4.68,9.03-.58,23.89,4.68,33.47,7.4,2.14.61,6.62.36,10.46-1.52s8.21-5.77,8.91-6.35c1.38-1.16,3.19-1.91,5.03-2.12" fill="none" stroke="#030f42" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 8: Raindrops */}
                {currentWeek >= 8 && (
                  <>
                    {/* Raindrop 1 - Art intro/Quote */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.deer1.x}%`, 
                        top: `${landscapePositions.deer1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 8 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'deer1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('deer1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'artintro' ? null : 'artintro');
                        }
                      }}
                    >
                      <svg width="28" height="40" viewBox="0 0 28 40" fill="none" className="hover:scale-105 transition-transform">
                        {/* Raindrop - teardrop shape */}
                        <path d="M14 2 Q14 2 14 2 C6 14 4 20 4 26 C4 34 8 38 14 38 C20 38 24 34 24 26 C24 20 22 14 14 2 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Inner highlight */}
                        <path d="M10 28 Q8 24 10 20" stroke="#030f42" strokeWidth="0.5" fill="none" opacity="0.5"/>
                      </svg>
                    </div>

                    {/* Raindrop 2 - Parents/Teachers */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.deer2.x}%`, 
                        top: `${landscapePositions.deer2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 8 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'deer2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('deer2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'parents' ? null : 'parents');
                        }
                      }}
                    >
                      <svg width="32" height="46" viewBox="0 0 32 46" fill="none" className="hover:scale-105 transition-transform">
                        {/* Larger raindrop */}
                        <path d="M16 2 Q16 2 16 2 C6 16 4 24 4 30 C4 40 9 44 16 44 C23 44 28 40 28 30 C28 24 26 16 16 2 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Inner highlight */}
                        <path d="M11 32 Q8 27 11 22" stroke="#030f42" strokeWidth="0.5" fill="none" opacity="0.5"/>
                      </svg>
                    </div>

                    {/* Raindrop 3 - Affirmations */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.deer3.x}%`, 
                        top: `${landscapePositions.deer3.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 8 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'deer3' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('deer3');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'affirmations' ? null : 'affirmations');
                        }
                      }}
                    >
                      <svg width="24" height="34" viewBox="0 0 24 34" fill="none" className="hover:scale-105 transition-transform">
                        {/* Smaller raindrop */}
                        <path d="M12 2 Q12 2 12 2 C5 12 3 17 3 22 C3 29 7 32 12 32 C17 32 21 29 21 22 C21 17 19 12 12 2 Z" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Inner highlight */}
                        <path d="M8 24 Q6 20 8 16" stroke="#030f42" strokeWidth="0.5" fill="none" opacity="0.5"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 9: Sun */}
                {currentWeek >= 9 && (
                  <div
                    className="absolute transition-opacity"
                    style={{ 
                      left: `${landscapePositions.sun.x}%`, 
                      top: `${landscapePositions.sun.y}%`, 
                      transform: 'translate(-50%, -50%)',
                      opacity: landscapeActiveLayer === 9 || landscapeActiveLayer === null ? 1 : 0.12,
                      cursor: landscapeDragging === 'sun' ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLandscapeDragging('sun');
                    }}
                    onClick={(e) => {
                      if (!landscapeDragging) {
                        setLandscapePopup(landscapePopup === 'blockbuster' ? null : 'blockbuster');
                      }
                    }}
                  >
                    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" className="hover:scale-110 transition-transform">
                      {/* Sun circle */}
                      <circle cx="22.5" cy="22.5" r="10" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      {/* Sun rays */}
                      <path d="M22.5 8 L22.5 2" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M22.5 43 L22.5 37" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M8 22.5 L2 22.5" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M43 22.5 L37 22.5" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M12 12 L7 7" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M38 38 L33 33" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M12 33 L7 38" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                      <path d="M38 7 L33 12" stroke="#030f42" strokeWidth="0.6" fill="none"/>
                    </svg>
                  </div>
                )}

                {/* Week 10: Moon */}
                {currentWeek >= 10 && (
                  <div
                    className="absolute transition-opacity"
                    style={{ 
                      left: `${landscapePositions.moon.x}%`, 
                      top: `${landscapePositions.moon.y}%`, 
                      transform: 'translate(-50%, -50%)',
                      opacity: landscapeActiveLayer === 10 || landscapeActiveLayer === null ? 1 : 0.12,
                      cursor: landscapeDragging === 'moon' ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLandscapeDragging('moon');
                    }}
                    onClick={(e) => {
                      if (!landscapeDragging) {
                        setLandscapePopup(landscapePopup === 'blocking' ? null : 'blocking');
                      }
                    }}
                  >
                    <svg width="40" height="44" viewBox="0 0 40 44" fill="none" className="hover:scale-110 transition-transform">
                      {/* Elegant crescent moon - pointed tips top and bottom */}
                      <path d="M18 1 
                        C8 4 2 14 2 24 
                        C2 34 10 42 20 43 
                        C14 40 10 32 10 24 
                        C10 14 14 6 18 1 Z" 
                        stroke="#030f42" strokeWidth="0.75" fill="none"/>
                    </svg>
                  </div>
                )}

                {/* Week 11: Walking people */}
                {currentWeek >= 11 && (
                  <>
                    {/* Person 1 - Artist statement */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.walker1.x}%`, 
                        top: `${landscapePositions.walker1.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 11 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'walker1' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('walker1');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'artiststatement' ? null : 'artiststatement');
                        }
                      }}
                    >
                      <svg width="30" height="45" viewBox="0 0 30 45" fill="none" className="hover:scale-105 transition-transform">
                        {/* Head */}
                        <circle cx="15" cy="6" r="4" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Body */}
                        <path d="M15 10 L15 25" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Arms - one forward, one back (walking) */}
                        <path d="M15 14 L8 20" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M15 14 L22 18" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Legs - walking stance */}
                        <path d="M15 25 L10 38 L8 42" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M15 25 L20 36 L22 42" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>

                    {/* Person 2 - Spiritual corner */}
                    <div
                      className="absolute transition-opacity"
                      style={{ 
                        left: `${landscapePositions.walker2.x}%`, 
                        top: `${landscapePositions.walker2.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        opacity: landscapeActiveLayer === 11 || landscapeActiveLayer === null ? 1 : 0.12,
                        cursor: landscapeDragging === 'walker2' ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLandscapeDragging('walker2');
                      }}
                      onClick={(e) => {
                        if (!landscapeDragging) {
                          setLandscapePopup(landscapePopup === 'spiritual' ? null : 'spiritual');
                        }
                      }}
                    >
                      <svg width="28" height="42" viewBox="0 0 28 42" fill="none" className="hover:scale-105 transition-transform">
                        {/* Head */}
                        <circle cx="14" cy="5" r="3.5" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Body */}
                        <path d="M14 8.5 L14 22" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Arms */}
                        <path d="M14 12 L7 17" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M14 12 L21 15" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        {/* Legs */}
                        <path d="M14 22 L9 34 L7 38" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                        <path d="M14 22 L19 32 L21 38" stroke="#030f42" strokeWidth="0.75" fill="none"/>
                      </svg>
                    </div>
                  </>
                )}

                {/* Week 12: Winding road */}
                {currentWeek >= 12 && (
                  <div
                    className="absolute transition-opacity"
                    style={{ 
                      left: `${landscapePositions.road.x}%`, 
                      top: `${landscapePositions.road.y}%`, 
                      transform: 'translate(-50%, -50%)',
                      opacity: landscapeActiveLayer === 12 || landscapeActiveLayer === null ? 1 : 0.12,
                      cursor: landscapeDragging === 'road' ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLandscapeDragging('road');
                    }}
                    onClick={(e) => {
                      if (!landscapeDragging) {
                        setLandscapePopup(landscapePopup === 'contract' ? null : 'contract');
                      }
                    }}
                  >
                    <svg width="120" height="118" viewBox="0 0 257.08 249.36" fill="none" className="hover:scale-105 transition-transform">
                      <path d="M172.33,248.6c-7.15,1-26.53-1.9-29.34-8.29-3.28-7.46,6.74-13.46,7.86-14.01,23.36-11.51,80.09-32.75,87.38-37.07,11.87-7.04,18.6-17.77,18.6-27.07,0-18.03-19.25-26.06-43.4-31.31-14.01-3.04-52.74-11.01-58.2-12.29-41-9.59,25.34-21.06,42.09-31.15,1.91-1.15,3.63-2.32,5.16-3.5,21.03-16.23,7.5-34.95-11.42-40.37q-38.89-11.13-38.9-11.09S121.11,24.26,178.51.25h-18.16s-82.76,29.47-2.25,44.91c51.44,9.87,36.81,22.53,20.79,29.26-6.1,2.76-50.4,18.13-59.19,21.64-7.69,3.08-19.63,10.11-18.1,20.54,1.15,7.82,17.81,12.15,21.84,13.47,2.77.91,56.02,14.27,74.37,17.85,20.55,4,36.49,11.02,11.74,22.78-6.48,3.08-113.85,34.24-128.83,39.45-10.54,3.67-18.94,7.37-25.61,10.96-.62.33-1.23.67-1.82,1-1.12.63-2.19,1.25-3.21,1.87-.75.46-1.47.91-2.17,1.36-19.97,12.87-18.74,23.27-18.74,23.27l-7.1-7.96c10.69-6.5-11.48-49.66-20.16-64.02-1.22-2.03-1.67-3.35-1.67-3.35l20.31,34.88-5.82-42.47,11.71,42.63-1.8-51.04,4.8,50.74,4.2-14.71,6.3-15.91-7.81,28.82-1.5,15.61,1.5,4.2,3.9-9.61,2.1-12.01.6-9.61s.3,26.12-3.9,33.03,13.21-17.71,13.21-17.71l-6.91,14.41s2.12-7.2,20.45-13.45c0,0-6.51,3.87-9.51,6.87s-4.19,7.38-4.19,7.38" fill="none" stroke="#030f42" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}

                {/* Popup Modals */}
                {landscapePopup === 'principles' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        BASIC PRINCIPLES
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ol className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>1. Creativity is the natural order of life. Life is energy: pure creative energy.</li>
                      <li>2. There is an underlying, in-dwelling creative force infusing all of life—including ourselves.</li>
                      <li>3. When we open ourselves to our creativity, we open ourselves to the creator's creativity within us and our lives.</li>
                      <li>4. We are, ourselves, creations. And we, in turn, are meant to continue creativity by being creative ourselves.</li>
                      <li>5. Creativity is God's gift to us. Using our creativity is our gift back to God.</li>
                      <li>6. The refusal to be creative is self-will and is counter to our true nature.</li>
                      <li>7. When we open ourselves to exploring our creativity, we open ourselves to God: good orderly direction.</li>
                      <li>8. As we open our creative channel to the creator, many gentle but powerful changes are to be expected.</li>
                      <li>9. It is safe to open ourselves up to greater and greater creativity.</li>
                      <li>10. Our creative dreams and yearnings come from a divine source. As we move toward our dreams, we move toward our divinity.</li>
                    </ol>
                  </div>
                )}

                {landscapePopup === 'stop' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        STOP TELLING YOURSELF
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ul className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>• Stop telling yourself, "It's too late."</li>
                      <li>• Stop waiting until you make enough money to do something you'd really love.</li>
                      <li>• Stop telling yourself, "It's just my ego" whenever you yearn for a more creative life.</li>
                      <li>• Stop telling yourself that dreams don't matter, that they are only dreams and that you should be more sensible.</li>
                      <li>• Stop fearing that your family and friends would think you crazy.</li>
                      <li>• Stop telling yourself that creativity is a luxury and that you should be grateful for what you've got.</li>
                    </ul>
                  </div>
                )}

                {landscapePopup === 'affirmations' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        AFFIRMATIONS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ol className="space-y-1" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', lineHeight: '1.5' }}>
                      <li>1. I am a channel for God's creativity, and my work comes to good.</li>
                      <li>2. My dreams come from God and God has the power to accomplish them.</li>
                      <li>3. As I create and listen, I will be led.</li>
                      <li>4. Creativity is the creator's will for me.</li>
                      <li>5. My creativity heals myself and others.</li>
                      <li>6. I am allowed to nurture my artist.</li>
                      <li>7. Through the use of a few simple tools, my creativity will flourish.</li>
                      <li>8. Through the use of my creativity, I serve God.</li>
                      <li>9. My creativity always leads me to truth and love.</li>
                      <li>10. My creativity leads me to forgiveness and self-forgiveness.</li>
                      <li>11. There is a divine plan of goodness for me.</li>
                      <li>12. There is a divine plan of goodness for my work.</li>
                      <li>13. As I listen to the creator within, I am led.</li>
                      <li>14. As I listen to my creativity I am led to my creator.</li>
                      <li>15. I am willing to create.</li>
                      <li>16. I am willing to learn to let myself create.</li>
                      <li>17. I am willing to let God create through me.</li>
                      <li>18. I am willing to be of service through my creativity.</li>
                      <li>19. I am willing to experience my creative energy.</li>
                      <li>20. I am willing to use my creative talents.</li>
                    </ol>
                  </div>
                )}

                {/* Week 2 - Rules of the Road popup */}
                {landscapePopup === 'rules' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        RULES OF THE ROAD
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '12px', opacity: 0.7 }}>
                      In order to be an artist, I must:
                    </p>
                    <ol className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>1. Show up at the page. Use the page to rest, to dream, to try.</li>
                      <li>2. Fill the well by caring for my artist.</li>
                      <li>3. Set small and gentle goals and meet them.</li>
                      <li>4. Pray for guidance, courage, and humility.</li>
                      <li>5. Remember that it is far harder and more painful to be a blocked artist than it is to do the work.</li>
                      <li>6. Be alert, always, for the presence of the Great Creator leading and helping my artist.</li>
                      <li>7. Choose companions who encourage me to do the work, not just talk about doing the work or why I am not doing the work.</li>
                      <li>8. Remember that the Great Creator loves creativity.</li>
                      <li>9. Remember that it is my job to do the work, not judge the work.</li>
                      <li>10. Place this sign in my workplace: Great Creator, I will take care of the quantity. You take care of the quality.</li>
                    </ol>
                  </div>
                )}

                {/* Week 3 - Criticism popup (Tree 1) */}
                {landscapePopup === 'criticism' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        SURVIVING CRITICISM
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ol className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>1. Receive the criticism all the way through and get it over with.</li>
                      <li>2. Jot down notes to yourself on what concepts or phrases bother you.</li>
                      <li>3. Jot down notes on what concepts or phrases seem useful.</li>
                      <li>4. Do something very nurturing for yourself—read an old good review or recall a compliment.</li>
                      <li>5. Remember that even if you have made a truly rotten piece of art, it may be a necessary stepping-stone to your next work. Art matures spasmodically and requires ugly-duckling growth stages.</li>
                      <li>6. Look at the criticism again. Does it remind you of any criticism from your past—particularly shaming childhood criticism? Acknowledge to yourself that the current criticism is triggering grief over a longstanding wound.</li>
                      <li>7. Write a letter to the critic—not to be mailed, most probably. Defend your work and acknowledge what was helpful, if anything, in the criticism proffered.</li>
                      <li>8. Get back on the horse. Make an immediate commitment to do something creative.</li>
                      <li>9. Do it. Creativity is the only cure for criticism.</li>
                    </ol>
                  </div>
                )}

                {/* Week 3 - Synchronicity popup (Tree 2) */}
                {landscapePopup === 'synchronicity' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '520px',
                    borderColor: '#030f42', 
                    maxHeight: '75vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        SYNCHRONICITY
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ul className="space-y-3 mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>• A woman admits to a buried dream of acting. At dinner the next night, she sits beside a man who teaches beginning actors.</li>
                      <li>• A writer acknowledges a dream to go to film school. A single exploratory phone call puts him in touch with a professor who knows and admires his work and promises him that the last available slot is now his.</li>
                      <li>• A woman wonders how to rent a rare film she has never seen. She finds it at her neighborhood bookstore two days later.</li>
                    </ul>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>
                      And you?
                    </p>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((num) => (
                        <input
                          key={num}
                          type="text"
                          value={landscapeResponses[`synchronicity${num}`] || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, [`synchronicity${num}`]: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          placeholder={`Experience ${num}...`}
                          className="w-full px-3 py-2 border text-sm focus:outline-none"
                          style={{ 
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            borderColor: '#030f42',
                            color: '#030f42',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 3 - Questions popup (Tree 3) */}
                {landscapePopup === 'questions' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '550px',
                    borderColor: '#030f42', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        QUESTIONS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.5' }}>
                      {[
                        { num: 1, q: "My favorite childhood toy was" },
                        { num: 2, q: "My favorite childhood game was" },
                        { num: 3, q: "The best movie I ever saw as a kid was" },
                        { num: 4, q: "I don't do it much but I enjoy" },
                        { num: 5, q: "If I could lighten up a little, I'd let myself" },
                        { num: 6, q: "If it weren't too late, I'd" },
                        { num: 7, q: "My favorite musical instrument is" },
                        { num: 8, q: "The amount of money I spend on treating myself to entertainment each month is" },
                        { num: 9, q: "If I weren't so stingy with my artist, I'd buy him/her" },
                        { num: 10, q: "Taking time out for myself is" },
                        { num: 11, q: "I am afraid that if I start dreaming" },
                        { num: 12, q: "I secretly enjoy reading" },
                        { num: 13, q: "If I had had a perfect childhood I'd have grown up to be" },
                        { num: 14, q: "If it didn't sound so crazy, I'd write or make a" },
                        { num: 15, q: "My parents think artists are" },
                        { num: 16, q: "My God thinks artists are" },
                        { num: 17, q: "What makes me feel weird about this recovery is" },
                        { num: 18, q: "Learning to trust myself is probably" },
                        { num: 19, q: "My most cheer-me-up music is" },
                        { num: 20, q: "My favorite way to dress is" },
                      ].map(({ num, q }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <div className="flex-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`question${num}`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`question${num}`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ 
                                width: '100%',
                                maxWidth: '200px',
                                color: '#030f42',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 4 - Hobbies/Lists popup (Bird 1) */}
                {landscapePopup === 'hobbies' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '520px',
                    borderColor: '#030f42', 
                    maxHeight: '75vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        LIST FIVE
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <ol className="space-y-3 mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.6' }}>
                      <li>1. List five hobbies that sound fun.</li>
                      <li>2. List five classes that sound fun.</li>
                      <li>3. List five things you personally would never do that sound fun.</li>
                      <li>4. List five skills that would be fun to have.</li>
                      <li>5. List five things you used to enjoy doing.</li>
                      <li>6. List five silly things you would like to try once.</li>
                    </ol>
                    <textarea
                      value={landscapeResponses.hobbies || ''}
                      onChange={(e) => {
                        const newResponses = { ...landscapeResponses, hobbies: e.target.value };
                        setLandscapeResponses(newResponses);
                        storageSet('windingPath:landscapeResponses', newResponses);
                      }}
                      placeholder="Write your lists here..."
                      className="w-full px-3 py-3 border text-sm focus:outline-none"
                      rows={8}
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                )}

                {/* Week 4 - Kriya popup (Bird 2) */}
                {landscapePopup === 'kriya' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '520px',
                    borderColor: '#030f42', 
                    maxHeight: '75vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        KRIYA
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.7' }}>
                      <p className="mb-4">
                        A kriya is a Sanskrit word meaning a spiritual emergency or surrender. (I always think of kriyas as spiritual seizures. Perhaps they should be spelled crias because they are cries of the soul as it is wrung through changes.)
                      </p>
                      <p className="mb-4">
                        We all know what a kriya looks like: it is the bad case of the flu right after you've broken up with your lover. It's the rotten head cold and bronchial cough that announces you've abused your health to meet an unreachable work deadline. That asthma attack out of nowhere when you've just done a round of care-taking your alcoholic sibling? That's a kriya, too.
                      </p>
                      <p className="mb-4">
                        Always significant, frequently psychosomatic, kriyas are the final insult our psyche adds to our injuries: "Get it?" a kriya asks you. Get it:
                      </p>
                      <p className="mb-4 pl-4" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                        You can't stay with this abusive lover.<br/>
                        You can't work at a job that demands eighty hours a week.<br/>
                        You can't rescue a brother who needs to save himself.
                      </p>
                      <p>
                        Think of yourself as an accident victim walking away from the crash: your old life has crashed and burned; your new life isn't apparent yet. You may feel yourself to be temporarily without a vehicle. Just keep walking.
                      </p>
                    </div>
                  </div>
                )}

                {/* Week 4 - Reading Deprivation popup (Bird 3) */}
                {landscapePopup === 'deprivation' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '550px',
                    borderColor: '#030f42', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        READING DEPRIVATION
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.7' }}>
                      <p className="mb-4">
                        Reading deprivation casts us into our inner silence, a space some of us begin to immediately fill with new words—long, gossipy conversations, television bingeing, the radio as a constant, chatty companion.
                      </p>
                      <p className="mb-4">
                        We often cannot hear our own inner voice, the voice of our artist's inspiration, above the static. In practicing reading deprivation, we need to cast a watchful eye on these other pollutants. They poison the well.
                      </p>
                      <p className="mb-4" style={{ fontWeight: 'bold' }}>
                        Need to push further? Why not do Image deprivation too?
                      </p>
                      <p className="mb-3" style={{ opacity: 0.7, fontSize: '11px' }}>
                        Instead, try:
                      </p>
                      <div className="grid grid-cols-3 gap-2" style={{ fontSize: '11px', opacity: 0.8 }}>
                        <span>Listen to the radio</span>
                        <span>Make a new lampshade</span>
                        <span>Organise the kitchen</span>
                        <span>Mend old socks</span>
                        <span>Polish your shoes</span>
                        <span>Go on an unexpected bike ride</span>
                        <span>Try a new album</span>
                        <span>Make a gift by hand</span>
                        <span>Wash special clothes by hand</span>
                        <span>Dance around</span>
                        <span>Knit</span>
                        <span>Cook</span>
                        <span>Make a plan</span>
                        <span>Draw</span>
                        <span>Fix something broken</span>
                        <span>Play an instrument</span>
                        <span>Watercolor</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 4 - Prayer popup (Bird 4) - editable */}
                {landscapePopup === 'prayer' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '540px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        PRAYER
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.6, marginBottom: '12px' }}>
                      This is yours to edit. Make it your own.
                    </p>
                    <textarea
                      value={landscapeResponses.prayer || `O Great Creator,

We are gathered together in your name
That we may be of greater service to you and to our fellows.

We offer ourselves to you as instruments.
We open ourselves to your creativity in our lives.
We surrender to you our old ideas.
We welcome your new and more expansive ideas.

We trust that you will lead us.
We trust that it is safe to follow you.

We know you created us and that creativity
Is your nature and our own.

We ask you to unfold our lives
According to your plan, not our low self-worth.

Help us to believe that it is not too late
And that we are not too small or too flawed
To be healed—by you and through each other—and made whole.

Help us to love one another,
To nurture each other's unfolding,
To encourage each other's growth,
And understand each other's fears.

Help us to know that we are not alone,
That we are loved and lovable.

Help us to create as an act of worship to you.`}
                      onChange={(e) => {
                        const newResponses = { ...landscapeResponses, prayer: e.target.value };
                        setLandscapeResponses(newResponses);
                        storageSet('windingPath:landscapeResponses', newResponses);
                      }}
                      className="w-full px-4 py-4 border text-sm focus:outline-none"
                      rows={20}
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42',
                        resize: 'vertical',
                        lineHeight: '1.7',
                        fontStyle: 'italic',
                      }}
                    />
                  </div>
                )}

                {/* Week 5 - Virtue Trap Quiz popup (Cloud 1) */}
                {landscapePopup === 'virtutrap' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '560px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        THE VIRTUE-TRAP QUIZ
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.5' }}>
                      {[
                        { num: 1, q: "The biggest lack in my life is" },
                        { num: 2, q: "The greatest joy in my life is" },
                        { num: 3, q: "My largest time commitment is" },
                        { num: 4, q: "As I play more, I work" },
                        { num: 5, q: "I feel guilty that I am" },
                        { num: 6, q: "I worry that" },
                        { num: 7, q: "If my dreams come true, my family will" },
                        { num: 8, q: "I sabotage myself so people will" },
                        { num: 9, q: "If I let myself feel it, I'm angry that I" },
                        { num: 10, q: "One reason I get sad sometimes is" },
                      ].map(({ num, q }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <div className="flex-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`virtutrap${num}`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`virtutrap${num}`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ 
                                width: '100%',
                                maxWidth: '250px',
                                color: '#030f42',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: '#030f42', opacity: 0.3 }}>
                      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', fontStyle: 'italic', marginBottom: '8px' }}>
                        "You will do foolish things, but do them with enthusiasm." — COLETTE
                      </p>
                      <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.8 }}>
                        Does your life serve you or only others? Are you self-destructive?
                      </p>
                    </div>
                  </div>
                )}

                {/* Week 5 - Forbidden Joys popup (Cloud 2) */}
                {landscapePopup === 'forbidden' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '520px',
                    borderColor: '#030f42', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        FORBIDDEN JOYS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '16px', opacity: 0.7 }}>
                      List ten things you love and would love to do but are not allowed to do.
                    </p>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="flex items-center gap-2">
                          <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <input
                            type="text"
                            value={landscapeResponses[`forbidden${num}`] || ''}
                            onChange={(e) => {
                              const newResponses = { ...landscapeResponses, [`forbidden${num}`]: e.target.value };
                              setLandscapeResponses(newResponses);
                              storageSet('windingPath:landscapeResponses', newResponses);
                            }}
                            className="flex-1 px-2 py-1 border-b bg-transparent focus:outline-none"
                            style={{ 
                              fontFamily: 'Helvetica, Arial, sans-serif',
                              borderColor: '#030f42',
                              color: '#030f42',
                              fontSize: '12px',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 5 - Wishes popup (Cloud 3) */}
                {landscapePopup === 'wishes' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '560px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        WISHES
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
                        <div key={num} className="flex items-center gap-2">
                          <span style={{ opacity: 0.5, minWidth: '28px' }}>{num}.</span>
                          <span>I wish</span>
                          <input
                            type="text"
                            value={landscapeResponses[`wish${num}`] || ''}
                            onChange={(e) => {
                              const newResponses = { ...landscapeResponses, [`wish${num}`]: e.target.value };
                              setLandscapeResponses(newResponses);
                              storageSet('windingPath:landscapeResponses', newResponses);
                            }}
                            className="flex-1 border-b bg-transparent focus:outline-none"
                            style={{ 
                              borderColor: '#030f42',
                              color: '#030f42',
                            }}
                          />
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-2">
                        <span style={{ opacity: 0.5, minWidth: '28px' }}>19.</span>
                        <span style={{ fontWeight: 'bold' }}>I most especially wish</span>
                        <input
                          type="text"
                          value={landscapeResponses.wish19 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, wish19: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="flex-1 border-b bg-transparent focus:outline-none"
                          style={{ 
                            borderColor: '#030f42',
                            color: '#030f42',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 6 - Money beliefs popup (House) */}
                {landscapePopup === 'money' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '580px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        MONEY BELIEFS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '16px', opacity: 0.7 }}>
                      Complete the following phrases.
                    </p>
                    <div className="space-y-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.5' }}>
                      {[
                        { num: 1, q: "People with money are" },
                        { num: 2, q: "Money makes people" },
                        { num: 3, q: "I'd have more money if" },
                        { num: 4, q: "My dad thought money was" },
                        { num: 5, q: "My mom always thought money would" },
                        { num: 6, q: "In my family, money caused" },
                        { num: 7, q: "Money equals" },
                        { num: 8, q: "If I had money, I'd" },
                        { num: 9, q: "If I could afford it, I'd" },
                        { num: 10, q: "If I had some money, I'd" },
                        { num: 11, q: "I'm afraid that if I had money I would" },
                        { num: 12, q: "Money is" },
                        { num: 13, q: "Money causes" },
                        { num: 14, q: "Having money is not" },
                        { num: 15, q: "In order to have more money, I'd need to" },
                        { num: 16, q: "When I have money, I usually" },
                        { num: 17, q: "I think money" },
                        { num: 18, q: "If I weren't so cheap I'd" },
                        { num: 19, q: "People think money" },
                        { num: 20, q: "Being broke tells me" },
                      ].map(({ num, q }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '28px' }}>{num}.</span>
                          <div className="flex-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`money${num}`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`money${num}`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ 
                                width: '100%',
                                maxWidth: '220px',
                                color: '#030f42',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 7 - Perfectionism popup (Wind 1) */}
                {landscapePopup === 'perfectionism' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '75vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        PERFECTIONISM
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.7' }}>
                      <p className="mb-2"><strong>QUESTION:</strong> What would I do if I didn't have to do it perfectly?</p>
                      <p><strong>ANSWER:</strong> A great deal more than I am.</p>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '12px' }}>
                      "If I didn't have to do it perfectly, I would try ..."
                    </p>
                    <textarea
                      value={landscapeResponses.perfectionism || ''}
                      onChange={(e) => {
                        const newResponses = { ...landscapeResponses, perfectionism: e.target.value };
                        setLandscapeResponses(newResponses);
                        storageSet('windingPath:landscapeResponses', newResponses);
                      }}
                      placeholder="Write freely..."
                      className="w-full px-3 py-3 border text-sm focus:outline-none"
                      rows={6}
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                )}

                {/* Week 7 - Jealousy Map popup (Wind 2) */}
                {landscapePopup === 'jealousy' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxWidth: '700px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        THE JEALOUSY MAP
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', fontWeight: 'bold' }}>
                      <div>Who</div>
                      <div>Why</div>
                      <div>Action Antidote</div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <div key={num} className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={landscapeResponses[`jealousy_who${num}`] || ''}
                            onChange={(e) => {
                              const newResponses = { ...landscapeResponses, [`jealousy_who${num}`]: e.target.value };
                              setLandscapeResponses(newResponses);
                              storageSet('windingPath:landscapeResponses', newResponses);
                            }}
                            placeholder={num === 1 ? "My sister" : ""}
                            className="px-2 py-1 border text-xs focus:outline-none"
                            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42' }}
                          />
                          <input
                            type="text"
                            value={landscapeResponses[`jealousy_why${num}`] || ''}
                            onChange={(e) => {
                              const newResponses = { ...landscapeResponses, [`jealousy_why${num}`]: e.target.value };
                              setLandscapeResponses(newResponses);
                              storageSet('windingPath:landscapeResponses', newResponses);
                            }}
                            placeholder={num === 1 ? "More specific knowledge than I" : ""}
                            className="px-2 py-1 border text-xs focus:outline-none"
                            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42' }}
                          />
                          <input
                            type="text"
                            value={landscapeResponses[`jealousy_action${num}`] || ''}
                            onChange={(e) => {
                              const newResponses = { ...landscapeResponses, [`jealousy_action${num}`]: e.target.value };
                              setLandscapeResponses(newResponses);
                              storageSet('windingPath:landscapeResponses', newResponses);
                            }}
                            placeholder={num === 1 ? "Get back into reading" : ""}
                            className="px-2 py-1 border text-xs focus:outline-none"
                            style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 7 - Childhood losses popup (Wind 3) */}
                {landscapePopup === 'childhood' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '560px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        CHILDHOOD
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.5' }}>
                      {[
                        { num: 1, q: "As a kid, I missed the chance to" },
                        { num: 2, q: "As a kid, I lacked" },
                        { num: 3, q: "As a kid, I could have used" },
                        { num: 4, q: "As a kid, I dreamed of being" },
                        { num: 5, q: "As a kid, I wanted a" },
                        { num: 6, q: "In my house, we never had enough" },
                        { num: 7, q: "As a kid, I needed more" },
                        { num: 8, q: "I am sorry that I will never again see" },
                        { num: 9, q: "For years, I have missed and wondered about" },
                        { num: 10, q: "I beat myself up about the loss of" },
                      ].map(({ num, q }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <div className="flex-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`childhood${num}`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`childhood${num}`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ 
                                width: '100%',
                                maxWidth: '220px',
                                color: '#030f42',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 7 - Gains popup (Wind 4) */}
                {landscapePopup === 'gains' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '560px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        GAINS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.5' }}>
                      {[
                        { num: 1, q: "I have a loyal friend in" },
                        { num: 2, q: "One thing I like about my town is" },
                        { num: 3, q: "I think I have nice" },
                        { num: 4, q: "Writing my pages has shown me I can" },
                        { num: 5, q: "I am taking a greater interest in" },
                        { num: 6, q: "I believe I am getting better at" },
                        { num: 7, q: "My artist has started to pay more attention to" },
                        { num: 8, q: "My self-care is" },
                        { num: 9, q: "I feel more" },
                        { num: 10, q: "Possibly, my creativity is" },
                      ].map(({ num, q }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <div className="flex-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`gains${num}`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`gains${num}`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ 
                                width: '100%',
                                maxWidth: '220px',
                                color: '#030f42',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 8 - Art intro popup (Deer 1) */}
                {landscapePopup === 'artintro' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '520px',
                    borderColor: '#030f42', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        RECOVERING A SENSE OF STRENGTH
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.8' }}>
                      <p className="mb-4">
                        Art is the act of structuring time. "Look at it this way," a piece of art says. "Here's how I see it."
                      </p>
                      <p className="mb-4">
                        Every end is a beginning. We know that. But we tend to forget it as we move through grief. Struck by a loss, we focus, understandably, on what we leave behind, the lost dream of the work's successful fruition and its buoyant reception.
                      </p>
                      <p className="mb-4">
                        We need to focus on what lies ahead. This can be tricky. We may not know what lies ahead. And, if the present hurts this badly, we tend to view the future as impending pain.
                      </p>
                      <p className="mb-4">
                        "In order to catch the ball, you have to want to catch the ball," the film director John Cassavetes once told a young director.
                      </p>
                      <div className="mt-6 p-4 border-l-2" style={{ borderColor: '#030f42', fontStyle: 'italic' }}>
                        <p className="mb-2"><strong>QUESTION:</strong> Do you know how old I'll be by the time I learn to play the piano?</p>
                        <p><strong>ANSWER:</strong> The same age you will be if you don't.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 8 - Parents/Teachers popup (Deer 2) */}
                {landscapePopup === 'parents' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '92%',
                    maxWidth: '600px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        PARENTS, TEACHERS & MENTORS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', lineHeight: '1.6' }}>
                      {[
                        { num: 1, q: "As a kid, my dad thought my art was", q2: "That made me feel" },
                        { num: 2, q: "I remember one time when he", q2: null },
                        { num: 3, q: "I felt very", q2: "and", q3: "about that. I never forgot it." },
                        { num: 4, q: "As a kid, my mother taught me that my daydreaming was", q2: null },
                        { num: 5, q: "I remember she'd tell me to snap out of it by reminding me", q2: null },
                        { num: 6, q: "The person I remember who believed in me was", q2: null },
                        { num: 7, q: "I remember one time when", q2: null },
                        { num: 8, q: "I felt", q2: "and", q3: "about that. I never forgot it." },
                        { num: 9, q: "The thing that ruined my chance to be an artist was", q2: null },
                        { num: 10, q: "The negative lesson I got from that, which wasn't logical but I still believe, is that I can't", q2: "and be an artist." },
                        { num: 11, q: "When I was little, I learned that", q2: "and", q3: "were big sins that I particularly had to watch out for." },
                        { num: 12, q: "I grew up thinking artists were", q2: "people." },
                        { num: 13, q: "The teacher who shipwrecked my confidence was", q2: null },
                        { num: 14, q: "I was told", q2: null },
                        { num: 15, q: "I believed this teacher because", q2: null },
                        { num: 16, q: "The mentor who gave me a good role model was", q2: null },
                        { num: 17, q: "When people say I have talent I think they want to", q2: null },
                        { num: 18, q: "The thing is, I am suspicious that", q2: null },
                        { num: 19, q: "I just can't believe that", q2: null },
                        { num: 20, q: "If I believe I am really talented, then I am mad as hell at", q2: "and", q3: "and", q4: "and", q5: "and" },
                      ].map(({ num, q, q2, q3, q4, q5 }) => (
                        <div key={num} className="flex items-start gap-2">
                          <span style={{ opacity: 0.5, minWidth: '24px' }}>{num}.</span>
                          <div className="flex-1 flex flex-wrap items-center gap-1">
                            <span>{q} </span>
                            <input
                              type="text"
                              value={landscapeResponses[`parents${num}a`] || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, [`parents${num}a`]: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="border-b border-current bg-transparent focus:outline-none"
                              style={{ width: '120px', color: '#030f42' }}
                            />
                            {q2 && <span> {q2} </span>}
                            {q2 && (
                              <input
                                type="text"
                                value={landscapeResponses[`parents${num}b`] || ''}
                                onChange={(e) => {
                                  const newResponses = { ...landscapeResponses, [`parents${num}b`]: e.target.value };
                                  setLandscapeResponses(newResponses);
                                  storageSet('windingPath:landscapeResponses', newResponses);
                                }}
                                className="border-b border-current bg-transparent focus:outline-none"
                                style={{ width: '100px', color: '#030f42' }}
                              />
                            )}
                            {q3 && <span> {q3} </span>}
                            {q3 && q4 && (
                              <input
                                type="text"
                                value={landscapeResponses[`parents${num}c`] || ''}
                                onChange={(e) => {
                                  const newResponses = { ...landscapeResponses, [`parents${num}c`]: e.target.value };
                                  setLandscapeResponses(newResponses);
                                  storageSet('windingPath:landscapeResponses', newResponses);
                                }}
                                className="border-b border-current bg-transparent focus:outline-none"
                                style={{ width: '80px', color: '#030f42' }}
                              />
                            )}
                            {q4 && <span> {q4} </span>}
                            {q4 && q5 && (
                              <input
                                type="text"
                                value={landscapeResponses[`parents${num}d`] || ''}
                                onChange={(e) => {
                                  const newResponses = { ...landscapeResponses, [`parents${num}d`]: e.target.value };
                                  setLandscapeResponses(newResponses);
                                  storageSet('windingPath:landscapeResponses', newResponses);
                                }}
                                className="border-b border-current bg-transparent focus:outline-none"
                                style={{ width: '80px', color: '#030f42' }}
                              />
                            )}
                            {q5 && <span> {q5} </span>}
                            {q5 && (
                              <input
                                type="text"
                                value={landscapeResponses[`parents${num}e`] || ''}
                                onChange={(e) => {
                                  const newResponses = { ...landscapeResponses, [`parents${num}e`]: e.target.value };
                                  setLandscapeResponses(newResponses);
                                  storageSet('windingPath:landscapeResponses', newResponses);
                                }}
                                className="border-b border-current bg-transparent focus:outline-none"
                                style={{ width: '80px', color: '#030f42' }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Week 8 - Affirmations popup (Deer 3) */}
                {landscapePopup === 'affirmations' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '85%',
                    maxWidth: '500px',
                    borderColor: '#030f42', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        AFFIRMATIONS
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', marginBottom: '16px', opacity: 0.7 }}>
                      Pick five and think of them this week.
                    </p>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', fontStyle: 'italic', lineHeight: '2' }}>
                      <p>I am a talented person.</p>
                      <p>I have a right to be an artist.</p>
                      <p>I am a good person and a good artist.</p>
                      <p>Creativity is a blessing I accept.</p>
                      <p>My creativity blesses others.</p>
                      <p>My creativity is appreciated.</p>
                      <p>I now treat myself and my creativity more gently.</p>
                      <p>I now treat myself and my creativity more generously.</p>
                      <p>I now share my creativity more openly.</p>
                      <p>I now accept hope.</p>
                      <p>I now act affirmatively.</p>
                      <p>I now accept creative recovery.</p>
                      <p>I now allow myself to heal.</p>
                      <p>I now accept God's help unfolding my life.</p>
                      <p>I now believe God loves artists.</p>
                    </div>
                  </div>
                )}

                {/* Week 9 - Block-buster popup (Sun) */}
                {landscapePopup === 'blockbuster' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '580px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        BLOCK-BUSTER
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div className="space-y-5" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.7' }}>
                      <div>
                        <p className="font-bold mb-2">1. List any resentments (anger) you have in connection with this project.</p>
                        <p className="mb-2 opacity-70" style={{ fontSize: '11px' }}>It does not matter how petty, picky, or irrational these resentments may appear to your adult self. To your artist child they are real big deals: grudges.</p>
                        <p className="mb-2 opacity-60 italic" style={{ fontSize: '11px' }}>Examples: I resent being the second artist asked, not the first... I resent this editor, she just nitpicks... I resent doing work for this idiot; he never pays me on time.</p>
                        <textarea
                          value={landscapeResponses.blockbuster1 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, blockbuster1: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="w-full px-2 py-2 border text-xs focus:outline-none"
                          rows={3}
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2">2. Ask your artist to list any and all fears about the projected piece of work.</p>
                        <p className="mb-2 opacity-70" style={{ fontSize: '11px' }}>These fears can be as dumb as any two-year-old's. It does not matter that they are groundless to your adult's eye. What matters is that they are big scary monsters to your artist.</p>
                        <p className="mb-2 opacity-60 italic" style={{ fontSize: '11px' }}>Examples: I'm afraid the work will be rotten and I won't know it... I'm afraid the work will be good and they won't know it... I'm afraid all my ideas are hackneyed... I'm afraid I'll starve... I'm afraid I'll never finish... I'm afraid I will be embarrassed...</p>
                        <textarea
                          value={landscapeResponses.blockbuster2 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, blockbuster2: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="w-full px-2 py-2 border text-xs focus:outline-none"
                          rows={3}
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2">3. Ask yourself if that is all.</p>
                        <p className="mb-2 opacity-70" style={{ fontSize: '11px' }}>Have you left out any itsy fear? Have you suppressed any "stupid" anger? Get it on the page.</p>
                        <textarea
                          value={landscapeResponses.blockbuster3 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, blockbuster3: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="w-full px-2 py-2 border text-xs focus:outline-none"
                          rows={2}
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2">4. Ask yourself what you stand to gain by not doing this piece of work.</p>
                        <p className="mb-2 opacity-60 italic" style={{ fontSize: '11px' }}>Examples: If I don't write the piece, no one can hate it... If I don't write the piece, my jerk editor will worry... If I don't paint, sculpt, act, sing, dance, I can criticize others, knowing I could do better.</p>
                        <textarea
                          value={landscapeResponses.blockbuster4 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, blockbuster4: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="w-full px-2 py-2 border text-xs focus:outline-none"
                          rows={2}
                          style={{ fontFamily: 'Helvetica, Arial, sans-serif', borderColor: '#030f42', color: '#030f42', resize: 'vertical' }}
                        />
                      </div>
                      <div>
                        <p className="font-bold mb-2">5. Make your deal.</p>
                        <p className="mb-3 opacity-70" style={{ fontSize: '11px' }}>The deal is: "Okay, Creative Force, you take care of the quality, I'll take care of the quantity."</p>
                        <div className="p-3 border" style={{ borderColor: '#030f42' }}>
                          <p className="italic mb-3">"Okay, Creative Force, you take care of the quality, I'll take care of the quantity."</p>
                          <div className="flex items-center gap-2">
                            <span>Signed:</span>
                            <input
                              type="text"
                              value={landscapeResponses.blockbusterSign || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, blockbusterSign: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="flex-1 border-b border-current bg-transparent focus:outline-none"
                              style={{ color: '#030f42' }}
                            />
                          </div>
                        </div>
                        <p className="mt-3 text-xs italic opacity-60">A word of warning: this is a very powerful exercise; it can do fatal damage to a creative block.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 10 - Blocking popup (Moon 1) */}
                {landscapePopup === 'blocking' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '88%',
                    maxWidth: '540px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        ON BLOCKING
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.8' }}>
                      <p className="mb-4">
                        It takes grace and courage to admit and surrender our blocking devices. Who wants to? Not while they are still working! Of course, long after they have stopped working, we hope against hope that this time they will work again.
                      </p>
                      <p className="mb-4">
                        Blocking is essentially an issue of faith. Rather than trust our intuition, our talent, our skill, our desire, we fear where our creator is taking us with this creativity. Rather than paint, write, dance, audition, and see where it takes us, we pick up a block.
                      </p>
                      <p className="mb-4">
                        Blocked, we know who and what we are: unhappy people. Unblocked, we may be something much more threatening—happy. For most of us, happy is terrifying, unfamiliar, out of control, too risky! Is it any wonder we take temporary U-turns?
                      </p>
                      <p className="mb-4">
                        As we become aware of our blocking devices—food, busyness, alcohol, sex, other drugs—we can feel our U-turns as we make them. The blocks will no longer work effectively. Over time, we will try—perhaps slowly at first and erratically—to ride out the anxiety and see where we emerge.
                      </p>
                      <p className="mb-4">
                        Anxiety is fuel. We can use it to write with, paint with, work with.
                      </p>
                      <div className="mt-6 p-4 bg-gray-50" style={{ fontStyle: 'italic', lineHeight: '2' }}>
                        <p>Feel: anxious!</p>
                        <p>Try: using the anxiety!</p>
                        <p>Feel: I just did it! I didn't block!</p>
                        <p>I used the anxiety and moved ahead!</p>
                        <p>Oh my God, I am excited!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week 11 - Artist statement popup (Walker 1) */}
                {landscapePopup === 'artiststatement' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '88%',
                    maxWidth: '540px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        I AM AN ARTIST
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.8' }}>
                      <p className="mb-4">
                        I AM AN ARTIST. As an artist, I may need a different mix of stability and flow from other people. I may find that a nine-to-five job steadies me and leaves me freer to create. Or I may find that a nine-to-five drains me of energy and leaves me unable to create. I must experiment with what works for me.
                      </p>
                      <p className="mb-4">
                        An artist's cash flow is typically erratic. No law says we must be broke all the time, but the odds are good we may be broke some of the time. Good work will sometimes not sell. People will buy but not pay promptly. The market may be rotten even when the work is great. I cannot control these factors.
                      </p>
                      <p className="mb-4">
                        Being true to the inner artist often results in work that sells—but not always. I have to free myself from determining my value and the value of my work by my work's market value.
                      </p>
                      <p className="mb-4">
                        The idea that money validates my credibility is very hard to shake. If money determines real art, then Gauguin was a charlatan.
                      </p>
                      <p className="mb-4">
                        As an artist, I may never have a home that looks like Town and Country—or I may. On the other hand, I may have a book of poems, a song, a piece of performance art, a film.
                      </p>
                      <p className="font-medium">
                        I must learn that as an artist my credibility lies with me, God, and my work. In other words, if I have a poem to write, I need to write that poem—whether it will sell or not.
                      </p>
                    </div>
                  </div>
                )}

                {/* Week 11 - Spiritual corner popup (Walker 2) */}
                {landscapePopup === 'spiritual' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '88%',
                    maxWidth: '540px',
                    borderColor: '#030f42', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        THE SPIRITUAL CORNER
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '1.8' }}>
                      <p className="mb-4">
                        The path is a meditation, a practice that brings you to your creativity and your creator God. In order to stay easily and happily creative, we need to stay spiritually centered. This is easier to do if we allow ourselves centering rituals. It is important that we devise these ourselves from the elements that feel holy and happy to us.
                      </p>
                      <p className="mb-4">
                        Many blocked creatives grew up in punitively religious homes. For us to stay happily and easily creative, we need to heal from this, becoming spiritually centered through creative rituals of our own.
                      </p>
                      <p className="mb-4">
                        A spiritual room or even a spiritual corner is an excellent way to do this. This haven can be a corner of a room, a nook under the stairs, even a window ledge. It is a reminder and an acknowledgment of the fact that our creator unfolds our creativity.
                      </p>
                      <p className="mb-4">
                        Fill it with things that make you happy. Remember that your artist is fed by images. We need to unlearn our old notion that spirituality and sensuality don't mix. An artist's altar should be a sensory experience. We are meant to celebrate the good things of this earth. Pretty leaves, rocks, candles, sea treasures—all these remind us of our creator.
                      </p>
                      <p className="mb-4">
                        Small rituals, self-devised, are good for the soul. Burning incense while reading affirmations or writing them, lighting a candle, dancing to drum music, holding a smooth rock and listening to Gregorian chant—all of these tactile, physical techniques reinforce spiritual growth.
                      </p>
                      <p className="font-medium">
                        Remember, the artist child speaks the language of the soul: music, dance, scent, shells... Your artist's altar to the creator should be fun to look at, even silly. Remember how much little kids like gaudy stuff. Your artist is a little kid, so.
                      </p>
                    </div>
                  </div>
                )}

                {/* Week 12 - Creativity Contract popup (Road) */}
                {landscapePopup === 'contract' && (
                  <div className="absolute bg-white border p-6 shadow-lg" style={{ 
                    top: '50%', left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '92%',
                    maxWidth: '580px',
                    borderColor: '#030f42', 
                    maxHeight: '88vh', 
                    overflowY: 'auto',
                    zIndex: 20 
                  }}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>
                        CREATIVITY CONTRACT
                      </h3>
                      <button onClick={() => setLandscapePopup(null)} style={{ color: '#030f42', fontSize: '18px', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '12px', lineHeight: '2' }}>
                      <p className="mb-4">
                        My name is{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractName || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractName: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '150px', color: '#030f42' }}
                        />.
                      </p>
                      
                      <p className="mb-4">
                        I am a recovering creative person. To further my growth and my joy, I now commit myself to the following self-nurturing plans:
                      </p>
                      
                      <p className="mb-4">
                        The pages have been an important part of my self-nurturing and self-discovery. I,{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractName2 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractName2: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '120px', color: '#030f42' }}
                        />, hereby commit myself to continuing to work with them for the next ninety days.
                      </p>
                      
                      <p className="mb-4">
                        Pit stops have been integral to my growth in self-love and my deepening joy in living. I,{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractName3 || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractName3: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '120px', color: '#030f42' }}
                        />, am willing to commit to another ninety days of weekly artist's dates for self-care.
                      </p>
                      
                      <p className="mb-4">
                        In the course of following the artist's way and healing my artist within, I have discovered that I have a number of creative interests. While I hope to develop many of them, my specific commitment for the next ninety days is to allow myself to more fully explore{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractExplore || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractExplore: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '200px', color: '#030f42' }}
                        />.
                      </p>
                      
                      <p className="mb-4">
                        My concrete commitment to a plan of action is a critical part of nurturing my artist. For the next ninety days, my planned, self-nurturing creative action plan is{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractPlan || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractPlan: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '200px', color: '#030f42' }}
                        />.
                      </p>
                      
                      <p className="mb-4">
                        I have chosen{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractColleague || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractColleague: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '120px', color: '#030f42' }}
                        />{' '}as my creative colleague and{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractBackup || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractBackup: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '120px', color: '#030f42' }}
                        />{' '}as my creative backup. I am committed to a weekly phone check-in.
                      </p>
                      
                      <p className="mb-6">
                        I have made the above commitments and will begin my new commitment on{' '}
                        <input
                          type="text"
                          value={landscapeResponses.contractDate || ''}
                          onChange={(e) => {
                            const newResponses = { ...landscapeResponses, contractDate: e.target.value };
                            setLandscapeResponses(newResponses);
                            storageSet('windingPath:landscapeResponses', newResponses);
                          }}
                          className="border-b border-current bg-transparent focus:outline-none"
                          style={{ width: '140px', color: '#030f42' }}
                        />.
                      </p>
                      
                      {/* Signature line */}
                      <div className="mt-8 pt-4 border-t" style={{ borderColor: '#030f42' }}>
                        <div className="flex items-end gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={landscapeResponses.contractSignature || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, contractSignature: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="w-full border-b border-current bg-transparent focus:outline-none text-center"
                              style={{ color: '#030f42', fontStyle: 'italic' }}
                            />
                            <p className="text-center mt-1 text-xs opacity-60">Signature</p>
                          </div>
                          <div style={{ width: '120px' }}>
                            <input
                              type="text"
                              value={landscapeResponses.contractSignDate || ''}
                              onChange={(e) => {
                                const newResponses = { ...landscapeResponses, contractSignDate: e.target.value };
                                setLandscapeResponses(newResponses);
                                storageSet('windingPath:landscapeResponses', newResponses);
                              }}
                              className="w-full border-b border-current bg-transparent focus:outline-none text-center"
                              style={{ color: '#030f42' }}
                            />
                            <p className="text-center mt-1 text-xs opacity-60">Date</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Week indicator - subtle bottom right */}
                <div className="absolute bottom-4 right-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '11px', opacity: 0.4 }}>
                  Week {currentWeek} of 12 • {currentWeek === 1 ? '1 layer' : `${currentWeek} layers`} unlocked
                </div>
              </div>
            </div>
          )}

          {/* User Profile Page */}
          {currentPage === 'profile' && (
            <div>
              <h2 
                className="text-3xl mb-6"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontWeight: 'normal' }}
              >
                user profile
              </h2>
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="border p-6" style={{ borderColor: '#030f42' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '15px' }}>
                      Email Reminders
                    </h3>
                    <button
                      onClick={() => handleEmailRemindersToggle(!emailRemindersEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                        emailRemindersEnabled ? '' : ''
                      }`}
                      style={{ 
                        backgroundColor: emailRemindersEnabled ? '#030f42' : '#d1d5db',
                      }}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          emailRemindersEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {emailRemindersEnabled && (
                    <div className="space-y-3 border-t pt-4" style={{ borderColor: '#030f42' }}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dailyReminders}
                          onChange={(e) => handleDailyRemindersToggle(e.target.checked)}
                          className="w-4 h-4"
                          style={{ accentColor: '#030f42' }}
                        />
                        <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px' }}>
                          Daily reminder emails
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={weeklyGreetings}
                          onChange={(e) => handleWeeklyGreetingsToggle(e.target.checked)}
                          className="w-4 h-4"
                          style={{ accentColor: '#030f42' }}
                        />
                        <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px' }}>
                          Weekly greeting emails
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkInReminders}
                          onChange={(e) => handleCheckInRemindersToggle(e.target.checked)}
                          className="w-4 h-4"
                          style={{ accentColor: '#030f42' }}
                        />
                        <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '14px' }}>
                          Check-in email on {checkInDay}s
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Check-in Day Settings */}
                <div className="border p-6" style={{ borderColor: '#030f42' }}>
                  <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '15px', marginBottom: '16px' }}>
                    Check-in Day
                  </h3>
                  <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', marginBottom: '12px', opacity: 0.7 }}>
                    Current check-in day: <span style={{ fontWeight: 'bold' }}>{checkInDay}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => handleCheckInDayChange(day)}
                        className={`px-3 py-2 border text-xs transition-all ${
                          checkInDay === day ? '' : 'opacity-50 hover:opacity-100'
                        }`}
                        style={{
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          borderColor: '#030f42',
                          color: '#030f42',
                          backgroundColor: checkInDay === day ? '#f8f9fa' : 'transparent'
                        }}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Program Restart Options */}
                <div className="border p-6" style={{ borderColor: '#030f42' }}>
                  <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '15px', marginBottom: '16px' }}>
                    Program Controls
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleRestartWeek}
                      className="w-full px-4 py-3 border text-left hover:opacity-70 transition-all"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>Restart Current Week</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Reset to day 1, keep past files archived</div>
                    </button>
                    <button
                      onClick={handleRestartProgram}
                      className="w-full px-4 py-3 border text-left hover:opacity-70 transition-all"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>Restart Program</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Start fresh at week 1, keep all past files archived</div>
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full px-4 py-3 border text-left hover:opacity-70 transition-all"
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        borderColor: '#030f42',
                        color: '#030f42'
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>Self-Destruct</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Permanently delete all data</div>
                    </button>

                    {/* Developer / Testing Controls */}
                    <div className="mt-4 p-4 border rounded" style={{ borderColor: '#e5e7eb' }}>
                      <h4 style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Developer / Testing</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={devStartDate}
                            onChange={(e) => setDevStartDate(e.target.value)}
                            className="px-3 py-2 border"
                            style={{ borderColor: '#030f42' }}
                          />
                          <button
                            onClick={() => handleSetStartDate(devStartDate)}
                            className="px-3 py-2 border hover:opacity-80"
                            style={{ borderColor: '#030f42', color: '#030f42' }}
                          >
                            Set Start Date
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="12"
                            placeholder="Week #"
                            value={devJumpWeek}
                            onChange={(e) => setDevJumpWeek(e.target.value)}
                            className="px-3 py-2 border w-28"
                            style={{ borderColor: '#030f42' }}
                          />
                          <button
                            onClick={() => handleJumpToWeek(devJumpWeek)}
                            className="px-3 py-2 border hover:opacity-80"
                            style={{ borderColor: '#030f42', color: '#030f42' }}
                          >
                            Jump to Week
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const todayStr = new Date().toISOString().split('T')[0];
                              await storageSet('windingPath:startDate', todayStr);
                              setDevStartDate(todayStr);
                              setCurrentWeek(computeWeekFromStart(todayStr));
                              alert('Start date set to today');
                            }}
                            className="px-3 py-2 border hover:opacity-80"
                            style={{ borderColor: '#030f42', color: '#030f42' }}
                          >
                            Set Start = Today
                          </button>
                          <button
                            onClick={async () => {
                              await storageSet('windingPath:startDate', null);
                              alert('Start date cleared');
                            }}
                            className="px-3 py-2 border hover:opacity-80"
                            style={{ borderColor: '#030f42', color: '#030f42' }}
                          >
                            Clear Start Date
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Confirmation Modal - Overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border max-w-md w-full p-8" style={{ borderColor: '#030f42' }}>
              <div className="flex gap-3 mb-4">
                <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#030f42' }} />
                <h2 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42' }}
                >
                  Permanently Delete Everything?
                </h2>
              </div>
              
              <p className="mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#030f42', opacity: 0.8 }}>
                This will permanently delete all your data and return you to the beginning of the program. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-3 border hover:opacity-70 transition-all"
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    borderColor: '#030f42',
                    color: '#030f42'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFullReset}
                  className="flex-1 px-4 py-3 text-white hover:opacity-80 transition-all"
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    backgroundColor: '#030f42'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default WindingPathApp;
