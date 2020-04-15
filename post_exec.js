"use strict";

const jsmd5 = require('js-md5')
const fs = require('fs')
const uuidv4 = require('uuid/v4')

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function post_exec(req, res, connection) {
    let CheckLogin = {'Logined':false, 'Login': "", 'CanDo':"", 'SessionID':""}

    let uuid = String(uuidv4());
    let UserName = "";
    let UserID = 0;
    let SesionID = "";
    let CanDo = "";
    let Logined = false;
    let str='';
    let tempstr='';


    if(!req.body) {return res.sendStatus(400)};
    if (str==null){ str='{"sum":0,"CNT":0,"pos":[]}'};
    if (str==''){ str='{"sum":0,"CNT":0,"pos":[]}'};

    if (req.body.post_type == 'login') {
        req.body.password = jsmd5("md5",req.body.password)
        let data = await connection.query('SELECT USERS.[USER_LOGIN], USERS.[USER_PASSWORD_HASH], USERS.[USER_CANDO] FROM USERS ' +
            'WHERE (((USERS.[USER_LOGIN])="' + req.body.login + '") AND ((USERS.[USER_PASSWORD_HASH])="' + req.body.password + '"));')
        if (data.length === 0) {
            res.cookie('UserName', "");
            res.cookie('SesionID', "");
            CheckLogin.Login = ""
            CheckLogin.Logined = false
            CheckLogin.CanDo = ""
            CheckLogin.SessionIDCanDo = ""
        } else {
            res.cookie('UserName', req.body.login);
            res.cookie('SesionID', uuid);
            CheckLogin.Login = req.body.login
            CheckLogin.Logined = true
            CheckLogin.CanDo = data[0].USER_CANDO
            CheckLogin.SessionIDCanDo = uuid
            await connection.execute('UPDATE USERS SET USER_SESIONID = "' + uuid + '" ' +
                'WHERE (((USERS.[USER_LOGIN])="' + req.body.login + '"));')
        }
        res.json(CheckLogin); // отправляем пришедший ответ обратно
    }
    if (req.body.post_type == 'logOut') {
        res.cookie('UserName', "");
        res.cookie('SesionID', "");
        res.json("LogOut");
    }
    if (req.body.post_type == 'logCheck') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        console.log("1")
        if (data.length === 0){
            console.log("2")
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            CheckLogin.Logined = false
            CheckLogin.Login = ""
            CheckLogin.CanDo = ""
            console.log("3")
        }
        else{
            console.log("4")
            CheckLogin.Logined = true
            CheckLogin.Login = data[0].USER_LOGIN
            CheckLogin.CanDo = data[0].USER_CANDO
            console.log("5")
        }
        res.json(CheckLogin);
    }
    if (req.body.post_type == 'NewLoginCheck') {
        let data = await connection.query('SELECT USERS.[USER_LOGIN], USERS.[USER_PASSWORD_HASH], USERS.[USER_CANDO] FROM USERS ' +
            'WHERE ((USERS.[USER_LOGIN])="' + req.body.login + '");')
        if (data.length === 0) {
            res.json("OK"); // отправляем пришедший ответ обратно
        } else {
            res.json("NO"); // отправляем пришедший ответ обратно
        }
    }
    if (req.body.post_type == 'new_user') {
        req.body.reg_password = jsmd5("md5",req.body.reg_password)
        await connection.execute('INSERT INTO USERS '+
            '( USER_LOGIN, USER_PASSWORD_HASH, USER_FIRST_NAME, USER_LAST_NAME, USER_TEL, USER_MAIL ) ' +
            'VALUES ' +
            '("'+req.body.reg_login+'","'+req.body.reg_password+'","'+req.body.reg_name+'","'+req.body.reg_fam+'","'+req.body.reg_tel+'","'+req.body.reg_email+'");');

        let data = await connection.query('SELECT USERS.[USER_LOGIN], USERS.[USER_PASSWORD_HASH], USERS.[USER_CANDO] FROM USERS ' +
            'WHERE (((USERS.[USER_LOGIN])="' + req.body.reg_login + '") AND ((USERS.[USER_PASSWORD_HASH])="' + req.body.reg_password + '"));')
        console.log('SELECT USERS.[USER_LOGIN], USERS.[USER_PASSWORD_HASH], USERS.[USER_CANDO] FROM USERS ' +
            'WHERE (((USERS.[USER_LOGIN])="' + req.body.reg_login + '") AND ((USERS.[USER_PASSWORD_HASH])="' + req.body.reg_password + '"));')
        console.log(data)
        if (data.length === 0) {
            res.cookie('UserName', "");
            res.cookie('SesionID', "");
            console.log('logined')
        } else {
            res.cookie('UserName', req.body.reg_login);
            res.cookie('SesionID', uuid);
            console.log('Unlogined')
            console.log('3 ' + req.body.name)
            await connection.execute('UPDATE USERS SET USER_SESIONID = "' + uuid + '" ' +
                'WHERE (((USERS.[USER_LOGIN])="' + req.body.reg_login + '"));')
            console.log('4')
            Logined = true
        }
        let tempstr = ""


        tempstr = ""
        if (Logined == false) {
            UserName = "";
            SesionID = "";
            CanDo = "";
            Logined = false;
            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<input class=login_input id=login_input name=login_input type=text placeholder=login>"
            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<input class=pass_input id=pass_input name=pass_input type=password placeholder=password>"
            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<input class=login_button type=button value=Login onclick=Login()>"
            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
        } else {
            UserName = data[0].USER_LOGIN;
            SesionID = uuid;
            CanDo = data[0].USER_CANDO;
            Logined = true;

            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<a class=admin_href>" + data[0].USER_LOGIN + "</a>"
            tempstr = tempstr + "<b>   </b>"
            tempstr = tempstr + "<a class=admin_href href=javascript:logOut();>Выйти</a>"
            if (data[0].USER_CANDO.indexOf('prise') != -1) {
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<a class=admin_href href=/content?page=1&cat_id=0&ContentType=Categories&filter=>Контент</a>"
            }
            if (data[0].USER_CANDO.indexOf('order') != -1) {
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<a class=admin_href href=/orders?page=1&filter=>Заказы</a>"
            }
            if (data[0].USER_CANDO.indexOf('user') != -1) {
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<a class=admin_href href=/users?page=1&filter=>Пользователи</a>"
            }
        }

        res.json(tempstr); // отправляем пришедший ответ обратно
    }
    if (req.body.post_type == 'UpDateCategoriesPage') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }

        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.record_count_on_page==undefined) { req.body.record_count_on_page=10 }
        let answer = {UserName:UserName, rec_count: 0, page_count: 0, rec_count_on_page: 0, curent_page: req.body.pageN, data: ""}
        answer.data =  await connection.query('SELECT Count([CAT_ID]) AS CATS_COUNT FROM CATS;');
        answer.rec_count=answer.data[0].CATS_COUNT;
        answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.record_count_on_page;
        if (answer.rec_count_on_page>req.body.record_count_on_page) {answer.rec_count_on_page=req.body.record_count_on_page }
        if (answer.rec_count_on_page<0) {answer.rec_count_on_page=0 }
        answer.page_count=Math.trunc(answer.rec_count/req.body.record_count_on_page);
        if ((answer.page_count<answer.rec_count/req.body.record_count_on_page) || (answer.rec_count==0)) {answer.page_count=answer.page_count+1;}
        answer.data =  await connection.query('SELECT TOP '+answer.rec_count_on_page+' * FROM (SELECT TOP '+(answer.rec_count-(Number(req.body.pageN)-1)*req.body.record_count_on_page)+' * FROM CATS ORDER BY CATS.[CAT_NAME] DESC) ORDER BY CATS.[CAT_NAME] ASC;');
        res.json(answer);
    }
    if (req.body.post_type == 'UpDatePositionsPage') {
        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.cat_id==undefined) { req.body.cat_id=0 }
        if (req.body.filter==undefined) { req.body.filter='' }
        if (req.body.positions_record_count_on_page==undefined) { req.body.positions_record_count_on_page=10 }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }

        let answer = {UserName:UserName, rec_count: 0, page_count: 0, rec_count_on_page: 0, curent_page: req.body.pageN, data: ""}

        let tsql = "SELECT COUNT (POSITIONS.[POS_ID]) as POS_COUNT FROM POSITIONS"
        let tsql_filter = ""

        if ((req.body.filter != "")&&(req.body.cat_id!=0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_CAT_ID]="+req.body.cat_id+") AND (POSITIONS.[POS_NAME] Like \"%"+req.body.filter+"%\")"
        } else if ((req.body.filter == "")&&(req.body.cat_id!=0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_CAT_ID]="+req.body.cat_id+")"
        } else if((req.body.filter != "")&&(req.body.cat_id==0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_NAME] Like \"%"+req.body.filter+"%\")"
        }

        if (tsql_filter!="") {
            tsql=tsql+tsql_filter+";"
        } else {
            tsql=tsql+";"
        }
console.log("f1")
        answer.data =  await connection.query(tsql);
console.log("f2")
        answer.rec_count=answer.data[0].POS_COUNT;
        answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.positions_record_count_on_page;
        if (answer.rec_count_on_page>req.body.positions_record_count_on_page) { answer.rec_count_on_page=req.body.positions_record_count_on_page }
        if (answer.rec_count_on_page<0) { answer.rec_count_on_page=0 }
        answer.page_count=Math.trunc(answer.rec_count/req.body.positions_record_count_on_page);

        if ((answer.page_count<answer.rec_count/req.body.positions_record_count_on_page) || (answer.rec_count==0))
        {
            answer.page_count=answer.page_count+1;
        }
        tsql_filter=""
        if ((req.body.filter != "")&&(req.body.cat_id!=0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_CAT_ID]="+req.body.cat_id+") AND (POSITIONS.[POS_NAME] Like \"%"+req.body.filter+"%\")"
        } else if ((req.body.filter == "")&&(req.body.cat_id!=0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_CAT_ID]="+req.body.cat_id+")"
        } else if((req.body.filter != "")&&(req.body.cat_id==0)) {
            tsql_filter = " WHERE (POSITIONS.[POS_NAME] Like \"%"+req.body.filter+"%\")"
        }
        if ((answer.rec_count == 0) || (answer.rec_count_on_page == 0)) {
            answer.data.length = 0;
        } else {
//            answer.data = await connection.query('SELECT TOP '+answer.rec_count_on_page+' * FROM (SELECT TOP '+(answer.rec_count-(Number(req.body.pageN)-1)*req.body.positions_record_count_on_page)+' * FROM (SELECT POSITIONS.POS_ID, POSITIONS.POS_CAT_ID, POSITIONS.POS_NAME, POSITION_FOTOS_GROUPED.[First_PF_ID] AS PF_ID FROM POSITIONS LEFT JOIN POSITION_FOTOS_GROUPED ON POSITIONS.POS_ID = POSITION_FOTOS_GROUPED.POS_ID ' + tsql_filter + ') ORDER BY POSITIONS.[POS_NAME] DESC) ORDER BY POSITIONS.[POS_NAME] ASC;');
              answer.data = await connection.query('SELECT TOP '+answer.rec_count_on_page+' CATS.CAT_NAME, * FROM (SELECT TOP '+(answer.rec_count-(Number(req.body.pageN)-1)*req.body.positions_record_count_on_page)+' * FROM (SELECT POSITIONS.POS_ID, POSITIONS.POS_CAT_ID, POSITIONS.POS_NAME, POSITIONS.POS_PRICE, POSITION_FOTOS_GROUPED.[First_PF_ID] AS PF_ID FROM POSITIONS LEFT JOIN POSITION_FOTOS_GROUPED ON POSITIONS.POS_ID = POSITION_FOTOS_GROUPED.POS_ID ' + tsql_filter + ') ORDER BY POSITIONS.[POS_NAME] DESC)  AS [%$##@_Alias] LEFT JOIN CATS ON [%$##@_Alias].POS_CAT_ID = CATS.CAT_ID ORDER BY POSITIONS.[POS_NAME];');
        }
        res.json(answer);
    }
    if (req.body.post_type == 'UpDatePositionPage') {
        if (req.body.pos_id==undefined) { req.body.pos_id=0 }
        if (req.body.pos_id==NaN) { req.body.pos_id=0 }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:UserName, data:""}
        answer.data =  await connection.query('SELECT POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], POSITIONS.[POS_PRICE], POSITION_FOTOS.[PF_ID] FROM POSITIONS LEFT JOIN POSITION_FOTOS ON POSITIONS.POS_ID = POSITION_FOTOS.POS_ID WHERE (((POSITIONS.[POS_ID])='+req.body.pos_id+'));');
        res.json(answer);
    }
    if (req.body.post_type == 'UpDateShoping') {

        if (req.body.filter==undefined) { req.body.filter="" }
        if (req.body.sum==undefined) { req.body.sum=0 }
        if (req.body.CNT==undefined) { req.body.CNT=0; req.body.pos = [] }
        if (req.body.pos==undefined) { req.body.CNT=0; req.body.pos = [] }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }

        let answer = {UserName:UserName, logined:false, data: ""}

        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        answer.data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (answer.data.length === 0){
            answer.logined=false
        } else {
            answer.logined=true
        }

        let sql_lilter='';

//        if (req.body.filter!=""){
            for (let i=0; i<req.body.pos.length; i++){
                if (i==0) {sql_lilter='(((POSITIONS.[POS_ID])='+req.body.pos[i].id+') AND ((POSITIONS.[POS_NAME]) LIKE "%'+req.body.filter+'%"))'}
                else {sql_lilter=sql_lilter+' OR (((POSITIONS.[POS_ID])='+req.body.pos[i].id+') AND ((POSITIONS.[POS_NAME]) LIKE "%'+req.body.filter+'%"))'}
                if (i==req.body.pos.length-1) {sql_lilter='WHERE '+sql_lilter}
            }
 //       }else {
 //           for (let i=0; i<req.body.pos.length; i++){
 //               if (i==0) {sql_lilter='((POSITIONS.[POS_ID])='+req.body.pos[i].id+')'}
 //               else {sql_lilter=sql_lilter+' OR ((POSITIONS.[POS_ID])='+req.body.pos[i].id+')'}
 //               if (i==req.body.pos.length-1) {sql_lilter='WHERE '+sql_lilter}
 //           }
//        }

        console.log("77")
        console.log(sql_lilter)
        console.log("78 "+'SELECT POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], '+
            'POSITIONS.[POS_PRICE], CATS.CAT_NAME '+
            'FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID '+sql_lilter+
            ' ORDER BY POSITIONS.[POS_NAME];')

        if(req.body.pos.length ==0) {
            answer.data.length=0
        }else {
            answer.data = await connection.query('SELECT POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], ' +
                'POSITIONS.[POS_PRICE], CATS.CAT_NAME ' +
                'FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID ' + sql_lilter +
                ' ORDER BY POSITIONS.[POS_NAME];');

        }
        console.log("Sended:")
        console.log(answer)
        res.json(answer);
    }
    if (req.body.post_type == 'CheckShoping') {

        if (req.body.sum==undefined) { req.body.sum=0 }
        if (req.body.CNT==undefined) { req.body.CNT=0; req.body.pos = [] }
        if (req.body.pos==undefined) { req.body.CNT=0; req.body.pos = [] }

        let answer = {data:"",sum:0,CNT:req.body.CNT,pos:req.body.pos}

        let sql_lilter='';

        for (let i=0; i<req.body.pos.length; i++){
            if (i==0) {sql_lilter='((POSITIONS.[POS_ID])='+req.body.pos[i].id+')'}
            else {sql_lilter=sql_lilter+' OR ((POSITIONS.[POS_ID])='+req.body.pos[i].id+')'}
            if (i==req.body.pos.length-1) {sql_lilter='WHERE '+sql_lilter}
        }

        if(req.body.pos.length ==0) {
            answer.data.length=0
            for (let i=0; i<answer.pos.length;i++){
                answer.pos[i].CNT=0
            }
        }else {
            console.log('000999 SELECT POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], ' +
                'POSITIONS.[POS_PRICE], CATS.CAT_NAME ' +
                'FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID ' + sql_lilter +
                ' ORDER BY POSITIONS.[POS_NAME];')
            answer.data = await connection.query('SELECT POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], ' +
                'POSITIONS.[POS_PRICE], CATS.CAT_NAME ' +
                'FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID ' + sql_lilter +
                ' ORDER BY POSITIONS.[POS_NAME];');
            console.log(answer.data)

            let b=false
            for (let i=0; i<answer.pos.length;i++){
                b=false;
                for (let j=0; j<answer.data.length;j++){
                    if (answer.data[j].POS_ID == answer.pos[i].id){
                        b=true
                        answer.pos[i].price = answer.data[i].POS_PRICE
                        answer.pos[i].posname = answer.data[i].POS_NAME
                    }
                }
                if (b==false){answer.pos[i].CNT=0}
            }

        }
        answer.sum = 0
        for (let i=0; i<answer.pos.length;i++){
            answer.sum = answer.sum + answer.pos[i].CNT*answer.pos[i].price
        }

        console.log("Sended:")
        console.log(answer)
        res.json(answer);
    }
    if (req.body.post_type == 'GetContentCats') {
        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.cat_id==undefined) { req.body.cat_id=0 }
        if (req.body.filter==undefined) { req.body.filter="" }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:UserName, rec_count: 0, page_count: 0, rec_count_on_page: 0, curent_page: req.body.pageN, data: ""}

        console.log("123456789 "+req.body.content_record_count_on_page)
// Проверка прав старт
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        answer.data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (answer.data.length === 0){
            answer.data.length = 0
        } else {
            if (answer.data[0].USER_CANDO.indexOf('prise')!=-1){
                console.log('SELECT Count(CATS.[CAT_NAME]) AS ContentCount FROM CATS WHERE (((CATS.CAT_NAME) Like "%' + req.body.filter + '%"));')
                answer.data = await connection.query('SELECT Count(CATS.[CAT_NAME]) AS ContentCount FROM CATS WHERE (((CATS.CAT_NAME) Like "%' + req.body.filter + '%"));');
                console.log('1')
                answer.rec_count=answer.data[0].ContentCount;
                console.log('2')
                answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.content_record_count_on_page;
                console.log('3')
                if (answer.rec_count_on_page>req.body.content_record_count_on_page) { answer.rec_count_on_page=req.body.content_record_count_on_page }
                if (answer.rec_count_on_page<0) { answer.rec_count_on_page=0 }
                console.log('4')
                answer.page_count=Math.trunc(answer.rec_count/req.body.content_record_count_on_page);
                if ((answer.page_count<answer.rec_count/req.body.content_record_count_on_page) || (answer.rec_count==0)){
                    answer.page_count=answer.page_count+1;
                }
                console.log('5 '+answer.rec_count+" "+answer.rec_count_on_page+" "+req.body.content_record_count_on_page)
                if ((answer.rec_count == 0) || (answer.rec_count_on_page == 0)) {
                    console.log('8 '+answer.rec_count)
                    answer.data.length = 0;
                } else {
                    console.log('7 '+answer.rec_count)
                    console.log('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP '+(answer.rec_count-(Number(req.body.pageN)-1)*req.body.content_record_count_on_page)+' * FROM (SELECT DISTINCTROW POSITIONS.POS_CAT_ID, Count(*) AS [Count_POSITIONS] FROM POSITIONS GROUP BY POSITIONS.POS_CAT_ID) AS SQL1 RIGHT JOIN CATS ON SQL1.POS_CAT_ID = CATS.CAT_ID WHERE (((CATS.[CAT_NAME]) Like "%' + req.body.filter + '%"))  ORDER BY CATS.[CAT_NAME] DESC) ORDER BY CATS.[CAT_NAME] ASC;')
                    answer.data = await connection.query('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP '+(answer.rec_count-(Number(req.body.pageN)-1)*req.body.content_record_count_on_page)+' * FROM (SELECT DISTINCTROW POSITIONS.POS_CAT_ID, Count(*) AS [Count_POSITIONS] FROM POSITIONS GROUP BY POSITIONS.POS_CAT_ID) AS SQL1 RIGHT JOIN CATS ON SQL1.POS_CAT_ID = CATS.CAT_ID WHERE (((CATS.[CAT_NAME]) Like "%' + req.body.filter + '%"))  ORDER BY CATS.[CAT_NAME] DESC) ORDER BY CATS.[CAT_NAME] ASC;');
                    console.log(answer.data)
                }
            } else answer.data.length = 0
        }
        res.json(answer);
    }
    if (req.body.post_type == 'GetContentPos') {
        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.cat_id==undefined) { req.body.cat_id=0 }
        if (req.body.filter==undefined) { req.body.filter="" }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:UserName, rec_count: 0, page_count: 0, rec_count_on_page: 0, curent_page: req.body.pageN, data: ""}

        console.log("123456789 "+req.body.content_record_count_on_page)
// Проверка прав старт
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        answer.data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (answer.data.length === 0){
            answer.data.length = 0
        } else {
            if (answer.data[0].USER_CANDO.indexOf('prise')!=-1){
                if (req.body.cat_id==0) {
                    console.log('SELECT Count(POSITIONS.[POS_NAME]) as ContentCount FROM POSITIONS HAVING (((Count(POSITIONS.[POS_NAME])) Like "%' + req.body.filter + '%"));')
                    answer.data = await connection.query('SELECT Count(POSITIONS.[POS_NAME]) AS ContentCount FROM POSITIONS WHERE (((POSITIONS.POS_NAME) Like "%' + req.body.filter + '%"));');
                    console.log("nm,mn, "+JSON.stringify(answer.data))
                } else {
                    console.log('SELECT Count(POSITIONS.[POS_NAME]) AS ContentCount FROM POSITIONS WHERE (((POSITIONS.POS_NAME) Like "%' + req.body.filter + '%") AND((POSITIONS.[POS_CAT_ID])=' + req.body.cat_id + '));')
                    answer.data = await connection.query('SELECT Count(POSITIONS.[POS_NAME]) AS ContentCount FROM POSITIONS WHERE (((POSITIONS.POS_NAME) Like "%' + req.body.filter + '%") AND((POSITIONS.[POS_CAT_ID])=' + req.body.cat_id + '));');
                    console.log("nm,mn000, "+JSON.stringify(answer.data))
                }
                console.log('1')
                answer.rec_count=answer.data[0].ContentCount;
                console.log('2 '+answer.rec_count)
                answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.content_record_count_on_page;
                console.log('3')
                if (answer.rec_count_on_page>req.body.content_record_count_on_page) { answer.rec_count_on_page=req.body.content_record_count_on_page }
                if (answer.rec_count_on_page<0) { answer.rec_count_on_page=0 }
                console.log('4')
                answer.page_count=Math.trunc(answer.rec_count/req.body.content_record_count_on_page);
                if ((answer.page_count<answer.rec_count/req.body.content_record_count_on_page) || (answer.rec_count==0)){
                    answer.page_count=answer.page_count+1;
                }
                console.log('5 '+answer.rec_count+" "+answer.rec_count_on_page+" "+req.body.content_record_count_on_page)
                if ((answer.rec_count == 0) || (answer.rec_count_on_page == 0)) {
                    console.log('8 '+answer.rec_count)
                    answer.data.length = 0;
                } else {
                    if (req.body.cat_id==0) {
                        answer.data = await connection.query('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * req.body.content_record_count_on_page) + ' POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], POSITIONS.[POS_PRICE], CATS.CAT_NAME FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID WHERE (((POSITIONS.[POS_CAT_ID])>' + req.body.cat_id + ') AND ((POSITIONS.[POS_NAME]) Like "%' + req.body.filter + '%")) ORDER BY POSITIONS.[POS_NAME] DESC) ORDER BY POSITIONS.[POS_NAME] ASC;')
                    } else {
                        answer.data = await connection.query('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * req.body.content_record_count_on_page) + ' POSITIONS.[POS_ID], POSITIONS.[POS_CAT_ID], POSITIONS.[POS_NAME], POSITIONS.[POS_PRICE], CATS.CAT_NAME FROM POSITIONS LEFT JOIN CATS ON POSITIONS.POS_CAT_ID = CATS.CAT_ID WHERE (((POSITIONS.[POS_CAT_ID])=' + req.body.cat_id + ') AND ((POSITIONS.[POS_NAME]) Like "%' + req.body.filter + '%")) ORDER BY POSITIONS.[POS_NAME] DESC) ORDER BY POSITIONS.[POS_NAME] ASC;')

                    }
                }
            } else answer.data.length = 0
        }
        res.json(answer);
    }
    if (req.body.post_type == 'UpDateUsersPage') {
        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.filter==undefined) { req.body.filter="" }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:UserName, rec_count: 0, page_count: 0, rec_count_on_page: 0, filter:req.body.filter, curent_page: req.body.pageN, data: ""}

        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        answer.data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (answer.data.length === 0){
            answer.data.length = 0
        } else {
            if (answer.data[0].USER_CANDO.indexOf('user')!=-1){

                console.log("771")
                answer.data = await connection.query('SELECT Count(USERS.[USER_LOGIN]) AS UserCount FROM USERS WHERE USERS.[USER_LOGIN] LIKE "%' + req.body.filter + '%";');
                answer.rec_count = answer.data[0].UserCount;
                answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.record_count_on_page;
                if (answer.rec_count_on_page>req.body.record_count_on_page) { answer.rec_count_on_page=req.body.record_count_on_page }
                if (answer.rec_count_on_page<0) { answer.rec_count_on_page=0 }
                answer.page_count=Math.trunc(answer.rec_count/req.body.record_count_on_page);
                if ((answer.page_count<answer.rec_count/req.body.record_count_on_page) || (answer.rec_count==0)){
                    answer.page_count=answer.page_count+1;
                }

                console.log(answer.curent_page)
                console.log(answer.rec_count)
                console.log(answer.rec_count_on_page)
                console.log(answer.page_count)

                console.log("772")
                if ((answer.rec_count == 0) || (answer.rec_count_on_page == 0)) {
                    answer.data.length = 0;
                } else {
                    console.log("773 "+'SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * req.body.record_count_on_page) + ' * FROM USERS WHERE USERS.[USER_LOGIN] Like "%' + req.body.filter + '%" ORDER BY USERS.[USER_LOGIN] DESC) ORDER BY USERS.[USER_LOGIN] ASC;')
                    answer.data = await connection.query('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * req.body.record_count_on_page) + ' * FROM USERS WHERE USERS.[USER_LOGIN] Like "%' + req.body.filter + '%" ORDER BY USERS.[USER_LOGIN] DESC) ORDER BY USERS.[USER_LOGIN] ASC;')
                    console.log("774")
                }
            } else answer.data.length = 0
        }
        res.json(answer);
    }
    if (req.body.post_type == 'UpDateOrdersPage') {
        if (req.body.pageN==undefined) { req.body.pageN=1 }
        if (req.body.filter==undefined) { req.body.filter="" }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:UserName,rec_count: 0, page_count: 0, rec_count_on_page: 0, curent_page: req.body.pageN, data: ""}

        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        answer.data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (answer.data.length === 0){
            answer.data.length = 0
        } else {
            if (answer.data[0].USER_CANDO.indexOf('order')!=-1){
                answer.data = await connection.query('SELECT Count(ORDERS.ORDER_ID) AS ORDERSCount FROM ORDERS LEFT JOIN USERS ON ORDERS.ORDER_UID = USERS.USER_ID HAVING (((ORDERS.ORDER_STATUS) LIKE "%'+req.body.filter+'%")) OR (((USERS.USER_LOGIN) LIKE "%'+req.body.filter+'%"));');

                answer.rec_count=answer.data[0].ORDERSCount;
                answer.rec_count_on_page=Number(answer.rec_count)-(Number(req.body.pageN)-1)*req.body.record_count_on_page;
                if (answer.rec_count_on_page>req.body.record_count_on_page) { answer.rec_count_on_page=req.body.record_count_on_page }
                if (answer.rec_count_on_page<0) { answer.rec_count_on_page=0 }
                answer.page_count=Math.trunc(answer.rec_count/req.body.record_count_on_page);
                if ((answer.page_count<answer.rec_count/req.body.record_count_on_page) || (answer.rec_count==0)){
                    answer.page_count=answer.page_count+1;
                }

                if ((answer.rec_count == 0) || (answer.rec_count_on_page == 0)) {
                    console.log('8 '+answer.rec_count)
                    answer.data.length = 0;
                } else {
                    console.log('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * answer.rec_count_on_page) + ' * FROM ORDERS LEFT JOIN USERS ON ORDERS.ORDER_UID = USERS.USER_ID WHERE (((ORDERS.ORDER_STATUS) Like "%' + req.body.filter + '%")) OR (((USERS.USER_LOGIN) Like "%' + req.body.filter + '%")) ORDER BY USERS.[USER_LOGIN] DESC) ORDER BY USERS.[USER_LOGIN] ASC;')
                    answer.data = await connection.query('SELECT TOP ' + answer.rec_count_on_page + ' * FROM (SELECT TOP ' + (answer.rec_count - (Number(req.body.pageN) - 1) * answer.rec_count_on_page) + ' ORDERS.[ORDER_ID], ORDERS.[ORDER_UID], ORDERS.[ORDER_DATE], ORDERS.[ORDER_STATUS], ORDERS.[ORDER_SUMM], USERS.[USER_ID], USERS.[USER_LOGIN], USERS.[USER_FIRST_NAME], USERS.[USER_LAST_NAME], USERS.[USER_TEL], USERS.[USER_MAIL] FROM ORDERS LEFT JOIN USERS ON ORDERS.ORDER_UID = USERS.USER_ID WHERE (((ORDERS.ORDER_STATUS) Like "%' + req.body.filter + '%")) OR (((USERS.USER_LOGIN) Like "%' + req.body.filter + '%")) ORDER BY ORDERS.[ORDER_DATE] ASC) ORDER BY ORDERS.[ORDER_DATE] DESC;')
                    console.log(answer.data)
                }
            } else answer.data.length = 0
        }
        res.json(answer);
    }
    if (req.body.post_type == 'Set_Img_For_Edit') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        console.log("hh7")
        if (req.body.pos_id==undefined) { req.body.pos_id=0 }
        let sf = require("fs")
        if (req.body.pos_id == 0) {
            console.log("hh7")
            fs.copyFileSync(__dirname+"\\static\\decor\\no_foto.jpg",__dirname+"\\static\\temp\\edit_pos_"+UserName+req.body.pos_id+".jpg")
        }else {
            console.log("hh72")
            sf.copyFileSync(__dirname+"\\static\\content\\img\\pos\\pos_"+req.body.pos_id+".jpg",__dirname+"\\static\\temp\\edit_pos_"+UserName+req.body.pos_id+".jpg")
            console.log("hh73")
        }
        console.log("hh9")
        res.send("ok")
    }
    if (req.body.post_type == 'Set_Img_For_Edit_Cat') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        console.log("hh7")
        if (req.body.cat_id==undefined) { req.body.cat_id=0 }
        let sf = require("fs")
        if (req.body.cat_id == 0) {
            console.log("hh7")
            fs.copyFileSync(__dirname+"\\static\\decor\\no_foto.jpg",__dirname+"\\static\\temp\\edit_cat_"+UserName+req.body.cat_id+".jpg")
        }else {
            console.log("hh72")
            sf.copyFileSync(__dirname+"\\static\\content\\img\\cat\\cat_"+req.body.cat_id+".jpg",__dirname+"\\static\\temp\\edit_cat_"+UserName+req.body.cat_id+".jpg")
            console.log("hh73")
        }
        console.log("hh9")
        res.send("ok")
    }
    if (req.body.post_type == 'Get_Pos_Text') {

        if (req.body.pos_id==undefined) { req.body.pageN=0 }
        let sf = require("fs")
        let data = sf.readFileSync(__dirname+"\\static\\content\\text\\pos_"+req.body.pos_id+".html")
        if (data == undefined) {data = ""}
        res.send(data)
    }
    if (req.body.post_type == 'DelPosClick') {
        if (req.body.pos_id==undefined) { req.body.pos_id=0 }
        if (req.body.pos_id==NaN) { req.body.pos_id=0 }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:0, data:"0"}
        await connection.execute('DELETE FROM POSITIONS WHERE (((POSITIONS.[POS_ID])='+req.body.pos_id+'));');
        res.json(answer);
    }
    if (req.body.post_type == 'DelCatClick') {
        if (req.body.cat_id==undefined) { req.body.cat_id=0 }
        if (req.body.cat_id==NaN) { req.body.cat_id=0 }
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        let answer = {UserName:0, data:"0"}
        await connection.execute('DELETE FROM CATS WHERE (((CATS.[CAT_ID])='+req.body.cat_id+'));');
        res.json(answer);
    }
    if (req.body.post_type == 'SetUserPr') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        let data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (data.length === 0)
        {
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
        }
        else
        {
            Logined=true
            CanDo=data[0].USER_CANDO
        }

        if (Logined==false) {
            tempstr='NoLogin'
        }
        else {
            tempstr='NoLogin'
            if ((data[0].USER_CANDO.indexOf('user')!=-1)&&(UserName!="Admin")){
                tempstr=req.body.PrStr;
                await connection.execute('UPDATE USERS SET USER_CANDO = "' + tempstr + '" ' +
                    'WHERE (((USERS.[USER_ID])=' + req.body.UserID + '));')
            }
        }
        res.json(tempstr);
    }
    if (req.body.post_type == 'DelUser') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }

        let data =  await connection.query('SELECT USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')

        if (data.length === 0)
        {
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
        }
        else
        {
            Logined=true
            CanDo=data[0].USER_CANDO
        }

        if (Logined==false) {
            tempstr='NoLogin'
        }
        else {
            tempstr='NoLogin'
            if ((data[0].USER_CANDO.indexOf('user')!=-1)&&(req.body.usename!="Admin")){
                tempstr=req.body.user_id;
                await connection.execute('DELETE FROM USERS WHERE (((USERS.[USER_ID])='+req.body.user_id+'));')
            }
        }
        res.json(tempstr);
    }
    if (req.body.post_type == 'CreateOrder') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_ID, USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        if (data.length === 0){
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            UserID = 0
        } else {
            Logined=true
            UserID = data[0].USER_ID
        }
        if (Logined==false) {
            tempstr='NoLogin'
        } else {
            tempstr=''
            if (data[0].USER_CANDO.indexOf('order')!=-1){
                await connection.execute('INSERT INTO ORDERS (ORDER_UID, ORDER_STATUS, ORDER_SUMM) VALUES (' + UserID + ',"Открыт",' + req.body.sum + ');')
                data = await connection.query('SELECT TOP 1 ORDERS.[ORDER_ID] FROM ORDERS ORDER BY ORDERS.[ORDER_ID] DESC;')
                console.log(data)
                for (let i=0;i<req.body.pos.length;i++){
                    console.log('INSERT INTO ORDER_POSITIONS (ORDER_ID, ORDER_POS_ID, ORDER_POS_NAME, ORDER_POS_PRICE, ORDER_POS_COUNT, ORDER_POS_SUMM) '+
                        'VALUES ('+data[0].ORDER_ID+', '+req.body.pos[i].id+', "'+req.body.pos[i].posname+'", '+req.body.pos[i].price+', '+req.body.pos[i].CNT+', '+req.body.pos[i].price*req.body.pos[i].CNT+');')
                    connection.execute('INSERT INTO ORDER_POSITIONS (ORDER_ID, ORDER_POS_ID, ORDER_POS_NAME, ORDER_POS_PRICE, ORDER_POS_COUNT, ORDER_POS_SUMM) '+
                        'VALUES ('+data[0].ORDER_ID+', '+req.body.pos[i].id+', "'+req.body.pos[i].posname+'", '+req.body.pos[i].price+', '+req.body.pos[i].CNT+', '+req.body.pos[i].price*req.body.pos[i].CNT+');')
                }
            }
        }
        res.json(tempstr);
    }
    if (req.body.post_type == 'GetOrder') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_ID, USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        if (data.length === 0){
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            UserID = 0
        } else {
            Logined=true
            UserID = data[0].USER_ID
        }
        if (Logined==false) {
            tempstr='NoLogin'
        } else {
            tempstr=''
            if (data[0].USER_CANDO.indexOf('order')!=-1){
                data = await connection.query('SELECT ORDER_POSITIONS.[ORDER_POSITIONS_ID], ORDER_POSITIONS.[ORDER_ID], '+
                    'ORDER_POSITIONS.[ORDER_POS_ID], ORDER_POSITIONS.[ORDER_POS_CAT_ID], ORDER_POSITIONS.[ORDER_POS_NAME], '+
                    'ORDER_POSITIONS.[ORDER_POS_PRICE], ORDER_POSITIONS.[ORDER_POS_COUNT], ORDER_POSITIONS.[ORDER_POS_SUMM], '+
                    'ORDERS.ORDER_DATE, ORDERS.ORDER_STATUS, ORDERS.ORDER_SUMM, USERS.USER_ID, USERS.USER_LOGIN, USERS.USER_FIRST_NAME, '+
                    'USERS.USER_LAST_NAME, USERS.USER_TEL, USERS.USER_MAIL FROM (ORDER_POSITIONS LEFT JOIN ORDERS ON ORDER_'+
                    'POSITIONS.ORDER_ID = ORDERS.ORDER_ID) LEFT JOIN USERS ON ORDERS.ORDER_UID = USERS.USER_ID ' +
                    'WHERE (((ORDER_POSITIONS.[ORDER_ID])='+req.body.order_id+'));')
                tempstr = data
            }
        }
        res.json(tempstr);
    }
    if (req.body.post_type == 'ExecOrder') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_ID, USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        if (data.length === 0){
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            UserID = 0
        } else {
            Logined=true
            UserID = data[0].USER_ID
        }
        if (Logined==false) {
            tempstr='NoLogin'
        } else {
            tempstr=''
            if (data[0].USER_CANDO.indexOf('order')!=-1){
                await connection.execute('UPDATE ORDERS SET ORDER_STATUS = "Выполнен" WHERE (((ORDERS.[ORDER_ID])=' + req.body.order_id + '));')
                tempstr = "executed"
            }
        }
        res.json(tempstr);
    }
    if (req.body.post_type == 'CancelOrder') {

        console.log('CancelOrder')

        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_ID, USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        if (data.length === 0){
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            UserID = 0
        } else {
            Logined=true
            UserID = data[0].USER_ID
        }
        if (Logined==false) {
            tempstr='NoLogin'
        } else {
            tempstr=''
            console.log('CancelOrder 1')
            if (data[0].USER_CANDO.indexOf('order')!=-1){
                console.log('UPDATE ORDERS SET ORDER_STATUS = "Отменен" WHERE (((ORDERS.[ORDER_ID])=' + req.body.order_id + '));')
                await connection.execute('UPDATE ORDERS SET ORDER_STATUS = "Отменен" WHERE (((ORDERS.[ORDER_ID])=' + req.body.order_id + '));')
                tempstr = "executed"
            }
        }
        console.log(tempstr)
        res.json(tempstr);
    }
    if (req.body.post_type == 'ReturnOrder') {
        if (typeof req.cookies.UserName === "undefined") { UserName = ""; }
        else { UserName = req.cookies.UserName; }
        if (typeof req.cookies.SesionID === "undefined") { SesionID = ""; }
        else { SesionID = req.cookies.SesionID; }
        let data =  await connection.query('SELECT USERS.USER_ID, USERS.USER_CANDO, USERS.USER_LOGIN, USERS.USER_SESIONID FROM USERS '+
            'WHERE (((USERS.USER_LOGIN)="'+UserName+'") AND ((USERS.USER_SESIONID)="'+SesionID+'"));')
        if (data.length === 0){
            Logined=false
            res.cookie('UserName',"");
            res.cookie('SesionID',"");
            UserID = 0
        } else {
            Logined=true
            UserID = data[0].USER_ID
        }
        if (Logined==false) {
            tempstr='NoLogin'
        } else {
            tempstr=''
            if (data[0].USER_CANDO.indexOf('order')!=-1){
                await connection.execute('UPDATE ORDERS SET ORDER_STATUS = "Открыт" WHERE (((ORDERS.[ORDER_ID])=' + req.body.order_id + '));')
                tempstr = "executed"
            }
        }
        res.json(tempstr);
    }
}

async function Edit_Pos(req, res, connection) {

    console.log("8999 ")

    let formidable = require("formidable");
    let form = new formidable.IncomingForm();
    let sf = require("fs");

    console.log("89991 ")

    form.parse(req, async function(err, fields, files) {
        console.log("899912 "+JSON.stringify(fields))
        console.log("89991222 "+JSON.stringify(fields))
        if (fields.pos_id==0) {
            console.log("89992 ")
            await connection.execute('INSERT INTO POSITIONS (POS_CAT_ID, POS_NAME, POS_PRICE) VALUES (' + fields.cat_id + ',"' + fields.name + '",' + fields.price + ');')
            console.log("89993 ")
            let data = await connection.query('SELECT TOP 1 POSITIONS.[POS_ID] FROM POSITIONS ORDER BY POSITIONS.[POS_ID] DESC;')
            console.log("88 " + JSON.stringify(data[0].POS_ID))
            fs.writeFileSync(__dirname+"\\static\\content\\text\\pos_"+data[0].POS_ID+".html", fields.text);
            let dataf = sf.readFileSync(__dirname+"\\static\\temp\\edit_pos_"+fields.username+fields.pos_id+".jpg")
            fs.writeFileSync(__dirname+"\\static\\content\\img\\pos\\pos_"+data[0].POS_ID+".jpg", dataf)
            res.send("ok")
        }else{
            console.log('UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')
            await connection.execute('UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')
            console.log("88 " + JSON.stringify(fields.pos_id)+' '+'UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')
            fs.writeFileSync(__dirname+"\\static\\content\\text\\pos_"+fields.pos_id+".html", fields.text);
            console.log("89 " + JSON.stringify(fields.pos_id)+' '+'UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')

            let dataf = sf.readFileSync(__dirname+"\\static\\temp\\edit_pos_"+fields.username+fields.pos_id+".jpg")
            console.log("90 " + JSON.stringify(fields.pos_id)+' '+'UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')
            fs.writeFileSync(__dirname+"\\static\\content\\img\\pos\\pos_"+fields.pos_id+".jpg", dataf)
            console.log("91 " + JSON.stringify(fields.pos_id)+' '+'UPDATE POSITIONS SET POS_CAT_ID=' + fields.cat_id + ', POS_NAME="' + fields.name + '", POS_PRICE=' + fields.price + ' WHERE ((POSITIONS.[POS_ID])='+fields.pos_id+');')

            res.send("ok")
        }

        console.log("899912 "+JSON.stringify(fields))
    })

}

async function Edit_Cat(req, res, connection) {

    let formidable = require("formidable");
    let form = new formidable.IncomingForm();
    let sf = require("fs");

    form.parse(req, async function(err, fields, files) {
        if (fields.cat_id==0) {
            connection.execute('INSERT INTO CATS (CAT_NAME) VALUES ("' + fields.cat_name + '");').then(function() {
                let data = connection.query('SELECT TOP 1 CATS.[CAT_ID] FROM CATS ORDER BY CATS.[CAT_ID] DESC;').then(function (data) {
                    let dataf = sf.readFileSync(__dirname+"\\static\\temp\\edit_cat_"+fields.username+fields.cat_id+".jpg")
                    fs.writeFileSync(__dirname+"\\static\\content\\img\\cat\\cat_"+data[0].CAT_ID+".jpg", dataf)
                    res.send("ok")
                })
            })
        }
        else{
            console.log('UPDATE CATS SET CAT_NAME="' + fields.cat_name + '" WHERE ((CATS.[CAT_ID])='+fields.cat_id+');')
            connection.execute('UPDATE CATS SET CAT_NAME="' + fields.cat_name + '" WHERE ((CATS.[CAT_ID])='+fields.cat_id+');').then(function (data) {
                let dataf = sf.readFileSync(__dirname+"\\static\\temp\\edit_cat_"+fields.username+fields.cat_id+".jpg")
                fs.writeFileSync(__dirname+"\\static\\content\\img\\cat\\cat_"+fields.cat_id+".jpg", dataf)
                res.send("ok")
            })
        }
    })
}

async function set_foto_for_edit_pos(req, res, connection) {
    let formidable = require("formidable")
    let form = new formidable.IncomingForm();
    let sf = require("fs")

    form.parse(req, async function(err, fields, files) {
        if (typeof files.file != "undefined") {let data = sf.readFileSync(files.file.path)
            fs.writeFileSync(__dirname+"\\static\\temp\\edit_pos_"+fields.username+fields.pos_id+".jpg", data)
            res.send("ok")
        } else {
            res.send("error")
        }
    });

}

async function Get_Pos_Text(req, res) {
    let sf = require("fs")
    let data = sf.readFileSync(__dirname+"\\static\\content\\pos_"+req.body.pos_id+".html")
    if (data == undefined) {data = ""}
    res.send(data)
}

async function set_foto_for_edit_cat(req, res, connection) {
    let formidable = require("formidable")
    let form = new formidable.IncomingForm();
    let sf = require("fs")

    form.parse(req, async function(err, fields, files) {
        if (typeof files.file != "undefined") {let data = sf.readFileSync(files.file.path)
            fs.writeFileSync(__dirname+"\\static\\temp\\edit_cat_"+fields.username+fields.cat_id+".jpg", data)
            res.send("ok")
        } else {
            res.send("error")
        }
    });
}


exports.post_exec = post_exec;
exports.Edit_Pos = Edit_Pos;
exports.set_foto_for_edit_pos = set_foto_for_edit_pos;
exports.Get_Pos_Text = Get_Pos_Text;
exports.set_foto_for_edit_cat = set_foto_for_edit_cat
exports.Edit_Cat = Edit_Cat

