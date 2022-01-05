import { 
    GridToolbarContainer, 
    GridToolbarDensitySelector, 
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    getGridNumericColumnOperators
} from '@material-ui/data-grid';


export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
}