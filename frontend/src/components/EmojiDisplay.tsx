import React from 'react';

interface EmojiProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiDisplay: React.FC<EmojiProps> = ({ onSelectEmoji }) => {
  const emojis = [
    { emoji: '😄', mood: 'Excited' },
    { emoji: '🙂', mood: 'Happy' },
    { emoji: '😐', mood: 'Meh' },
    { emoji: '😢', mood: 'Depressed' },
    { emoji: '😡', mood: 'Angry' },
  ];

  return (
    <div className="emoji-container">
      {emojis.map(({ emoji, mood }) => (
        <div key={mood} onClick={() => onSelectEmoji(mood)}>
          {emoji} = {mood}
        </div>
      ))}
    </div>
  );
};

export default EmojiDisplay;
