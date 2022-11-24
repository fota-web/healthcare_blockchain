import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./user_request.css";

class user_request extends Component{
  constructor(props) {
    super(props);
    this.request_account = this.request_account.bind(this);
    this.state = {
      user_name: "",
      user_account: "",
      accounts: [],
      account_request_list: [],
      permission: 0,
      account_name_list: [],
      date: new Date()
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(),1000);
  }

  componentWillMount() {
    clearInterval(this.timerID);
    this.loadBlockchainData()
  }

  tick() {
    this.setState({date: new Date()});

    fetch('/User_Request', {
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
          this.setState({account_request_list:res.account_request_list});
      })
      .catch(err => console.log(err))

    // console.log(this.state.account_request_list);
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
          this.setState({user_name:res.name});
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
          getname: 0
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

    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
    // var Web3 = require('web3');
    // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const acc = await web3.eth.getAccounts();
    this.setState({accounts:acc});
    
  }

  request_account(event) {
    // console.log("請求 "+event.target.value+" 授權");
    var resp = window.prompt("身分驗證 請輸入密碼：");

    fetch('/User_Choose_Request', {
      method: "POST",
      body: JSON.stringify({
        user_name: this.state.user_name,
        password: resp,
        click_request: event.target.value
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
          if (res.text == "promise check"){
            alert("驗證成功 等待對方授權許可...");
          }
          else if (res.text == "double promise"){
            alert("已請求該節點 待確認...");
          }
          else if (res.text == "already promise"){
            alert("您已授權許可 可進行數據讀取");
          }
          else
            alert("驗證錯誤 即將導引至主畫面");
            
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
      })
      .catch(err => console.log(err))
  }

  promise_request=(event)=>{
    var rates = document.getElementsByName('radio');
    var rate_value;
    //取得天數
    for(var i = 0; i < rates.length; i++){
        if(rates[i].checked){
            rate_value = rates[i].value;
        }
    }
    // console.log(event.target.name);
    // console.log(event.target.id);

    if (!rate_value && event.target.id == "yes"){
      alert("請選擇預授權天數");
    }
    else{
      fetch('/User_Request', {
        method: "POST",
        body: JSON.stringify({
          user_name: this.state.user_name,
          promise_name: event.target.name,
          value: event.target.id,
          promise_mon: rate_value
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
      })
      .catch(err => console.log(err))

      if (event.target.id == "no"){
        alert("拒絕授權");
      }
      else
        alert("成功授權");
    }
  }

  back=()=>{
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

  render() {
    const a1 = [];
    const a2 = [];

    const style = {
      backgroundColor: "#dddbdbc4",
      color: "black",
      fontFamily: "Arial",
      fontSize: "20px",
      textAlign: "center",
      height: "100vh"
    };

    // console.log(this.state.account_name_list);
    var count = 0;
    for(let i=1;i<10;i++){
      var account = "account"+i;

      if (this.state.user_account != "account"+i){
        count++;
        a1.push(
          <input class="request_button" type="button" id={account} value={this.state.account_name_list[i]} onClickCapture={this.request_account}/>
        );
        if (count == 4)
          a1.push(<br />);
      }
    }

    //抵銷重置後第一秒顯示問題
    if (this.state.account_request_list.length != 0){
      for(let i=0;i<this.state.account_request_list[this.state.user_account.split("t")[1]].length;i++){
          a2.push(
              <tr>
                <td width="33%">
                  <font size="6">{this.state.account_request_list[this.state.user_account.split("t")[1]][i]}</font>
                </td>
                <td width="33%">
                  <label class="container">1 Month(30 Day)
                    <input type="radio" name="radio" id="mon_1" value="1"/>
                    <span class="check"></span>
                  </label>

                  <label class="container">2 Month(60 Day)
                    <input type="radio" name="radio" id="mon_2" value="2"/>
                    <span class="check"></span>
                  </label>

                  <label class="container">3 Month(90 Day)
                    <input type="radio" name="radio" id="mon_3" value="3"/>
                    <span class="check"></span>
                  </label>
                </td>
                <td width="33%">
                  <input class="request_button_accept" type="button" id={"yes"} value={"接受"} name={this.state.account_request_list[this.state.user_account.split("t")[1]][i]} text={this.state.account_request_list[this.state.user_account.split("t")[1]][i]} onClickCapture={this.promise_request}/>
                  <br />
                  <input class="request_button_refuse" type="button" id={"no"} value={"拒絕"} name={this.state.account_request_list[this.state.user_account.split("t")[1]][i]} onClickCapture={this.promise_request}/>
                </td>
              </tr>
          );
      }
    }

    return (
      <div style={style}>
        <label>
          <br /><br />
          <strong><font size="6">選取節點，請求數據授權</font></strong>
          <form class="request-form-box">
            <input class="request_button_x" type="button"/><br />
            {a1}
          </form>

          <br /><br />
          <strong><font size="6">節點請求授權申請</font></strong>
          
          <table class="request_table" align="center" border="2" rules="rows">
            <tr>
              <td>節點
              </td>
              <td>授權天數
              </td>
              <td>狀態
              </td>
            </tr>

            {a2}

          </table>
          <br />
          <input class="request_button_back" type="button" value="返回" onClickCapture={this.back} />

        </label>
        
      </div>
    );
  }
}
export default user_request;