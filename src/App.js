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
import PD from './pd/PD.js'
import AdminHome from './AdminHome';
import DispListHome from './DispListHome.js'
import Eissoi from './eissoi/Eissoi'
import DnHome from './DnHome.js';
import SmoFinHome from './SmoFinHome.js';
import FramePage from './FramePage.js';

export default function App(props) {
  return (
    <div className="App">
        <Switch>
          <PrivateRoute path='/mail'       component={MailHome}/>
          <PrivateRoute path='/bills'      component={BillsHome}/>
          <PrivateRoute path='/expertise'  component={ExpertiseHome}/>
          <PrivateRoute path='/registers'  component={RegistersHome}/>
          <PrivateRoute path='/agreements' component={AgreementsHome}/>
          <PrivateRoute path='/admin'      component={AdminHome}/>
          <PrivateRoute path='/displist'   component={DispListHome}/>
          <PrivateRoute path='/dn'         component={DnHome}/>
          <PrivateRoute path='/smo-fin'    component={SmoFinHome}/>
          <PrivateRoute path='/f1'    component={FramePage}/>
          <Route exact path='/sign-up/:invite' component={SignUp}/>
          <Route exact path='/eissoi' component={Eissoi}/>
          <Route exact path='/pd/:invite' component={PD}/>
          <Route exact path='/login' component={Login}/>
          <PrivateRoute component={StartPage}/>
        </Switch>
    </div>
  )
}