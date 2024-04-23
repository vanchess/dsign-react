import { gridPageCountSelector, gridPaginationModelSelector, useGridApiContext, useGridSelector  } from '@mui/x-data-grid';
import makeStyles from '@mui/styles/makeStyles';
import Pagination from '@mui/material/Pagination';

const useStyles = makeStyles((theme) => ({
  pagination: {
    display: 'flex',
  },
}));

export default function CustomPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const classes = useStyles();

  return (
    <Pagination
      className={classes.pagination}
      color="primary"
      count={pageCount}
      page={paginationModel.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}