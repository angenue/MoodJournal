import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { journalInput } from "../utils/journal_api";
import popupStyles from "../styles/JournalPopup.module.css";
import styles from "../styles/JournalEntry.module.css";
import { Journal } from "../models/journal";
import { mapEmojiToString, mapStringToEmoji } from "../utils/mapEmojiAndString";
import { errorMessage, successMessage } from "../utils/toastMessage";
import * as JournalsApi from "../utils/journal_api";
import CustomModal from "../utils/deleteConfirmation";

export interface JournalEntryPopupProps {
  journalToEdit?: Journal;
  onSave: (journal: Journal) => void;
  onDelete: (journal: Journal) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const JournalEntryPopup: React.FC<JournalEntryPopupProps> = ({
  journalToEdit,
  onSave,
  onCancel,
  onDelete,
  selectedDate,
}) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [journalEntry, setJournalEntry] = useState<string>(journalToEdit?.journalEntry || "");
  const [wordCount, setWordCount] = useState(0);
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

  useEffect(() => {
    setWordCount(journalEntry.split(/\s+/).filter(Boolean).length); // This will count words separated by one or more whitespace characters
  }, [journalEntry]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    setJournalEntry(inputText);
    const words = inputText.trim().split(/\s+/);
    setWordCount(words.length);

    if (words.length > 500) {
      const truncatedText = words.slice(0, 500).join(' ');
      setValue("journalEntry", truncatedText);
      setWordCount(500);
    }
  };

  const deleteJournal = async () => {
    try {
      if (journalToEdit) {
        await JournalsApi.deleteJournal(journalToEdit._id);
        onDelete(journalToEdit);
      } else {
        errorMessage("Unable to delete diary: Journal does not exist");
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
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
     

      <div className={popupStyles["journal-entry-popup"]}>

      <CustomModal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          onConfirm={deleteJournal}
        />

        <div className={popupStyles["options"]}>
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

        {journalToEdit && (
          <button className={popupStyles["delete-button"]} onClick={handleDelete} >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 24 24"
            >
              <path d="M 10 2 L 9 3 L 5 3 C 4.448 3 4 3.448 4 4 C 4 4.552 4.448 5 5 5 L 7 5 L 17 5 L 19 5 C 19.552 5 20 4.552 20 4 C 20 3.448 19.552 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.105 5.895 22 7 22 L 17 22 C 18.105 22 19 21.105 19 20 L 19 7 L 5 7 z"></path>
            </svg>
          </button>
        )}
        </div>

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
          className={popupStyles["editor-container-popup"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            className={popupStyles["custom-editor-popup"]}
            placeholder="Write your journal entry..."
            value={journalEntry}
            {...register("journalEntry")}
            rows={10}
            onChange={(e) => handleTextareaChange(e)}
          />
          <input
            type="hidden"
            value={selectedMood || ""}
            {...register("mood")}
          />

          <div className={styles["editor-addons"]}>
          <div className={styles["word-limit"]}>Word Count: {wordCount}/500</div>

          <div className={styles["button-container"]}>
  <button
    className={`${styles["submit-button"]} ${(!selectedMood || wordCount >= 500) ? styles["disabled-button"] : ""}`}
    disabled={isSubmitting || !selectedMood || wordCount >= 500}
    type="submit"
    title={!selectedMood ? "Mood is required" : ""}
  >
    Save
  </button>

  <div className={styles["hint-text"]}>
    {!selectedMood && "Mood is required"}
  </div>
</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryPopup;
