import React from 'react';
import 'typeface-roboto';

import CssBaseline from '@mui/material/CssBaseline';

import { Header } from './components/Header'; 
import { Sidebar } from './components/Sidebar'; 
import { MainListItems, secondaryListItems } from './components/Sidebar/listItems';

import { authService } from './services';
import { styled } from '@mui/material';

const AppBarSpacer = styled('div')(({theme}) => theme.mixins.toolbar);

const MainStyled = styled('main')`
    flex-grow: 1;
    height: '100vh';
    overflow: 'auto';
`

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

    return (  
      <div style={{ display: 'flex' }}>
          <CssBaseline />
          <Header title={this.props.title} open={this.state.open} userName={this.state.userName} handleDrawerOpen={() => this.handleDrawerOpen()} logout={authService.logout} />
          <Sidebar 
            open={this.state.open} 
            handleDrawerClose={() => this.handleDrawerClose()} 
            actions={this.props.actions}
          >
                <MainListItems sidebarMainListItems={this.props.sidebarMainListItems} />
          </Sidebar>
          <MainStyled>
            <AppBarSpacer />
            {this.props.main}
          </MainStyled>
            {this.props.snackbar}
      </div>
    );
  }
}

export default Home;
