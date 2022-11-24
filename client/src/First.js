import React, { Component } from 'react';
import App from "./App";
import Login from "./Login";
import LoginFail from "./LoginFail";
import management_main from "./management_main";
import Dr_main from "./Dr_main";
import In_main from "./In_main";
import Th_main from "./Th_main";
import Co_main from "./Co_main";
import user_request from "./user_request";
import ShowAccounts from "./ShowAccounts";
import Transfer from "./Transfer";
import CheckAccount from './CheckAccount';
import System from './System';
import System_apply from './System_apply';
import System_Napply from './System_Napply';
import System_Management from './System_Management';
import test from './test';

import {BrowserRouter , Route, Switch , withRouter} from "react-router-dom";
import { CSSTransition,TransitionGroup } from 'react-transition-group';
import "./test.css";


class First extends Component {

  render() {

    const Routes = withRouter(({location}) => (
      <TransitionGroup>
        <CSSTransition
          timeout={5000}
          classNames={'fade'}
          key={location.key}
        >
          <Switch location={location}>
            <Route path="/App" component={App}/>
            <Route exact path="/" component={Login}/>
            <Route path="/LoginFail" component={LoginFail}/>
            <Route path="/management_main" component={management_main}/>
            <Route path="/Dr_main" component={Dr_main}/>
            <Route path="/In_main" component={In_main}/>
            <Route path="/Th_main" component={Th_main}/>
            <Route path="/Co_main" component={Co_main}/>
            <Route path="/user_request" component={user_request}/>
            <Route path="/ShowAccounts" component={ShowAccounts}/>
            <Route path="/Transfer" component={Transfer}/>
            <Route path="/CheckAccount" component={CheckAccount}/>
            <Route path="/System" component={System}/>
            <Route path="/System_apply" component={System_apply}/>
            <Route path="/System_Napply" component={System_Napply}/>
            <Route path="/System_Management" component={System_Management}/>
            <Route path="/test" component={test}/>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    ));


    return (
      <div className="Route">
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </div>
    );
  }
}

export default First;