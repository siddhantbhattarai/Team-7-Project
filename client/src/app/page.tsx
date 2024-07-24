import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Boss Adventure ',
};

export default function HomePage() {
  redirect('/auth/login/');
}
