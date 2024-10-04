import { parseGoDuration, parseDurationString } from "../src/index";

describe("parseGoDuration", () => {
  it("should correctly parse a duration of 1h30m10s in nanoseconds", () => {
    const nanoseconds = (1 * 3600 + 30 * 60 + 10) * 1e9;
    const result = parseGoDuration(nanoseconds);

    expect(result.years).toBe(0);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(10);
    expect(result.remainingNanoseconds).toBe(0);
  });

  it("should handle maximum Go duration correctly", () => {
    const maxNanoseconds = 9223372036854775807;
    const result = parseGoDuration(maxNanoseconds);

    expect(result.years).toBe(292);
    expect(result.days).toBe(171);
    expect(result.hours).toBe(23);
    expect(result.minutes).toBe(47);
    expect(result.seconds).toBe(16);
    expect(result.remainingNanoseconds).toBe(854775808);
  });
});

describe('parseDurationString', () => {
    const testCases = [
      {
        description: 'correctly parse 1day1h1m1s',
        input: '1day1h1m1s',
        expectedNanoseconds: (1 * 86400 + 1 * 3600 + 1 * 60 + 1) * 1e9,
      },
      {
        description: 'correctly parse 2w3d4h5m6.7s',
        input: '2w3d4h5m6.7s',
        expectedNanoseconds: (2 * 604800 + 3 * 86400 + 4 * 3600 + 5 * 60 + 6.7) * 1e9,
        useToBeCloseTo: true,
      },
      {
        description: 'correctly parse 1.5h',
        input: '1.5h',
        expectedNanoseconds: 1.5 * 3600 * 1e9,
      },
      {
        description: 'correctly parse 1week2day3h4min5sec',
        input: '1week2day3h4min5sec',
        expectedNanoseconds: (1 * 604800 + 2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1e9,
      },
      {
        description: 'correctly parse 292y2w3d4h5m6.7s',
        input: '292y2w3d4h5m6.7s',
        expectedNanoseconds:
          (292 * 365 * 24 * 3600 +
            2 * 7 * 24 * 3600 +
            3 * 24 * 3600 +
            4 * 3600 +
            5 * 60 +
            6.7) *
          1e9,
      },
      {
        description: 'correctly parse 180d',
        input: '180day',
        expectedNanoseconds: (180 * 24 * 3600) * 1e9,
      },

      {
        description: 'should handle fractional units with microseconds',
        input: '1min30sec20µs',
        expectedNanoseconds: 90 * 1e9 + 20 * 1e3,
      },
      {
        description: 'should handle repeated units and microseconds',
        input: '1min20µs20µs30sec30sec30sec',
        expectedNanoseconds: (60 + 30 + 30 + 30) * 1e9 + 20 * 1e3 + 20 * 1e3,
      },
      {
        description: 'should correctly normalize and parse units "min" and "sec"',
        input: '1h2min3sec',
        expectedNanoseconds: (1 * 3600 + 2 * 60 + 3) * 1e9,
      },
      {
        description: 'should correctly normalize and parse the last unit "min" after the loop',
        input: '1h30min',
        expectedNanoseconds: (1 * 3600 + 30 * 60) * 1e9,
      },
      {
        description: 'should correctly normalize and parse the last unit "sec" after the loop',
        input: '2min15sec',
        expectedNanoseconds: (2 * 60 + 15) * 1e9,
      },

    ];
  
    testCases.forEach(({ description, input, expectedNanoseconds }) => {
      it(description, () => {
        const nanoseconds = parseDurationString(input);
        expect(nanoseconds).toBe(expectedNanoseconds);
      });
    });
  
    // Тесты, которые проверяют ошибки
    const errorTestCases = [
      {
        description: 'should throw an error for unknown units',
        input: '5x',
        expectedError: 'Unknown time unit: x',
      },
      {
        description: 'should throw an error for invalid format',
        input: '1h30',
        expectedError: 'Invalid duration string format',
      },
      {
        description: 'should throw an error for invalid character',
        input: 'Am',
        expectedError: "Invalid character 'A' in duration string",
      },
      {
        description: 'should throw an error for unknown units during parsing (first occurrence)',
        input: '1h30x10s',
        expectedError: 'Unknown time unit: x',
      },
    ];
  
    errorTestCases.forEach(({ description, input, expectedError }) => {
      it(description, () => {
        expect(() => {
          parseDurationString(input);
        }).toThrow(expectedError);
      });
    });
  });