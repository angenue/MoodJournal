export function getMoodColor(mood: string): string {
  switch (mood) {
    case 'happy':
      return 'lightgreen';
    case 'content':
      return 'lightblue';
    case 'neutral':
      return 'lightgray';
    case 'sad':
      return 'lightpink';
    case 'angry':
      return 'salmon';
    default:
      return 'white';
  }
};

