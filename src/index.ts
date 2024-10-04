// Interface representing the parsed duration components
export interface ParsedDuration {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  remainingNanoseconds: number;
}

// Function to parse duration in nanoseconds into years, days, hours, minutes, seconds, and remaining nanoseconds
export function parseGoDuration(nanoseconds: number): ParsedDuration {
  // Constants for time unit conversions
  const nanosecondsInSecond = 1e9;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const daysInYear = 365;

  // Calculate total seconds and remaining nanoseconds
  const seconds = Math.floor(nanoseconds / nanosecondsInSecond);
  const remainingNanoseconds = nanoseconds % nanosecondsInSecond;

  // Calculate years
  const years = Math.floor(
    seconds / (secondsInMinute * minutesInHour * hoursInDay * daysInYear)
  );

  // Calculate remaining days after extracting years
  const days = Math.floor(
    (seconds % (secondsInMinute * minutesInHour * hoursInDay * daysInYear)) /
      (secondsInMinute * minutesInHour * hoursInDay)
  );

  // Calculate remaining hours after extracting days
  const hours = Math.floor(
    (seconds % (secondsInMinute * minutesInHour * hoursInDay)) /
      (secondsInMinute * minutesInHour)
  );

  // Calculate remaining minutes after extracting hours
  const minutes = Math.floor(
    (seconds % (secondsInMinute * minutesInHour)) / secondsInMinute
  );

  // Calculate remaining seconds after extracting minutes
  const remainingSeconds = seconds % secondsInMinute;

  // Return the parsed duration components
  return {
    years: years,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
    remainingNanoseconds: remainingNanoseconds,
  };
}

// Mapping of time units to their equivalent in nanoseconds
const timeUnits: { [unit: string]: number } = {
  ns: 1, // Nanoseconds

  us: 1e3, // Microseconds
  µs: 1e3, // Microseconds (alternative symbol)

  ms: 1e6, // Milliseconds

  s: 1e9, // Seconds
  sec: 1e9, // Seconds (alternative)

  m: 60 * 1e9, // Minutes
  min: 60 * 1e9, // Minutes (alternative)

  h: 3600 * 1e9, // Hours

  d: 24 * 3600 * 1e9, // Days
  day: 24 * 3600 * 1e9, // Days (alternative)

  w: 7 * 24 * 3600 * 1e9, // Weeks
  week: 7 * 24 * 3600 * 1e9, // Weeks (alternative)

  y: 365 * 24 * 3600 * 1e9, // Years
  yr: 365 * 24 * 3600 * 1e9, // Years (alternative)
};

// Function to parse a duration string (e.g., "1h30m") into total nanoseconds
export function parseDurationString(durationStr: string): number {
  let totalNanoseconds = 0;
  let numberBuffer = "";
  let unitBuffer = "";

  for (let i = 0; i < durationStr.length; i++) {
    const char = durationStr[i];

    if ((char >= "0" && char <= "9") || char === ".") {
      if (unitBuffer) {
        // Process the accumulated number and unit
        totalNanoseconds += processTimeUnit(numberBuffer, unitBuffer);

        // Reset the buffers
        numberBuffer = "";
        unitBuffer = "";
      }

      numberBuffer += char;
    } else if ((char >= "a" && char <= "z") || char === "µ") {
      unitBuffer += char;
    } else {
      throw new Error(`Invalid character '${char}' in duration string`);
    }
  }

  // Process any remaining number and unit after the loop ends
  if (numberBuffer && unitBuffer) {
    totalNanoseconds += processTimeUnit(numberBuffer, unitBuffer);
  } else {
    throw new Error("Invalid duration string format");
  }

  return totalNanoseconds;
}

// Helper function to process a number and its unit, converting it to nanoseconds
function processTimeUnit(numberStr: string, unitStr: string): number {
  const value = parseFloat(numberStr);
  const unit = unitStr;
  // Normalize the unit (e.g., 'min' -> 'm', 'sec' -> 's')
  const normalizedUnit = unit === "min" ? "m" : unit === "sec" ? "s" : unit;

  if (normalizedUnit in timeUnits) {
    return value * timeUnits[normalizedUnit];
  } else {
    throw new Error(`Unknown time unit: ${unit}`);
  }
}
