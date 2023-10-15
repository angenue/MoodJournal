export const mapStringToEmoji = (emoji: string | null) => {
    if (!emoji) return "";
    switch (emoji) {
      case "excited":
        return "😃";
      case "happy":
        return "😊";
        case "meh":
            return "😐";
            case "depressed":
        return "😢";
        case "angry":
        return "😡";
      default:
        return "";
    }
  };
  