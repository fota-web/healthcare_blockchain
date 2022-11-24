import React,{ Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./System_Napply.css";

class System_Napply extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            account: "",
            permission: 0,
            ch: [[],[]],
            check: []
        }
    }

    componentWillMount() {
        this.load()
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

  back=()=>{
    const history = createBrowserHistory();

    if (this.state.permission == 1)
    {
      history.push("/sDr_main");
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
        <tr class="system_table2-box">
          <td width="10%"><strong><font size="5">專責醫師：</font></strong></td>
          <td><strong><font size="5">{this.state.ch[0][i]}</font></strong></td>
          <td rowspan="2" align="center"><strong><font size="5">{this.state.check[i]}</font></strong></td>
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
        <table class="system_N_table-box">
            <tr>
              <td width="5%"></td>
              <td width="10%" align="center"><strong><font size="6">申請人</font></strong></td>
              <td width="40%" align="center"><strong><font size="6">申請進度</font></strong></td>
            </tr>

            {a1}

        </table>

        <label>
          <input class="button button1" type="button" value="" /><br />
          <input class="system_Napply_back" type="button" value="返回" onClickCapture={this.back} />
        </label>

      </div>
    );
  }

}

export default System_Napply;