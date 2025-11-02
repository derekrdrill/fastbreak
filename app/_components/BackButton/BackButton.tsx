'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

interface BackButtonProps {
  className?: string;
  href?: string;
  label?: string;
}

function BackButton({ className, href, label = 'Back to Dashboard' }: BackButtonProps) {
  const router = useRouter();

  const hasHref = Boolean(href);
  const fallbackHref = '/dashboard';
  const finalHref = href || fallbackHref;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (hasHref && href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={classNames(
        'inline-flex items-center text-blue-600 hover:text-blue-800 mb-4',
        className,
      )}
    >
      <IoArrowBack className='w-5 h-5 mr-2' />
      {label}
    </a>
  );
}

export default BackButton;
