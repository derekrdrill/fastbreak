// TODO: Implement auth form component
// Can be used for both login and signup
// Uses shadcn Form component with react-hook-form
// Fields:
//   - Email (text input)
//   - Password (password input)
//   - [Signup only] Confirm Password
// Google OAuth button
// Submit button with loading/error states

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  return (
    <div>
      {/* TODO: Implement form using shadcn Form component */}
      {/* TODO: Add Google OAuth button */}
    </div>
  );
}
