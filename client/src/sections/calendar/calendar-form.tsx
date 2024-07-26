import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
// utils
import {
  useAddEventCalendar,
  useDeleteEventCalendar,
  useUpdateEventCalendar,
} from 'src/api/calendar';
// components
import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
// types
import { Chip, MenuItem } from '@mui/material';
import { CALENDAR_EVENT_OPTIONS } from 'src/_mock';
import { IMailTemplate } from 'src/types/mail';
import { IUserUniqueFields } from 'src/types/user';
import { formatDistanceToNowStrict } from 'date-fns';
import { getCurrentUser } from 'src/utils/SessionManager';

// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: VoidFunction;
  templates: IMailTemplate[];
  userOptions: IUserUniqueFields;
  currentEvent?: any;
};

export default function CalendarForm({
  currentEvent,
  templates,
  userOptions,
  colorOptions,
  onClose,
}: Props) {
  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000, 'Description must be at most 5000 characters'),
    type: Yup.string(),
    color: Yup.string(),
    date: Yup.string(), // any string or number
    template: Yup.object(),
    to: Yup.string().nullable(),
    courses: Yup.string(),
    sections: Yup.array().of(Yup.string()),
    tags: Yup.array().of(Yup.string()),
    batches: Yup.array().of(Yup.string()),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    getFieldState,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  console.log('🚀 ~ getFieldState:', getFieldState('template'));

  const addEvent = useAddEventCalendar(onClose, reset);
  const deleteEvent = useDeleteEventCalendar(onClose, reset);
  const updateEvent = useUpdateEventCalendar(onClose, reset);
  const values = watch();
  const user = getCurrentUser();

  // const dateError = values.date ? values.date > new Date().toString() : false;

  const onSubmit = handleSubmit(async (data) => {
    console.log('data is', data);
    const eventData = {
      title: data.title,
      description: data.description,
      time: data.date,
      templateId: data.template.value,
      createdBy: user.id,
      color: data?.color,
      ...(data.type === 'EMAIL' && {
        to: data?.to || null,
        condition: {},
      }),
      ...(data.type === 'MULTIPLE-EMAIL' && {
        to: null,
        condition: {
          batches: data?.batches || [],
          sections: data?.sections || [],
          course: data.courses || null,
          tags: data?.tags || [],
        },
      }),
    };

    if (currentEvent?.id) {
      updateEvent.mutate({ ...eventData, id: currentEvent.id });
    } else {
      addEvent.mutate(eventData);
    }
  });

  const onDelete = () => {
    if (currentEvent?.id) {
      deleteEvent.mutate(currentEvent?.id);
      return;
    }
    console.log('No event to delete');
  };

  const renderBulkOptions = (
    <>
      <RHFAutocomplete
        name="courses"
        label="Course"
        options={userOptions.course}
        getOptionLabel={(option) => option}
        isOptionEqualToValue={(option, value) => option === value}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option}>
              <Iconify key={option} icon={`email`} width={28} sx={{ mr: 1 }} />
              {option}
            </li>
          );
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <RHFAutocomplete
          sx={{
            flex: '1 1 30%', // adjust flex-basis for responsiveness
            minWidth: '200px', // minimum width for each dropdown
          }}
          name="sections"
          placeholder="+ Sections"
          multiple
          disableCloseOnSelect
          options={userOptions.section}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
        <RHFAutocomplete
          sx={{
            flex: '1 1 30%',
            minWidth: '200px',
          }}
          name="batches"
          placeholder="+ Batches"
          multiple
          disableCloseOnSelect
          options={userOptions.batch}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
        <RHFAutocomplete
          sx={{
            flex: '1 1 30%',
            minWidth: '200px',
          }}
          name="tags"
          placeholder="+ Tags"
          multiple
          disableCloseOnSelect
          options={userOptions.tags}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Box>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFSelect
          defaultValue={CALENDAR_EVENT_OPTIONS.map((item) => item.value === values.type)}
          name="type"
          label="Event Type"
        >
          {CALENDAR_EVENT_OPTIONS.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField name="title" label="Title" />

        <RHFTextField name="description" label="Description" multiline rows={3} />

        {values.type === 'EMAIL' && (
          <RHFTextField name="to" label="To" placeholder="example@gmail.com" />
        )}

        {values.type === 'MULTIPLE-EMAIL' && renderBulkOptions}

        <RHFAutocomplete
          name="template"
          label="Email templates"
          options={templates.map((template) => {
            const time = formatDistanceToNowStrict(new Date(template.updatedAt), {
              addSuffix: false,
            });
            return {
              value: template.id,
              time,
              by: template.createdBy.name,
              label: template.subject,
            };
          })}
          // getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                key={option.value}
              >
                {option.label}
                <span
                  style={{
                    fontSize: '12px',
                    color: 'gray',
                  }}
                >
                  {option.by} - {option.time} ago
                </span>
              </li>
            );
          }}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(newValue.toISOString());
                }
              }}
              label="Date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value as string}
              onSelectColor={field.onChange}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
