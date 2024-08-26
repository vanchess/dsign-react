import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

import { useSelector } from 'react-redux';
import { styled } from '@mui/material';

const AvatarStyled = styled(Avatar)`
    background-color: ${blue[100]};
    color: ${blue[600]};
`

function CertDialog(props) {
  const items  = useSelector(store => store.cadespluginReducer.items);
  // const itemsTotal = useSelector(store => store.cadespluginReducer.itemsTotal);
  // const loading = useSelector(store => store.cadespluginReducer.loading);
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  
  // TODO: вынести в reducer
  let user = JSON.parse(localStorage.getItem('user'));
  
  /*
  useEffect( () => {
      props.fetchCert();
  },[]);
  */
  
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" aria-modal="true" open={open}>
      <DialogTitle id="simple-dialog-title">Выберите сертификат</DialogTitle>
      <List>
        {items.map((item) => {
          if(user.snils != item.snils ) {
              return;
          }
          return (<ListItem button onClick={() => handleListItemClick(item)} key={item.thumbprint} alignItems="flex-start">
                <ListItemAvatar>
                  <AvatarStyled><VpnKeyIcon /></AvatarStyled>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={
                    <React.Fragment>
                    
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                      { item.secondaryInfoString }
                      </Typography>
                      { item.secondaryInfoString ? <br /> : null }
                      <Typography
                        component="span"
                        variant="body2"
                      >
                      { item.validityString }
                      </Typography>
                    </React.Fragment>
                 } />
              </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}

CertDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CertDialog;