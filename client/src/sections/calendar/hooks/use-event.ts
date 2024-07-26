import { useMemo } from 'react';
import merge from 'lodash/merge';
// types
import { ICalendarRange, ICalendarEvent } from 'src/types/calendar';
// _mock
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

export default function useEvent(
  events: ICalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues = {
    id: currentEvent?.id || '',
    title: currentEvent?.title || null,
    description: currentEvent?.description || null,
    type: currentEvent?.to !== null ? 'EMAIL' : 'MULTIPLE-EMAIL',
    color: currentEvent?.color || CALENDAR_COLOR_OPTIONS[0],
    template: currentEvent?.emailTemplate?.title || '',
    to: currentEvent?.to || null,
    courses: currentEvent?.condition?.course || '',
    sections: currentEvent?.condition?.sections || [],
    tags: currentEvent?.condition?.tags || [],
    batches: currentEvent?.condition?.batches || [],
  };

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  return defaultValues;
}
