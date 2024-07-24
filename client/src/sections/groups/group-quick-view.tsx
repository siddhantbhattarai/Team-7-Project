import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import ListItemText from '@mui/material/ListItemText';
// components
import { TableHeadCustom } from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
// types
import { IUserGroupRows } from 'src/types/user';
import FormProvider, {
    RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
    currentGroup: IUserGroupRows;
    open: boolean;
    onClose: VoidFunction;
};

const TABLE_HEAD = [
    { id: 'username', label: 'Name', alignRight: false },
    { id: 'role', label: 'Role', alignRight: false },
    { id: 'rooms', label: 'Rooms', alignRight: false },
    { id: 'extension', label: 'Extension', alignRight: false },
];

export default function GroupQuickView({ currentGroup, open, onClose }: Props) {
    const GroupsSchema = Yup.object().shape({
        groupId: Yup.string().required('Group ID is required'),
    });

    const defaultValues = useMemo(
        () => ({
            groupId: currentGroup?.groupId || '',
        }),
        [currentGroup]
    );

    const methods = useForm({
        resolver: yupResolver(GroupsSchema),
        defaultValues,
    });

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { maxWidth: 720 },
            }}
        >
            <FormProvider methods={methods}>
                <DialogTitle>Quick View</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        This is for viewing purposes only.
                    </Alert>
                    <Card sx={{ p: 3 }}>
                        <RHFTextField name="groupId" disabled label="Group ID" />

                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Users on Group ({currentGroup.UsersOnGroup.length})
                            </Typography>
                            <TableContainer>
                                <Scrollbar>
                                    <Table>
                                        <TableHeadCustom headLabel={TABLE_HEAD} />

                                        <TableBody>
                                            {currentGroup.UsersOnGroup.map((user) => (
                                                <TableRow key={user.user.id}>
                                                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar alt={user.user.name} src={user.user.profileImage} sx={{ mr: 2 }} />
                                                        <ListItemText
                                                            primary={user.user.name}
                                                            primaryTypographyProps={{ typography: 'body2' }}
                                                            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{user.user.roles[0].roleId}</TableCell>
                                                    <TableCell>{user?.rooms ?? ''}</TableCell>
                                                    <TableCell>{user?.extension ?? ''}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Scrollbar>
                            </TableContainer>
                        </Box>
                    </Card>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={onClose}>
                        Back
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog >
    );
}
