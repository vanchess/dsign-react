import { Box } from '@mui/material';
import { 
    GridToolbarContainer, 
    GridToolbarDensitySelector, 
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
} from '@mui/x-data-grid';


export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport
        csvOptions={{
          delimiter: ';',
          utf8WithBom: true,
        }}
        /*
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
        */
      />
    </GridToolbarContainer>
  );
}