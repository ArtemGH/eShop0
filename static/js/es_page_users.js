"use strict";

function logCheck() {
    let post_body  = JSON.stringify({post_type: 'logCheck'});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let CheckLogin = JSON.parse(this.responseText)

            if (CheckLogin.Logined==false) {
                tempstr = '';
                tempstr=tempstr+"<input class=login_input id=login_input name=login_input type=text placeholder=login>"
                tempstr=tempstr+"<b>   </b>"
                tempstr=tempstr+"<input class=\pass_input id=pass_input name=pass_input type=password placeholder=password>"
                tempstr=tempstr+"<b>   </b>"
                tempstr=tempstr+"<input class=login_button type=button value=Login onclick=Login()>"
                tempstr=tempstr+"<b>   </b>"
                tempstr=tempstr+"<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
            }
            else {
                tempstr = '';
                tempstr=tempstr+"<div class=flex_element_div> <a class=admin_href>"+CheckLogin.Login+"</a></div>"
                tempstr=tempstr+"<div class=flex_element_div> <a class=admin_href href=javascript:logOut();>Выйти</a></div>"
                if (CheckLogin.CanDo.indexOf('prise')!=-1){
                    tempstr=tempstr+"<div class=flex_element_div><a class=admin_href href=/content?page=1&cat_id=0&ContentType=Categories&filter=>Контент</a></div>"
                }
                if (CheckLogin.CanDo.indexOf('order')!=-1){
                    tempstr=tempstr+"<div class=flex_element_div><a class=admin_href href=/orders?page=1&filter=>Заказы</a></div>"
                }
                if (CheckLogin.CanDo.indexOf('user')!=-1){
                    tempstr=tempstr+"<div class=flex_element_div><a class=admin_href href=/users?page=1&filter=>Пользователи</a></div>"
                }

            }
            document.getElementById("privat_info_element_1").innerHTML = tempstr;
            GetShopingAdminPanel()

        } else if (this.readyState == 4) {
            tempstr = '';
            tempstr=tempstr+"<input class=login_input id=login_input name=login_input type=text placeholder=login>"
            tempstr=tempstr+"<b>   </b>"
            tempstr=tempstr+"<input class=\pass_input id=pass_input name=pass_input type=password placeholder=password>"
            tempstr=tempstr+"<b>   </b>"
            tempstr=tempstr+"<input class=login_button type=button value=Login onclick=Login()>"
            tempstr=tempstr+"<b>   </b>"
            tempstr=tempstr+"<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
            GetShopingAdminPanel()
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function Login() {

    document.getElementById("loader").style.display="block"
    let log = document.getElementById('login_input').value;
    let pass = document.getElementById('pass_input').value;
    let post_body  = JSON.stringify({post_type: 'login', login: log, password: pass});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            document.getElementById("loader").style.display="none"
            if (this.status == 200){

                let CheckLogin = JSON.parse(this.responseText)

                if (CheckLogin.Logined == false) {
                    tempstr = '';
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<input class=login_input id=login_input name=login_input type=text placeholder=login>"
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<input class=pass_input id=pass_input name=pass_input type=password placeholder=password>"
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<input class=login_button type=button value=Login onclick=Login()>"
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
                } else {
                    tempstr = '';
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<a class=admin_href>" + CheckLogin.Login + "</a>"
                    tempstr = tempstr + "<b>   </b>"
                    tempstr = tempstr + "<a class=admin_href href=javascript:logOut();>Выйти</a>"
                    if (CheckLogin.CanDo.indexOf('prise') != -1) {
                        tempstr = tempstr + "<b>   </b>"
                        tempstr = tempstr + "<a class=admin_href href=/content?page=1&cat_id=0&ContentType=Categories&filter=>Контент</a>"
                    }
                    if (CheckLogin.CanDo.indexOf('order') != -1) {
                        tempstr = tempstr + "<b>   </b>"
                        tempstr = tempstr + "<a class=admin_href href=/orders?page=1&filter=>Заказы</a>"
                    }
                    if (CheckLogin.CanDo.indexOf('user') != -1) {
                        tempstr = tempstr + "<b>   </b>"
                        tempstr = tempstr + "<a class=admin_href href=/users?page=1&filter=>Пользователи</a>"
                    }
                }
            } else {
                tempstr = '';
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=login_input id=login_input name=login_input type=text placeholder=login>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=pass_input id=pass_input name=pass_input type=password placeholder=password>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=login_button type=button value=Login onclick=Login()>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
            }
            document.getElementById("privat_info_element_1").innerHTML = tempstr
            GetShopingAdminPanel()
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function logOut() {
    document.getElementById("loader").style.display="block"
    let post_body  = JSON.stringify({post_type: 'logOut'});
    let tempstr = ''
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4){
            document.getElementById("loader").style.display="none"
            if (this.status == 200) {
                tempstr = ''
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=login_input id=login_input name=login_input type=text placeholder=login>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=pass_input id=pass_input name=pass_input type=password placeholder=password>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<input class=login_button type=button value=Login onclick=Login()>"
                tempstr = tempstr + "<b>   </b>"
                tempstr = tempstr + "<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>"
                document.getElementById("privat_info_element_1").innerHTML = tempstr;
            }
            GetShopingAdminPanel()
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function ShowRegisterWindow() {

    document.getElementById("modal_container").innerHTML =
        '<div class="modal_background" id="modal_background" onclick="Modal_Hide()">' +
        '</div>' +
        '<div class="reg_modal_window" >' +
        '<span class="window_close" onclick="Modal_Hide()">Закрыть X</span>' +
        '<h2 style="margin: 0;  border: 0;  padding: 0;  text-align: center; ">Регистрация</h2>' +
        '<form class="reg_form">' +
        '<input type="text" class="reg_login" id="reg_login" placeholder="login" autocomplete="off" value="" oninput="CheckRegField(1)" onchange="CheckRegField(1)">' +
        '<img class="reg_login_img" id="reg_login_img" src="../decor/no.jpg">' +
        '<input type="password" class="reg_password" id="reg_password" placeholder="password" autocomplete="off" value="" oninput="CheckRegField(2)">' +
        '<img class="reg_password_img" id="reg_password_img" src="../decor/no.jpg">' +
        '<input type="password" class="reg_confirm_password" id="reg_confirm_password" placeholder="confirm password" autocomplete="off" value="" oninput="CheckRegField(3)">' +
        '<img class="reg_confirm_password_img" id="reg_confirm_password_img" src="../decor/no.jpg">' +
        '<input type="text" class="reg_name" id="reg_name" placeholder="имя" autocomplete="off" value="" oninput="CheckRegField(4)">' +
        '<img class="reg_name_img" id="reg_name_img" src="../decor/no.jpg">' +
        '<input type="text" class="reg_fam" id="reg_fam" placeholder="фамилия" autocomplete="off" value="" oninput="CheckRegField(5)">' +
        '<img class="reg_fam_img" id="reg_fam_img" src="../decor/no.jpg">' +
        '<input type="tel" class="reg_tel" id="reg_tel" placeholder="телефон" autocomplete="off" value="" oninput="CheckRegField(6)">' +
        '<img class="reg_tel_img" id="reg_tel_img" src="../decor/no.jpg">' +
        '<input type="email" class="reg_email" id="reg_email" placeholder="eMail" autocomplete="off" value="" oninput="CheckRegField(7)">' +
        '<img class="reg_email_img" id="reg_email_img" src="../decor/no.jpg">' +
        '<input type="button" class="reg_button" id="reg_button" value="Зарегестрироваться" onclick="RegisterUser()">' +
        '</form>' +
        '</div>';
    document.getElementById("modal_container").style.display = "block"
}

function CheckRegField(element_id) {
    if (element_id == 1) {
        let el_val = document.getElementById("reg_login").value;
        document.getElementById("reg_login_img").src = "../decor/load_2.gif";
        let login = JSON.stringify({post_type: 'NewLoginCheck', login: el_val});
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (el_val == document.getElementById("reg_login").value) {
                    if (this.responseText == '"OK"') {
                        document.getElementById("reg_login_img").src = "../decor/ok.png"
                    } else {
                        document.getElementById("reg_login_img").src = "../decor/no.jpg"
                    }
                }
            }
            if (this.readyState == 4 && this.status != 200) {
                if (el_val == document.getElementById("reg_login").value) {
                    document.getElementById("reg_login_img").src = "../decor/no.jpg"
                }
            }
        }
        xhttp.open("POST", "/", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(login);
    }
    if (element_id == 2) {
        if (document.getElementById("reg_password").value != "") {
            document.getElementById("reg_password_img").src = "../decor/ok.png"
            if (document.getElementById("reg_confirm_password").value ==document.getElementById("reg_password").value) {
                document.getElementById("reg_confirm_password_img").src = "../decor/ok.png"
            } else {
                document.getElementById("reg_confirm_password_img").src = "../decor/no.jpg"
            }
        } else {document.getElementById("reg_password_img").src = "../decor/no.jpg"}
    }
    if (element_id == 3) {
        if (document.getElementById("reg_confirm_password").value == "") {document.getElementById("reg_confirm_password_img").src = "../img/no.png"}
        else {
            if (document.getElementById("reg_confirm_password").value == document.getElementById("reg_password").value) {
                document.getElementById("reg_confirm_password_img").src = "../decor/ok.png"
            } else {
                document.getElementById("reg_confirm_password_img").src = "../decor/no.jpg"
            }
        }
    }
    if (element_id == 4) {
        if (document.getElementById("reg_name").value == "") {document.getElementById("reg_name_img").src = "../img/no.png"}
        else {document.getElementById("reg_name_img").src = "../decor/ok.png"}
    }
    if (element_id == 5) {
        if (document.getElementById("reg_fam").value == "") {document.getElementById("reg_fam_img").src = "../img/no.png"}
        else {document.getElementById("reg_fam_img").src = "../decor/ok.png"}
    }
    if (element_id == 6) {
        if (document.getElementById("reg_tel").value == "") {document.getElementById("reg_tel_img").src = "../img/no.png"}
        else {document.getElementById("reg_tel_img").src = "../decor/ok.png"}
    }
    if (element_id == 7) {
        if (document.getElementById("reg_email").value == "") {document.getElementById("reg_email_img").src = "../img/no.png"}
        else {document.getElementById("reg_email_img").src = "../decor/ok.png"}
    }
}

function RegisterUser() {
    let post_type = 'new_user';
    let reg_login = document.getElementById('reg_login').value
    let reg_password = document.getElementById('reg_password').value
    let reg_name = document.getElementById('reg_name').value
    let reg_fam = document.getElementById('reg_fam').value
    let reg_tel = document.getElementById('reg_tel').value
    let reg_email = document.getElementById('reg_email').value

    if ((document.getElementById("reg_login_img").src.indexOf("/ok.png") != -1)&&
        (document.getElementById("reg_password_img").src.indexOf("/ok.png") != -1)&&
        (document.getElementById("reg_name_img").src.indexOf("/ok.png") != -1)&&
        (document.getElementById("reg_fam_img").src.indexOf("/ok.png") != -1)&&
        (document.getElementById("reg_tel_img").src.indexOf("/ok.png") != -1)&&
        (document.getElementById("reg_email_img").src.indexOf("/ok.png") != -1)) {
        document.getElementById("loader").style.display="block"
        let loginpass = JSON.stringify({
            post_type: post_type,
            reg_login: reg_login,
            reg_password: reg_password,
            reg_name: reg_name,
            reg_fam: reg_fam,
            reg_tel: reg_tel,
            reg_email: reg_email
        });
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("privat_info_element_1").innerHTML = this.responseText.substr(1, this.responseText.length - 2);
                GetShopingAdminPanel()
                document.getElementById("modal_container").style.display = "none"
            }
            if (this.readyState == 4) {
                document.getElementById("loader").style.display = "none"
            }
        };
        xhttp.open("POST", "/", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(loginpass);
    }
}

function UpDateUsersPage(pageN,filter,record_count_on_page){
    let post_body  = JSON.stringify({post_type: 'UpDateUsersPage', pageN: pageN, filter: filter, record_count_on_page: record_count_on_page});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    let pagestr = '';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                tempstr ='';
                pagestr = '<div class="pages">'
                pagestr = pagestr + "Страница:    "

                if (pageN>1) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/users?page=1&filter="+filter+"\" title=\"Первая\"> << </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/users?page="+(pageN-1)+"&filter="+filter+"\" title=\"Предыдущая\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            pagestr = pagestr + "<a class=\"page_activ\" href=\"/users?page="+i+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            pagestr = pagestr + "<a class=\"page\" href=\"/users?page="+(i)+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/users?page="+(pageN+1)+"&filter="+filter+"\" title=\"Следующая\"> > </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/users?page="+answer.page_count+"&filter="+filter+"\" title=\"Последняя\"> >> </a>"
                }
                pagestr = pagestr+'</div>'

                tempstr =""
                tempstr = tempstr+
                    '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                    '<div class=\"content_grid_item_1_users\">'+
                    '<h3>User</h3>'+
                    '  </div>'+
                    '<div class=\"content_grid_item_2_users\" >'+
                    '<h3>Права</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_3_users\" >'+
                    '<h3></h3>'+
                    '</div>'+
                    '</div>';

                 for (let i=0; i<10; i++) {
                    if (i<answer.data.length) {
                        tempstr = tempstr+'<div class=\"content_grid_sub_tab\">'
                        tempstr = tempstr+'<div class=\"content_grid_item_1_users\">'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].USER_LOGIN+' </a>'
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr+'<div class=\"content_grid_item_2_users\">'
                        if (answer.data[i].USER_CANDO.indexOf('user')!=-1) {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"user_'+answer.data[i].USER_ID+'\" '+
                                'checked '+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"user\")>'+
                                'Права пользователей</input>';
                        }
                        else {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"user_'+answer.data[i].USER_ID+'\" '+
                                ''+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"user\")>'+
                                'Права пользователей</input>';
                        }
                        tempstr = tempstr+'<br>';
                        if (answer.data[i].USER_CANDO.indexOf('order')!=-1) {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"order_'+answer.data[i].USER_ID+'\" '+
                                'checked '+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"order\")>'+
                                'Обработка заказов</input>';
                        }
                        else {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"order_'+answer.data[i].USER_ID+'\" '+
                                ''+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"order\")>'+
                                'Обработка заказов</input>';
                        }
                        tempstr = tempstr+'<br>';
                        if (answer.data[i].USER_CANDO.indexOf('prise')!=-1) {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"prise_'+answer.data[i].USER_ID+'\" '+
                                'checked '+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"prise\")>'+
                                'Наполнение контента</input>';
                        }
                        else {
                            tempstr = tempstr + '<input type="checkbox" '+
                                'id=\"prise_'+answer.data[i].USER_ID+'\" '+
                                ''+
                                'class=\"content_grid_item_1_users_link\" '+
                                'onclick=SetUserPr1('+answer.data[i].USER_ID+',\"prise\")>'+
                                'Наполнение контента</input>';
                        }
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr+'<div class=\"content_grid_item_3_users\" >'
                        tempstr = tempstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelUser('+answer.data[i].USER_ID+','+pageN+',\''+filter+'\','+record_count_on_page+','+answer.data[i].USER_LOGIN+')">    '
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr +'</div>';
                    }
                }

                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+pagestr+tempstr+pagestr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function SetUserPr1(User_ID,User_Pr) {

    let PrStr=""
    if (document.getElementById('user_'+User_ID).checked)
    {
        if (PrStr=="") {PrStr="user"}
        else {PrStr=PrStr+",user"}
    }
    if (document.getElementById('prise_'+User_ID).checked)
    {
        if (PrStr=="") {PrStr="prise"}
        else {PrStr=PrStr+",prise"}
    }
    if (document.getElementById('order_'+User_ID).checked)
    {
        if (PrStr=="") {PrStr="order"}
        else {PrStr=PrStr+",order"}
    }
    PrStr="["+PrStr+"]"

    let post_type = 'SetUserPr';
    let UserPr  = JSON.stringify({post_type: 'SetUserPr',PrStr: PrStr, UserID: User_ID});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(UserPr);
}

function DelPosClick(pos_id,cat_id,pageN,filter,content_record_count_on_page){
    document.getElementById("loader").style.display="block"
    let post_body  = JSON.stringify({post_type: 'DelPosClick', pos_id: pos_id});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                GetContentPos(content_record_count_on_page, pageN, cat_id, filter)
            }
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function DelUser(user_id,pageN,filter,record_count_on_page, usename){
    document.getElementById("loader").style.display="block"
    let post_body  = JSON.stringify({post_type: 'DelUser', user_id: user_id, usename: usename});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                UpDateUsersPage(pageN,filter,record_count_on_page)
            }
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}