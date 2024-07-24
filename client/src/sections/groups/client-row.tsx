
import { useMemo, useEffect } from 'react';
import * as yup from 'yup';
import { useForm, FormProvider as Form } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Stack from "@mui/material/Stack"
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify/iconify';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from "@mui/material/Avatar";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// types
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { IUserOnGroup } from 'src/types/user';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = {
    client: IUserOnGroup;
    onEdit: (rooms: string, extension: string) => void;
    onDelete: () => void;
};

export default function ClientRow({ client, onEdit, onDelete }: Props) {
    const { extension, rooms, user } = client;

    const { professional, name, gender, profileImage } = user;

    const popover = usePopover();
    const dialog = useBoolean();

    return (
        <>
            <TableRow hover>
                <TableCell sx={{ width: '72px', pr: 0 }}>
                    <Avatar alt={name} src={profileImage} />
                </TableCell>

                <TableCell>

                    <ListItemText
                        primary={name}
                        primaryTypographyProps={{ typography: 'body2' }}
                    />
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {gender}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {professional.passportNumber}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {rooms ?? '-'}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {extension ?? '-'}
                </TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        popover.onClose();
                        dialog.onToggle();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Add Details
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onDelete();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>

            </CustomPopover>

            <DialogForm
                open={dialog.value}
                onClose={dialog.onFalse}
                handleEdit={onEdit}
                rooms={rooms}
                extension={extension}
            />
        </>
    );
}


type DialogProps = {
    open: boolean;
    onClose: VoidFunction;
    handleEdit: (key: string, value: string) => void;
    rooms?: string | null;
    extension?: string | null;
}

const RoomSchema = yup.object().shape({
    rooms: yup.string().nullable(),
    extension: yup.string().nullable(),
});

const DialogForm = ({ open, onClose, handleEdit, extension, rooms }: DialogProps) => {
    const defaultValue = useMemo(() => ({
        rooms,
        extension,
    }), [rooms, extension])

    const methods = useForm({
        resolver: yupResolver(RoomSchema),
        defaultValues: defaultValue,
    });

    const {
        reset,
    } = methods;

    useEffect(() => {
        reset(defaultValue)
    }, [reset, defaultValue])

    const onSubmit = (data: any) => {
        handleEdit(data.rooms, data.extension);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <Form {...methods}>
                <form onSubmit={e => {
                    e.stopPropagation();

                    return methods.handleSubmit(onSubmit)(e);
                }}>
                    <DialogTitle>Room and Extension Details</DialogTitle>

                    <DialogContent>
                        <Stack spacing={2} sx={{ py: 4 }}>
                            <RHFTextField name="rooms" label="Rooms" />
                            <RHFTextField name="extension" label="Extension" />
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={onClose}
                            color="primary"
                            variant="contained"
                        >
                            Close
                        </Button>
                        <Button
                            type='submit'
                            color="primary"
                            variant="contained"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Form>

        </Dialog>

    )
}
