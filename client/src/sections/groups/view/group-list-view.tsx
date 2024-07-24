'use client';

import isEqual from 'lodash/isEqual';
import { useState, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// hooks
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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserGroupRows } from 'src/types/user';
//
import Link from 'next/link';
import { useDebounce } from 'src/hooks/use-debounce';
import { useFetchGroups, useRemoveGroup } from 'src/api/groups';
import GroupTableRow from '../group-table-row';
import GroupTableLoader from '../use-group-loader';
import GroupTableToolbar from '../group-table-toolbar';
import GroupTableFiltersResult from '../group-table-filters-result';
// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

const TABLE_HEAD = [
  { id: 'empty' },
  { id: 'Group ID', label: 'Group ID', align: 'left' },
  { id: 'Group Members', label: 'Group Members', align: 'center' },
  { id: '' },
];

export default function GroupListView() {
  const table = useTable();

  const [tableData, setTableData] = useState<IUserGroupRows[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const debouncedSearch = useDebounce(filters.name, 500);

  const {
    data: groups,
    isLoading,
    isError,
  } = useFetchGroups(
    (table.page + 1).toString(),
    table.rowsPerPage.toString(),
    debouncedSearch,
  );

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const canReset = !isEqual(defaultFilters, filters);

  const deleteGroup = useRemoveGroup();

  const handleFilters = (name: string, value: any) => {
    table.onResetPage();
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteRow = (id: string) => {
    deleteGroup.mutate(id);
  };

  const handleDeleteRows = () => { };

  const handleEditRow = (id: string) => {
    router.push(paths.dashboard.itinerary.groups.edit(id));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  useEffect(() => {
    if (groups) {
      setTableData(groups?.rows);
    }
  }, [groups, table.page, table.rowsPerPage]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Groups"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Groups' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              color="primary"
              onClick={() => router.push(paths.dashboard.itinerary.groups.new)}
            >
              <Link
                style={{ textDecoration: 'none', color: 'inherit' }}
                href={{
                  pathname: paths.dashboard.itinerary.groups.new,
                }}
              >
                New Group
              </Link>
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <GroupTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <GroupTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={groups?.meta?.total || 0}
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
              <Table size={table.dense ? 'small' : 'medium'}>
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
                    tableData.map((row: IUserGroupRows) => (
                      <GroupTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}
                  {tableData.length === 0 && !isLoading && !isError && <TableNoData notFound />}
                  {isLoading && <GroupTableLoader rowsNum={table.rowsPerPage} />}
                  <TableNoData notFound={isError} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={groups?.meta?.total || 0}
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
