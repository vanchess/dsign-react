import { useGridApiContext  } from '@mui/x-data-grid';
import makeStyles from '@mui/styles/makeStyles';
import Pagination from '@mui/material/Pagination';

const useStyles = makeStyles((theme) => ({
  pagination: {
    display: 'flex',
  },
}));

export default function CustomPagination() {
  const apiRef = useGridApiContext();
  const state = apiRef.current.state;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.pagination}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}