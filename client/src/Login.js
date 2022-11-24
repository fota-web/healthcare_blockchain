import React, { Component } from 'react';
import {Redirect,Router,Route} from "react-router-dom";
import { createBrowserHistory, createHashHistory } from 'history';
import "./Login.css";
import image from './image/e.png';

import { TailSpin } from  'react-loader-spinner';


class Login extends Component{
    constructor(props) {
        super(props);
        this.state={
            id:"",
            password:"",
            direction_main: 0,
            show_loading: false
        }
    }

    componentDidMount=()=>{ 
        // fetch('./Transaction', {
        //     method: "POST",
        //     body: JSON.stringify({
        //         account_from: 'account0',
        //         account_to: 'account1',
        //         coin: 0
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8'
        //     }
        //   })
        //   .then(res => res.json())
        //   .then(res => {
        //     console.log(res.hash)
        //   })
        //   .catch(err => console.log(err))
    }

    CheckLogin=()=>{    
        fetch('/CheckLogin', {
            method: "POST",
            body: JSON.stringify({
              id: this.state.id,
              password: this.state.password
            }),
            // headers: new Headers({
            //     'Content-Type': 'application/json',
            //     // 'Authorization': token, /* 把token放在這 */
            // })
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then(res => res.text())
            .then(res => {
                console.log(res);
                this.setState({direction_main:res});
            })
            .catch(err => console.log(err))

        this.setState({show_loading:true});
    }

    KeyEnter=(event)=>{
        if (event.keyCode === 13){
            this.CheckLogin();
        }
    }

    //傳入event要取觸發事件的元件
    changeStateId=(event)=>{
        this.setState({id:event.target.value})
    }
    changeStatePassword=(event)=>{
        this.setState({password:event.target.value})
    }

    render(){
        if(this.state.show_loading){
            const history = createBrowserHistory();

            setTimeout(() => {
                if (this.state.direction_main == 0)
                {
                    history.push("/Management_main");
                    window.location.reload();
                }
                else if (this.state.direction_main == 1)
                {
                    history.push("/Dr_main");
                    window.location.reload();
                }
                else if (this.state.direction_main == 2){
                    history.push("/In_main");
                    window.location.reload();
                }
                else if (this.state.direction_main == 3){
                    history.push("/Th_main");
                    window.location.reload();
                }
                else if (this.state.direction_main == 4){
                    history.push("/Co_main");
                    window.location.reload();
                }
                else if (this.state.direction_main == "Management"){
                    history.push("/management_main");
                    window.location.reload();
                }
                else{
                    history.push("/LoginFail");
                    window.location.reload();
                }
            }, 3000);
            
            return(
                <div class="Login">
                <form class="form">
                    <img src={image} alt="Background" width="300"/>
                    <br />
                    
                    <label>
                        <TailSpin
                            height="100"
                            width="100"
                            color='orange'
                            ariaLabel='loading'
                        />
                    </label>
                </form>
                </div>
            );
        }
        else{
            return(
                <div class="Login">
                    <form class="form">
                        <img src={image} alt="Background" width="300"/>
                        <br />
                        <label>
                            <input 
                            type="text"
                            class="form--input"
                            placeholder="帳號" 
                            id="id" 
                            name="id"
                            size="40"
                            onChange={this.changeStateId} />
                        <br />
                        </label>
                        <label>
                            <input 
                            type="password" 
                            class="form--input"
                            placeholder="密碼" 
                            id="password" 
                            name="password" 
                            value={this.state.password} 
                            onKeyDown={this.KeyEnter} 
                            onChange={this.changeStatePassword} />
                        <br />
                        </label>

                        <label>
                            <input type="button" class="form--btn" value="登入" onClickCapture={this.CheckLogin} />
                        </label>
                    </form>
                </div>
            );
        }
    }
}
export default Login;