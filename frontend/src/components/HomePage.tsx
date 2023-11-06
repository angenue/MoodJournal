import React, { useState } from "react"
import {journalInput} from "../utils/journal_api";
import * as JournalsApi from "../utils/journal_api";
//import "../styles/HomePage.css";
import styles from "../styles/JournalEntry.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { mapEmojiToString } from '../utils/mapEmojiAndString';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorMessage, successMessage } from "../utils/toastMessage";


interface FormData {
  mood: string | null;
  journalEntry?: string;
  selectedDate?: Date;
}

const HomePage = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const { register, handleSubmit, getValues, setValue, formState: {errors, isSubmitting }} = useForm<journalInput>();

  const handleSelectEmoji = (mood: string) => {
    setSelectedMood(mood);
  };

  const onSubmit: SubmitHandler<FormData> = async (input) => {
    try {
      input.mood = mapEmojiToString(selectedMood);
      const journalResponse = await JournalsApi.createJournal(input);
      console.log("Journal Response:", journalResponse);
      successMessage("💗 Diary Submitted");
    } catch (error) {
      errorMessage("Unable To Submit Diary")
      console.error(error);
      alert(error);
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    const words = inputText.trim().split(/\s+/);
    setWordCount(words.length);

    if (words.length > 500) {
      const truncatedText = words.slice(0, 500).join(' ');
      setValue("journalEntry", truncatedText);
      setWordCount(500);
    } else {
      setValue("journalEntry", inputText);
    }
    
  };
  

  return (
    <div className={styles["home-page"]}>
      <ToastContainer />

      <h1 className={styles["todays-date"]}>{new Date().toDateString()}</h1>
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

      
      <form className={styles["editor-container"]} onSubmit={handleSubmit(onSubmit)}>
  <textarea
    className={styles["custom-editor"]}
    placeholder="Write your journal entry..."
    rows={10}
    {...register("journalEntry")}
    onChange={(e) => handleTextareaChange(e)}
  />

  <input
    type="hidden"
    value={selectedMood || ''}
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
    Submit Diary
  </button>

  <div className={styles["hint-text"]}>
    {!selectedMood && "Mood is required"}
  </div>
</div>


        </div>
      </form>
    </div>
  );
};

export default HomePage;
