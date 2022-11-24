import React,{ Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./System_Management.css";

class System_Management extends Component {
  constructor(props) {
      super(props);
      this.state = { 
          name: "",
          account: "",
          permission: 0,
          ch: [[],[]],
          check: [],
          date: new Date()
      }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(),10);
  }

  componentWillMount() {
    clearInterval(this.timerID);
      this.load();
  }

  tick() {
    fetch('/Get_System', {
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
        this.setState({ch:res.ch});
        this.setState({check:res.check});
      })
      .catch(err => console.log(err))       
  }

  async load() {
      var web3 = new Web3();
      web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
      
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
            this.setState({name:res.name});
            this.setState({account:res.account});
            this.setState({permission:res.permission});
            
            if (res == ""){
                const history = createBrowserHistory();
                history.push("/LoginFail");
                window.location.reload();
            }
        })
        .catch(err => console.log(err))   
  }

  check_system=(event)=>{
    var text = event.target.id.split(" ");

    fetch('/system_update', {
      method: "POST",
      body: JSON.stringify({
        ch1: text[0],
        update:text[1]
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
        if (res.check == 1){
          alert("已修改為「通過狀態」");
        }
        else if (res.check == 0){
          alert("已修改為「取消狀態」");
        }
        else if (res.check == 3){
          alert("已是「通過狀態」");
        }
        else{
          alert("已是「取消狀態」");
        }
      })
      .catch(err => console.log(err))      
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
    else if (this.state.permission == 0){
      history.push("/management_main");
      window.location.reload();
    }
  }

  render() {
    const a1 = [];

    for (let i=0;i<this.state.ch[0].length;i++){
      a1.push(
        <tr class="system_M_table2-box">
          <td width="10%"><strong><font size="5">專責醫師：</font></strong></td>
          <td><strong><font size="5">{this.state.ch[0][i]}</font></strong></td>
          <td rowspan="2" align="center"><strong><font size="5">{this.state.check[i]}</font></strong></td>
          <td rowspan="2" class="system_M_table_check">
            <button class="system_M_yes" id={this.state.ch[0][i]+" "+1} onClickCapture={this.check_system}>接受</button>
            <button class="system_M_no" id={this.state.ch[0][i]+" "+0} onClickCapture={this.check_system}>拒絕</button></td>

        </tr>
      );
      a1.push(
        <tr class="system_table2-box">
          <td><strong><font size="5">機構：</font></strong></td>
          <td width="500"><strong><font size="5">{this.state.ch[1][i]}</font></strong></td>
        </tr>
  );
    }
    
    return (
      <div>
        <table class="system_M_table-box">
            <tr>
              <td width="5%"></td>
              <td width="10%" align="center"><strong><font size="6">申請人</font></strong></td>
              <td width="40%" align="center"><strong><font size="6">申請進度</font></strong></td>
              <td width="5%" colspan="2" align="center"><strong><font size="6">修改</font></strong></td>
            </tr>

            {a1}

        </table>

        <label>
          <input class="button button1" type="button" value="" /><br />
          <input class="system_Mapply_back" type="button" value="返回" onClickCapture={this.back} />
        </label>

      </div>
    );
  }

}

export default System_Management;