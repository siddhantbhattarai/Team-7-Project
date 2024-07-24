import { Skeleton, TableCell, TableRow } from '@mui/material';

const GroupTableLoader = ({ rowsNum }: any) =>
  [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      <TableCell align="center">
        <Skeleton variant="circular" width={50} height={50} />
      </TableCell>
      <TableCell align="center">
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" width="100%" />
      </TableCell>
    </TableRow>
  ));

export default GroupTableLoader;
