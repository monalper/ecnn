// Emoji utility functions for consistent emoji display
import { emoji } from 'emoji-js';

// Initialize emoji-js with WhatsApp-style settings
emoji.allow_native = true;
emoji.use_sheet = false;
emoji.replace_mode = 'unified';

// Convert text with emoji shortcodes to actual emojis
// @param {string} text - Text containing emoji shortcodes
// @returns {string} - Text with emojis rendered
export const convertEmojiShortcodes = (text) => {
  if (!text) return '';
  return emoji.replace_colons(text);
};

// Convert text with unicode emojis to shortcodes (for storage)
// @param {string} text - Text containing unicode emojis
// @returns {string} - Text with emoji shortcodes
export const convertToEmojiShortcodes = (text) => {
  if (!text) return '';
  return emoji.replace_unified(text);
};

// Get emoji data for a specific shortcode
// @param {string} shortcode - Emoji shortcode (e.g., ':smile:')
// @returns {object} - Emoji data object
export const getEmojiData = (shortcode) => {
  return emoji.get(shortcode);
};

// Check if a string contains emojis
// @param {string} text - Text to check
// @returns {boolean} - True if text contains emojis
export const hasEmojis = (text) => {
  if (!text) return false;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
};

// Render text with proper emoji font classes
// @param {string} text - Text to render
// @returns {JSX.Element} - Rendered text with emoji styling
export const renderTextWithEmojis = (text) => {
  if (!text) return null;
  
  // Convert shortcodes to unicode emojis
  const processedText = convertEmojiShortcodes(text);
  
  // Split text into parts (emojis and regular text)
  const parts = processedText.split(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u);
  
  return parts.map((part, index) => {
    if (hasEmojis(part)) {
      return (
        <span key={index} className="comments-emoji emoji-consistent">
          {part}
        </span>
      );
    }
    return part;
  });
};

// Common emoji shortcodes for quick access
export const commonEmojis = {
  smile: ':smile:',
  heart: ':heart:',
  thumbsUp: ':thumbsup:',
  thumbsDown: ':thumbsdown:',
  fire: ':fire:',
  star: ':star:',
  clap: ':clap:',
  laugh: ':laughing:',
  cry: ':cry:',
  angry: ':angry:',
  thinking: ':thinking:',
  party: ':partying_face:',
  rocket: ':rocket:',
  check: ':white_check_mark:',
  cross: ':x:',
  warning: ':warning:',
  info: ':information_source:',
  question: ':question:',
  exclamation: ':exclamation:',
  plus: ':heavy_plus_sign:',
  minus: ':heavy_minus_sign:',
  ok: ':ok:',
  cool: ':sunglasses:',
  wink: ':wink:',
  kiss: ':kiss:',
  hug: ':hugging_face:',
  pray: ':pray:',
  muscle: ':muscle:',
  peace: ':v:',
  victory: ':v:',
  pointUp: ':point_up:',
  pointDown: ':point_down:',
  pointLeft: ':point_left:',
  pointRight: ':point_right:',
  wave: ':wave:',
  handshake: ':handshake:',
  highFive: ':high_five:',
  fist: ':fist:',
  fingersCrossed: ':crossed_fingers:',
  love: ':heart_eyes:',
  kissHeart: ':kissing_heart:',
  heartEyes: ':heart_eyes:',
  winkHeart: ':wink:',
  blush: ':blush:',
  innocent: ':innocent:',
  relieved: ':relieved:',
  smirk: ':smirk:',
  unamused: ':unamused:',
  disappointed: ':disappointed:',
  worried: ':worried:',
  confused: ':confused:',
  astonished: ':astonished:',
  flushed: ':flushed:',
  scream: ':scream:',
  dizzy: ':dizzy_face:',
  expressionless: ':expressionless:',
  neutral: ':neutral_face:',
  noMouth: ':no_mouth:',
  mask: ':mask:',
  sunglasses: ':sunglasses:',
  nerd: ':nerd_face:',
  money: ':money_mouth_face:',
  stuckOut: ':stuck_out_tongue:',
  stuckOutWink: ':stuck_out_tongue_winking_eye:',
  stuckOutClosed: ':stuck_out_tongue_closed_eyes:',
  drooling: ':drooling_face:',
  sweat: ':sweat:',
  pensive: ':pensive:',
  upsideDown: ':upside_down_face:',
  headBandage: ':head_bandage:',
  robot: ':robot:',
  hankey: ':hankey:',
  boom: ':boom:',
  speech: ':speech_balloon:',
  thought: ':thought_balloon:',
  zzz: ':zzz:',
  rage: ':rage:',
  triumph: ':triumph:',
  cold: ':cold_sweat:',
  grey: ':grey_exclamation:',
  greyQuestion: ':grey_question:',
  white: ':white_exclamation:',
  whiteQuestion: ':white_question:',
  o: ':o:',
  o2: ':o2:',
  interrobang: ':interrobang:'
};

// Get a random emoji from common emojis
// @returns {string} - Random emoji shortcode
export const getRandomEmoji = () => {
  const emojiKeys = Object.keys(commonEmojis);
  const randomKey = emojiKeys[Math.floor(Math.random() * emojiKeys.length)];
  return commonEmojis[randomKey];
};

// Format text for display with proper emoji rendering
// @param {string} text - Text to format
// @returns {string} - Formatted text with emojis
export const formatTextForDisplay = (text) => {
  if (!text) return '';
  return convertEmojiShortcodes(text);
};
