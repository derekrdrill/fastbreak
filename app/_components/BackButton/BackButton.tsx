'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

interface BackButtonProps {
  className?: string;
  href?: string;
  label?: string;
}

export default function BackButton({
  className,
  href,
  label = 'Back to Dashboard',
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <a
      href={href || '/dashboard'}
      onClick={handleClick}
      className={className || 'inline-flex items-center text-blue-600 hover:text-blue-800 mb-4'}
    >
      <IoArrowBack className='w-5 h-5 mr-2' />
      {label}
    </a>
  );
}
