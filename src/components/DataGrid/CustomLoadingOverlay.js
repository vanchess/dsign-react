import { GridOverlay } from '@material-ui/data-grid';
import LinearProgress from '@mui/material/LinearProgress';

export default function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}