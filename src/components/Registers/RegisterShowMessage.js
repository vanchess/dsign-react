import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

import withStyles from '@mui/styles/withStyles';

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
        {(this.props.permission && this.props.permission.includes('reject reg')) ?
          (<Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                      <Button 
                        variant="contained"
                        color="primary"
                        startIcon={<ThumbDownAltOutlinedIcon />}
                        onClick={this.handleReject}>Отклонить</Button>
                  </Paper>
                </Grid>
              </Grid>
          </Container>):null
        }
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