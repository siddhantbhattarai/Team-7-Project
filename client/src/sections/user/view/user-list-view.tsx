'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';

import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import { useFetchUsers, useRemoveUser } from 'src/api/users';
import { useDebounce } from 'src/hooks/use-debounce';
import Link from 'next/link';
import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';
import UserTableLoader from '../use-user-loader';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'empty' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phoneNumber', label: 'Phone Number', align: 'left' },
  { id: 'dob', label: 'Date of Birth', align: 'left' },
  { id: 'gender', label: 'Gender', align: 'left' },
  { id: '' },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  role: [],
  status: 'all',
};

export default function StudentListView({ userList, heading }: any) {
  const table = useTable();

  const searchParams = useSearchParams();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const debouncedSearch = useDebounce(filters.name, 500);

  const {
    data: users,
    isLoading,
    isError,
  } = useFetchUsers(
    (table.page + 1).toString(),
    table.rowsPerPage.toString(),
    debouncedSearch,
    userList
  );

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const canReset = !isEqual(defaultFilters, filters);

  const deleteUser = useRemoveUser();

  const handleFilters = (name: string, value: IUserTableFilterValue) => {
    table.onResetPage();
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteRow = (id: string) => {
    deleteUser.mutate(id);
  };

  const handleDeleteRows = () => {};

  const handleEditRow = (id: string) => {
    router.push(paths.dashboard.user.edit(id));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  useEffect(() => {
    if (users) {
      setTableData(users?.rows);
    }
  }, [users, table.page, table.rowsPerPage]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={heading}
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: heading }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="primary"
              onClick={() => {
                router.push(
                  `${paths.dashboard.user.new}?${createQueryString('role', userList || '')}`
                );
              }}
            >
              <Link
                style={{ textDecoration: 'none', color: 'inherit' }}
                href={{
                  pathname: paths.dashboard.user.new,
                  query: { role: userList || '' },
                }}
              >
                New User
              </Link>
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          {/* {users && (
            <Tabs
              value={filters.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'active' && 'success') ||
                        (tab.value === 'pending' && 'warning') ||
                        (tab.value === 'blocked' && 'error') ||
                        'default'
                      }
                    >
                      {tab.value === 'all' && users?.rows.length}
                      {tab.value === 'active' &&
                        users?.rows?.filter((user: any) => user.status === 'ACTIVE').length}

                      {tab.value === 'pending' &&
                        users?.rows?.filter((user: any) => user.status === 'PENDING').length}
                      {tab.value === 'blocked' &&
                        users?.rows?.filter((user: any) => user.status === 'BLOCKED').length}
                      {tab.value === 'inactive' &&
                        users?.rows?.filter((user: any) => user.status === 'INACTIVE').length}
                    </Label>
                  }
                />
              ))}
            </Tabs>
          )} */}

          <UserTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={users?.meta?.total || 0}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row: any) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  // order={table.order}
                  // orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={tableData.length}
                  // numSelected={table.selected.length}
                  // onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     tableData.map((row: any) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {!isLoading &&
                    !isError &&
                    tableData.map((row: any) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  {tableData.length === 0 && !isLoading && !isError && <TableNoData notFound />}
                  {isLoading && <UserTableLoader rowsNum={table.rowsPerPage} />}
                  <TableNoData notFound={isError} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={users?.meta?.total || 0}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
