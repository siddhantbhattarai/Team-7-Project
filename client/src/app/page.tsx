import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'ISMT Hub',
};

export default function HomePage() {
  redirect('/auth/login/');
}
