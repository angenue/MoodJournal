import React, { useState } from 'react';
import {journalInput} from "../utils/handleSave";
import popupStyles from "../styles/JournalPopup.module.css";
import styles from "../styles/JournalEntry.module.css";


interface JournalEntryPopupProps {
  onSave: (date: Date, mood: string, journalEntry: string) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const JournalEntryPopup: React.FC<JournalEntryPopupProps> = ({ onSave, onCancel, selectedDate }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);

  const handleJournalInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setJournalEntry(inputText);
    const wordCount = inputText.split(/\s/).length;
    setWordLimitExceeded(wordCount > 500);
  };

  const handleSelectEmoji = (mood: string) => {
    setSelectedMood(mood);
  };

  /*const handleSave = () => {
    handleSubmit({ mood, journalEntry, selectedDate });
  };*/

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className={popupStyles["journal-entry-popup-overlay"]}>
    <div className={popupStyles["journal-entry-popup"]}>
    
          <button className={popupStyles["back-arrow"]} onClick={handleCancel}>
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
          <h1 className={popupStyles["selected-date"]}>{selectedDate.toDateString()}</h1>
        

          <div className={styles.emojis}>
        <div className={styles["emoji-reaction-prompt"]}>
          What best describes your mood today?
        </div>
        <button
          className={`${styles["emoji-reaction"]} ${selectedMood === "😃" ? styles["active"] : ""}`}
          onClick={() => handleSelectEmoji("😃")}
        >
          😃
        </button>
        <button
          className={`${styles["emoji-reaction"]} ${selectedMood === "😊" ? styles["active"] : ""}`}
          onClick={() => handleSelectEmoji("😊")}
        >
          😊
        </button>
        <button
          className={`${styles["emoji-reaction"]} ${selectedMood === "😐" ? styles["active"] : ""}`}
          onClick={() => handleSelectEmoji("😐")}
        >
          😐
        </button>
        <button
          className={`${styles["emoji-reaction"]} ${selectedMood === "😢" ? styles["active"] : ""}`}
          onClick={() => handleSelectEmoji("😢")}
        >
          😢
        </button>
        <button
          className={`${styles["emoji-reaction"]} ${selectedMood === "😡" ? styles["active"] : ""}`}
          onClick={() => handleSelectEmoji("😡")}
        >
          😡
        </button>
      </div>

      <form className={styles["editor-container"]} /*onSubmit={handleSave}*/>
        <textarea
        className={styles["custom-editor"]}
          value={journalEntry}
          onChange={handleJournalInputChange}
          placeholder="Write your journal entry..."
        />


        <div className={styles["editor-addons"]}>
          <div className={styles["word-limit"]}>
            {`${journalEntry.split(/\s/).length} words / 500 limit`}
          </div>

          <button
            className={styles["submit-button"]}
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
