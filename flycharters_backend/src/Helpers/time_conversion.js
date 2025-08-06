function convertToHourMinuteFormat(totalhoursfloat){
    let hours=Math.floor(totalhoursfloat)
    let minutes=Math.round((totalhoursfloat-hours)*60)
    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
    }
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
}
export {convertToHourMinuteFormat}