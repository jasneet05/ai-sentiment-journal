export const SENTIMENTS = [
  { value: 'HAPPY', emoji: '😊', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  { value: 'SAD', emoji: '😢', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { value: 'ANGRY', emoji: '😡', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { value: 'ANXIOUS', emoji: '😰', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
];

export function getSentimentStyles(sentimentValue) {
  const s = SENTIMENTS.find(sent => sent.value === sentimentValue);
  return s || { color: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/10', emoji: '💜' };
}

export const SENTIMENTS_WITH_ICONS = [
  { value: 'HAPPY', emoji: '😊', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: 'Smile' },
  { value: 'SAD', emoji: '😢', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: 'Frown' },
  { value: 'ANGRY', emoji: '😡', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: 'Flame' },
  { value: 'ANXIOUS', emoji: '😰', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: 'Activity' },
];

export const SENTIMENTS_BASIC = [
  { value: 'HAPPY', color: 'bg-green-400', text: 'text-green-400' },
  { value: 'SAD', color: 'bg-blue-400', text: 'text-blue-400' },
  { value: 'ANGRY', color: 'bg-red-400', text: 'text-red-400' },
  { value: 'ANXIOUS', color: 'bg-amber-400', text: 'text-amber-400' },
];
