import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';

import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import ShowMessage from '../Message/ShowMessage';

import { messageService } from '../../services';

const styles = theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    //flexDirection: 'column',
  },
})


class RegisterShowMessage extends React.Component {

    constructor(props){
      super(props);
      
      this.handleReject = this.handleReject.bind(this);
    }
    
    componentDidMount(){
        
    }
    
    componentDidUpdate(prevProps, prevState) {
      
    }

    handleReject = () => {
        let msgId = this.props.match.params.id;
        messageService.setStatus(msgId, 'rejected').then(
            () => { 
                this.props.history.push('/bills/msg/in') 
            },
            (err) => { 
                alert(err);
            } 
        );
    }
  
  
  render() {
      const { classes } = this.props;
      //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

      return (
        <div>
          <ShowMessage setTitle={this.props.setTitle} />
        </div>
      );
  }
}

const mapStateToProps = function(store) {
  console.log(store);
  return {
        permission: store.authReducer.user.permissions,
    };
}
const mapDispatchToProps = dispatch => {
  return {
    /*
    fetchMyFiles: (page, perPage) => {
        dispatch(myFileFetch(page, perPage));
    },*/
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(withStyles(styles)(RegisterShowMessage)));