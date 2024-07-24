// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
// types
import { IUserOnGroup } from 'src/types/user';


// ----------------------------------------------------------------------

type Props = {
  userGroup: IUserOnGroup;
};

export default function UserCard({ userGroup }: Props) {
  const { user } = userGroup;

  const { name, address, phone, profileImage, status, roles } = user;

  const roleName = roles.map((role) => role.roleId);

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box>
        <Avatar
          alt={name}
          src={profileImage}
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            my: 2,
          }}
        />
      </Box>

      <ListItemText
        sx={{ my: 2 }}
        primary={name}
        secondary={status}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
        {roleName.map((role) => (
          <Label
            key={role}
            variant='soft'
            color={
              (role === 'CLIENT' && 'success') ||
              (role === 'GUIDES' && 'warning') ||
              (role === 'LEADER' && 'error') ||
              'default'
            }
          >
            {role}
          </Label>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        sx={{ py: 3, px: 2, typography: 'subtitle1' }}
      >
        <div>
          <Typography variant="subtitle1" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Phone Number
          </Typography>

          {phone}
        </div>

        <div>
          <Typography variant="subtitle1" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Address
          </Typography>
          {address.city}, {address.state}, {address.country}
        </div>
      </Box>
    </Card>
  );
}
