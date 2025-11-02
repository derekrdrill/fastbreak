import { SPORTS } from '@/app/_constants/events';

interface SportFilterProps {
  value: number | null;
  onChange: (sportId: number | null) => void;
}

function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className='sm:w-64'>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
      >
        <option value=''>All Sports</option>
        {SPORTS.map(sport => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SportFilter;
