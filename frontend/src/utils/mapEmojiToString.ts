export const mapEmojiToString = (emoji: string | null) => {
    if (!emoji) return "";
    switch (emoji) {
      case "😃":
        return "excited";
      case "😊":
        return "happy";
        case "😐":
            return "meh";
            case "😢":
        return "depressed";
        case "😡":
        return "angry";
      default:
        return "";
    }
  };
  