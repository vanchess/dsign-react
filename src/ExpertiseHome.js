import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MailIcon from '@mui/icons-material/Mail';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

import ExpertiseRoutes  from './routes/ExpertiseRoutes';
import Home from './Home';

class ExpertiseHome extends React.Component {
  constructor(props) {
      super(props);
      
      this.state ={title: 'Экспертиза', snackbarOpen: true}
      
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
    if (this.props.permission) {
        if(this.props.permission.includes('send mek')){
            actions.push({'key':1, 'title':'Отправка актов МЭК', 'tooltip':'Создать новое сообщение для актов МЭК', 'to':`${path}msg/mek/new`});
        }
        if(this.props.permission.includes('send mee')){
            actions.push({'key':2, 'title':'Отправка актов МЭЭ', 'tooltip':'Создать новое сообщение для актов МЭЭ', 'to':`${path}msg/mee/new`});
        }
        if(this.props.permission.includes('send rmee')){
            actions.push({'key':3, 'title':'Отправка МЭЭ (Р/Э)', 'tooltip':'Создать новое сообщение для актов повторной МЭЭ(Р/Э)', 'to':`${path}msg/rmee/new`});
        }
    }
    let sidebarMainListItems = [
        {'key':1, 'title':'МЭК', 'to':`${path}list/mek`, 'tooltip':'Акты МЭК', 'icon': <MailIcon />},
        {'key':2, 'title':'МЭЭ', 'to':`${path}list/mee`, 'tooltip':'Акты МЭЭ', 'icon': <MailIcon />},
        {'key':3, 'title':'Повторная МЭЭ (Р/Э)', 'to':`${path}list/rmee`, 'tooltip':'Акты повторной МЭЭ(Р/Э)', 'icon': <MailIcon />},
    ];
    
    return (  
      <Home 
          title={this.state.title}
          main={<ExpertiseRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
          snackbar={null}
          actions={actions}
      />
    );
  }
}


const mapStateToProps = function(store) {
  // console.log(store);
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

export default connect(mapStateToProps,mapDispatchToProps)(ExpertiseHome);
