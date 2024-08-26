import { Container, css, styled } from "@mui/material";

export const ContainerStyled = styled(Container)(({theme}) => css`
    padding-top: ${theme.spacing(4)};
    padding-bottom: ${theme.spacing(4)};
`)