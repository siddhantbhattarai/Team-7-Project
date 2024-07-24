import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';
// types
import { ISingleGroup, IUserOnGroup } from 'src/types/user';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import MenuItem from '@mui/material/MenuItem';
import { useCreateGroup, useUpdateGroup } from 'src/api/groups';
import { useSearchUsers } from 'src/api/users';
import { useSnackbar } from 'notistack';
import UserCard from '../user/user-card';
import ClientRow from './client-row';

// ----------------------------------------------------------------------

type Props = {
  currentGroup?: ISingleGroup;
};

const TABLE_HEAD = [
  { id: 'empty' },
  { id: 'name', label: 'Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'passport', label: 'Passport' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'extension', label: 'Extension' },
  { id: '' },
];

export default function GroupNewEditForm({ currentGroup }: Props) {
  const [selectedClient, setSelectedClient] = useState<IUserOnGroup[]>([]);
  const [searchClient, setSearchClient] = useState<string>('');

  const [selectedLeader, setSelectedLeader] = useState<IUserOnGroup | null>(null);
  const [searchLeader, setSearchLeader] = useState<string>('');

  const [selectedGuide, setSelectedGuide] = useState<IUserOnGroup[]>([]);
  const [searchGuide, setSearchGuide] = useState<string>('');

  const [selectedAsstGuide, setSelectedAsstGuide] = useState<IUserOnGroup[]>([]);
  const [searchAsstGuide, setSearchAsstGuide] = useState<string>('');

  const { data: users } = useSearchUsers('');

  const { enqueueSnackbar } = useSnackbar();

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

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const createGroup = useCreateGroup(setError, reset);
  const updateGroup = useUpdateGroup(setError, reset);

  useEffect(() => {
    if (currentGroup) {
      const leaders = currentGroup.UsersOnGroup.filter(
        (item) => item.user.roles[0].roleId === 'LEADER'
      );
      const guides = currentGroup.UsersOnGroup.filter(
        (item) => item.user.roles[0].roleId === 'GUIDE'
      );
      const clients = currentGroup.UsersOnGroup.filter(
        (item) => item.user.roles[0].roleId === 'CLIENT'
      );
      const asst_guides = currentGroup.UsersOnGroup.filter(
        (item) => item.user.roles[0].roleId === 'ASST_GUIDE'
      );
      setSelectedClient(clients);
      setSelectedLeader(leaders[0]);
      setSelectedGuide(guides);
      setSelectedAsstGuide(asst_guides);

      reset(defaultValues);
    }
  }, [currentGroup, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (selectedLeader === null) {
        enqueueSnackbar('Please select one leader', { variant: 'error' });
        return;
      }

      if (selectedGuide.length === 0) {
        enqueueSnackbar('Please select at least one guide', { variant: 'error' });
        return;
      }

      if (selectedClient.length === 0) {
        enqueueSnackbar('Please select at least one client', { variant: 'error' });
        return;
      }

      const selectedUser = [
        ...selectedClient,
        ...selectedGuide,
        ...selectedAsstGuide,
        selectedLeader,
      ];

      if (selectedUser.length === 0) {
        enqueueSnackbar('Please select at least one user', { variant: 'error' });
        return;
      }

      const payload = {
        ...data,
        clients: selectedUser.map((item) => ({
          clientId: item.user.id,
          rooms: item.rooms,
          extension: item.extension,
        })),
      };

      if (!currentGroup) {
        createGroup.mutate({ ...payload });
      } else {
        updateGroup.mutate({
          groups: { ...payload },
          id: currentGroup.id as string,
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const options: IUserOnGroup[] = users
    ? users.map((item) => ({
        user: item,
        extension: '',
        rooms: '',
      }))
    : [];

  const leaders = options.filter((item) => item.user.roles[0].roleId === 'LEADER');
  const guides = options.filter((item) => item.user.roles[0].roleId === 'GUIDE');
  const asst_guides = options.filter((item) => item.user.roles[0].roleId === 'ASST_GUIDE');
  const clients = options.filter((item) => item.user.roles[0].roleId === 'CLIENT');

  const handleClientRemove = (index: number) => {
    setSelectedClient((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClientEdit = (index: number, rooms: string, extension: string) => {
    const newClient = [...selectedClient];

    newClient[index] = {
      ...newClient[index],
      rooms,
      extension,
    };

    setSelectedClient(newClient);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <RHFTextField name="groupId" label="Group ID" />

        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: '1fr 2fr',
          }}
        >
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Leader:
            </Typography>
            <Autocomplete
              fullWidth
              options={leaders}
              value={selectedLeader}
              onChange={(event, newValue) => {
                setSelectedLeader(newValue);
              }}
              getOptionLabel={(option: IUserOnGroup) => option.user.name}
              inputValue={searchLeader}
              onInputChange={(event, newInputValue) => {
                setSearchLeader(newInputValue);
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof value === 'string') {
                  value = JSON.parse(value);
                }
                return option.user.id === value.user.id;
              }}
              renderInput={(params) => <TextField placeholder="Search Leader..." {...params} />}
              loadingText="Loading..."
              loading={users === undefined}
              noOptionsText="No Leaders found"
              renderOption={(props, option) => (
                <MenuItem {...props} key={option.user.id}>
                  <Avatar
                    key={option.user.id}
                    src={option.user.profileImage}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  {option.user.name} ({option.user.roles[0].roleId})
                </MenuItem>
              )}
            />

            <Box
              sx={{
                py: 3,
              }}
            >
              {selectedLeader !== null && (
                <UserCard key={selectedLeader.user.id} userGroup={selectedLeader} />
              )}
            </Box>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Guides:
            </Typography>
            <Autocomplete
              fullWidth
              multiple
              options={guides}
              value={selectedGuide}
              onChange={(event, newValue) => {
                setSelectedGuide(newValue);
              }}
              disableCloseOnSelect
              getOptionLabel={(option: IUserOnGroup) => option.user.name}
              inputValue={searchGuide}
              onInputChange={(event, newInputValue) => {
                setSearchGuide(newInputValue);
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof value === 'string') {
                  value = JSON.parse(value);
                }
                return option.user.id === value.user.id;
              }}
              renderInput={(params) => <TextField placeholder="Search Guides..." {...params} />}
              loadingText="Loading..."
              loading={users === undefined}
              noOptionsText="No users found"
              renderOption={(props, option) => (
                <MenuItem {...props} key={option.user.id}>
                  <Avatar
                    key={option.user.id}
                    src={option.user.profileImage}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  {option.user.name} ({option.user.roles[0].roleId})
                </MenuItem>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.user.id}
                    label={option.user.name}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
              sx={{
                py: 3,
              }}
            >
              {selectedGuide.map((item, index) => (
                <UserCard key={item.user.id} userGroup={item} />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Assistant Guides:
          </Typography>
          <Autocomplete
            fullWidth
            multiple
            options={asst_guides}
            value={selectedAsstGuide}
            onChange={(event, newValue) => {
              setSelectedAsstGuide(newValue);
            }}
            disableCloseOnSelect
            getOptionLabel={(option: IUserOnGroup) => option.user.name}
            inputValue={searchAsstGuide}
            onInputChange={(event, newInputValue) => {
              setSearchAsstGuide(newInputValue);
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof value === 'string') {
                value = JSON.parse(value);
              }
              return option.user.id === value.user.id;
            }}
            renderInput={(params) => (
              <TextField placeholder="Search Assistant Guides..." {...params} />
            )}
            loadingText="Loading..."
            loading={users === undefined}
            noOptionsText="No users found"
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.user.id}>
                <Avatar
                  key={option.user.id}
                  src={option.user.profileImage}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                {option.user.name} ({option.user.roles[0].roleId})
              </MenuItem>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.user.id}
                  label={option.user.name}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />

          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
            sx={{
              py: 3,
            }}
          >
            {selectedAsstGuide.map((item, index) => (
              <UserCard key={item.user.id} userGroup={item} />
            ))}
          </Box>
        </Box>

        <Box sx={{ my: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Clients:
          </Typography>
          <Autocomplete
            fullWidth
            multiple
            options={clients}
            value={selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
            }}
            disableCloseOnSelect
            getOptionLabel={(option: IUserOnGroup) => option.user.name}
            inputValue={searchClient}
            onInputChange={(event, newInputValue) => {
              setSearchClient(newInputValue);
            }}
            isOptionEqualToValue={(option, value) => {
              if (typeof value === 'string') {
                value = JSON.parse(value);
              }
              return option.user.id === value.user.id;
            }}
            renderInput={(params) => <TextField placeholder="Search Clients..." {...params} />}
            loadingText="Loading..."
            loading={users === undefined}
            noOptionsText="No users found"
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.user.id}>
                <Avatar
                  key={option.user.id}
                  src={option.user.profileImage}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                {option.user.name} ({option.user.roles[0].roleId})
              </MenuItem>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.user.id}
                  label={option.user.name}
                  size="small"
                  color="info"
                  variant="soft"
                  sx={{
                    display: 'none',
                  }}
                />
              ))
            }
          />

          <TableContainer sx={{ my: 4 }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {selectedClient.map((client, index) => (
                    <ClientRow
                      key={index}
                      client={client}
                      onEdit={(rooms, extension) => handleClientEdit(index, rooms, extension)}
                      onDelete={() => handleClientRemove(index)}
                    />
                  ))}
                  {selectedClient.length === 0 && (
                    <TableNoData notFound title="Insert some Clients" />
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
            {!currentGroup ? 'Create Group' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
