import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridEditInputCell } from "@mui/x-data-grid";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export default function EditInputCell(props) {
  const { error } = props;

  return (
    <StyledTooltip open={!!error} title={error}>
      <Box>
        <GridEditInputCell {...props} error={!!error} required />
      </Box>
    </StyledTooltip>
  );
}