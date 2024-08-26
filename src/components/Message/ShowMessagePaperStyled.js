import { css, Paper, styled } from "@mui/material";

export const ShowMessagePaperStyled = styled(Paper)(({theme}) => css`
  padding: ${theme.spacing(2)};
  display: flex;
  overflow: auto;
`)