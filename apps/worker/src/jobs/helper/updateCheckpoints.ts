const checkpointMinutes = [15, 30, 60, 60 * 6];

export function getUpdateCheckpoint(latestBuildDate: Date) {
  const now = new Date();

  for(let i = checkpointMinutes.length - 1; i >= 0; i--) {
    const date = new Date(latestBuildDate);
    date.setMinutes(date.getMinutes() + checkpointMinutes[i]);

    if(date <= now) {
      return date;
    }
  }

  return undefined;
}
