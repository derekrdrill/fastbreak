import {
  GiAmericanFootballBall,
  GiBaseballGlove,
  GiBasketballBasket,
  GiHockey,
  GiSoccerBall,
  GiTennisRacket,
} from 'react-icons/gi';

const SPORTS = [
  {
    id: 5,
    name: 'Baseball',
    icon: <GiBaseballGlove className='text-2xl' />,
  },
  {
    id: 2,
    name: 'Basketball',
    icon: <GiBasketballBasket className='text-2xl' />,
  },
  {
    id: 4,
    name: 'Football',
    icon: <GiAmericanFootballBall className='text-2xl' />,
  },
  {
    id: 6,
    name: 'Hockey',
    icon: <GiHockey className='text-2xl' />,
  },
  {
    id: 1,
    name: 'Soccer',
    icon: <GiSoccerBall className='text-2xl' />,
  },
  {
    id: 3,
    name: 'Tennis',
    icon: <GiTennisRacket className='text-2xl' />,
  },
];

const EVENTS = [
  {
    id: 1,
    fullName: 'Real Madrid vs Barcelona',
    shortName: 'RM vs BAR',
    date: new Date('2025-01-01'),
    venues: 'Venue 1',
    sportType: 1,
  },
  {
    id: 2,
    fullName: 'Real Madrid vs Atletico Madrid',
    shortName: 'RM vs ATM',
    date: new Date('2025-01-02'),
    venues: 'Venue 2',
    sportType: 1,
  },
  {
    id: 3,
    fullName: 'Los Angeles Lakers vs New York Knicks',
    shortName: 'LAL vs NYK',
    date: new Date('2025-01-02'),
    venues: 'Venue 2',
    sportType: 2,
  },
  {
    id: 4,
    fullName: 'Charlotte Hornets vs Washington Wizards',
    shortName: 'CHA vs WAS',
    date: new Date('2025-01-03'),
    venues: 'Venue 3',
    sportType: 2,
  },
  {
    id: 5,
    fullName: 'Wimbeldon Semi Finals',
    shortName: 'WIM Semi',
    date: new Date('2025-01-03'),
    venues: ['Venue 3', 'Venue 4'],
    sportType: 3,
  },
  {
    id: 6,
    fullName: 'Australian Open Semi Finals',
    shortName: 'AO Semi',
    date: new Date('2025-01-04'),
    venues: ['Venue 5', 'Venue 6'],
    sportType: 3,
  },
  {
    id: 7,
    fullName: 'Atlanta Falcons vs Carolina Panthers',
    shortName: 'ATL vs CAR',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 4,
  },
  {
    id: 8,
    fullName: 'New York Jets vs Buffalo Bills',
    shortName: 'NYJ vs BUF',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 4,
  },
  {
    id: 9,
    fullName: 'Chicago Cubs vs Milwaukee Brewers',
    shortName: 'CHC vs MIL',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 5,
  },
  {
    id: 10,
    fullName: 'Los Angeles Dodgers vs San Francisco Giants',
    shortName: 'LAD vs SF',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 5,
  },
  {
    id: 11,
    fullName: 'Toronto Maple Leafs vs Montreal Canadiens',
    shortName: 'TOR vs MTL',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 6,
  },
  {
    id: 12,
    fullName: 'Edmonton Oilers vs Calgary Flames',
    shortName: 'EDM vs CGY',
    date: new Date('2025-01-04'),
    venues: 'Venue 4',
    sportType: 6,
  },
];

export { EVENTS, SPORTS };
