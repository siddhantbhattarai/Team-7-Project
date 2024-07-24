// sections
import { JwtVerifyView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Verify code | Bus Adventures',
};

export default function VerifyPage() {
  return <JwtVerifyView />;
}
