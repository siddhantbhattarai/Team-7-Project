// @mui
import Avatar from '@mui/material/Avatar';
import { AvatarGroup } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserGroupRows } from 'src/types/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import GroupQuickView from './group-quick-view';

// ----------------------------------------------------------------------

type Props = {
    selected: boolean;
    onEditRow: VoidFunction;
    onSelectRow: VoidFunction;
    onDeleteRow: VoidFunction;
    row: IUserGroupRows;
};

export default function GroupTableRow({
    row,
    selected,
    onEditRow,
    onSelectRow,
    onDeleteRow,
}: Props) {
    const confirm = useBoolean();
    const popover = usePopover();
    const quickView = useBoolean();

    const users = row?.UsersOnGroup.map((user) => user.user.name).join(', ');
    const userImages = row?.UsersOnGroup.map((user) => user.user.profileImage);

    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell sx={{ width: '90px', pr: 0 }}>
                    <AvatarGroup max={2}>
                        {userImages.map((image, index) => (
                            <Avatar key={index} alt={row?.groupId} src={image} />
                        ))}
                    </AvatarGroup>
                </TableCell>

                <TableCell>
                    <ListItemText
                        primary={row?.groupId}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
                    />
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{users}</TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <Tooltip title="Quick View" placement="top" arrow>
                        <IconButton color={quickView.value ? 'inherit' : 'default'} onClick={quickView.onTrue}>
                            <Iconify icon="carbon:view" />
                        </IconButton>
                    </Tooltip>

                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            {quickView.value && (
                <GroupQuickView currentGroup={row} open={quickView.value} onClose={quickView.onFalse} />
            )}

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
