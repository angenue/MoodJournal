import React, { useState } from "react"
import {journalInput} from "../utils/journal_api";
import * as JournalsApi from "../utils/journal_api";
//import "../styles/HomePage.css";
import styles from "../styles/JournalEntry.module.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { mapEmojiToString } from '../utils/mapEmojiToString';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface FormData {
  mood: string | null;
  journalEntry?: string;
  selectedDate?: Date;
}

const HomePage = () => {

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wordLimitExceeded, setWordLimitExceeded] = useState(false);
  const { register, handleSubmit, getValues, formState: {errors, isSubmitting }} = useForm<journalInput>();

  const handleSelectEmoji = (mood: string) => {
    setSelectedMood(mood);
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    console.log("Form Data:", formData); // Check the console for this log
    try {
      formData.mood = mapEmojiToString(selectedMood); // Set the mood from selectedMood
      const journalResponse = await JournalsApi.createJournal(formData);
      console.log("Journal Response:", journalResponse); // Check the console for this log

      // Show a success toast
    toast("💗 Diary Submitted", {
      position: "top-center",
      autoClose: 3000, // Automatically close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
      
    } catch (error) {
      toast.error("Unable To Submit Diary", {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      console.error(error);
      alert(error);
    }
  }

  const checkWordCount = () => {
    const journalEntry = getValues("journalEntry");
    if (journalEntry) {
      const wordCount = journalEntry.split(/\s/).length;
      setWordLimitExceeded(wordCount > 500);
    }
  };
  

  return (
    <div className="home-page">
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
    onChange={checkWordCount}
  />

  <input
    type="hidden"
    value={selectedMood || ''}
    {...register("mood")}
  />

<div className={styles["editor-addons"]}>
    <div className={styles["word-limit"]}>
      {`${getValues("journalEntry")?.split(/\s/).length ?? 0} words / 500 limit`}
    </div>

    <button
      className={styles["submit-button"]}
      disabled={wordLimitExceeded || isSubmitting}
      type="submit"
    >
      Submit Diary
    </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
