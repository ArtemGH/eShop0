"use strict";

function UpDateOrdersPage(pageN,filter,record_count_on_page){
    let post_body  = JSON.stringify({post_type: 'UpDateOrdersPage', pageN: pageN, filter: filter, record_count_on_page: record_count_on_page});
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
                    pagestr = pagestr + "<a class=\"page\" href=\"/orders?page=1&filter="+filter+"\" title=\"Первая\"> << </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(pageN-1)+"&filter="+filter+"\" title=\"Предыдущая\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            pagestr = pagestr + "<a class=\"page_activ\" href=\"/orders?page="+i+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(i)+"&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+(pageN+1)+"&filter="+filter+"\" title=\"Следующая\"> > </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/orders?page="+answer.page_count+"&filter="+filter+"\" title=\"Последняя\"> >> </a>"
                }
                pagestr = pagestr+'</div>'

                tempstr =""
                tempstr = tempstr+
                    '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                    '<div class=\"content_grid_item_1_orders\">'+
                    '<h3>User</h3>'+
                    '  </div>'+
                    '<div class=\"content_grid_item_2_orders\" >'+
                    '<h3>Дата</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_3_orders\" >'+
                    '<h3>Сумма</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_4_orders\" >'+
                    '<h3>Статус</h3>'+
                    '</div>'+
                    '</div>';

                for (let i=0; i<10; i++) {
                    if (i<answer.data.length) {
                        tempstr = tempstr+'<div class=\"content_grid_sub_tab\">'
                        tempstr = tempstr+'<div class=\"content_grid_item_1_orders\">'
                        tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].ORDER_ID+','+pageN+',"'+filter+'",'+record_count_on_page+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].USER_LOGIN+' </a>'
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr+'<div class=\"content_grid_item_2_orders\">'
                        tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].ORDER_ID+','+pageN+',"'+filter+'",'+record_count_on_page+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].ORDER_DATE+' </a>'
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr+'<div class=\"content_grid_item_3_orders\">'
                        tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].ORDER_ID+','+pageN+',"'+filter+'",'+record_count_on_page+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].ORDER_SUMM+' </a>'
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr+'<div class=\"content_grid_item_4_orders\" >'
                        tempstr = tempstr+'<a href=javascript:ShowEditOrderWindow('+answer.data[i].ORDER_ID+','+pageN+',"'+filter+'",'+record_count_on_page+') class=\"content_grid_item_1_users_link\" align=\"right\"> '+answer.data[i].ORDER_STATUS+' </a>'
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr +'</div>';
                    }
                }
                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+pagestr+tempstr+pagestr
                document.getElementById("modal_container_edit_order").style.display = "none"
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function ShowEditOrderWindow(order_id, pageN,filter,record_count_on_page) {
    document.getElementById("loader").style.display="block"

    let post_body  = JSON.stringify({post_type: 'GetOrder', order_id: order_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)

                let EditWindow = ''
                EditWindow = EditWindow + '<div class="modal_background_edit_order" id="modal_background_edit_order" onclick="Modal_Hide()"> </div>'
                EditWindow = EditWindow + '<div class="edit_order_modal_window" >'
                EditWindow = EditWindow + '<span class="window_close" onclick="Modal_Hide()">Закрыть X</span>'

                EditWindow = EditWindow + '<h2>Обработка заказа</h2>'

                EditWindow = EditWindow + '<div class="edit_order_left_side" id="edit_order_left_side">'
                EditWindow = EditWindow + '<div class="edit_order_left_side_box" id="edit_order_left_side_box">'
                EditWindow = EditWindow +'<dl><dt>Имя:</dt><dd>'+answer[0].USER_FIRST_NAME+'</dd></dl>'
                EditWindow = EditWindow +'<dl><dt>Фамилия:</dt><dd>'+answer[0].USER_LAST_NAME+'</dd></dl>'
                EditWindow = EditWindow +'<dl><dt>Телефон:</dt><dd><a href="tel:'+answer[0].USER_TEL+'">'+answer[0].USER_TEL+'</a></dd></dl>'
                EditWindow = EditWindow +'<dl><dt>Mail:</dt><dd><a class="logo_contact_mail" href="mailto:'+answer[0].USER_MAIL+'">'+answer[0].USER_MAIL+'</a></dd></dl>'
                EditWindow = EditWindow +'<p></p>'
                EditWindow = EditWindow +'<dl><dt>Заказ дата:</dt><dd>'+answer[0].ORDER_DATE+'</dd></dl>'
                EditWindow = EditWindow +'<dl><dt>Заказ сумма:</dt><dd>'+answer[0].ORDER_SUMM+'</dd></dl>'
                EditWindow = EditWindow +'<dl><dt>Заказ статус:</dt><dd>'+answer[0].ORDER_STATUS+'</dd></dl>'
                if (answer[0].ORDER_STATUS=="Открыт"){
                    EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_exec" id="edit_order_btn_order_exec" value="Выполнить" onclick="ExecOrder('+order_id+','+pageN+',\''+filter+'\','+record_count_on_page+')">'
                    EditWindow = EditWindow +'<p></p>'
                    EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_cancel" id="edit_order_btn_order_cancel" value="Отменить" onclick="CancelOrder('+order_id+','+pageN+',\''+filter+'\','+record_count_on_page+')">'
                }
                if (answer[0].ORDER_STATUS=="Отменен"){
                    EditWindow = EditWindow +'<input type="button" class="edit_order_btn_order_return" id="edit_order_btn_order_return" value="Восстановить" onclick="ReturnOrder('+order_id+','+pageN+',\''+filter+'\','+record_count_on_page+')">'
                }

                EditWindow = EditWindow + '</div>';
                EditWindow = EditWindow + '</div>';

                EditWindow = EditWindow + '<div class="edit_order_right_side" id="class="edit_order_right_side"">'
                EditWindow = EditWindow + '<div class="edit_order_right_side_box" id="edit_order_right_side_box">'

                EditWindow = EditWindow + '<div class=\"content_grid_sub_tab_o\" id="content_grid_sub" >'
                EditWindow = EditWindow + '<div class=\"content_grid_item_1_order\"><h3>Позиция</h3></div>'
                EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Цена</h3></div>'
                EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Кол-во</h3></div>'
                EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3>Сумма</h3></div>'
                EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ><h3></h3></div>'
                EditWindow = EditWindow + '</div>';

                for (let i=0; i<answer.length; i++){
                    EditWindow = EditWindow + '<div class=\"content_grid_sub_tab_o\" id="content_grid_sub" >'
                    EditWindow = EditWindow + '<div class=\"content_grid_item_1_order\">'+answer[i].ORDER_POS_NAME+'</div>'
                    EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+answer[i].ORDER_POS_PRICE+'</div>'
                    EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+answer[i].ORDER_POS_COUNT+'</div>'
                    EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" >'+answer[i].ORDER_POS_SUMM+'</div>'
                    EditWindow = EditWindow + '<div class=\"content_grid_item_2_order\" ></div>'
                    EditWindow = EditWindow + '</div>';
                }

                EditWindow = EditWindow + '</div>'
                EditWindow = EditWindow + '</div>'

                document.getElementById("modal_container_edit_order").style.display = "block"
                document.getElementById("modal_container_edit_order").innerHTML = EditWindow
            }
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function ExecOrder(order_id, pageN,filter,record_count_on_page){
    document.getElementById("loader").style.display="block"

    let post_body  = JSON.stringify({post_type: 'ExecOrder', order_id: order_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                document.getElementById("modal_container_edit_order").style.display = "none"
            }
            UpDateOrdersPage(pageN,filter,record_count_on_page)
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function CancelOrder(order_id, pageN,filter,record_count_on_page){
    document.getElementById("loader").style.display="block"

    let post_body  = JSON.stringify({post_type: 'CancelOrder', order_id: order_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                document.getElementById("modal_container_edit_order").style.display = "none"
            }
            UpDateOrdersPage(pageN,filter,record_count_on_page)
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function ReturnOrder(order_id, pageN,filter,record_count_on_page){
    document.getElementById("loader").style.display="block"

    let post_body  = JSON.stringify({post_type: 'ReturnOrder', order_id: order_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                document.getElementById("modal_container_edit_order").style.display = "none"
            }
            UpDateOrdersPage(pageN,filter,record_count_on_page)
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}