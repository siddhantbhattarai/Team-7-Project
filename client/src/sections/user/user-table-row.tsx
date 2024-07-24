// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUserItem } from 'src/types/user';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import moment from 'moment';
import UserQuickEditForm from './user-quick-edit-form';
// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IUserItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell sx={{ width: '72px', pr: 0 }}>
          <Avatar alt={row?.name} src={row?.profileImage} />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row?.name}
            secondary={row?.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.phoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(row?.dob).format('MMMM Do, YYYY')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.gender}</TableCell>

        {/* 
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={row?.professional?.passportNumber}
            secondary={moment(row?.professional?.passportExpire).format('LLL')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell> */}

        {/* <TableCell align="center">
          <Label
            variant="soft"
            color={
              (row?.status.toLocaleLowerCase() === 'active' && 'success') ||
              (row?.status.toLocaleLowerCase() === 'pending' && 'warning') ||
              (row?.status.toLocaleLowerCase() === 'inactive' && 'secondary') ||
              (row?.status.toLocaleLowerCase() === 'blocked' && 'error') ||
              'default'
            }
          >
            {row?.status.toLocaleLowerCase()}
          </Label>
        </TableCell> */}

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick View" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="carbon:view" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {quickEdit.value && (
        <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />
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
