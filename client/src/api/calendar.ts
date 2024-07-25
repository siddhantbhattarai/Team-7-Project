import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import api, { fetcher, endpoints } from 'src/utils/axios';
// types
import { ICalendarEvent } from 'src/types/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
export function useAddEventCalendar(onClose: VoidFunction, reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['addEventCalendar'],
    mutationFn: async (event: any) => {
      await api.post(`/calendar-event`, event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendarEvents'],
        refetchType: 'active',
      });
      enqueueSnackbar(`Event added Successfully!`, { variant: 'success' });
      onClose();
      reset();
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message || 'Something went wrong', { variant: 'error' });
    },
  });
}

export function useUpdateEventCalendar(onClose: VoidFunction, reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['updateEventCalendar'],
    mutationFn: async (event: any) => {
      const { id, ...data } = event;
      await api.put(`/calendar-event/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendarEvents'],
        refetchType: 'active',
      });
      enqueueSnackbar(`Event updated Successfully!`, { variant: 'success' });
      onClose();
      reset();
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message || 'Something went wrong', { variant: 'error' });
    },
  });
}

export function useDeleteEventCalendar(onClose: VoidFunction, reset: any) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationKey: ['deleteEventCalendar'],
    mutationFn: async (id: string) => {
      await api.delete(`/calendar-event/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendarEvents'],
        refetchType: 'active',
      });
      enqueueSnackbar(`Event deleted Successfully!`, { variant: 'success' });
      onClose();
      reset();
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message || 'Something went wrong', { variant: 'error' });
    },
  });
}

export function useFetchCalendarEvents() {
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: async () => {
      const { data } = await api.get(`/calendar-event`);
      return data;
    },
  });
}

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.post(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = [...currentData.events, eventData];

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.put(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.map((event: ICalendarEvent) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work on server
   */
  // const data = { eventId };
  // await axios.patch(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.filter(
        (event: ICalendarEvent) => event.id !== eventId
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}
