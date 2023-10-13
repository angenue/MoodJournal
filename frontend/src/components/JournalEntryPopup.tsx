import React, { useState } from 'react';
import {journalInput} from "../utils/handleSave";
import "../styles/JournalPopup.css";

interface JournalEntryPopupProps {
  onSave: (date: Date, mood: string, journalEntry: string) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const JournalEntryPopup: React.FC<JournalEntryPopupProps> = ({ onSave, onCancel, selectedDate }) => {
  const [mood, setMood] = useState<string>('');
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);

  const handleJournalInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setJournalEntry(inputText);
    const wordCount = inputText.split(/\s/).length;
    setWordLimitExceeded(wordCount > 500);
  };

  /*const handleSave = () => {
    handleSubmit({ mood, journalEntry, selectedDate });
  };*/

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="journal-entry-popup-overlay">
    <div className="journal-entry-popup">
    
          <button className="back-arrow" onClick={handleCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="selected-date">{selectedDate.toDateString()}</h1>
        

      <div className="emojis">
        <div className="emoji-reaction-prompt">
          What best describes your mood today?
        </div>
        <button
          className={`emoji-reaction ${mood === "😃" ? "active" : ""}`}
          onClick={() => setMood("😃")}
        >
          😃
        </button>
        <button
          className={`emoji-reaction ${mood === "😊" ? "active" : ""}`}
          onClick={() => setMood("😊")}
        >
          😊
        </button>
        <button
          className={`emoji-reaction ${mood === "😐" ? "active" : ""}`}
          onClick={() => setMood("😐")}
        >
          😐
        </button>
        <button
          className={`emoji-reaction ${mood === "😢" ? "active" : ""}`}
          onClick={() => setMood("😢")}
        >
          😢
        </button>
        <button
          className={`emoji-reaction ${mood === "😡" ? "active" : ""}`}
          onClick={() => setMood("😡")}
        >
          😡
        </button>
      </div>

      <form className="editor-container" /*onSubmit={handleSave}*/>
        <textarea
        className="custom-editor"
          value={journalEntry}
          onChange={handleJournalInputChange}
          placeholder="Write your journal entry..."
        />


        <div className="editor-addons">
          <div className="word-limit">
            {`${journalEntry.split(/\s/).length} words / 500 limit`}
          </div>

          <button
            className="submit-button"
            //onClick={handleSave}
            disabled={wordLimitExceeded}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>

      
      </div>
    </div>
  );
};

export default JournalEntryPopup;
