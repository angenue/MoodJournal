import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../styles/HomePage.css';

const HomePage = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const handleSelectEmoji = (mood: string) => {
    setSelectedMood(mood);
  };
  

  return (
    <div className="home-page">
      <h1 className='todays-date'>{new Date().toDateString()}</h1>

      <div className="emojis">
      <div className="emoji-reaction-prompt">What best describes your mood today?</div>
      <button
  className={`emoji-reaction ${selectedMood === '😃' ? 'active' : ''}`}
  onClick={() => handleSelectEmoji("😃")}
>
  😃
</button>
<button
  className={`emoji-reaction ${selectedMood === '😊' ? 'active' : ''}`}
  onClick={() => handleSelectEmoji("😊")}
>
  😊
</button>
<button
  className={`emoji-reaction ${selectedMood === '😐' ? 'active' : ''}`}
  onClick={() => handleSelectEmoji("😐")}
>
  😐
</button>
<button
  className={`emoji-reaction ${selectedMood === '😢' ? 'active' : ''}`}
  onClick={() => handleSelectEmoji("😢")}
>
  😢
</button>
<button
  className={`emoji-reaction ${selectedMood === '😡' ? 'active' : ''}`}
  onClick={() => handleSelectEmoji("😡")}
>
  😡
</button>
</div>
      
      <div className="editor-container">
      <div className="custom-editor">
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Write your journal entry..."
        />
        </div>
        <div className="word-limit">
          {`${editorState.getCurrentContent().getPlainText().split(/\s/).length} words / 500 limit`}
        </div>
      </div>

      {/*selectedMood && <div>You selected: {selectedMood}</div>*/} 
    </div>
  );
};

export default HomePage;
