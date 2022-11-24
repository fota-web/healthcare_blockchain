import React, { Component } from 'react';
import Web3 from 'web3';
import { createBrowserHistory, createHashHistory } from 'history';
import "./Transfer.css";
import Modal from 'react-modal';

import ReactApexChart from "react-apexcharts";

class Transfer extends Component{
    constructor(props) {
        super(props);
        this.state={
            account_name: '',
            account_from: '',
            account_to: '',
            balance: '',
            coin: 0,
            permission: 0,
            older_data: [[]],
            showModal: false,
            showModal2: false,
            older_measurement: [[],[],[],[],[],[],[],[]],
            older_id: "",
            year: [[]],
            month: [[]],
            b1: [],
            order: "",
            medicine: "",
            hash: "",
            flag:0 ,
            order_detail: [[],[],[],[],[]],
            date: new Date()
        }
        this.OpenModal = this.OpenModal.bind(this);
        this.OpenModal2 = this.OpenModal2.bind(this);
        this.CloseModal = this.CloseModal.bind(this);
        this.CloseModal2 = this.CloseModal2.bind(this);
    }
    

    componentDidMount=()=>{
        this.loading();
        this.timerID = setInterval(() => this.tick(),1000);
    }

    componentWillMount() {
        clearInterval(this.timerID);
    }
    
    tick() {        
    }

    async loading() {
        fetch('/LoginState', {
            method: "POST",
            body: JSON.stringify({
                flag: 3
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
                this.setState({account_name:res.name});
                this.setState({account_from:res.account});
                this.setState({permission:res.permission});
                
                if (res.flag == 0){
                    alert("您尚未正確登入 將導引至登入畫面");
                    const history = createBrowserHistory();
                    history.push("/");
                    window.location.reload();
                }
                else if (res.check == 0){
                    const history = createBrowserHistory();
                    alert("您沒有權限讀取");
                    console.log(this.state.permission);
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

                // 如果正確進入 讀取住民資料
                fetch('/Get_Older_Data', {
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
                        this.setState({older_data:res.older_data});
                    })
                    .catch(err => console.log(err))

            })
            .catch(err => console.log(err))
    }

    // KeyEnter=(event)=>{
    //     if (event.keyCode === 13){
    //         this.send();
    //     }
    // }

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

    Send=()=>{
      fetch('./Save_Order', {
        method: "POST",
        body: JSON.stringify({
            hash: this.state.hash,
            leader: this.state.account_name,
            older_id: this.state.older_id,
            order: this.state.order,
            medicine: this.state.medicine
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.text == "OK"){
          this.setState({flag:res.flag});
          alert("已完成紀錄");
          // const history = createBrowserHistory();
          // history.push("/Transfer");
          // window.location.reload();
        }
      })
      .catch(err => console.log(err))
      // console.log(this.state.older_id);

      this.setState({order:""})
      this.setState({medicine:""})
    }

    //查看住民資訊
    OpenModal (event) {
        this.setState({ showModal: true });
        this.setState({ older_id: event.target.id });

        fetch('./Get_Older_Measurement_Date', {
            method: "POST",
            body: JSON.stringify({
                user_name: this.state.account_name,
                older_id: event.target.id
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({order_detail:res.order_detail});
            this.setState({year:res.year});
            this.setState({month:res.month});
        })
        .catch(err => console.log(err))
    }

    OpenModal2 (event) {
        this.setState({ showModal: false });
        this.setState({ showModal2: true });
        fetch('./Get_Older_Measurement', {
            method: "POST",
            body: JSON.stringify({
                older_id: this.state.older_id,
                date: event.target.id
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        .then(res => res.json())
        .then(res => {
            this.setState({older_measurement: res.detail});
        })
        .catch(err => console.log(err))

        if (this.state.flag == 0){
            fetch('./Transaction', {
                method: "POST",
                body: JSON.stringify({
                    account_from: this.state.account_from,
                    account_to: 'account1',
                    coin: 0
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
            .then(res => res.json())
            .then(res => {
              this.setState({hash:res.hash});
              this.setState({flag:res.flag});
            })
            .catch(err => console.log(err))
        }
    }

    CloseModal () {
        this.setState({ showModal: false });
    }

    CloseModal2 () {
        this.setState({ showModal2: false });
    }

    //傳入event要取觸發事件的元件
    order=(event)=>{
      this.setState({order:event.target.value})
    }
    medicine=(event)=>{
        this.setState({medicine:event.target.value})
    }
    

    render(){
        //住民按鈕
        const a1 = [];
        const chart_date = [];
        const chart_b_date = [];
        const chart_a_date = [];
        const chart_value = [[],[],[],[],[],[]];
        //住民量測紀錄 年-月
        const b1 = [];
        const char_list = [];
        //處方內文textarea
        const prescription = [];
        //過往紀錄
        const past_record = [[]];


        a1.push(<button class="button_transfer_x"></button>);
        a1.push(<br />);

        for (let i=0;i<this.state.older_data[0].length;i++){
            if (i == 5){
                a1.push(
                    <br />
                );
            }
            a1.push(
                <button class="button_older_data" id={this.state.older_data[0][i]} onClickCapture={this.OpenModal} >
                    {this.state.older_data[0][i]}<br />
                    {this.state.older_data[1][i]}<br />
                    {this.state.older_data[2][i]}<br />
                    {"年齡："+this.state.older_data[3][i]}<br />
                    {"身高："+this.state.older_data[4][i]}<br />
                    {"體重："+this.state.older_data[5][i]}<br />
                    {this.state.older_data[6][i]}
                </button>
            );
        }

        
        if (this.state.month.length != 0  && this.state.year.length != 0){
            //older_year
            for (let i=0;i<this.state.year.length;i++){
                b1.push(
                    <font class="transfer_text">
                        {this.state.year[i]}
                    </font>
                );
                b1.push(
                    <br />
                );
    
                //older_year_month
                for (let j=0;j<this.state.month[i].length;j++){
                    b1.push(
                        <button class="button_transfer" id={this.state.year[i]+"-"+this.state.month[i][j]} onClickCapture={this.OpenModal2} >
                            {this.state.month[i][j]}月
                        </button>
                    );
                }
                b1.push(
                    <br />
                );
            }
        }
        //清空上一個月份陣列
        this.state.month.splice(0,this.state.month.length);


        for (let i=0;i<this.state.older_measurement[0].length;i++){
            chart_date.push(this.state.older_measurement[7][i]);
            //心律
            chart_value[0].push(this.state.older_measurement[1][i]);
            chart_value[1].push(this.state.older_measurement[2][i]);
            //血脂 BMI
            chart_value[4].push(this.state.older_measurement[5][i]);
            chart_value[5].push(this.state.older_measurement[6][i]);

            //飯前飯後血糖
            if (this.state.older_measurement[3][i] != null){
                chart_b_date.push(this.state.older_measurement[7][i]);
                chart_value[2].push(this.state.older_measurement[3][i]);
            }
            if (this.state.older_measurement[4][i] != null){
                chart_a_date.push(this.state.older_measurement[7][i]);
                chart_value[3].push(this.state.older_measurement[4][i]);
            }
        }

        //折線圖-心律
        const chart_1 = {
            series: [
                {
                  name: "收縮壓",
                  data: chart_value[0]
                },
                {
                  name: "舒張壓",
                  data: chart_value[1]
                }
              ],
              options: {
                chart: {
                  height: 350,
                  type: 'line',
                  dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                  },
                  toolbar: {
                    show: false
                  }
                },
                colors: ['#77B6EA', '#545454'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "30px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold"
                  }
                },
                stroke: {
                  curve: 'smooth'
                },
                title: {
                  text: this.state.older_measurement[0][0],
                  align: 'left'
                },
                grid: {
                  borderColor: '#e7e7e7',
                  row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                  },
                },
                markers: {
                  size: 1
                },
                xaxis: {
                  categories: chart_date,
                  title: {
                    text: 'Month',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: '心律',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  },
                  min: 20,
                  max: 170
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right',
                  floating: true,
                  offsetY: -25,
                  offsetX: -5
                }
              },
        };

        //折線圖-飯前血糖
        const chart_2 = {
            series: [
                {
                  name: "飯前血糖",
                  data: chart_value[2]
                }
              ],
              options: {
                chart: {
                  height: 350,
                  type: 'line',
                  dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                  },
                  toolbar: {
                    show: false
                  }
                },
                colors: ['#77B6EA', '#545454'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "30px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold"
                  }
                },
                stroke: {
                  curve: 'smooth'
                },
                title: {
                  text: this.state.older_measurement[0][0],
                  align: 'left'
                },
                grid: {
                  borderColor: '#e7e7e7',
                  row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                  },
                },
                markers: {
                  size: 1
                },
                xaxis: {
                  categories: chart_b_date,
                  title: {
                    text: 'Month',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: '血糖值(飯前)',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  },
                  min: 70,
                  max: 140
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right',
                  floating: true,
                  offsetY: -25,
                  offsetX: -5
                }
              },
        };

        //折線圖-飯後血糖
        const chart_3 = {
            series: [
                {
                  name: "飯後血糖",
                  data: chart_value[3]
                }
              ],
              options: {
                chart: {
                  height: 350,
                  type: 'line',
                  dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                  },
                  toolbar: {
                    show: false
                  }
                },
                colors: ['#77B6EA', '#545454'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "30px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold"
                  }
                },
                stroke: {
                  curve: 'smooth'
                },
                title: {
                  text: this.state.older_measurement[0][0],
                  align: 'left'
                },
                grid: {
                  borderColor: '#e7e7e7',
                  row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                  },
                },
                markers: {
                  size: 1
                },
                xaxis: {
                  categories: chart_a_date,
                  title: {
                    text: 'Month',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: '血糖值(飯後)',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  },
                  min: 100,
                  max: 160
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right',
                  floating: true,
                  offsetY: -25,
                  offsetX: -5
                }
              },
        };

        //折線圖-血脂
        const chart_4 = {
            series: [
                {
                  name: "血脂",
                  data: chart_value[4]
                }
              ],
              options: {
                chart: {
                  height: 350,
                  type: 'line',
                  dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                  },
                  toolbar: {
                    show: false
                  }
                },
                colors: ['#77B6EA', '#545454'],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "30px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold"
                  }
                },
                stroke: {
                  curve: 'smooth'
                },
                title: {
                  text: this.state.older_measurement[0][0],
                  align: 'left'
                },
                grid: {
                  borderColor: '#e7e7e7',
                  row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5
                  },
                },
                markers: {
                  size: 1
                },
                xaxis: {
                  categories: chart_date,
                  title: {
                    text: 'Month',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  }
                },
                yaxis: {
                  title: {
                    text: '血脂',
                    style: {
                        fontSize: "20px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                  },
                  min: 200,
                  max: 250
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right',
                  floating: true,
                  offsetY: -25,
                  offsetX: -5
                }
              },
        };

       
        //折線圖-BMI
        // const chart_5 = {
        //     chart: {
        //       caption: this.state.older_measurement[0][0],
        //       yaxisname: "BMI",
        //       subcaption: "",
        //       baseFont: "Arial",
        //       baseFontSize: "20",
        //       baseFontColor: "#446fc5",
        //       showValues: "1",
        //       numdivlines: "3",
        //       legenditemfontsize: "20",
        //       legenditemfontbold: "1",
        //       plottooltext: "<b>$dataValue</b> Tickets $seriesName on $label",
        //       theme: "fusion"
        //     },
        //     categories: [
        //       {
        //         category: chart_date
        //       }
        //     ],
        //     dataset: [
        //         {
        //             seriesname: "BMI",
        //             data: chart_value[5]
        //         }
        //     ]
        // };

        char_list.push(
            <ReactApexChart options={chart_1.options} series={chart_1.series} type="line" height={550} />
        );
        //沒有血糖紀錄 不寫入圖表
        if (chart_value[2].length != 0){
            char_list.push(
                <ReactApexChart options={chart_2.options} series={chart_2.series} type="line" height={550} />
            );
            char_list.push(
                <ReactApexChart options={chart_3.options} series={chart_3.series} type="line" height={550} />
            );
        }
        char_list.push(
            <ReactApexChart options={chart_4.options} series={chart_4.series} type="line" height={550} />
        );

        //顯示不同權限的輸入框
        if (this.state.permission == 1){
          prescription.push("醫師處方紀錄");
          prescription.push("醫囑評估/治療措施...");
          prescription.push("服用藥物...");
        }
        else if(this.state.permission == 2){
          prescription.push("機構紀錄");
          prescription.push("治療服務...");
          prescription.push("藥物用量...");
        }
        else if(this.state.permission == 3){
          prescription.push("治療師服務紀錄");
          prescription.push("治療服務...");
          prescription.push("藥物用量...");
        }

        console.log(this.state.order_detail);

        //顯示過往紀錄
        if (this.state.order_detail[0].length != 0){
          for (let i=0;i<this.state.order_detail[0].length;i++){
            past_record[i].push(
              <tr>
                  <td>{this.state.order_detail[0][i]}</td>
                  <td>{this.state.order_detail[1][i]}</td>
                  <td>{this.state.order_detail[2][i]}</td>
                  <td>{this.state.order_detail[3][i]}</td>
              </tr>
            );
            if (this.state.order_detail[0][i] != ""){
                past_record.push([]);
            }
          }
        }
        
        return(
            
            <div class="transfer_div">
                <label>
                    <font size="6"><strong>機構住民資訊</strong></font>
                    <br />
                    {/* <font size="5">帳戶</font>
                    <input 
                        type="text"
                        id="account_from"
                        name="account_from"
                        class="transfer_form_input"
                        value={this.state.account_name}
                        disabled
                    />
                    <br />
                    <font size="5">轉給</font>
                    <input 
                        type="text"
                        id="account_to" 
                        name="account_to"
                        class="transfer_form_input"
                        onChange={this.BalanceAccountTo}
                    />
                    <br />
                    <font size="5">金額</font>
                    <input 
                        type="text"
                        placeholder="eth" 
                        id="coin" 
                        name="coin"
                        class="transfer_form_input"
                        onKeyDown={this.KeyEnter} 
                        onChange={this.Coin}
                    />
                    <br /> */}

                    {a1}
                    <br />
                    
                    <Modal
                        isOpen={this.state.showModal}
                        className="modal"
                    >
                        {b1}
                        
                        <table class="order_data_table" border="1">
                            <tr class="order_data_table_top">
                                <td>住民</td>
                                <td>紀錄</td>
                                <td>藥品處方</td>
                                <td>時間</td>
                            </tr>
                            {past_record}
                        </table>

                        <br />
                        <button class="button_transfer_back" onClickCapture={this.CloseModal}>返回</button>
                    </Modal>

                    <Modal
                        isOpen={this.state.showModal2}
                        className="modal"
                    >
                        {char_list}
                        <font size="10"><strong>{prescription[0]}</strong></font>
                        <br />
                        <textarea class="transfer_textarea" id="order" value={this.state.order} onChange={this.order} placeholder={prescription[1]}/>
                        <textarea class="transfer_textarea" id="medicine" value={this.state.medicine} onChange={this.medicine} placeholder={prescription[2]}/>
                        <br />

                        <button class="button_transfer_send" onClickCapture={this.Send}>送出</button>
                        <button class="button_transfer_back" onClickCapture={this.CloseModal2}>返回</button>
                    </Modal>
                    

                    <br /><br />
                    <input class="button_transfer_back" type="button" value="返回" onClickCapture={this.Back} />
                    <br />
                    
                </label>
            </div>          
        );
    }
}
export default Transfer;