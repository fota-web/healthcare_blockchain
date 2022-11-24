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

class Co_main extends Component{
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
        this.timerID = setInterval(() => this.tick(),1000);
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

        fetch('/Get_Block', {
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
                this.setState({transaction_hash:res.hash});
                this.setState({transaction_from_name:res.from_name});
                this.setState({transaction_to_name:res.to_name});
                this.setState({timestamp:res.timestamp});
            })
            .catch(err => console.log(err))
    }

    //請求他人數據
    Request=()=>{
        const history = createBrowserHistory();
        history.push("/user_request");
        window.location.reload();
    }

    //轉帳
    Transfer=()=>{
        const history = createBrowserHistory();
        history.push("/Transfer");
        window.location.reload();
    }

    //查帳
    CheckAccount=()=>{
        const history = createBrowserHistory();
        history.push("/CheckAccount");
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
                                <tr>
                                    <td colspan="3">
                                        <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
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
                                    <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
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
                                <tr>
                                    <td colspan="3">
                                        <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
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
                                    <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
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
                                <input class="button main_button7" type="button" id={this.state.transaction_hash[i]+" "+this.state.transaction_from_name[i]} value="檢視" onClickCapture={this.CheckBlockDetail} />
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

        // const past_record = [[]];
        // //顯示過往紀錄
        // if (this.state.order_detail[0].length != 0){
        //     for (let i=0;i<this.state.order_detail.length-1;i++){
        //         past_record[i].push(
        //             <tr>
        //                 <td>{this.state.order_detail[i][0]}</td>
        //                 <td>{this.state.order_detail[i][1]}</td>
        //                 <td>{this.state.order_detail[i][2]}</td>
        //                 <td>{this.state.order_detail[i][3]}</td>
        //                 <td>{this.state.order_detail[i][4]}</td>
        //             </tr>
        //         );
        //         if (this.state.order_detail.length != i){
        //             past_record.push([]);
        //         }
        //     }
        // }
        
        return(
            <div class="user_main">
                <form class="form-box">
                    <label>
                        <table class="table-box">
                            <tr>
                                <input class="button button1" type="button" value="" />
                                <td width="85%" align="left"><strong>{moment().format("YYYY/MM/DD")} {new Date().toLocaleTimeString()}</strong></td>
                                <td width="1%" align="right"><img src={image} alt="Background" class="image"/></td>
                                <td width="12%" align="right">
                                    <strong>{this.state.user_name}</strong> 歡迎登入
                                    <input class="button main_button6" type="button" value="登出" onClickCapture={this.Logout} />
                                </td>
                            </tr>
                        </table>

                        <section>
                            <article class="article">
                            <table width="100%" height="100%">
                                <tr height="50%">
                                    <td align="center" width="50%">
                                        <input class="main_button2" type="image" src={image_promise} alt="授權節點" onClickCapture={this.Request}/><br />
                                        <div class="button_name">授權節點</div>
                                    </td>
                                    <td align="center">
                                        <input class="main_button" type="image" src={image_patient_data} alt="機構住民資料" onClickCapture={this.Transfer}/><br />
                                        <div class="button_name">機構住民資料</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <input class="main_button" type="image" src={image_account} alt="查帳" onClickCapture={this.CheckAccount}/><br />
                                        <div class="button_name">查帳</div>
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

                        {/* <nav class="nav">
                            <marquee direction="right" height="auto" scrollamount="10" behavior="alternate">！！！疫情期間出入請配戴口罩，勤洗手！！！</marquee>
                        </nav> */}
                        
                    </label>
                </form>
            </div>       
        );
    }
}
export default Co_main;
