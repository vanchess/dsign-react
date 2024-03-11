import React from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import withStyles from '@mui/styles/withStyles';
import { Header } from './components/FrameHeader'; 
import { authService } from './services';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
  },
})

class FramePage extends React.Component {
  
    constructor(props) {
      super(props);
    }
    render(){
        const { classes } = this.props;
        if(this.props.permission) {
          if (this.props.permission.includes('monitor reg')) {
                    return (
                      <div className={classes.root}>
                          <CssBaseline />
                          <Header title={'Мониторинг. 1 этап (основные реестры)'} open={false} userName={''} handleDrawerOpen={() => {}} logout={authService.logout}  />
                          <main className={classes.content}>
                              <div className={classes.appBarSpacer} />
                              
                                      <div className={classes.content}>
                                          <iframe src="http://192.168.12.18:4567/stage1" width="100%" height="100%">
                                            Ваш браузер не поддерживает плавающие фреймы!
                                          </iframe>
                                      </div>
                                
                          </main>
                      </div>
                    );
          }
        }
        return (<div className={classes.root}>
                          <CssBaseline />
                          <Header title={'Доступ запрещен'} open={false} userName={''} handleDrawerOpen={() => {}} logout={authService.logout} />
                </div>);
    }
}

const mapStateToProps = function(store) {
  return {
        permission: store.authReducer.user.permissions,
    };
}
const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(FramePage));