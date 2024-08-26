import { CircularProgress, styled } from "@mui/material";
import { green } from "@mui/material/colors";

export const CircularProgressStyled = styled(CircularProgress)`
    color: ${green[500]};
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
`