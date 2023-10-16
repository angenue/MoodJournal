export const mapEmojiToString = (emoji: string | null) => {
  if (!emoji) return "";
  switch (emoji) {
    case "😃":
      return "happy";
    case "😊":
      return "content";
    case "😐":
      return "neutral";
    case "😢":
      return "sad";
    case "😡":
      return "angry";
    default:
      return "";
  }
};

export const mapStringToEmoji = (emoji: string | null) => {
  if (!emoji) return "";
  switch (emoji) {
    case "happy":
      return "😃";
    case "content":
      return "😊";
    case "neutral":
      return "😐";
    case "sad":
      return "😢";
    case "angry":
      return "😡";
    default:
      return "";
  }
};

