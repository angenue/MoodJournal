import { mapEmojiToString, mapStringToEmoji } from './mapEmojiAndString';


describe('Emoji Mapping', () => {
    describe('mapEmojiToString', () => {
      it('returns the correct string for a given emoji', () => {
        expect(mapEmojiToString('😃')).toBe('happy');
        expect(mapEmojiToString('😊')).toBe('content');
        expect(mapEmojiToString('😐')).toBe('neutral');
        expect(mapEmojiToString('😢')).toBe('sad');
        expect(mapEmojiToString('😡')).toBe('angry');
      });
  
      it('returns an empty string for an unrecognized emoji', () => {
        expect(mapEmojiToString('🤔')).toBe('');
      });
  
      it('returns an empty string for null input', () => {
        expect(mapEmojiToString(null)).toBe('');
      });
    });
  
    describe('mapStringToEmoji', () => {
      it('returns the correct emoji for a given string', () => {
        expect(mapStringToEmoji('happy')).toBe('😃');
        expect(mapStringToEmoji('content')).toBe('😊');
        expect(mapStringToEmoji('neutral')).toBe('😐');
        expect(mapStringToEmoji('sad')).toBe('😢');
        expect(mapStringToEmoji('angry')).toBe('😡');
      });
  
      it('returns an empty string for an unrecognized string', () => {
        expect(mapStringToEmoji('excited')).toBe('');
      });
  
      it('returns an empty string for null input', () => {
        expect(mapStringToEmoji(null)).toBe('');
      });
    });
  });
  