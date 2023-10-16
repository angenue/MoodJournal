import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { journalInput } from "../utils/journal_api";
import popupStyles from "../styles/JournalPopup.module.css";
import styles from "../styles/JournalEntry.module.css";
import { Journal } from "../models/journal";
import { mapEmojiToString } from "../utils/mapEmojiToString";
import { mapStringToEmoji } from "../utils/mapStringToEmoji";
import { errorMessage, successMessage } from "../utils/toastMessage";
import { ToastContainer } from "react-toastify";
import * as JournalsApi from "../utils/journal_api";
import { formatDate, formatDateToDefault } from "../utils/formatDate";

interface JournalEntryPopupProps {
  journalToEdit?: Journal;
  onSave: (journal: Journal) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const JournalEntryPopup: React.FC<JournalEntryPopupProps> = ({
  journalToEdit,
  onSave,
  onCancel,
  selectedDate,
}) => {
  const [journalEntry, setJournalEntry] = useState<string>(
    journalToEdit?.journalEntry || ""
  );
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>(
    mapStringToEmoji(journalToEdit?.mood || "") || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<journalInput>({
    defaultValues: {
      mood: journalToEdit?.mood || "",
      journalEntry: journalToEdit?.journalEntry || "",
      selectedDate: selectedDate || "", // Set the selected date here
    },
  });

  async function onSubmit(input: journalInput) {
    console.log("Form Data:", input);
    try {
      input.mood = mapEmojiToString(input.mood);
      let journalResponse: Journal;

      if (journalToEdit) {
        journalResponse = await JournalsApi.updateJournal(
          journalToEdit._id,
          input
        );
        successMessage("💗 Diary Updated");
      } else {
        journalResponse = await JournalsApi.createJournal(input);
        successMessage("💗 Diary Created");
      }

      onSave(journalResponse);
    } catch (error) {
      errorMessage("Unable To Save Diary");
      console.error(error);
    }
  }

  const handleJournalInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputText = event.target.value;
    setJournalEntry(inputText);
    const wordCount = inputText.split(/\s/).length;
    setWordLimitExceeded(wordCount > 500);
  };

  const handleSelectEmoji = (mood: string) => {
    setSelectedMood(mood);
    setValue("mood", mood);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className={popupStyles["journal-entry-popup-overlay"]}>
      <ToastContainer />

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

        <h1 className={popupStyles["selected-date"]}>
          {selectedDate.toDateString()}
        </h1>

        <div className={styles.emojis}>
          <div className={styles["emoji-reaction-prompt"]}>
            What best describes your mood today?
          </div>
          <button
            className={`${styles["emoji-reaction"]} ${
              selectedMood === "😃" ? styles["active"] : ""
            }`}
            onClick={() => handleSelectEmoji("😃")}
          >
            😃
          </button>
          <button
            className={`${styles["emoji-reaction"]} ${
              selectedMood === "😊" ? styles["active"] : ""
            }`}
            onClick={() => handleSelectEmoji("😊")}
          >
            😊
          </button>
          <button
            className={`${styles["emoji-reaction"]} ${
              selectedMood === "😐" ? styles["active"] : ""
            }`}
            onClick={() => handleSelectEmoji("😐")}
          >
            😐
          </button>
          <button
            className={`${styles["emoji-reaction"]} ${
              selectedMood === "😢" ? styles["active"] : ""
            }`}
            onClick={() => handleSelectEmoji("😢")}
          >
            😢
          </button>
          <button
            className={`${styles["emoji-reaction"]} ${
              selectedMood === "😡" ? styles["active"] : ""
            }`}
            onClick={() => handleSelectEmoji("😡")}
          >
            😡
          </button>
        </div>

        <form
          className={styles["editor-container"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            className={styles["custom-editor"]}
            placeholder="Write your journal entry..."
            {...register("journalEntry")}
          />
          <input
            type="hidden"
            value={selectedMood || ""}
            {...register("mood")}
          />

          <div className={styles["editor-addons"]}>
            <div className={styles["word-limit"]}>
              {`${journalEntry.split(/\s/).length} words / 500 limit`}
            </div>

            <button
              className={styles["submit-button"]}
              disabled={wordLimitExceeded || isSubmitting}
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
