import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function EditToolbar(props) {
    const { addRow } = props;
  
    const handleClick = addRow;
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Добавить запись
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarExport
            csvOptions={{
            delimiter: ';',
            utf8WithBom: true,
            }}
            slotProps={{
            button: { variant: 'outlined' },
            }}
        />
      </GridToolbarContainer>
    );
  }