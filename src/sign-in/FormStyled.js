import { styled } from "@mui/material";

export const FormStyled = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
}))