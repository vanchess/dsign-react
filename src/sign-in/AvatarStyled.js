import { Avatar, styled } from "@mui/material";

export const AvatarStyled = styled(Avatar)(({theme}) => ({
    margin: theme.spacing(1),
    width: theme.spacing(7),
    height: theme.spacing(7),
}))