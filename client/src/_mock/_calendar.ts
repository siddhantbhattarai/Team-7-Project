import { palette as themePalette } from 'src/theme/palette';

// ----------------------------------------------------------------------

export const CALENDAR_EVENT_OPTIONS = [
  { value: 'MULTIPLE-EMAIL', label: 'MULTIPLE EMAIL' },
  { value: 'EMAIL', label: 'EMAIL' },
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
