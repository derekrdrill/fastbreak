import { BackButton } from '@/app/_components';

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <BackButton />
      {children}
    </div>
  );
}
