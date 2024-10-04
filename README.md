# go-duration-js

A TypeScript module to parse Go durations and duration strings.

## Installation

```bash
npm install go-duration-js
```

### Example

``` ts
import { parseGoDuration, parseDurationString } from 'go-duration-js';

// Parsing nanoseconds into a duration object
const nanoseconds = 1234567890123456;
const duration = parseGoDuration(nanoseconds);
console.log(duration);
// Output:
// {
//   years: 0,
//   days: 14,
//   hours: 6,
//   minutes: 56,
//   seconds: 7,
//   remainingNanoseconds: 123456
// }

// Parsing a duration string into nanoseconds
const durationStr = '1h30m15s';
const totalNanoseconds = parseDurationString(durationStr);
console.log(totalNanoseconds);
// Output: 5415000000000
```

#### Supported Units:

- **Nanoseconds**: `ns`
- **Microseconds**: `us`, `µs`
- **Milliseconds**: `ms`
- **Seconds**: `s`, `sec`
- **Minutes**: `m`, `min`
- **Hours**: `h`
- **Days**: `d`, `day`
- **Weeks**: `w`, `week`
- **Years**: `y`, `yr`

#### Examples:

- `'1h2min3sec'` → 3723000000000 nanoseconds
- `'1h30m'` → 5400000000000 nanoseconds

### Error Handling

If the duration string contains unknown time units, the function will throw an error.

#### Example:

```typescript
import { parseDurationString } from 'go-duration-js';

const durationStr = '1h30x10s';

try {
  const nanoseconds = parseDurationString(durationStr);
} catch (error) {
  console.error(error.message);
  // Output: Unknown time unit: x
}
