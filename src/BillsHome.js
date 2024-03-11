import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MailIcon from '@mui/icons-material/Mail';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import BillsRoutes from './routes/BillsRoutes';
import Home from './Home';

class BillsHome extends React.Component {
  
  constructor(props) {
      super(props);
      
      this.state ={title: 'Счета', snackbarOpen: true}
      
      this.handleClose = this.handleClose.bind(this);
      this.handleSetTitle = this.handleSetTitle.bind(this);
  }
  
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({snackbarOpen: false});
  };
  
  handleSetTitle(t){
      this.setState({title: t});
  }
  
  render(){
    let path = this.props.match.path;    
    if( !path.endsWith('/') ) {
          path += '/';
    }
    
    let actions = [];
    
    let sidebarMainListItems = [];
    
    if(this.props.permission) {
        if (this.props.permission.includes('send bill')) {
            actions.push({'key':1, 'title':'Отправить счета','tooltip':'Создать новое сообщение для отправки счетов','to':`${path}msg/bill/new`});
        }
        if (this.props.permission.includes('send reconciliation-act')) {
            actions.push({'key':2, 'title':'Акты сверки','tooltip':'Создать новое сообщение для отправки актов сверки','to':`${path}msg/reconciliation-act/new`});
        }
        
        //sidebarMainListItems.push({'key':1, 'title':'Счета',          'to':`${path}msg/in`, 'tooltip':'Счета', 'icon': <MailIcon />});
        sidebarMainListItems.push({'key':2, 'title':'Счета',       'to':`${path}list/bill`,   'tooltip':'Счета', 'icon': <MailIcon />});
        //sidebarMainListItems.push({'key':3, 'title':'Акты сверки',    'to':`${path}msg/reconciliation-act`, 'tooltip':'Акты сверки', 'icon': <PlaylistAddCheckIcon />});
        sidebarMainListItems.push({'key':4, 'title':'Акты сверки', 'to':`${path}list/reconciliation-act`, 'tooltip':'Акты сверки', 'icon': <PlaylistAddCheckIcon />});
        sidebarMainListItems.push({'key':5, 'title':'Отклонено',      'to':`${path}msg/in/rejected`, 'tooltip':'Отклоненные счета', 'icon': <ThumbDownAltOutlinedIcon />});
        
    }

    
    return (  
      <Home 
          path={path}
          title={this.state.title}
          main={<BillsRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
          snackbar={null}
          actions={actions}
      />
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

export default connect(mapStateToProps,mapDispatchToProps)(BillsHome);
