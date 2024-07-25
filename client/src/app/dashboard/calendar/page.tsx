'use client';
// sections
import { useFetchCalendarEvents } from 'src/api/calendar';
import { LoadingScreen } from 'src/components/loading-screen';
import { CalendarView } from 'src/sections/calendar/view';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: Calendar',
// };

export default function CalendarPage() {
  const { data: calendarEvents, isLoading: calenderEventLoading } = useFetchCalendarEvents();

  if (calenderEventLoading) {
    return <LoadingScreen />;
  }

  return <CalendarView items={calendarEvents} />;
}
