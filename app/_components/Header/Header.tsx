import Link from 'next/link';
// TODO: Add auth check and user info display
// TODO: Add proper logout functionality

function Header() {
  // TODO: Get auth status from server component
  // TODO: Display user info if authenticated
  // TODO: Make logout actually work

  return (
    <header className="border-b mb-4 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          FASTBREAK
        </Link>
        <nav className="flex items-center gap-4">
          {/* TODO: Show user email/name if authenticated */}
          {/* TODO: Show login/signup links if not authenticated */}
          <Link
            href="/logout"
            className="text-sm hover:underline"
          >
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
