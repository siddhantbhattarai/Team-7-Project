import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

type Props = DatePickerProps<Date> & {
    name: string;
    label: string;
}

export default function RHFDateField({ name, label, ...other }: Props) {
    const { control } = useFormContext();
    const open = useBoolean()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <DatePicker
                    open={open.value}
                    onClose={open.onFalse}
                    label={label}
                    value={field.value !== '' ? new Date(field.value) : null}
                    onChange={(newValue) => {
                        field.onChange(newValue?.toISOString() || null);
                    }}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                            onClick: open.onTrue,
                        },
                    }}
                    {...other}
                />
            )}
        />
    );
}
