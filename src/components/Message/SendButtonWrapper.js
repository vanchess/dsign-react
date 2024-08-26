import { styled } from "@mui/material";

const SendButtonDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const SendButtonWrapperDiv = styled('div')(({theme}) => ({
  margin: theme.spacing(1),
  position: 'relative',
}));

export const SendButtonWrapper = ({children, ...props}) => {
  return (
    <SendButtonDiv><SendButtonWrapperDiv {...props}>{children}</SendButtonWrapperDiv></SendButtonDiv>
  );
}