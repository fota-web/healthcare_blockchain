import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./System_apply.css";

class System_apply extends Component{
  constructor(props) {
    super(props);
    this.apply_account = this.apply_account.bind(this);
    this.send_apply = this.send_apply.bind(this);
    this.state = {
      ch1: "",
      user_account: "",
      permission: 0,
      account_name_list: [],
      ch2: ""
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
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
          this.setState({user_account:res.account});
          this.setState({ch1:res.name});
          this.setState({permission:res.permission});
          
          if (res == ""){
              const history = createBrowserHistory();
              history.push("/LoginFail");
              window.location.reload();
          }
      })
      .catch(err => console.log(err))

      fetch('/Get_Information', {
        method: "POST",
        body: JSON.stringify({
          getname: 1
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
            this.setState({account_name_list:res.name});
        })
        .catch(err => console.log(err))
  }

  apply_account(event) {
    // console.log(event.target.value)
    if (this.state.ch2 == event.target.value)
      this.setState({ch2:""});
    else
      this.setState({ch2:event.target.value});
  }

  send_apply(event) {
    if (this.state.ch1 == "" || this.state.ch2 == ""){
      alert("請選取申請人資料！！！");
    }
    else{
      fetch('/Apply_State', {
        method: "POST",
        body: JSON.stringify({
          user_name: this.state.ch1,
          ch2: this.state.ch2,
          permission: this.state.permission
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
          alert(res.text);
          

          const timer = setTimeout(() => {
            const history = createBrowserHistory();

            history.push("/System");
            window.location.reload();
          }, 100);
          return () => clearTimeout(timer);

        })
        .catch(err => console.log(err))


    }
    
  }

  back=()=>{
    const history = createBrowserHistory();

    history.push("/System");
    window.location.reload();
  }

  render() {
    const c1 = [];
    const c2 = [];
    const a1 = [];

    const style = {
      backgroundColor: "#dddbdbc4",
      color: "black",
      fontFamily: "Arial",
      fontSize: "20px",
      textAlign: "center",
      height: "100vh"
    };

    // console.log(this.state.account_name_list);
    if (this.state.account_name_list.length != 0){
      for(let i=0;i<this.state.account_name_list.length;i++){
          a1.push(
            <input class="request_button" type="button" value={this.state.account_name_list[i]} onClickCapture={this.apply_account}/>
          );
        
      }
    }

    if (this.state.permission == 1){
      c1.push(
        <input 
              type="text"
              id=""
              name=""
              class="system_apply_form_input"
              value={this.state.ch1}
              disabled
          />
      );
      c2.push(
        <input 
              type="text"
              id=""
              name=""
              class="system_apply_form_input"
              value={this.state.ch2}
              disabled
          />
      );
    }
    else{
      c1.push(
        <input 
              type="text"
              id=""
              name=""
              class="system_apply_form_input"
              value={this.state.ch2}
              disabled
          />
      );
      c2.push(
        <input 
              type="text"
              id=""
              name=""
              class="system_apply_form_input"
              value={this.state.ch1}
              disabled
          />
      );
    }

    return (
      <div style={style}>
        <label>
          <br /><br />
          <strong><font size="6">醫療機構(乙方)：</font></strong>
          {c1}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <strong><font size="6">照護機構(丙方)：</font></strong>
          {c2}
          <br />
          <strong><font size="6">選取對象申請人</font></strong>
          <form class="system-apply-form-box">
            <input class="system_apply_button_x" type="button"/><br />
            {a1}
          </form>
          <br />

          <input class="system_apply_button2" type="button" value="送出" onClickCapture={this.send_apply} />
          <input class="system_apply_button_back" type="button" value="返回" onClickCapture={this.back} />

        </label>
        
      </div>
    );
  }
}
export default System_apply;