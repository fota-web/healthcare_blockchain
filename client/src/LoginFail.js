import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import "./LoginFail.css";

class SecondPage extends Component{
    constructor(props) {
        super(props);
        this.state={
            back: 0
        }
    }
 
    componentDidMount=()=>{
    }

    back=()=>{
        const history = createBrowserHistory();

        history.push("/");
        window.location.reload();
        
    }
    
    render(){
        return(
            <div class="loginfail">
                <form class="form-fail">
                    <strong><font size="7" style={{color:"black",fontFamily:"Microsoft JhengHei"}}>登入失敗 請重新登入</font></strong>
                    <label>
                        <input type="button" class="form-back-btn" value="返回" onClickCapture={this.back} />
                    </label>
                </form>
            </div>
        )
    }
}

export default SecondPage;