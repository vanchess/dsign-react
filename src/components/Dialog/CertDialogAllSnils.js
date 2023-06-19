import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
//import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

import { connect } from 'react-redux';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function CertDialog(props) {
  const classes = useStyles();
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
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Выберите сертификат</DialogTitle>
      <List>
        {props.items.map((item) => {
          return (<ListItem button onClick={() => handleListItemClick(item)} key={item.thumbprint} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <VpnKeyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={
                    <React.Fragment>
                    
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
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

const mapStateToProps = function(store) {
  return {
      items: store.cadespluginReducer.items, 
      itemsTotal: store.cadespluginReducer.itemsTotal,
      loading: store.cadespluginReducer.loading,
    };
}
const mapDispatchToProps = dispatch => {
  return {  
    
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(CertDialog);