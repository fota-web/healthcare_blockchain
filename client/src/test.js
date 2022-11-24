import React, { Component } from 'react';
import getWeb3 from "./getWeb3";
import moment from "moment";

class test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    }
    this.test = this.test.bind(this);
    this.testAsync = this.testAsync.bind(this);
    this.latency = this.latency.bind(this);
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  async test(event) {
    var time = event.target.id;
    var random = Math.floor(Math.random() * 501);

    for (let i=0;i<time;i++){
      await this.testAsync(i,i*12);

      // const web3 = await getWeb3();
      // var a = await web3.eth.getBlock(0)
      // web3.eth.getBlock(0).then(console.log);
      // console.log(i);
    }
  }

  latency() {
    fetch('./test', {
      method: "POST",
      body: JSON.stringify({
      }),
      headers: {
          'Content-Type': 'application/json; charset=utf-8'
      }
    })
    .then(res => res.json())
    .then(res => {

    })
    .catch(err => console.log(err))
  }

  testAsync(i,latency){
    
    return new Promise((resolve,reject)=>{
        //here our function should be implemented 
        setTimeout(()=>{
            //-----------------do-----------------
            fetch('/Transaction', {
              method: "POST",
              body: JSON.stringify({
                account_from: 'account9',
                account_to: 'account0',
                coin: 0
              }),
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            })
            .then(res => res.json())
            .then(res => {
              console.log("讀取第 "+i+" 次區塊");
              console.log(moment().format("ss.SSS"));

            })
            .catch(err => console.log(err))
            //--------------------------------------------
            resolve();
        ;} , latency
        );
    });
  }

  render() {
    return (
      <div>
        <input type="button" id="200" value="測試200" onClickCapture={this.test} />
        <input type="button" id="400" value="測試400" onClickCapture={this.test} />
        <input type="button" id="600" value="測試600" onClickCapture={this.test} />
        <input type="button" id="800" value="測試800" onClickCapture={this.test} />
        <input type="button" id="1000" value="測試1000" onClickCapture={this.test} />
        <input type="button" id="" value="計算延遲" onClickCapture={this.latency} />
      </div>
    );
  }
}

export default test;