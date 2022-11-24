var mysql = require('mysql');
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

var express = require('express');
const session = require('express-session');
var app = express();

var multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'file');
    },
  
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '.jpg');
    }
});
  
var upload = multer({ storage: storage })

app.use(express.json());
app.use(session({
    secret: 'react',
    name: 'user',
    user_web_position: 'main',
    saveUninitialized: false,
    resave: true
}))

var config =
{
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
    port: 3306
}

// var pool  = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'ethereum',
//     port: 3306,
//     // 無可用連線時是否等待pool連線釋放(預設為true)
//     waitForConnections : true,
//     // 連線池可建立的總連線數上限(預設最多為10個連線數)
//     connectionLimit : 10
// });

const account_request_list = 
[
    [],[],[],[],[],[],[],[],[],[]
]
var block_detail = [[]];

function handleConnect(){
    conn = new mysql.createConnection(config)

    conn.connect(function(err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
        }
    })

    // - Error listener
    conn.on('error', function(err) {
        //- The server close the connection.
        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            handleConnect()
        }

        //- Connection in closing
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            handleConnect()
        }

        //- Fatal error : connection variable must be recreated
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            handleConnect()
        }

        //- Error because a connection is already being established
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            handleConnect()
        }

        //- Anything else
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            handleConnect()
        }
    })
}

// function reconnect(connection){
//     console.log("\n New connection tentative...")
//     //- Destroy the current connection variable
//     if(connection) connection.destroy()
//     //- Create a new one
//     //- Try to reconnect
//     pool.getConnection(function(err, connection) {
//         if (err) 
//         {
//             console.log("!!! Cannot connect !!! Error:");
//             throw err;
//         }
//         else
//             writeAccount()
//     });
// }

async function writeAccount(){
    // get accounts
    var acc = await web3.eth.getAccounts()
    var text = ""
    var j = 0
    
    for(let i=0;i<acc.length;i++){
        j++
        text = "update test set account = ' "+ acc[i] +" ' where test.index = "+ j +""
        conn.query(text)
        console.log("account"+i+" OK")
    }

}

async function writeBlock(){
    // get block detail
    var acc = await web3.eth.getAccounts()
    var block_number = await web3.eth.getBlockNumber()
    var detail = [];
    var time = 0;
    var date = [];

    block_detail = [[]]

    text = "delete from block"
    conn.query(text)
    text = "alter table block AUTO_INCREMENT = 1"
    conn.query(text)

    conn.query('SELECT * FROM test', 
        async function (err, results, fields) {
            for (let i=1;i<=block_number;i++){
                detail.push(await web3.eth.getTransactionFromBlock(i))
                time = (await web3.eth.getBlock(i)).timestamp
                time = new Date(time*1000)
                date = String(time).split(" ")
            
                block_detail[i-1].push(detail[i-1].hash)

                for (let j=0;j<results.length;j++){
                    if(detail[i-1].from == acc[j])
                        block_detail[i-1].push(results[j].name)
                }
                for (let j=0;j<results.length;j++){
                    if( block_detail[i-1][1] == 'root'){
                        block_detail[i-1].push(" ")
                        break
                    }
                    else if(detail[i-1].to == acc[j])
                        block_detail[i-1].push(results[j].name)
                }
                
                block_detail[i-1].push(date[3] + " " + date[1]+ "/" + date[2]+ " " + date[4])
                block_detail.push([])
                
        
                text = "insert into block (block.hash,block.from,block.to,block.date) values ('"+block_detail[i-1][0]+"','"+block_detail[i-1][1]+"','"+block_detail[i-1][2]+"','"+block_detail[i-1][3]+"')"
                conn.query(text)
            }
            block_detail.pop()
            console.log("block loading is done")
        }
    )
}

handleConnect()
writeAccount()
// writeBlock()

// app.get('/api', (req, res) => {
//     conn.query(select, (err, results) => {
//         if(err) {
//             return res.send(err)
//         } else {
//             return res.json({
//                 data: results
//             })
//         }
//     })
// })
app.post('/insert_data', function (req, res) {
    conn.query('SELECT * FROM older_data', 
        function (err, results, fields) {
            //收縮壓正常範圍
            var sbp_max = 119
            var sbp_min = 90
            //舒張壓正常範圍
            var dbp_max = 79
            var dbp_min = 60

            //收縮壓-高血壓範圍
            var high_sbp_max = 139
            var high_sbp_min = 120
            //舒張壓-高血壓範圍
            var high_dbp_max = 90
            var high_dbp_min = 80

            //飯前血糖
            var b_glucose_max = 130
            var b_glucose_min = 80
            //飯後血糖
            var a_glucose_max = 160
            var a_glucose_min = 100

            //血脂
            var fat_max = 239
            var fat_min = 200

            //BMI
            var bmi = 0

            //date
            var date = "2022-04-"
            //time
            var b_time =  "11:"
            var a_time =  "13:"

            //亂數跑
            //正常收縮壓-舒張壓
            var sbp = 0
            var dbp = 0
            //高血壓
            var h_sbp = 0
            var h_dbp = 0
            //血糖
            var b_glucose = 0
            var a_glucose = 0
            //血脂
            var fat = 0
            //BMI
            var bmi = 0

            for (i=1;i<=26;i=i+2){
                for (j=0;j<results.length;j++){
                    //有糖尿病史/肥胖
                    if (results[j].other == "糖尿病史" || results[j].other == "肥胖"){
                        //亂數跑
                        //正常收縮壓-舒張壓
                        sbp = Math.floor(Math.random() * (sbp_max - sbp_min + 1)) + sbp_min
                        dbp = Math.floor(Math.random() * (dbp_max - dbp_min + 1)) + dbp_min
                        //高血壓
                        h_sbp = Math.floor(Math.random() * (high_sbp_max - high_sbp_min + 1)) + high_sbp_min
                        h_dbp = Math.floor(Math.random() * (high_dbp_max - high_dbp_min + 1)) + high_dbp_min
                        //血糖
                        b_glucose = Math.floor(Math.random() * (b_glucose_max - b_glucose_min + 1)) + b_glucose_min
                        a_glucose = Math.floor(Math.random() * (a_glucose_max - a_glucose_min + 1)) + a_glucose_min
                        //血脂
                        fat = Math.floor(Math.random() * (fat_max - fat_min + 1)) + fat_min
                        //BMI
                        bmi = results[j].weight/Math.pow((results[j].height/100),2)
                        bmi = Math.round((bmi + Number.EPSILON) * 100) / 100
                        text = "insert into data_measurement (user_id,name,sbp,dbp,b_glucose,fat,bmi,date) values ('"+results[j].user_id+"','"+results[j].name+"',"+sbp+","+dbp+","+b_glucose+","+fat+","+bmi+",'"+date+i+" "+b_time+(11+i)+":"+i+"');"
                        conn.query(text)


                        //亂數跑
                        //正常收縮壓-舒張壓
                        sbp = Math.floor(Math.random() * (sbp_max - sbp_min + 1)) + sbp_min
                        dbp = Math.floor(Math.random() * (dbp_max - dbp_min + 1)) + dbp_min
                        //高血壓
                        h_sbp = Math.floor(Math.random() * (high_sbp_max - high_sbp_min + 1)) + high_sbp_min
                        h_dbp = Math.floor(Math.random() * (high_dbp_max - high_dbp_min + 1)) + high_dbp_min
                        //血糖
                        b_glucose = Math.floor(Math.random() * (b_glucose_max - b_glucose_min + 1)) + b_glucose_min
                        a_glucose = Math.floor(Math.random() * (a_glucose_max - a_glucose_min + 1)) + a_glucose_min
                        //血脂
                        fat = Math.floor(Math.random() * (fat_max - fat_min + 1)) + fat_min
                        //BMI
                        bmi = results[j].weight/Math.pow((results[j].height/100),2)
                        bmi = Math.round((bmi + Number.EPSILON) * 100) / 100
                        text = "insert into data_measurement (user_id,name,sbp,dbp,a_glucose,fat,bmi,date) values ('"+results[j].user_id+"','"+results[j].name+"',"+sbp+","+dbp+","+a_glucose+","+fat+","+bmi+",'"+date+i+" "+a_time+(10+i)+":"+i+"');"
                        conn.query(text)
                    }
                    //高血壓
                    else if (results[j].other == "高血壓"){
                        //亂數跑
                        //正常收縮壓-舒張壓
                        sbp = Math.floor(Math.random() * (sbp_max - sbp_min + 1)) + sbp_min
                        dbp = Math.floor(Math.random() * (dbp_max - dbp_min + 1)) + dbp_min
                        //高血壓
                        h_sbp = Math.floor(Math.random() * (high_sbp_max - high_sbp_min + 1)) + high_sbp_min
                        h_dbp = Math.floor(Math.random() * (high_dbp_max - high_dbp_min + 1)) + high_dbp_min
                        //血糖
                        b_glucose = Math.floor(Math.random() * (b_glucose_max - b_glucose_min + 1)) + b_glucose_min
                        a_glucose = Math.floor(Math.random() * (a_glucose_max - a_glucose_min + 1)) + a_glucose_min
                        //血脂
                        fat = Math.floor(Math.random() * (fat_max - fat_min + 1)) + fat_min
                        //BMI
                        bmi = results[j].weight/Math.pow((results[j].height/100),2)
                        bmi = Math.round((bmi + Number.EPSILON) * 100) / 100
                        text = "insert into data_measurement (user_id,name,sbp,dbp,fat,bmi,date) values ('"+results[j].user_id+"','"+results[j].name+"',"+h_sbp+","+h_dbp+","+fat+","+bmi+",'"+date+i+" "+b_time+(10+i)+":"+i+"');"
                        conn.query(text)
                    }
                    else{
                        //亂數跑
                        //正常收縮壓-舒張壓
                        sbp = Math.floor(Math.random() * (sbp_max - sbp_min + 1)) + sbp_min
                        dbp = Math.floor(Math.random() * (dbp_max - dbp_min + 1)) + dbp_min
                        //高血壓
                        h_sbp = Math.floor(Math.random() * (high_sbp_max - high_sbp_min + 1)) + high_sbp_min
                        h_dbp = Math.floor(Math.random() * (high_dbp_max - high_dbp_min + 1)) + high_dbp_min
                        //血糖
                        b_glucose = Math.floor(Math.random() * (b_glucose_max - b_glucose_min + 1)) + b_glucose_min
                        a_glucose = Math.floor(Math.random() * (a_glucose_max - a_glucose_min + 1)) + a_glucose_min
                        //血脂
                        fat = Math.floor(Math.random() * (fat_max - fat_min + 1)) + fat_min
                        //BMI
                        bmi = results[j].weight/Math.pow((results[j].height/100),2)
                        bmi = Math.round((bmi + Number.EPSILON) * 100) / 100
                        text = "insert into data_measurement (user_id,name,sbp,dbp,fat,bmi,date) values ('"+results[j].user_id+"','"+results[j].name+"',"+sbp+","+dbp+","+fat+","+bmi+",'"+date+i+" "+b_time+(10+i)+":"+i+"');"
                        conn.query(text)
                    }
                    

                }
                // console.log(time+i+":"+(2*i))

                // console.log(sbp)
                // console.log(dbp)
                // console.log(h_sbp)
                // console.log(h_dbp)
                // console.log(fat)
                // console.log("--------")
                
            }

            // console.log(date)
            // console.log(date+" 12:15:55")
            

        }
    )
})

app.post('/test', function (req, res) {
    conn.query('SELECT * FROM analysis', 
    function (err, results, fields) {

        var latency = 0

        for (let i=0;i<results.length;i++){
            if (i>0){
                if (parseFloat(results[i].time) < parseFloat(results[i-1].time)){
                    latency = parseFloat(results[i].time) + (60 - parseFloat(results[i-1].time))
                }
                else {
                    latency = parseFloat(results[i].time) - parseFloat(results[i-1].time)
                }
                
                text = "update analysis set latency = "+latency+" where id = "+(i+1)+";"
                conn.query(text)
            }
        }
    })
})

app.post('/read', function (req, res) {
    conn.query('SELECT * FROM analysis', 
    async function (err, results, fields) {
        var moment = require('moment')
        var a = await web3.eth.getBlock(req.body.random)

        console.log(req.body.random)


        // text = "insert into analysis (`time`) values ('"+moment().format("ss.SSS")+"');"
        // conn.query(text)
    })
})

app.post('/CheckLogin', function (req, res) {
    conn.query('SELECT * FROM test', 
        function (err, results, fields) {
            var count = 0;
            //run all query
            for (i = 0; i < results.length; i++) {
                count = count + 1;
                if (req.body.id == results[i].id & req.body.password == results[i].password){
                    req.session.user = results[i].value
                    // console.log(req.session)

                    if (results[i].permission == 0){
                        return res.send("0");
                    }
                    else if (results[i].permission == 1){
                        return res.send("1");
                    }
                    else if (results[i].permission == 2){
                        return res.send("2");
                    }
                    else if (results[i].permission == 3){
                        return res.send("3");
                    }
                    else if (results[i].permission == 4){
                        return res.send("4");
                    }                        
                }              
                else if (results.length == count)
                    return res.send("Warning!!!");
            }
            
        }
    )
})

app.post('/LoginState', function (req, res) {
    conn.query('SELECT * FROM test', 
        function (err, results, fields) {
            var user_name = ""
            var user_account = ""
            var user_permission = 0 

            //check logout
            if (req.body.state == 0){
                req.session.destroy(() => {
                    console.log(req.body.account+" State：Logout")
                    console.log('session destroyed')
                })
            }
            else if (!req.session.user){
                console.log("未授權ID已遭攔截")
                return res.json({
                    flag: 0
                });
            }
            else if (req.body.flag == 3){
                //暫存使用者名稱
                for (let i=0;i<results.length;i++){
                    if(req.session.user == 'account'+i){
                        user_name = results[i].name
                        user_account = results[i].value,
                        user_permission = results[i].permission
                        user_job = results[i].job
                    }
                }
                //判斷該使用者是否符合讀取資格
                conn.query('SELECT * FROM system', 
                    function (err, results, fields) {
                        for (let i=0;i<results.length;i++){
                            if (user_name == results[i].ch1 || user_name == results[i].ch2){
                                if (results[i].check == 1){
                                    req.session.user_web_position = "Dr_main"
                                    return res.json({
                                        account: user_account,
                                        name: user_name,
                                        permission: user_permission,
                                        check: 1
                                    });
                                }
                                else {
                                    return res.json({
                                        account: user_account,
                                        name: user_name,
                                        permission: user_permission,
                                        check: 0
                                    });
                                }
                            }
                            else if (user_permission == 2){
                                req.session.user_web_position = "In_main"
                                return res.json({
                                    account: user_account,
                                    name: user_name,
                                    permission: user_permission,
                                    check: 1
                                });
                            }
                            else if (user_permission == 3){
                                req.session.user_web_position = "Th_main"
                                return res.json({
                                    account: user_account,
                                    name: user_name,
                                    permission: user_permission,
                                    check: 1
                                });
                            }
                            else if (user_permission == 4){
                                req.session.user_web_position = "Co_main"
                                return res.json({
                                    account: user_account,
                                    name: user_name,
                                    permission: user_permission,
                                    check: 0
                                });
                            }
                        }
                    }
                )
            }
            else if(req.session.user == 'Management'){
                return res.json({
                    name: 'management',
                    permission: 0
                });
            }
            else {// check login
                for (let i=0;i<results.length;i++){
                    if(req.session.user == 'account'+i){
                        console.log(req.session.user+" State：Login")
                        return res.json({
                            account: results[i].value,
                            name: results[i].name,
                            job: results[i].job,
                            permission: results[i].permission
                        });
                    }
                }
            }
        }
    )
})

app.post('/GetBalance', function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            var acc = await web3.eth.getAccounts()

            for (let i=0;i<results.length;i++){
                var bal = await web3.eth.getBalance(acc[i])

                if(req.session.user == 'account'+i){
                    console.log("correct")
                    return res.json({
                        balance: bal
                    });
                }
            }
        }
    )
})

app.post('/Transaction', async function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            var account_from = "0"
            var account_to = "0"
            var flag_1 = 0
            var flag_2 = 0
            var coin = parseInt(req.body.coin)

            //get account_from balance
            var acc = await web3.eth.getAccounts()
            for (i=0;i<results.length;i++){        
                if(req.body.account_from == 'account'+i){        
                    var account_from_bal = await web3.eth.getBalance(acc[i])
                }
            }
            account_from_bal = account_from_bal/1000000000000000000

            for (i=0;i<results.length;i++){
                if(flag_1 == 1 & flag_2 == 1){// account_from & account_to 確認完畢
                    break
                }
                if(req.body.account_from == 'account'+i & flag_1 == 0){
                    account_from = results[i].account.trim()
                    flag_1 = 1
                }
                if(req.body.account_to == 'account'+i & flag_2 == 0){
                    account_to = results[i].account.trim()
                    flag_2 = 1
                }
                else if(req.body.account_to == results[i].name & flag_2 == 0){
                    account_to = results[i].account.trim()
                    flag_2 = 1
                }
                //for main transaction
                if(req.body.account_to == results[i].account.trim() & flag_2 == 0){
                    account_to = results[i].account.trim()
                    flag_2 = 1
                }
            }

            if (account_from == "0"){
                return res.send("Transaction is Failed !!");
            }
            else{
                if (account_to == "0"){
                    return res.send("Transaction is Failed !!");
                }
                else{
                    if (typeof(coin) != 'number' || coin < 0){
                        return res.send("Coin is Failed !!");
                    }
                    else if (account_from_bal < coin){
                        return res.send("Balance is not enough !!");
                    }
                    else{
                        if (req.session.user_web_position != "Transfer"){
                            var txnObject = {
                                "from": account_from,
                                "to": account_to,
                                "value": coin * 1000000000000000000
                            };
        
                            web3.eth.sendTransaction(txnObject, function(error, result){
                                if(error) {
                                    console.log(error);
                                } else {
                                    //change user position
                                    req.session.main = "Transfer"
    
                                    console.log("明細")
                                    console.log("--------------------------------------------------")
                                    console.log("來自："+account_from)
                                    console.log("餘額："+account_from_bal)
                                    // console.log("轉帳："+coin+" ETH")
                                    // console.log("對象："+account_to)

                                    console.log("內容：已完成護理表單記錄上傳")
                                    var moment = require('moment');
                                    console.log("時間：15:15:50.239")
                                    console.log("--------------------------------------------------")
    
                                    var txn_hash = result; //Get transaction hash
                                    console.log("交易完成："+txn_hash);
                                    write_block()
                                    var moment = require('moment');
                                    // console.log(moment().format("hh:mm:ss.SSS"))
                                    

                                    text = "insert into analysis (`hash`,`time`) values ('"+txn_hash+"','"+moment().format("ss.SSS")+"');"
                                    conn.query(text)           
                                    
                                    return res.json({
                                        text: "Transaction is Successful !!",
                                        hash: txn_hash,
                                        flag: 1
                                    });
                                }
                            });
                        }
                        else if (req.body.flag == "main_transaction"){
                            var txnObject = {
                                "from": account_from,
                                "to": account_to,
                                "value": coin * 1000000000000000000
                            };
        
                            web3.eth.sendTransaction(txnObject, function(error, result){
                                if(error) {
                                    console.log(error);
                                } else {
                                    //change user position
                                    req.session.main = "Transfer"
    
                                    console.log("明細")
                                    console.log("--------------------------------------------------")
                                    console.log("來自："+account_from)
                                    console.log("餘額："+account_from_bal)
                                    console.log("轉帳："+coin+" ETH")
                                    console.log("對象："+account_to)
                                    console.log("--------------------------------------------------")
    
                                    var txn_hash = result; //Get transaction hash
                                    console.log("交易完成："+txn_hash);
                                    write_block()
                                    return res.json({
                                        text: "Transaction is Successful !!",
                                        hash: txn_hash,
                                        flag: 1
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }
    )
})

app.post('/User_Choose_Request', function(req,res){
    conn.query('SELECT * FROM test', 
        function (err, results, fields){
    conn.query('SELECT * FROM promise_request', 
        function (err, results_2, fields){
            var user_account
            var request_user_account

            var user_name = req.body.user_name
            var user_job = req.body.user_job
            var click_request_name = req.body.click_request_name
            var click_request_job = req.body.click_request_job

            for (let i = 0; i < results.length; i++) {
                // user_account
                if (user_name == results[i].name && user_job == results[i].job){
                    user_account = results[i].value
                }
                // request_user_account
                if (click_request_name == results[i].name && click_request_job == results[i].job){
                    request_user_account = results[i].value
                }
            }



            //取得已授權的資料
            var d = new Date()
            var now_year = d.getFullYear()
            var now_month = d.getMonth() + 1
            var now_day = d.getDate()
            var flag = 1
            for (let i = 0; i < results_2.length; i++) {
                var date = results_2[i].end_date.split(" ")[0]
                var end_date = date.split("-")
                //判斷對方 & 使用者
                if (req.body.click_request == results_2[i].user_name && req.body.user_name == results_2[i].promise_name){
                    //判斷年份 & 月份 & 日
                    if (end_date[0] > now_year){
                        flag = 0
                    }
                    else if (end_date[0] == now_year){
                        if (end_date[1] > now_month){
                            flag = 0
                        }
                        else if (end_date[1] == now_month){
                            if (end_date[2] > now_day){
                                flag = 0
                            }
                            else if (end_date[2] == now_day){
                                text = "delete from promise_request where `user_name` = '"+click_request_name+"' and `promise_name` = '"+user_name+"'"
                                conn.query(text)
                                flag = 1
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < results.length; i++) {
                if (req.body.user_name == results[i].name & req.body.password == results[i].password){ 
                    //判斷重複請求的情況
                    for (let j = 0; j <= account_request_list[request_user_account.split("t")[1]].length; j++) {
                        //已授權在期限內且重複的情況
                        if (flag == 0){
                            return res.json({
                                text: "already promise"
                            });
                        }
                        //尚未授權且重複的情況
                        else if (account_request_list[request_user_account.split("t")[1]][j] == req.body.user_name){
                            return res.json({
                                text: "double promise"
                            });
                        }
                        else{//第一次請求 寫入account_request_list
                            account_request_list[request_user_account.split("t")[1]].push(user_account)

                            console.log(user_name+user_job+" 請求 "+click_request_name+click_request_job+" 授權 ")
                            console.log(account_request_list)
                            return res.json({
                                text: "promise check"
                            });  
                        }  
                    }                    
                }
                else if (results.length-1 == i){
                    return res.json({
                        text: "Warning!!!"
                    });  
                }
            }
        }
    )
        }
    )
})

app.post('/User_Request', function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){

            var d = new Date()
            var now_year = d.getFullYear()
            var now_month = d.getMonth() + 1
            var now_day = d.getDate()
            var now_hour = d.getHours()
            var now_min = d.getMinutes()
            var now_sec = d.getSeconds()
            var now = now_year+"-"+now_month+"-"+now_day+" "+now_hour+":"+now_min+":"+now_sec
            
            var end_month = now_month + parseInt(req.body.promise_mon)
            var end_year = now_year
            //授權結束時間超過月份
            if (end_month > 12){
                end_month = end_month - 12
                end_year = end_year + 1
            }
            var end = end_year+"-"+end_month+"-"+now_day+" "+now_hour+":"+now_min+":"+now_sec

            //允許授權
            if (req.body.value == "yes"){
                var promise_name = ""
                var promise_job = ""

                for (let i=0;i<results.length;i++){
                    if (req.body.promise_name == results[i].value){
                        promise_name = results[i].name
                        promise_job = results[i].job
                    }
                }
                text = "Insert into promise_request(user_name,user_job,promise_name,promise_job,state,start_date,end_date) values ('"+req.body.user_name+"','"+req.body.user_job+"','"+promise_name+"','"+promise_job+"',1,'"+now+"','"+end+"')"
                conn.query(text)

                console.log("--------------------------------------------------")
                console.log(new Date())
                console.log(req.body.user_name+" 已授權 "+req.body.promise_name)

                //delete account_request_list
                for (let i=0;i<10;i++){
                    if (req.body.promise_name == account_request_list[req.session.user.split("t")[1]][i]){
                        account_request_list[req.session.user.split("t")[1]].splice(i, 1)
                    }
                }
                // console.log(account_request_list)
            }
            //拒絕授權
            else if(req.body.value == "no"){
                console.log(new Date())
                console.log(req.body.user_name+" 拒絕 "+req.body.promise_name)

                //delete account_request_list
                for (let i=0;i<10;i++){
                    if (req.body.promise_name == account_request_list[req.session.user.split("t")[1]][i]){
                        account_request_list[req.session.user.split("t")[1]].splice(i, 1)
                    }
                }
                // console.log(account_request_list)
            }
            else{
                var list_index = req.session.user.split("t")[1]
                var list_name = []

                for (let i=0;i<account_request_list[list_index].length;i++){
                    for (let j=0;j<results.length;j++){
                        if (account_request_list[list_index][i] == results[j].value){
                            list_name.push(results[j].name+results[j].job)
                        }
                    }
                }

                return res.json({
                    account_request_list: account_request_list,
                    account_request_list_name: list_name
                });
            }
        }
    )
})

app.post('/Get_Information', function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            var acc = await web3.eth.getAccounts()
            var from_name="",to_name=""
            var account_name_list = []
            var count = 0
            
            if (req.body.getname == 0){
                for (let i=0;i<results.length;i++){
                    account_name_list[i] = results[i].name
                }
                return res.json({
                    name: account_name_list
                });
            }
            else if(req.body.getname == 1){
                for (let i=0;i<results.length;i++){//找使用者
                    if(req.session.user == results[i].value){
                        for (let j=0;j<results.length;j++){//將名單寫入
                            if(results[i].permission == 1 && results[j].permission == 2){//(醫師>機構)
                                    account_name_list[count] = results[j].name
                                    count++
                            }
                            else if(results[i].permission == 2 && results[j].permission == 1){//(機構>醫師)
                                    account_name_list[count] = results[j].name
                                    count++
                            }
                        }
                        return res.json({
                            name: account_name_list
                        });
                    }
                }
            }
            else {
                for (let i=0;i<results.length;i++){
                    if(req.body.from == acc[i]){
                        from_name = results[i].name
                    }
                    if(req.body.to == acc[i]){
                        to_name = results[i].name
                    }
                }
                return res.json({
                    from_name: from_name,
                    to_name: to_name
                });
            }
        }
    )
})

app.post('/Get_System', function(req,res){
    conn.query('SELECT * FROM system', 
        async function (err, results, fields){
            var ch = 
            [
                [],[]
            ]
            var check = []
            
            for (let i=0;i<results.length;i++){
                if (results[i].check == 1){
                    check[i] = "已通過審核"
                  }
                  else if (results[i].check == 0){
                    check[i] = "已取消該申請"
                  }
                  else
                    check[i] = "待審核通過..."
                
                ch[0].push(results[i].ch1)
                ch[1].push(results[i].ch2)
            }
            return res.json({
                ch: ch,
                check: check
            });
        }
    )
})

app.post('/Apply_State', function(req,res){
    conn.query('SELECT * FROM system', 
        async function (err, results, fields){
            for (let i=0;i<results.length;i++){
                if (results.length-1 == i){
                    if (req.body.user_name != results[i].ch1 || req.body.user_name != results[i].ch2){
                        if (req.body.permission == 1)
                        text = "Insert into system(ch1,ch2,date) values ('"+ req.body.user_name +"','"+ req.body.ch2 +"',now())"
                        else
                            text = "Insert into system(ch1,ch2,date) values ('"+ req.body.ch2 +"','"+ req.body.user_name +"',now())"
                        conn.query(text)
                        return res.json({
                            text: "已送出申請，待主管機關審核..."
                        });
                    }
                }
                else if (req.body.user_name == results[i].ch1 || req.body.user_name == results[i].ch2){
                    if (results[i].check == 1){
                        return res.json({
                            text: "已申請成功"
                        });
                    }
                    else if (results[i].check == 0){
                        return res.json({
                            text: "已取消您的申請"
                        });
                    }
                    else{
                        return res.json({
                            text: "待主管機關審核..."
                        });
                    }
                }
                
            }
            if (results.length == 0){
                text = "Insert into system(ch1,ch2,date) values ('"+ req.body.user_name +"','"+ req.body.ch2 +"',now())"
                conn.query(text)
                return res.json({
                    text: "已送出申請，待主管機關審核..."
                });
            }
        }
    )
})

app.post('/Get_Older_Data', function(req,res){
    conn.query('SELECT * FROM older_data', 
        async function (err, results, fields){
            var older_data = [
                [],[],[],[],[],[],[]
            ]

            for (let i=0;i<results.length;i++){
                older_data[0][i] = results[i].user_id
                older_data[1][i] = results[i].name
                older_data[2][i] = results[i].sex
                older_data[3][i] = results[i].age
                older_data[4][i] = results[i].height
                older_data[5][i] = results[i].weight
                older_data[6][i] = results[i].other
            }

            return res.json({
                older_data: older_data
            });
        }
    )
})

app.post('/Get_Older_Measurement_Date', function(req,res){
    conn.query('SELECT * FROM data_measurement', 
        async function (err, results, fields){
            var year = []
            var month = [[]]
            var first_write = 0
            var c = 0

            for (let i=0;i<results.length;i++){
                if (req.body.older_id == results[i].user_id){
                    //第一次寫入陣列
                    if (first_write == 0){
                        year.push(results[i].date.split("-")[0])
                        month[c].push(results[i].date.split("-")[1])
                        first_write = 1
                    }
                    else{
                        //判斷年份是否重複
                        for (let j=0;j<year.length;j++){
                            if (results[i].date.split("-")[0] == year[j])
                                break
                            else if (results[i].date.split("-")[0] != year[j] && year.length-1 == j){
                                year.push(results[i].date.split("-")[0])
                                //跳下一個陣列存當年月份
                                c++
                                month.push([results[i].date.split("-")[1]])
                            }
                        }
                        //判斷月份是否重複
                        for (let j=0;j<month[c].length;j++){
                            if (results[i].date.split("-")[1] == month[c][j])
                                break
                            else if (results[i].date.split("-")[1] != month[c][j] && month[c].length-1 == j)
                                month[c].push(results[i].date.split("-")[1])
                        }
                    }
                }                
            }

            conn.query('SELECT * FROM order_data', 
                async function (err, results, fields){
                    var order_detail = [[],[],[],[],[]]
                    var c = 0

                    for (let j=0;j<results.length;j++){
                        // 判斷醫師/治療師，病患資料是否相同
                        if(req.body.user_name == results[j].leader && req.body.older_id == results[j].user_id){
                            order_detail[0][c] = results[j].name
                            order_detail[1][c] = results[j].order
                            order_detail[2][c] = results[j].medicine
                            order_detail[3][c] = results[j].date
                            c++
                        }
                    }

                    return res.json({
                        year: year,
                        month: month,
                        order_detail: order_detail
                    });
                }
            )

            // return res.json({
            //     year: year,
            //     month: month
            // });
            
        }
    )
})

app.post('/Get_Older_Measurement', function(req,res){
    conn.query('SELECT * FROM data_measurement', 
        async function (err, results, fields){
            var older_detail = [
                [],[],[],[],[],[],[],[],[]
            ]
            var c = 0

            for (let i=0;i<results.length;i++){
                if (req.body.older_id == results[i].user_id){
                    //判斷年份
                    if (results[i].date.split("-")[0] == req.body.date.split("-")[0]){
                        //判斷月份
                        if (results[i].date.split("-")[1] == req.body.date.split("-")[1]){
                            older_detail[0][c] = results[i].name
                            older_detail[1][c] = results[i].sbp
                            older_detail[2][c] = results[i].dbp
                            older_detail[3][c] = results[i].b_glucose
                            older_detail[4][c] = results[i].a_glucose
                            older_detail[5][c] = results[i].fat
                            older_detail[6][c] = results[i].bmi
                            older_detail[7][c] = results[i].date
                            c++
                        }
                    }
                }                
            }

            return res.json({
                detail: older_detail
            });
            
        }
    )
})

app.post('/Save_Order', function(req,res){
    conn.query('SELECT * FROM older_data', 
        async function (err, results, fields){
            var name = ""

            for (let i=0;i<results.length;i++){
                if (req.body.older_id == results[i].user_id){
                    name = results[i].name
                }
            }
            text = "insert into order_data (`hash`,`leader`,`user_id`,`name`,`order`,`medicine`,`date`) values ('"+req.body.hash+"','"+req.body.leader+"','"+req.body.older_id+"','"+name+"','"+req.body.order+"','"+req.body.medicine+"',now());"
            conn.query(text)

            return res.json({
                text: "OK",
                flag: 1
            });
        }
    )
})

app.post('/Get_Past_Order', function(req,res){
    conn.query('SELECT * FROM order_data', 
        async function (err, results, fields){
            var order_detail = [[]]
            var c = 0

            for (let j=0;j<results.length;j++){
                // 判斷醫師/治療師，病患資料是否相同
                if(req.body.user_name == results[j].leader && req.body.patient_id == results[j].user_id){
                    order_detail[c].push(results[j].leader)
                    order_detail[c].push(results[j].name)
                    order_detail[c].push(results[j].order)
                    order_detail[c].push(results[j].medicine)
                    order_detail[c].push(results[j].date)
                    c++
                }
            }

            return res.json({
                order_detail: order_detail
            });
        }
    )
})

app.post('/CheckBlockDetail', function(req,res){
    //使用者
    var user_name = req.body.user_name
    var user_account = ""
    //請求對方
    var promise_name = req.body.promise_name
    var promise_account = ""
    //區塊hash
    var hash = req.body.hash
    //個案ID
    var user_id = req.body.user_id
    
    var order_detail = [[]]
    var c = 0
    var state = 0

    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            for (let i=0;i<results.length;i++){
                if (user_name == results[i].name)
                    user_account = results[i].value
                if (promise_name == results[i].name)
                    promise_account = results[i].value
            }

            //同一個人讀取自己的區塊
            if (user_name == promise_name){
                conn.query('SELECT * FROM order_data', 
                    async function (err, results, fields){
                        for (let j=0;j<results.length;j++){
                            // 判斷授權對象是否相同
                            if(promise_name == results[j].leader && hash == results[j].hash && user_id == results[j].user_id){
                                order_detail[c].push(results[j].leader)
                                order_detail[c].push(results[j].job)
                                order_detail[c].push(results[j].name)
                                order_detail[c].push(results[j].order)
                                order_detail[c].push(results[j].medicine)
                                order_detail[c].push(results[j].date)
                                c++
                                order_detail.push([])
                            }
                        }
                        return res.json({
                            order_detail: order_detail,
                            text: "promise"
                        });
                    }
                )
            }
            //不同人讀取自己的區塊
            else{
                //判斷使用者是否有被授權
                conn.query("SELECT * FROM promise_request", 
                    async function (err, results, fields){
                        var d = new Date()
                        var now_year = d.getFullYear()
                        var now_month = d.getMonth() + 1
                        var now_day = d.getDate()

                        //判斷授權是否為1
                        for (let i=0;i<results.length;i++){
                            if (user_name == results[i].promise_name && promise_name == results[i].user_name){
                                state = results[i].state
                                var date = results[i].end_date.split(" ")[0]
                                var end_date = date.split("-")
                            }
                        }
                        if (state == 1){
                            //判斷時間是否符合
                            if (end_date[0] < now_year){
                                return res.json({
                                    text: "date over"
                                });
                            }
                            else if (end_date[0] == now_year){
                                if (end_date[1] < now_month){
                                    return res.json({
                                        text: "date over"
                                    });
                                }
                                else if (end_date[1] == now_month){
                                    if (end_date[2] <= now_day){
                                        return res.json({
                                            text: "date over"
                                        });
                                    }
                                }
                            }
                            conn.query('SELECT * FROM order_data', 
                                async function (err, results, fields){
                                    for (let j=0;j<results.length;j++){
                                        // 判斷授權對象是否相同
                                        if(promise_name == results[j].leader && hash == results[j].hash && user_id == results[j].user_id){
                                            order_detail[c].push(results[j].leader)
                                            order_detail[c].push(results[j].job)
                                            order_detail[c].push(results[j].name)
                                            order_detail[c].push(results[j].order)
                                            order_detail[c].push(results[j].medicine)
                                            order_detail[c].push(results[j].date)
                                            c++
                                            order_detail.push([])
                                        }
                                    }
                                    return res.json({
                                        order_detail: order_detail,
                                        text: "promise"
                                    });
                                }
                            )
                        }
                        else{
                            return res.json({
                                text: "not promise"
                            });
                        }
                    
                    }
                )
            }


        }
    )
})

app.post('/Get_All_Patient_Record', function(req,res){
    conn.query('SELECT * FROM order_data', 
        async function (err, results, fields){
            var leader = req.body.leader
            var job = req.body.job
            var user_id = req.body.user_id

            var order_detail = [[]]
            var c = 0

            for (let i=0;i<results.length;i++){
                if(leader == results[i].leader && job == results[i].job && user_id == results[i].user_id){
                    order_detail[c].push(results[i].leader)
                    order_detail[c].push(results[i].job)
                    order_detail[c].push(results[i].name)
                    order_detail[c].push(results[i].order)
                    order_detail[c].push(results[i].medicine)
                    order_detail[c].push(results[i].date)
                    c++
                    order_detail.push([])
                }
            }

            return res.json({
                order_detail: order_detail
            });
        }
    )
})

app.post('/system_update', function(req,res){
    conn.query('SELECT * FROM system', 
        async function (err, results, fields){
            var check = 0   //1審核通過 0取消審核通過 3-4已是該狀態

            for (let i=0;i<results.length;i++){
                if (req.body.ch1 == results[i].ch1){
                    //情況一：通過狀態，按鈕按下接受
                    if (results[i].check == 1 && req.body.update == 1){
                        check = 3
                    }
                    //情況二：通過狀態，按鈕按下取消
                    else if(results[i].check == 1 && req.body.update == 0){
                        check = 0
                        text = "update system set system.check = 0 where ch1 = '"+results[i].ch1+"'"
                        conn.query(text)
                    }
                    //情況三：取消狀態，按鈕按下接受
                    else if(results[i].check == 0 && req.body.update == 1){
                        check = 1
                        text = "update system set system.check = 1 where ch1 = '"+results[i].ch1+"'"
                        conn.query(text)
                    }
                    //情況四：取消狀態，按鈕按下取消
                    else if(results[i].check == 0 && req.body.update == 0){
                        check = 4
                    }
                    //情況五：申請狀態，按鈕按下接受
                    else if(results[i].check == null && req.body.update == 1){
                        check = 1
                        text = "update system set system.check = 1 where ch1 = '"+results[i].ch1+"'"
                        conn.query(text)
                    }
                    //情況六：申請狀態，按鈕按下取消
                    else if(results[i].check == null && req.body.update == 0){
                        check = 0
                        text = "update system set system.check = 0 where ch1 = '"+results[i].ch1+"'"
                        conn.query(text)
                    }
                }
            }


            return res.json({
                check: check
            })
        }
    )
})

app.post('/Get_Promise_node_count', function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            var user_index = 0
            var count = 0

            for (let i=0;i<results.length;i++){
                if (req.body.user_account == results[i].value){
                    user_index = i
                }
            }
            // console.log(user_index)

            for (let i=0;i<account_request_list[user_index].length;i++){
                count++
            }

            return res.json({
                count: count
            });
        }
    )
})

app.post('/Get_Block', function(req,res){
    conn.query('SELECT * FROM test', 
        async function (err, results, fields){
            var hash = []
            var from_name = []
            var to_name = []
            var timestamp = []

            for (let i=0;i<block_detail.length;i++){
                hash.push(block_detail[i][0])
                from_name.push(block_detail[i][1])
                to_name.push(block_detail[i][2])
                timestamp.push(block_detail[i][3])
            }

            return res.json({
                hash: hash,
                from_name: from_name,
                to_name: to_name,
                timestamp: timestamp
            });
        }
    )
})

app.post('/Get_patient_list', function(req,res){
    conn.query('SELECT * FROM older_data', 
        async function (err, results, fields){
            var list = [[]]

            for(let i=0;i<results.length;i++){
                list[i].push(results[i].user_id)
                list[i].push(results[i].number)
                list[i].push(results[i].name)
                list.push([])
            }

            return res.json({
                patient_list:list
            })
        }
    )
})

app.post('/Get_Patient_Block_Content', function(req,res){
    conn.query('SELECT * FROM order_data', 
        async function (err, results, fields){
            var list = [[]]
            var user_id  =  req.body.user_id
            var count  =  0

            for (let i=0;i<results.length;i++){
                // if(results[i].leader == leader)
                // if(results[i].job == job)
                if(results[i].user_id == user_id){
                    list[count].push(results[i].leader)
                    list[count].push(results[i].job)
                    list[count].push(results[i].date)
                    list[count].push(results[i].hash)
                    list.push([])
                    count = count+1
                }
            }

            return res.json({
                list: list
            })

        }
    )
})

app.post('/get_form', upload.single("userpic"), function(req,res){

    console.log(req.file)

})

app.listen(6000);