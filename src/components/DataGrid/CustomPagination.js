import { gridPageCountSelector, gridPaginationModelSelector, useGridApiContext, useGridSelector  } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';

export default function CustomPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      sx={{display: 'flex'}}
      color="primary"
      count={pageCount}
      page={paginationModel.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}