import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./All_main.css";
import image from './image/user.png';
import image_promise from './image/authorize.png';
import image_patient_data from './image/patient_data.png';
import image_account from './image/account.png';
import image_system from './image/system.png';

import image_arrow from './image/arrow.png';
import image_dr from './image/doctor.png';
import image_patient from './image/patient.png';
import image_th from './image/therapy.png';
import image_in from './image/institution.png';
import image_contract from './image/contract.png';

import moment from "moment";

class management_main extends Component{
    constructor(props) {
        super(props);
        this.state={
            user_name: "",
            transaction_hash: [],
            transaction_from_name: [],
            transaction_from: [],
            transaction_to_name: [],
            transaction_to: [],
            transaction_coin: [],
            transaction_gas: [],
            timestamp: [],
            date: new Date()
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(),10);
    }

    componentWillMount() {
        clearInterval(this.timerID);
        this.loading()
    }

    tick() {
        this.setState({date: new Date()});
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
                this.setState({user_name:res.name});
                
                if (res.flag == 0){
                    const history = createBrowserHistory();
                    history.push("/LoginFail");
                    window.location.reload();
                }
            })
            .catch(err => console.log(err))

        var web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
        
        var block_number = await web3.eth.getBlockNumber();
        var detail = [];
        var hash = [];
        var from_name = [];
        var from = [];
        var to_name = [];
        var to = [];
        var coin = [];
        var gas = [];
        var timestamp = [];

        var time = 0;
        var date = []

        //transaction log
        for (let i=1;i<=block_number;i++){
            detail.push(await web3.eth.getTransactionFromBlock(i));
            time = (await web3.eth.getBlock(i)).timestamp;
            time = new Date(time*1000);
            date = String(time).split(" ")

            fetch('/Get_Information', {
                method: "POST",
                body: JSON.stringify({
                    from: detail[i-1].from,
                    to: detail[i-1].to
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
                    from_name.push(res.from_name);
                    to_name.push(res.to_name);
                })
                .catch(err => console.log(err))

            hash.push(detail[i-1].hash);
            from.push(detail[i-1].from);
            to.push(detail[i-1].to);
            coin.push(detail[i-1].value/1000000000000000000);
            gas.push(detail[i-1].gasPrice*21000/1000000000000000000);
            timestamp.push(date[3] + "/" + date[1]+ "/" + date[2]+ " " + date[4]);
        }
        // console.log(String(time).split(" "));

        this.setState({transaction_hash:hash});
        this.setState({transaction_from_name:from_name});
        this.setState({transaction_from:from});
        this.setState({transaction_to_name:to_name});
        this.setState({transaction_to:to});
        this.setState({transaction_coin:coin});
        this.setState({transaction_gas:gas});
        this.setState({timestamp:timestamp});

        //數位簽名
        // console.log(web3.eth.accounts.sign('Some data', '0xe89fbfea18c4b62643002d60b14f7726e9bc40cd12cdc08fd55e5b55ea52a6c5'));
        // var messageHash= web3.eth.accounts.hashMessage('Some data');
        // console.log(messageHash);
        // console.log(web3.eth.accounts.recover({
        //     messageHash: "0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655",
        //     r: "0x880e3546aae0ac9682318ccf3ca4e96001182f3f4e030a1d87cd8b793a8b29ae",
        //     s: "0x615a78474d20c65c4a1d0ecc5234fb9634314ac6bcf486fb30d50c7fed4426e2",
        //     v: "0x1b"
        // }));
    }

    //
    Request=()=>{
    }

    //
    Transfer=()=>{
    }

    //
    CheckAccount=()=>{
    }

    //專責制度概況
    System=()=>{
        const history = createBrowserHistory();
        history.push("/System_Management");
        window.location.reload();
    }

    //登出
    Logout=()=>{
        fetch('/LoginState', {
            method: "POST",
            body: JSON.stringify({
                account: this.state.user_name,
                state: 0
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
            })
            .catch(err => console.log(err))

        const history = createBrowserHistory();
        history.push("/");
        window.location.reload();
    }

    render(){
        const a1 = [];

        for(let i=0;i<this.state.transaction_hash.length;i++){
            // 情況一：醫生->治療師/機構
            if (this.state.transaction_from_name[i] == "Dr.A" || 
                this.state.transaction_from_name[i] == "Dr.B" || 
                this.state.transaction_from_name[i] == "Dr.C"   ){
                if (this.state.transaction_to_name[i] == "PT" ||
                    this.state.transaction_to_name[i] == "OT" ||
                    this.state.transaction_to_name[i] == "ST"   ){
                        a1.push(
                            <tr class="Dr_In_form-box">
                                <tr>
                                <td colspan="3" align="center">
                                        <strong>
                                            交易{[i+1]}(Hash)：  
                                        </strong>
                                        <font class="text">{this.state.transaction_hash[i]}</font>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30%" align="center">
                                        <img src={image_dr} alt="Background" class="image_block"/>
                                        <br />
                                        <font>{this.state.transaction_from_name[i]}</font>
                                    </td>
                                    <td width="30%" align="center">
                                        <img src={image_arrow} alt="Background" class="image_arrow"/>
                                        <br />
                                        <font>請求資料</font>
                                    </td>
                                    <td width="33%" align="center">
                                        <img src={image_th} alt="Background" class="image_block"/>
                                        <br />
                                        <font>{this.state.transaction_to_name[i]}</font>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" align="right">
                                        {this.state.timestamp[i]}
                                    </td>
                                </tr>
                            </tr>
                        );
                }
                else if (this.state.transaction_to_name[i] == "InstitutionA"){
                    a1.push(
                        <tr class="Dr_In_form-box">
                            <tr>
                                <td colspan="3" align="center">
                                    <strong>
                                        交易{[i+1]}(Hash)：  
                                    </strong>
                                    <font class="text">{this.state.transaction_hash[i]}</font>
                                </td>
                            </tr>
                            <tr>
                                <td width="30%" align="center">
                                    <img src={image_dr} alt="Background" class="image_block"/>
                                    <br />
                                    <font>{this.state.transaction_from_name[i]}</font>
                                </td>
                                <td width="30%" align="center">
                                    <img src={image_arrow} alt="Background" class="image_arrow"/>
                                    <br />
                                    <font>看診</font>
                                </td>
                                <td width="33%" align="center">
                                    <img src={image_patient} alt="Background" class="image_block"/>
                                    <br />
                                    <font>{this.state.transaction_to_name[i]}</font>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" align="right">
                                    {this.state.timestamp[i]}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]+" "+this.state.transaction_from[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
                                </td>
                            </tr>
                        </tr>
                    );
                }
            }
            //情況二：治療師->醫生/機構
            else if (this.state.transaction_from_name[i] == "PT" ||
                     this.state.transaction_from_name[i] == "OT" ||
                     this.state.transaction_from_name[i] == "ST"   ){
                if (this.state.transaction_to_name[i] == "Dr.A" || 
                    this.state.transaction_to_name[i] == "Dr.B" || 
                    this.state.transaction_to_name[i] == "Dr.C"   ){
                        a1.push(
                            <tr class="Dr_In_form-box">
                                <tr>
                                    <td colspan="3" align="center">
                                        <strong>
                                            交易{[i+1]}(Hash)：  
                                        </strong>
                                        <font class="text">{this.state.transaction_hash[i]}</font>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="30%" align="center">
                                        <img src={image_th} alt="Background" class="image_block"/>
                                        <br />
                                        <font>{this.state.transaction_from_name[i]}</font>
                                    </td>
                                    <td width="30%" align="center">
                                        <img src={image_arrow} alt="Background" class="image_arrow"/>
                                        <br />
                                        <font>請求資料</font>
                                    </td>
                                    <td width="33%" align="center">
                                        <img src={image_dr} alt="Background" class="image_block"/>
                                        <br />
                                        <font> {this.state.transaction_to_name[i]}</font>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" align="right">
                                        {this.state.timestamp[i]}
                                    </td>
                                </tr>
                            </tr>
                        );
                }
                else if (this.state.transaction_to_name[i] == "InstitutionA"){
                    a1.push(
                        <tr class="Dr_In_form-box">
                            <tr>
                                <td colspan="3" align="center">
                                    <strong>
                                        交易{[i+1]}(Hash)：
                                    </strong>
                                    <font class="text">{this.state.transaction_hash[i]}</font>
                                </td>
                            </tr>
                            <tr>
                                <td width="30%" align="center">
                                    <img src={image_th} alt="Background" class="image_block"/>
                                    <br />
                                    <font>{this.state.transaction_from_name[i]}</font>
                                </td>
                                <td width="30%" align="center">
                                    <img src={image_arrow} alt="Background" class="image_arrow"/>
                                    <br />
                                    <font>治療處方</font>
                                </td>
                                <td width="33%" align="center">
                                    <img src={image_patient} alt="Background" class="image_block"/>
                                    <br />
                                    <font> {this.state.transaction_to_name[i]}</font>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" align="right">
                                    {this.state.timestamp[i]}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]+" "+this.state.transaction_from[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
                                </td>
                            </tr>
                        </tr>
                    );
                }
            }
            //情況三：機構->機構
            else if (this.state.transaction_from_name[i] == "InstitutionA" && this.state.transaction_to_name[i] == "InstitutionA"){
                a1.push(
                    <tr class="Dr_In_form-box">
                        <tr>
                            <td colspan="33" align="center">
                                <strong>
                                    交易{[i+1]}(Hash)：  
                                </strong>
                                <font class="text">{this.state.transaction_hash[i]}</font>
                            </td>
                        </tr>
                        <tr>
                            <td width="30%" align="center">
                                <img src={image_in} alt="Background" class="image_block"/>
                                <br />
                                <font>{this.state.transaction_from_name[i]}</font>
                            </td>
                            <td width="30%" align="center">
                                <img src={image_arrow} alt="Background" class="image_arrow"/>
                                <br />
                                <font>日常照護</font>
                            </td>
                            <td width="33%" align="center">
                                <img src={image_patient} alt="Background" class="image_block"/>
                                <br />
                                <font> {this.state.transaction_to_name[i]}</font>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" align="right">
                                {this.state.timestamp[i]}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                            <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]+" "+this.state.transaction_from[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
                            </td>
                        </tr>
                    </tr>
                );
            }
            //情況四：合約
            else {
                a1.push(
                    <tr class="Detail_form-box">
                        <tr>
                            <td align="center">
                                <strong>
                                    交易{[i+1]}(Hash)：
                                </strong>
                                <font class="text">{this.state.transaction_hash[i]}</font>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <img src={image_contract} alt="Background" class="image_block"/>
                                <br />
                                <font class="text_contract">合約部署</font>
                            </td>
                        </tr>
                        <tr>
                            <td align="right">
                                {this.state.timestamp[i]}
                            </td>
                        </tr>
                    </tr>
                );
            }
        }

        const a2 = [];
        let j = 0;
        for(let i=a1.length;i>=0;i--){
            a2[j] = a1[i];
            j++;
        }
        
        return(
            <div class="user_main">
                <form class="form-box">
                    <label>
                        <table class="table-box">
                            <tr>
                                <input class="button button1" type="button" value="" />
                                <td width="20%" align="left"><strong>{moment().format("YYYY/MM/DD")} {new Date().toLocaleTimeString()}</strong></td>
                                <td width="80%" align="right"><img src={image} alt="Background" class="image"/>&nbsp;&nbsp;
                                    <strong>{this.state.user_name}</strong> 歡迎登入
                                    <input class="button main_button6" type="button" value="登出" onClickCapture={this.Logout} /></td>
                            </tr>
                        </table>

                        <section>
                            <article class="article">
                            <table width="100%" height="100%">
                                <tr height="50%">
                                    <td align="center" width="50%">
                                        <input class="main_button2" type="image" src={image_promise} alt="授權節點"/><br />
                                        <div class="button_name">none1</div>
                                    </td>
                                    <td align="center">
                                        <input class="main_button" type="image" src={image_patient_data} alt="機構住民資料"/><br />
                                        <div class="button_name">none2</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <input class="main_button" type="image" src={image_account} alt="查帳"/><br />
                                        <div class="button_name">none3</div>
                                    </td>
                                    <td align="center">
                                        <input class="main_button" type="image" src={image_system} alt="專責制度概況" onClickCapture={this.System}/><br />
                                        <div class="button_name">專責制度概況</div>
                                    </td>
                                </tr>
                            </table>
                            </article>
                        </section>

                        <div class="block_label">區塊狀態列</div>

                        <div class="block_detail">
                            <table>
                                {a2}
                            </table>
                        </div>

                        <nav class="nav">
                            <marquee direction="right" height="auto" scrollamount="10" behavior="alternate">！！！疫情期間出入請配戴口罩，勤洗手！！！</marquee>
                        </nav>
                        
                    </label>
                </form>
            </div>       
        );
    }
}
export default management_main;