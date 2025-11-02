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

export { SPORTS };
