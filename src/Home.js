import React from 'react';
// import Button from '@mui/material/Button';
// import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
// import IconButton from '@mui/material/IconButton';
//import SvgIcon from '@mui/material/SvgIcon';
import 'typeface-roboto';

import CssBaseline from '@mui/material/CssBaseline';

import { Header } from './components/Header'; 
import { Sidebar } from './components/Sidebar'; 
import { MainListItems, secondaryListItems } from './components/Sidebar/listItems';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import withStyles from '@mui/styles/withStyles';

import { authService } from './services';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
})

class Home extends React.Component {
  constructor(props) {
      super(props);
      
      // TODO: вынести в reducer
      let user = JSON.parse(localStorage.getItem('user'));
      
      this.state ={open: true, userName: user.name}
      
      this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
      this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }
  
  componentDidMount(){
      document.title = `DSign App - ${this.props.title}`;
  }
  
  componentDidUpdate(prevProps, prevState) {
      if (prevProps.title !== this.props.title) {
        document.title = `DSign App - ${this.props.title}`;
      }
    }
  
  handleDrawerOpen(){
      this.setState({open: true});
  }
  
  handleDrawerClose(){
      this.setState({open: false});
  }
  

  
  render(){
    const { classes } = this.props;

    return (  
      <div className={classes.root}>
          <CssBaseline />
          <Header title={this.props.title} open={this.state.open} userName={this.state.userName} handleDrawerOpen={() => this.handleDrawerOpen()} logout={authService.logout} />
          <Sidebar 
            open={this.state.open} 
            handleDrawerClose={() => this.handleDrawerClose()} 
            actions={this.props.actions}
          >
                <MainListItems sidebarMainListItems={this.props.sidebarMainListItems} />
          </Sidebar>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {this.props.main}
          </main>
            {this.props.snackbar}
      </div>
    );
  }
}

export default withStyles(styles)(Home);
