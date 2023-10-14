import React, { useState } from "react"
import {journalInput} from "../utils/handleSave";
import * as JournalsApi from "../utils/handleSave";
import "../styles/HomePage.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { mapEmojiToString } from '../utils/mapEmojiToString';


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
    } catch (error) {
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

      <h1 className="todays-date">{new Date().toDateString()}</h1>
      <div className="emojis">
        <div className="emoji-reaction-prompt">
          What best describes your mood today?
        </div>
        <button
          className={`emoji-reaction ${selectedMood === "😃" ? "active" : ""}`}
          onClick={() => handleSelectEmoji("😃")}
        >
          😃
        </button>
        <button
          className={`emoji-reaction ${selectedMood === "😊" ? "active" : ""}`}
          onClick={() => handleSelectEmoji("😊")}
        >
          😊
        </button>
        <button
          className={`emoji-reaction ${selectedMood === "😐" ? "active" : ""}`}
          onClick={() => handleSelectEmoji("😐")}
        >
          😐
        </button>
        <button
          className={`emoji-reaction ${selectedMood === "😢" ? "active" : ""}`}
          onClick={() => handleSelectEmoji("😢")}
        >
          😢
        </button>
        <button
          className={`emoji-reaction ${selectedMood === "😡" ? "active" : ""}`}
          onClick={() => handleSelectEmoji("😡")}
        >
          😡
        </button>
      </div>

      
      <form  className="editor-container" onSubmit={handleSubmit(onSubmit)}>
        <textarea
        className="custom-editor"
          placeholder="Write your journal entry..."
          rows={10}
          {...register("journalEntry", { required: "Required" })}
          onChange={checkWordCount}
        />

<input type="hidden" value={selectedMood || ''} {...register("mood")} />

        <div className="editor-addons">
          <div className="word-limit">
          {`${getValues("journalEntry")?.split(/\s/).length ?? 0} words / 500 limit`}
</div>

          <button
            className="submit-button"
            disabled={wordLimitExceeded}
            type="submit"
          >
            Submit Diary
          </button>
        </div>
      </form>

      {/*selectedMood && <div>You selected: {selectedMood}</div>*/}
    </div>
  );
};

export default HomePage;
