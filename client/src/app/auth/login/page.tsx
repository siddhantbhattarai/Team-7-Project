// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'ISMT Hub | Login',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
