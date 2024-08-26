import { Backdrop, css, styled } from "@mui/material";

export const BackdropStyled = styled(Backdrop)(({theme}) => css`
    z-index: ${theme.zIndex.drawer + 1};
    color: #fff;
`)