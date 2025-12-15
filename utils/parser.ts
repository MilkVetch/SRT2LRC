/**
 * Converts SRT formatted string to LRC formatted string.
 *
 * Input:
 * 2
 * 00:00:12,000 --> 00:00:17,766
 * Text line
 *
 * Output:
 * [00:12.000]Text line
 */
export const convertSrtToLrc = (srtContent: string): string => {
  if (!srtContent) return '';

  // Normalize line endings to \n
  const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split by double newlines to isolate blocks
  // Some files might use multiple newlines or just one between blocks if they are messy,
  // but strictly SRT uses blank lines.
  const blocks = normalized.split(/\n\n+/);

  const lrcLines = blocks.map((block) => {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    // A valid minimal block has at least index (optional check), time, and text.
    // However, sometimes index is missing in malformed files.
    // We search for the arrow '-->' to identify the timestamp line.
    const timeLineIndex = lines.findIndex(l => l.includes('-->'));

    if (timeLineIndex === -1) {
      return null;
    }

    const timeLine = lines[timeLineIndex];
    // Remaining lines after the time line are the text
    const textLines = lines.slice(timeLineIndex + 1);
    
    if (textLines.length === 0) {
       // It's possible to have empty subtitles, we skip or keep them? 
       // Usually useless for LRC.
       return null;
    }

    // Regex to extract start time: HH:MM:SS,mmm
    // Example: 00:00:12,000
    const timeMatch = timeLine.match(/(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})/);
    
    if (!timeMatch) {
      return null;
    }

    const [_, hh, mm, ss, ms] = timeMatch;

    // Calculate total minutes (SRT usually resets hours, but LRC counts up minutes)
    // Standard LRC is [mm:ss.xx] or [mm:ss.xxx].
    // If hours > 0, we add them to minutes: 01:05:00 -> 65:00
    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);
    const totalMinutes = hours * 60 + minutes;

    // Format: [MM:SS.mmm]
    // Pad minutes with 0 if single digit (though usually 2 digits)
    const formattedMinutes = String(totalMinutes).padStart(2, '0');
    
    // Join all text lines with a space or newline? 
    // Usually lyrics for a specific timestamp should be single line for most players.
    const textContent = textLines.join(' ');

    return `[${formattedMinutes}:${ss}.${ms}]${textContent}`;
  }).filter(line => line !== null);

  return lrcLines.join('\n');
};