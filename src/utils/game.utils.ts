import * as moment from 'moment-timezone';
import { UserDraw } from 'src/entities';

export const createShuffledPositions = (): {
  position: number;
  number: number;
}[] => {
  // Create an array of numbers from 1 to 24
  const numbers: number[] = Array.from({ length: 24 }, (_, i) => i + 1);

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Map the shuffled numbers to the desired format
  const result = numbers.map((number, index) => ({
    position: index + 1,
    number,
  }));

  return result;
};

type PositionTimeMap = {
  time: number;
  position: number;
  timeMarker: 'am' | 'pm';
};

// 0, 1, 2, 3
// 4, 5, 6, 7
// 8, 9, 10, 11
// 12, 13, 14, 15
// 16, 17, 18, 19
// 20, 21, 22, 23
export const positionTimeMap: PositionTimeMap[] = [
  {
    time: 0,
    position: 1,
    timeMarker: 'am',
  },
  {
    time: 1,
    position: 2,
    timeMarker: 'am',
  },
  {
    time: 2,
    position: 3,
    timeMarker: 'am',
  },
  {
    time: 3,
    position: 4,
    timeMarker: 'am',
  },
  {
    time: 4,
    position: 1,
    timeMarker: 'am',
  },
  {
    time: 5,
    position: 2,
    timeMarker: 'am',
  },
  {
    time: 6,
    position: 3,
    timeMarker: 'am',
  },
  {
    time: 7,
    position: 4,
    timeMarker: 'am',
  },
  {
    time: 8,
    position: 1,
    timeMarker: 'am',
  },
  {
    time: 9,
    position: 2,
    timeMarker: 'am',
  },
  {
    time: 10,
    position: 3,
    timeMarker: 'am',
  },
  {
    time: 11,
    position: 4,
    timeMarker: 'am',
  },

  {
    time: 12,
    position: 1,
    timeMarker: 'pm',
  },
  {
    time: 13,
    position: 2,
    timeMarker: 'pm',
  },
  {
    time: 14,
    position: 3,
    timeMarker: 'pm',
  },
  {
    time: 15,
    position: 4,
    timeMarker: 'pm',
  },
  {
    time: 16,
    position: 1,
    timeMarker: 'pm',
  },
  {
    time: 17,
    position: 2,
    timeMarker: 'pm',
  },
  {
    time: 18,
    position: 3,
    timeMarker: 'pm',
  },
  {
    time: 19,
    position: 4,
    timeMarker: 'pm',
  },
  {
    time: 20,
    position: 1,
    timeMarker: 'pm',
  },
  {
    time: 21,
    position: 2,
    timeMarker: 'pm',
  },
  {
    time: 22,
    position: 3,
    timeMarker: 'pm',
  },
  {
    time: 23,
    position: 4,
    timeMarker: 'pm',
  },
];

// Dynamic Position Time Map

// Interval 4
// Not using this since we need caching to not always regenerate the position time map
function generatePositionTimeMap(
  interval: number,
  currentHour: number,
): PositionTimeMap {
  const positionTimeMap: PositionTimeMap[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const position = (hour % interval) + 1;
    const timeMarker = hour < 12 ? 'am' : 'pm';
    positionTimeMap.push({ time: hour, position, timeMarker });
  }

  return positionTimeMap[currentHour];
}
// END Dynamic Position Time Map

export const timeMapDaily = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3, 4,
  5, 6, 7,
];

export const timeMapWeekly = [8, 14, 20, 2];

export const createGameFourDrawLayout = (
  currentHour: number,
  userDraws: UserDraw[],
) => {
  const timeIndex = timeMapDaily.indexOf(currentHour);
  const currentHourConverter = [24, 25, 26, 27];
  const currentHourReverseConverter: { [key: number]: number } = {
    24: 0,
    25: 1,
    26: 2,
    27: 3,
  };

  console.debug({
    timeIndex,
    currentHour,
  });

  let output;

  if (timeIndex === 0) {
    output = [
      {
        label: '08:01 AM',
        position: 1,
        value: getUserDrawNumberDraw(userDraws, 8),
        currentHour: true,
      },
      {
        label: '09:01 AM',
        position: 2,
        value: null,
      },
      {
        label: '10:01 AM',
        position: 3,
        value: null,
      },
      {
        label: '11:01 AM',
        position: 4,
        value: null,
      },
    ];
  } else if (timeIndex === 1) {
    output = [
      {
        label: '08:01 AM',
        position: 1,
        value: getUserDrawNumberDraw(userDraws, 8),
      },
      {
        label: '09:01 AM',
        position: 2,
        value: getUserDrawNumberDraw(userDraws, 9),
        currentHour: true,
      },
      {
        label: '10:01 AM',
        position: 3,
        value: null,
      },
      {
        label: '11:01 AM',
        position: 4,
        value: null,
      },
    ];
  } else if (timeIndex === 2) {
    output = [
      {
        label: '08:01 AM',
        position: 1,
        value: getUserDrawNumberDraw(userDraws, 8),
      },
      {
        label: '09:01 AM',
        position: 2,
        value: getUserDrawNumberDraw(userDraws, 9),
      },
      {
        label: '10:01 AM',
        position: 3,
        value: getUserDrawNumberDraw(userDraws, 10),
        currentHour: true,
      },
      {
        label: '11:01 AM',
        position: 4,
        value: null,
      },
    ];
  } else {
    const manipulatedCurrentHour =
      currentHourConverter[currentHour] ?? currentHour;

    const result1 =
      manipulatedCurrentHour - 1 >= 24
        ? currentHourReverseConverter[manipulatedCurrentHour - 1]
        : manipulatedCurrentHour - 1;
    const result2 =
      manipulatedCurrentHour - 2 >= 24
        ? currentHourReverseConverter[manipulatedCurrentHour - 2]
        : manipulatedCurrentHour - 2;
    const result3 =
      manipulatedCurrentHour - 3 >= 24
        ? currentHourReverseConverter[manipulatedCurrentHour - 3]
        : manipulatedCurrentHour - 3;

    output = [
      {
        ...formatPositionTimeMap(
          positionTimeMap[currentHour === 24 ? 0 : currentHour],
          getUserDrawNumberDraw(
            userDraws,
            currentHour === 24 ? 0 : currentHour,
          ),
        ),
        currentHour: true,
      },
      formatPositionTimeMap(
        positionTimeMap[result1],
        getUserDrawNumberDraw(userDraws, result1),
      ),
      formatPositionTimeMap(
        positionTimeMap[result2],
        getUserDrawNumberDraw(userDraws, result2),
      ),
      formatPositionTimeMap(
        positionTimeMap[result3],
        getUserDrawNumberDraw(userDraws, result3),
      ),
    ];

    // sort by position
    output.sort((a, b) => a.position - b.position);
  }

  return output;
};

export const getUserDrawNumberDraw = (
  userDraws: UserDraw[],
  currentHour: number,
): number | null => {
  return (
    userDraws.filter((userDraw) => userDraw.drawTime === currentHour)[0]
      ?.numberDraw ?? null
  );
};

export const formatPositionTimeMap = (
  positionTimeMap: PositionTimeMap,
  value: number | null | undefined,
) => {
  const { time, position, timeMarker } = positionTimeMap;

  const formattedTime = `${(time > 12 ? time - 12 : time).toString().padStart(2, '0')}`;

  return {
    label: `${formattedTime === '00' ? '12' : formattedTime}:01 ${timeMarker.toUpperCase()}`,
    value: value ?? null,
    position: position,
  };
};

export const getUserLocalTime = (
  timezone: string,
  format: string = '',
): number => {
  return Number(moment(new Date()).tz(timezone).format(format));
};

export const getNumberDraw = (
  userDraws: UserDraw[],
  randomRepeatAllowed: number,
): number => {
  const numberDraw = getRandomNumber(1, 24);

  if (
    userDraws.filter((userDraw) => userDraw.numberDraw === numberDraw).length >=
    randomRepeatAllowed
  ) {
    return getNumberDraw(userDraws, randomRepeatAllowed);
  }

  return numberDraw;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
