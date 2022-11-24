import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./CheckAccount.css";

class CheckAccount extends Component{
    constructor(props) {
        super(props);
        this.state={
            user_name: "",
            balance: "",
            permission: 0
        }
    }

    componentDidMount=()=>{
        this.loading();
    }

    async loading() {
        fetch('/LoginState', {
            method: "POST",
            body: JSON.stringify({
            }),
            // headers: new Headers({
            //     'Content-Type': 'application/json',
            //     // 'Authorization': token, /* 把token放在這 */
            // })
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({user_name:res.name});
                this.setState({permission:res.permission});
                
                if (res.flag == 0){
                    const history = createBrowserHistory();
                    history.push("/LoginFail");
                    window.location.reload();
                }
            })
            .catch(err => console.log(err))
        

        fetch('./GetBalance', {
                method: "POST",
                body: JSON.stringify({
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(res => res.json())
            .then(res => {
                if (res.balance == 0){
                    // document.getElementById('account_id').value = "";
                    alert("Account Error !!");
                }
                else{
                    // document.getElementById('account_id').value = "";
                    this.setState({balance:res.balance/1000000000000000000});
                }
            })
            .catch(err => console.log(err))
    }

    //返回
    Back=()=>{
        const history = createBrowserHistory();

        if (this.state.permission == 1)
        {
            history.push("/Dr_main");
            window.location.reload();
        }
        else if (this.state.permission == 2){
            history.push("/In_main");
            window.location.reload();
        }
        else if (this.state.permission == 3){
            history.push("/Th_main");
            window.location.reload();
        }
        else if (this.state.permission == 4){
            history.push("/Co_main");
            window.location.reload();
        }
    }

    render(){            
        return(
            <div>
                <form class="checkaccount_form">
                    <label>
                        <br /><br /><br /><br /><br /><br />
                        <font size="6">餘額</font>
                        <br />
                        <input type="button" class="button_x" value=""/>
                        <br />
                        <font size="6">{this.state.balance} ETH</font>
                        <br /><br /><br />
                        <input class="button_checkaccount_back" type="button" value="返回" onClickCapture={this.Back} />
                        </label>
                </form>
            </div>          
        );
    }
}
export default CheckAccount;