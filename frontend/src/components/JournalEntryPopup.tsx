import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import "../styles/JournalPopup.css";

interface JournalEntryPopupProps {
  onSave: (date: Date, mood: string, journalEntry: string) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const JournalEntryPopup: React.FC<JournalEntryPopupProps> = ({ onSave, onCancel, selectedDate }) => {
  const [mood, setMood] = useState<string>('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);

  const handleEditorChange = (newEditorState: EditorState) => {
    const wordCount = newEditorState.getCurrentContent().getPlainText().split(/\s/).length;
    setEditorState(newEditorState);
    setWordLimitExceeded(wordCount > 500);
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const journalEntry = contentState.getPlainText();
    onSave(selectedDate, mood, journalEntry);
  };

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

      <div className="custom-editor">
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Write your journal entry..."
          />
        </div>
        <div className="editor-addons">
      <div className="word-limit">
          {`${editorState.getCurrentContent().getPlainText().split(/\s/).length} words / 500 limit`}
        </div>
      <button className="submit-button" onClick={handleSave} disabled={wordLimitExceeded}>Save</button>
      </div>
      </div>
    </div>
  );
};

export default JournalEntryPopup;
