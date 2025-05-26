export default function formatCommentTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Check if the date is today
  const isToday =
    now.toDateString() === date.toDateString();

  // Check if the date is yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    // Return just the time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return '1d ago';
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}M ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years}Y ago`;
  }
}
