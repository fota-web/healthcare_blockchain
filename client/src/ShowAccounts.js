import React,{ Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./ShowAccounts.css";

class ShowAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      accounts: [],
      balance: []
    }
  }

  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
    // var Web3 = require('web3');
    // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const acc = await web3.eth.getAccounts();
    this.setState({accounts:acc});
    
    const bal = [];

    for (let i=0;i<acc.length;i++){
      const coin = await web3.eth.getBalance(acc[i]);
      bal.push(coin/1000000000000000000);
    }
    this.setState({balance:bal});
  }

  back=()=>{
    const history = createBrowserHistory();

    history.push("/management_main");
    window.location.reload();
  }

  render() {
    const a1 = [];
    const table = [];

    const style = {
      backgroundColor: "#dddbdbc4",
      color: "black",
      fontFamily: "Arial",
      fontSize: "20px",
      textAlign: "center",
      height: "100vh"
    };

    for(let i=0;i<10;i++){
      a1.push(
      <span>
        <td></td>
        帳戶{[i+1]}：{this.state.accounts[i]}
        <br />
        餘額：{this.state.balance[i]} ETH
        <br /><br />
      </span>
      );
    }

    for(let i=0;i<5;i++){
      table.push(
        <span>
          <tr class="showaccount-table-box">
            <td class="showaccount-table-box">
            <strong><font size="5">帳戶{[i]}：{this.state.accounts[i]}</font></strong>
              <br /><br />
              餘額：{this.state.balance[i]} ETH
              <br />
              權限：一般使用者
            </td>

            <td class="showaccount-table-box">
              <strong><font size="5">帳戶{[i+5]}：{this.state.accounts[i+5]}</font></strong>
              <br /><br />
              餘額：{this.state.balance[i+5]} ETH
              <br />
              權限：一般使用者
            </td>
          </tr>
        </span>
      );
    }


    return (
      <div style={style}>
        <label>
          <table>
            {table}
          </table>
        </label>
        <label>
          <form>
            <input class="button_x" type="button"/><br />
            <input class="button_back" type="button" value="返回" onClickCapture={this.back} />
          </form>
        </label>
        
      </div>
    );
  }

}

export default ShowAccounts;