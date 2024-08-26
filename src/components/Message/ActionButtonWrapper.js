import { styled } from "@mui/material";

const ActionButtonDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const ActionButtonWrapperDiv = styled('div')(({theme}) => ({
  // margin: theme.spacing(1),
  position: 'relative',
}));

export const ActionButtonWrapper = ({children, ...props}) => {
  return (
    <ActionButtonDiv><ActionButtonWrapperDiv {...props} >{children}</ActionButtonWrapperDiv></ActionButtonDiv>
  );
}