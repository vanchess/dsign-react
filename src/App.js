import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './_components';
import MailHome from './MailHome.js'
import BillsHome from './BillsHome.js'
import ExpertiseHome from './ExpertiseHome.js'
import RegistersHome from './RegistersHome.js'
import AgreementsHome from './AgreementsHome.js'
import StartPage from './StartPage.js'
import Login from './Login.js'
import SignUp from './sign-in/SignUp.js'
import FramePage from './FramePage.js'
import FramePage2 from './FramePage2.js'
import PD from './pd/PD.js'
import AdminHome from './AdminHome';
import Eissoi from './eissoi/Eissoi'

class App extends React.Component {
    constructor(props){
        super(props);

    }
    
    
    render(){
      return (
        <div className="App">
            <Switch>
              <PrivateRoute path='/mail'       component={MailHome}/>
              <PrivateRoute path='/bills'      component={BillsHome}/>
              <PrivateRoute path='/expertise'  component={ExpertiseHome}/>
              <PrivateRoute path='/registers'  component={RegistersHome}/>
              <PrivateRoute path='/agreements' component={AgreementsHome}/>
              <PrivateRoute path='/admin'      component={AdminHome}/>
              <Route exact path='/sign-up/:invite' component={SignUp}/>
              <PrivateRoute path='/f1' component={FramePage}/>
              <PrivateRoute path='/f2' component={FramePage2}/>
              <Route exact path='/eissoi' component={Eissoi}/>
              <Route exact path='/pd/:invite' component={PD}/>
              <Route exact path='/login' component={Login}/>
              <PrivateRoute component={StartPage}/>
            </Switch>
        </div>
      );
    }
}

export default App;
