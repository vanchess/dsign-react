import { 
    GridToolbarContainer, 
    GridToolbarDensitySelector, 
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';


export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}