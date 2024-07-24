import { palette as themePalette } from 'src/theme/palette';

// ----------------------------------------------------------------------

export const CALENDAR_EVENT_OPTIONS = [
  { value: 'EMAIL', label: 'EMAIL' },
  { value: 'NOTIFICATION', label: 'NOTIFICATION' },
];

const palette = themePalette('light');

export const CALENDAR_COLOR_OPTIONS = [
  palette.primary.main,
  palette.secondary.main,
  palette.info.main,
  palette.info.darker,
  palette.success.main,
  palette.warning.main,
  palette.error.main,
  palette.error.darker,
];
