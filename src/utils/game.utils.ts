export const createShuffledPositions = () => {
  // Create an array of numbers from 1 to 24
  const numbers = Array.from({ length: 24 }, (_, i) => i + 1);

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
