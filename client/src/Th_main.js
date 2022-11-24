import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory } from 'history';
import "./new.css";
import image from './image/user.png';

import image_arrow from './image/arrow.png';
import image_patient from './image/patient.png';
import image_D_P from './image/D_P.png';
import image_I_P from './image/I_P.png';
import image_T_P from './image/T_P.png';

import Modal from 'react-modal';
// import { Modal, Button } from 'antd';
import moment from "moment";

class Th_main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_account: "",
            user_name: "",
            user_job: "",
            patient_list: [],
            showModal: false,
            save_patient_number: "",
            save_patient_id: "",
            save_content_table: [[]],
            list_patient_record: [[]],
            table_css_flag: true,
            promise_node_count: 0,
            account_request_list: [],
            account_request_list_name: [],
            date: new Date()
        }
        this.CloseModal = this.CloseModal.bind(this);
        this.Request = this.Request.bind(this);
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(),1000);
        this.loading();
    }

    componentWillMount() {
        clearInterval(this.timerID);
    }

    tick() {
    //   this.setState({date: new Date()});

      //get node count
      fetch('/Get_Promise_node_count', {
        method: "POST",
        body: JSON.stringify({
            user_account: this.state.user_account
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
            this.setState({promise_node_count:res.count});
        })
        .catch(err => console.log(err))
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
                this.setState({ user_account: res.account });
                this.setState({ user_name: res.name });
                this.setState({ user_job: res.job });

                if (res.flag == 0) {
                    const history = createBrowserHistory();
                    history.push("/LoginFail");
                    window.location.reload();
                }
            })
            .catch(err => console.log(err))


        fetch('/Get_patient_list', {
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
                this.setState({ patient_list: res.patient_list })

            })
            .catch(err => console.log(err))
    }

    //登出
    Logout = () => {
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

    //查看個案治療紀錄
    ClickPatientRecord = (event) => {
        var list = event.target.id.split(",");
        console.log(list)

        fetch('/CheckBlockDetail', {
            method: "POST",
            body: JSON.stringify({
                user_name: this.state.user_name,
                promise_name: list[0],
                hash: list[3],
                user_id: this.state.save_patient_id
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
                if (res.text == "not promise") {
                    this.setState({ table_css_flag: true });

                    //是否需要授權
                    var yse_no = window.confirm("尚未取得對方的授權許可，是否要請求該節點授權？");
                    if (yse_no == true)
                        var resp = window.prompt("身分驗證 請輸入密碼：");
                    
                    fetch('/User_Choose_Request', {
                        method: "POST",
                        body: JSON.stringify({
                            user_account: this.state.user_account,
                            user_name: this.state.user_name,
                            user_job: this.state.user_job,
                            password: resp,
                            click_request_name: list[0],
                            click_request_job: list[1]
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
                        })
                        .catch(err => console.log(err))
                    
                }
                else if (res.text == "date over") {
                    this.setState({ table_css_flag: true });

                    //是否需要授權
                    var yse_no = window.confirm("您的授權已到期，是否要重新請求該節點授權？");
                    if (yse_no == true)
                        window.prompt("身分驗證 請輸入密碼：");
                }
                else {
                    this.setState({ table_css_flag: false });
                    this.setState({ save_content_table: res.order_detail })
                    console.log(res.order_detail);
                }
            })
            .catch(err => console.log(err))
    }

    //授權節點畫面
    Request() {
        this.setState({ showModal: true });

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
            this.setState({account_request_list_name:res.account_request_list_name});
        })
        .catch(err => console.log(err))
    }

    CloseModal() {
        this.setState({ showModal: false });
    }

    //選取住民觸發讀取區塊內容
    changeSelect = (event) => {
        var checkAll = document.getElementById("cbox").checked
        this.setState({ save_patient_number: event.target.value });
        this.setState({ save_patient_id: event.target.value });
        this.setState({ save_content_table: [[]] });

        fetch('/Get_Patient_Block_Content', {
            method: "POST",
            body: JSON.stringify({
                user_id: event.target.value
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
                this.setState({ list_patient_record: res.list })
            })
            .catch(err => console.log(err))

        // 1.check 顯示個案全記錄
        if (checkAll == true) {
            fetch('/Get_All_Patient_Record', {
                method: "POST",
                body: JSON.stringify({
                    leader: this.state.user_name,
                    job: this.state.user_job,
                    user_id: event.target.value
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
                    this.setState({ save_content_table: res.order_detail })
                })
                .catch(err => console.log(err))

            this.setState({ table_css_flag: false });
        }
        // 2.取消全部顯示 改為下拉選單
        else
            this.setState({ table_css_flag: true });


        for (let i = 0; i < this.state.patient_list.length - 1; i++) {
            if (event.target.value == this.state.patient_list[i][0])
                this.setState({ save_patient_number: this.state.patient_list[i][1] + this.state.patient_list[i][2] })
        }
    }

    // 接受/拒絕授權
    promise_request=(event)=>{
        var rates = document.getElementsByName('radio');
        var rate_value;

        //取得天數
        for(var i = 0; i < rates.length; i++){
            if(rates[i].checked){
                rate_value = rates[i].value;
            }
        }
    
        if (!rate_value && event.target.id == "yes"){
            alert("請選擇預授權天數");
        }
        else{
            fetch('/User_Request', {
            method: "POST",
            body: JSON.stringify({
                user_name: this.state.user_name,
                user_job: this.state.user_job,
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
        this.setState({ showModal: false });
    }

    render() {
        const list_table = [];
        const content_table = [];
        const patient = [];
        const a2 = [];

        const content_table_css_nondisplay = {
            width: "80%",
            height: "100%"
        };
        const content_table_css_display = {
            width: "80%",
            height: "100%",
            display: "none"
        };


        //匯入機構住民區塊
        for (let i = 0; i < this.state.list_patient_record.length - 1; i++) {
            //D to P
            if (this.state.list_patient_record[i][1] == "醫師") {
                list_table.push(
                    <tr class="list_table_th">
                        <td colspan="3" height="20px">
                            <div>
                                <img src={image_D_P} alt="Background" class="list_image" />
                            </div>
                        </td>
                    </tr>
                );
            }
            //I to P
            else if (this.state.list_patient_record[i][1] == "機構管理者") {
                list_table.push(
                    <tr class="list_table_th">
                        <td colspan="3" height="20px">
                            <div>
                                <img src={image_I_P} alt="Background" class="list_image" />
                            </div>
                        </td>
                    </tr>
                );
            }
            //T to P
            else {
                list_table.push(
                    <tr class="list_table_th">
                        <td colspan="3" height="20px">
                            <div>
                                <img src={image_T_P} alt="Background" class="list_image" />
                            </div>
                        </td>
                    </tr>
                );
            }

            list_table.push(
                <tr >
                    <td colspan="2" width="60%" height="10px" align="left">
                        {this.state.list_patient_record[i][0]}
                    </td>
                    <td width="40%" height="10px" align="right">
                        {this.state.save_patient_number}
                    </td>
                </tr>
            );

            list_table.push(
                <tr>
                    <td colspan="2" width="60%" height="10px" align="left">
                        {this.state.list_patient_record[i][1]}
                    </td>
                </tr>
            );

            list_table.push(
                <tr class="list_table_th">
                    <td colspan="3" height="10px">
                        <strong>
                            時間：{this.state.list_patient_record[i][2]}
                        </strong>
                    </td>
                </tr>
            );

            if (this.state.user_name == this.state.list_patient_record[i][0] && this.state.user_job == this.state.list_patient_record[i][1]){
                list_table.push(
                    <tr class="list_table_th">
                        <td colspan="3">
                            <input class="button main_button7-1" type="button" id={this.state.list_patient_record[i]} value="查看" onClickCapture={this.ClickPatientRecord} />
                        </td>
                    </tr>
                );
            }
            else {
                list_table.push(
                    <tr class="list_table_th">
                        <td colspan="3">
                            <input class="button main_button7-2" type="button" id={this.state.list_patient_record[i]} value="查看" onClickCapture={this.ClickPatientRecord} />
                        </td>
                    </tr>
                );
            }
            
        }

        //匯入機構住民資料
        for (let i = 0; i < this.state.patient_list.length - 1; i++) {
            patient.push(
                <option value={this.state.patient_list[i][0]}>{this.state.patient_list[i][1] + " " + this.state.patient_list[i][2]}</option>
            );
        }

        if (this.state.save_content_table.length != 0) {
            //隱藏table
            if (this.state.table_css_flag == true) {
                content_table.push(
                    <table class="content_table" style={content_table_css_display}>
                        <tr>
                            <td>
                                <strong><font size="5"></font></strong>
                                <br />
                                <img src={image_patient} alt="Background" class="content_image" />
                            </td>
                            <td><font size="6">治療人員</font></td>
                            <td><font size="6">照護記錄</font></td>
                        </tr>

                        <tr class="content_table_th">
                            <td colspan="3"><strong></strong></td>
                        </tr>

                        <tr>
                            <td width="33%"></td>
                            <td width="33%"><font size="6"></font></td>
                            <td width="33%"><font size="6"></font></td>
                        </tr>
                    </table>
                );
                content_table.push(<text class="table_text">待選取畫面...</text>);
            }
            //不隱藏table
            else if (this.state.table_css_flag == false) {
                //無個案資料
                if (this.state.save_content_table[0].length == 0) {
                    content_table.push(<text class="table_text">目前該個案暫無您的記錄</text>);
                }
                else {
                    //匯入機構住民區塊內容
                    content_table.push(
                        <tr>
                            <td width="25%">
                                <strong><font size="5">{this.state.save_patient_number}</font></strong>
                                <br />
                                <img src={image_patient} alt="Background" class="content_image" />
                            </td>
                            <td width="25%"><font size="6">治療人員</font></td>
                            <td width="25%"><font size="6">照護記錄</font></td>
                            <td width="25%"><font size="6">藥物</font></td>
                        </tr>
                    );

                    for (let i = 0; i < this.state.save_content_table.length; i++) {
                        if (this.state.save_content_table[i].length == 0) {
                            break;
                        }
                        content_table.push(
                            <tr class="content_table_th">
                                <td colspan="4"><strong>{this.state.save_content_table[i][5]}</strong></td>
                            </tr>
                        );
                        content_table.push(
                            <tr>
                                <td></td>
                                <td><font size="6">{this.state.save_content_table[i][0] + this.state.save_content_table[0][1]}</font></td>
                                <td><font size="6">{this.state.save_content_table[i][3]}</font></td>
                                <td><font size="6">{this.state.save_content_table[i][4]}</font></td>
                            </tr>
                        );
                    }
                }
            }
        }

        const node_count = [];
        //顯示授權節點通知數量
        if (this.state.promise_node_count > 0) {
            node_count[0] = <span class="number_badge"> {this.state.promise_node_count} </span>;
        }

        //抵銷重置後第一秒顯示問題
        if (this.state.account_request_list.length != 0){
            for(let i=0;i<this.state.account_request_list[this.state.user_account.split("t")[1]].length;i++){
                a2.push(
                    <tr>
                    <td width="33%">
                        <font size="6">{this.state.account_request_list_name[i]}</font>
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
            <div class="user_main">
                <form class="form-box">
                    <label>
                        <table class="table-box">
                            <tr>
                                <input class="button button1" type="button" value="" />
                                <td width="86%" align="left"></td>
                                {/* <td width="86%" align="left"><strong>{moment().format("YYYY/MM/DD")} {new Date().toLocaleTimeString()}</strong></td> */}
                                <td width="1%" align="right"><button class="button main_button5" type="button" onClickCapture={this.Request}><img src={image} alt="Background" class="image_user" /></button></td>
                                <td width="11%" align="right">
                                    {node_count}
                                    <strong>{this.state.user_name + this.state.user_job}</strong> 歡迎登入
                                    <input class="button main_button6" type="button" value="登出" onClickCapture={this.Logout} />
                                </td>
                            </tr>
                        </table>

                        <div class="article" align="center">
                            <strong><font size="5">機構住民紀錄狀態列</font></strong>
                            <br />

                            <input type="checkbox" id="cbox" value="" onChange={this.clickAllPatient} />
                            <label for="cbox">顯示個案所有紀錄</label>

                            <select name="patient" onChange={this.changeSelect}>
                                {patient}
                            </select>

                            <br /><br />

                            <table class="list_table">
                                {list_table}
                            </table>
                        </div>

                        <div align="center">
                            <br />

                            <table class="content_table" style={content_table_css_nondisplay}>
                                {content_table}
                            </table>

                        </div>

                        <Modal
                            isOpen={this.state.showModal}
                            className="modal"
                        >
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
                            <button class="button_main_back" onClickCapture={this.CloseModal}>返回</button>
                        </Modal>

                    </label>
                </form>
            </div>
        );
    }
}
export default Th_main;
