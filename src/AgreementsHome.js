import React from 'react';
import { connect } from 'react-redux';
import MailIcon from '@mui/icons-material/Mail';

import AgreementsRoutes from './routes/AgreementsRoutes';
import Home from './Home';

class RegistersHome extends React.Component {
  
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
        if (this.props.permission.includes('send agreement-fin')) {
            actions.push({'key':1, 'title':'Новое соглашение','tooltip':'Загрузить соглашение для подписания','to':`${path}msg/agreement-fin/new`});
        }
        if (this.props.permission.includes('send agreement-fin-salaries')) {
            actions.push({'key':2, 'title':'О финансировании ЗП','tooltip':'Загрузить соглашение о софинансировании заработной платы медицинских работников','to':`${path}msg/agreement-fin-salaries/new`});
        }
        if (this.props.permission.includes('send contract-payment-oms')) {
            actions.push({'key':3, 'title':'На оплату МП по ОМС','tooltip':'Загрузить договор на оказание и оплату медицинской помощи по ОМС','to':`${path}msg/contract-payment-oms/new`});
        }
        if (this.props.permission.includes('send contract-financial-support-oms')) {
            actions.push({'key':4, 'title':'О фин.обеспечении','tooltip':'Загрузить договор о финансовом обеспечении ОМС','to':`${path}msg/contract-financial-support-oms/new`});
        }

        sidebarMainListItems.push({'key':5, 'title':'Соглашения',    'to':`${path}list/agreement-fin`,   'tooltip':'Соглашения о финансовом обеспечении мероприятий по организации дополнительного профессионального образования медицинских работников по программам повышения квалификации, а также по приобретению и проведению ремонта медицинского оборудования', 'icon': <MailIcon />});
        sidebarMainListItems.push({'key':6, 'title':'Соглашения о софинансировании ЗП',    'to':`${path}list/agreement-fin-salaries`,   'tooltip':'Соглашения о софинансировании заработной платы медицинских работников', 'icon': <MailIcon />});
        sidebarMainListItems.push({'key':7, 'title':'Договоры оплаты МП по ОМС',    'to':`${path}list/contract-payment-oms`,   'tooltip':'Договоры на оказание и оплату медицинской помощи по ОМС', 'icon': <MailIcon />});
        sidebarMainListItems.push({'key':8, 'title':'Договоры о фин.обеспечении ОМС',    'to':`${path}list/contract-financial-support-oms`,   'tooltip':'Договоры о финансовом обеспечении ОМС', 'icon': <MailIcon />});        
    }

    
    return (  
      <Home 
          path={path}
          title={this.state.title}
          main={<AgreementsRoutes handleSetTitle={(title) => this.handleSetTitle(title)}/>}
          sidebarMainListItems={sidebarMainListItems}
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

export default connect(mapStateToProps,mapDispatchToProps)(RegistersHome);
