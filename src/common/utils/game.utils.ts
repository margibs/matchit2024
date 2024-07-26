import * as moment from 'moment-timezone';
import { UserDraw } from 'src/entities';
import { positionTimeMap, timeMapDaily } from '../constants/constants';
import { PositionTimeMap } from '../types/game.types';

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

// //Dynamic Position Time Map
// //Interval 4
// // Not using this since we need caching to not always regenerate the position time map
// function generatePositionTimeMap(
//   interval: number,
//   currentHour: number,
// ): PositionTimeMap {
//   const positionTimeMap: PositionTimeMap[] = [];

//   for (let hour = 0; hour < 24; hour++) {
//     const position = (hour % interval) + 1;
//     const timeMarker = hour < 12 ? 'am' : 'pm';
//     positionTimeMap.push({ time: hour, position, timeMarker });
//   }

//   return positionTimeMap[currentHour];
// }
// //END Dynamic Position Time Map

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

export const getUserLocalTime = (timezone: string, format: string = '') => {
  return moment(new Date()).tz(timezone).format(format);
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
