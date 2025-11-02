// Jest setup file
// Add any global test setup here if needed

// Mock react-icons to avoid import issues in tests
jest.mock('react-icons/gi', () => ({
  GiBaseballGlove: () => 'GiBaseballGlove',
  GiBasketballBasket: () => 'GiBasketballBasket',
  GiAmericanFootballBall: () => 'GiAmericanFootballBall',
  GiHockey: () => 'GiHockey',
  GiSoccerBall: () => 'GiSoccerBall',
  GiTennisRacket: () => 'GiTennisRacket',
}));

