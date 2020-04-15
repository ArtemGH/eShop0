"use strict";

function UpDateCategoriesPage(pageN, record_count_on_page,positions_record_count_on_page){

    let post_body  = JSON.stringify({post_type: 'UpDateCategoriesPage', pageN: pageN, 'record_count_on_page': record_count_on_page});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
//                document.getElementById('nav_refs').innerHTML = '<a href="/">eShop</a>/';
                tempstr = '<div class="pages">'
                tempstr=tempstr+"Страница:    ";
                if (pageN>1) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page=1&record_count_on_page="+record_count_on_page+"\" title=\"first\"> << </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(pageN-1)+"&record_count_on_page="+record_count_on_page+"\" title=\"previus\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            tempstr = tempstr + "<a class=\"page_activ\" href=\"/categories?page="+i+"&record_count_on_page="+record_count_on_page+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(i)+"&record_count_on_page="+record_count_on_page+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(pageN+1)+"&record_count_on_page="+record_count_on_page+"\" title=\"next\"> > </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+answer.page_count+"&record_count_on_page="+record_count_on_page+"\" title=\"last\"> >> </a>"
                }
                tempstr = tempstr+'</div>'

                tempstr = tempstr+'<div class="content_grid_sub" id="content_grid_sub">'
                for (let i=0; i<answer.rec_count_on_page; i++) {
                    tempstr = tempstr +'<div class=\"content_grid_item\">';
                    tempstr = tempstr + '<a href=\"positions?page=1&cat='+answer.data[i].CAT_ID+'&positions_record_count_on_page='+record_count_on_page+'&filtr=\"><div class="content_grid_item_div_img" id="content_grid_item_div_img" style="background-image: url(../content/img/cat/cat_'+answer.data[i].CAT_ID+'.jpg?'+new Date().getTime()+'); background-color: #FFFFFF" ></div></a>';


//                    tempstr = tempstr +'<a href=\"positions?page=1&cat='+answer.data[i].CAT_ID+'&positions_record_count_on_page='+positions_record_count_on_page+'&filtr="><img class=\"content_grid_item_img\" src=\"../content/img/cat/cat_'+answer.data[i].CAT_ID+'.jpg\"></a>';
                    tempstr = tempstr +'<a class=\"content_grid_item_link\" href=\"positions?page=1&cat='+answer.data[i].CAT_ID+'&positions_record_count_on_page='+record_count_on_page+'&filtr="> <h3 align=\"center\"> '+answer.data[i].CAT_NAME+' </h3></a>';
                    tempstr = tempstr + '</div>';
                }
                tempstr = tempstr+'</div>'

                tempstr = tempstr+'<div class="pages">'
                tempstr=tempstr+"Страница:    ";
                if (pageN>1) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page=1&record_count_on_page="+record_count_on_page+"\" title=\"first\"> << </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(pageN-1)+"&record_count_on_page="+record_count_on_page+"\" title=\"previus\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            tempstr = tempstr + "<a class=\"page_activ\" href=\"/categories?page="+i+"&record_count_on_page="+record_count_on_page+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(i)+"&record_count_on_page="+record_count_on_page+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+(pageN+1)+"&record_count_on_page="+record_count_on_page+"\" title=\"next\"> > </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/categories?page="+answer.page_count+"&record_count_on_page="+record_count_on_page+"\" title=\"last\"> >> </a>"
                }
                tempstr = tempstr+'</div>'

                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+tempstr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function UpDatePositionsPage(pageN, filter, cat_id, positions_record_count_on_page){

    let post_body  = JSON.stringify({post_type: 'UpDatePositionsPage', pageN: pageN, cat_id: cat_id, filter: filter, positions_record_count_on_page: positions_record_count_on_page});

    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
//                document.getElementById('nav_refs').innerHTML =
//                    '<a href="/">eShop</a>/'+
//                    '<a href="/positions?page=1&cat='+cat_id+'&positions_record_count_on_page='+positions_record_count_on_page+'&filtr='+filter+'">eShop</a>/';
                tempstr = '';
                tempstr = '<div class="pages">'
                tempstr=tempstr+"Страница:    ";
                if (pageN>1) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page=1&cat="+cat_id+"&filtr="+filter+"\" title=\"first\"> << </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+(pageN-1)+"&cat="+cat_id+"&filtr="+filter+"\" title=\"previus\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++) {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            tempstr = tempstr + "<a class=\"page_activ\" href=\"/positions?page="+i+"&cat="+cat_id+"&filtr="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+i+"&cat="+cat_id+"&filtr="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+(pageN+1)+"&cat="+cat_id+"&filtr="+filter+"\" title=\"next\"> > </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+answer.page_count+"&cat="+cat_id+"&filtr="+filter+"\" title=\"last\"> >> </a>"
                }
                tempstr =tempstr +'</div>'

                tempstr = tempstr+'<div class="content_grid_sub" id="content_grid_sub">'
                for (let i=0; i<answer.rec_count_on_page; i++) {
                    if (i<answer.data.length) {
                        tempstr = tempstr + '<div class=\"content_grid_item\">'
                        tempstr = tempstr + '<a href=\"position?pos='+answer.data[i].POS_ID+'\"><div class="content_grid_item_div_img" id="content_grid_item_div_img" style="background-image: url(../content/img/pos/pos_'+answer.data[i].POS_ID+'.jpg?'+new Date().getTime()+'); background-color: #FFFFFF" ></div></a>';
                        tempstr = tempstr + '<a href=\"position?pos='+answer.data[i].POS_ID+'\"><div class="content_grid_item_div_prise" id="content_grid_item_div_prise"><h3 style="margin: 0">'+answer.data[i].POS_PRICE+' грн</h3></div></a>';
                        tempstr = tempstr + '<a href=\"position?pos='+answer.data[i].POS_ID+'\"><div class="content_grid_item_div_name" id="content_grid_item_div_name"><h4 style="margin: 0">'+answer.data[i].POS_NAME+'</h4></div></a>';
                        tempstr = tempstr + '</div>';
                    }
                }
                tempstr =tempstr +'</div>'
                tempstr = tempstr +'<div class="pages">'
                tempstr=tempstr+"Страница:    ";
                if (pageN>1) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page=1&cat="+cat_id+"&filtr="+filter+"\" title=\"first\"> << </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+(pageN-1)+"&cat="+cat_id+"&filtr="+filter+"\" title=\"previus\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++) {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            tempstr = tempstr + "<a class=\"page_activ\" href=\"/positions?page="+i+"&cat="+cat_id+"&filtr="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+i+"&cat="+cat_id+"&filtr="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+(pageN+1)+"&cat="+cat_id+"&filtr="+filter+"\" title=\"next\"> > </a>"
                    tempstr = tempstr + "<a class=\"page\" href=\"/positions?page="+answer.page_count+"&cat="+cat_id+"&filtr="+filter+"\" title=\"last\"> >> </a>"
                }
                tempstr =tempstr +'</div>'
                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+tempstr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function UpDatePositionPage(pos_id){
    let post_body  = JSON.stringify({post_type: 'UpDatePositionPage', pos_id: pos_id});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                tempstr ='<div class="pos_header" id="pos_header"> ' +
                         '<div class="pos_header_btn_cnt"><input type="button" class="pos_header_btn" value="В корзину ('+answer.data[0].POS_PRICE+' грн)" onclick="AddToShoping('+answer.data[0].POS_ID+','+1+','+answer.data[0].POS_PRICE+',\''+answer.data[0].POS_NAME+'\')"></div>'+
                         '<div class="pos_header_txt_cnt"><h1 class="pos_header_txt">'+answer.data[0].POS_NAME+'</h1></div>' +
                         '</div>'
                tempstr = tempstr + '<div class=\"pos_left_side\" id=\"pos_left_side\">'+
                                      '<div class="pos_img_cnt" id="pos_img_cnt">'+
                                        '<div style="background-image: url(../content/img/pos/pos_'+answer.data[0].POS_ID+'.jpg); background-color: white" class=\"pos_img\">' +
                                      '</div>' +
                                    '</div>'+
                         '</div>'+
                         '<div style="overflow: hidden"  class=\"pos_right_side\" id=\"pos_right_side\">'+
                           '<iframe frameborder="no" scrolling="yes" class=\"pos_right_side_text\" src=\"../content/text/pos_'+answer.data[0].POS_ID+'.html\"></iframe>'+
                         '</div>';

                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+tempstr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);

}

function FindClick() {
    document.getElementById("loader").style.display="block"

    let find_url= document.documentURI;

    if (find_url.indexOf("categories?page=")!=-1) {
        location.href='/positions?page=1&cat=0&positions_record_count_on_page=10&filtr='+document.getElementById("find_panel_input").value
    }
    else if (find_url.indexOf("positions?page=")!=-1) {
        location.href='/positions?page=1&cat=0&positions_record_count_on_page=10&filtr='+document.getElementById("find_panel_input").value
    }
    else if (find_url.indexOf("content/?page=")!=-1) {
        location.href='/content/?page=1&cat_id=0&ContentType=Positions&filter='+document.getElementById("find_panel_input").value
    }
    else if (find_url.indexOf("users?page=")!=-1) {
        location.href='/users?page=1&filter='+document.getElementById("find_panel_input").value
    }
    else if (find_url.indexOf("orders?page=")!=-1) {
        location.href='/orders?page=1&filter='+document.getElementById("find_panel_input").value
    }
    else if (find_url.indexOf("shoping?filter=")!=-1) {
        location.href='/shoping?filter='+document.getElementById("find_panel_input").value
    }
    else
    {
        location.href='positions?page=1&cat=0&positions_record_count_on_page=10&filtr='+document.getElementById("find_panel_input").value+''
    }
}

function Modal_Hide() {
    document.getElementById("modal_container").innerHTML = "";
    document.getElementById("modal_container").style.display="none"
//      document.getElementById("modal_container_edit_pos").innerHTML=""
    document.getElementById("modal_container_edit_pos").style.display="none"
    document.getElementById("modal_container_edit_cat").style.display="none"
    document.getElementById("modal_container_edit_order").style.display="none"
    tinymce.remove('textarea')
}

function GetContentCats(content_record_count_on_page, pageN, cat_id, filter){
    let post_body  = JSON.stringify({post_type: 'GetContentCats', pageN: pageN, cat_id: cat_id, filter: filter, content_record_count_on_page: content_record_count_on_page});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    let pagestr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)

                pagestr = '<div class="pages">'
                pagestr = pagestr + "Страница:    "

                if (pageN>1) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page=1&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"Первая\"> << </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(pageN-1)+"&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"Предыдущая\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            pagestr = pagestr + "<a class=\"page_activ\" href=\"/content?page="+i+"&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(i)+"&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(pageN+1)+"&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"Следующая\"> > </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+answer.page_count+"&cat_id="+cat_id+"&ContentType=Categories&filter="+filter+"\" title=\"Последняя\"> >> </a>"
                }
                pagestr = pagestr+'</div>'


                tempstr =""

                tempstr = tempstr + '<div style="border: none" class=\"content_grid_sub_tab\" id="content_grid_sub" >'
                tempstr = tempstr + '<div class=\"content_grid_item_1_content_cats\">'
                tempstr = tempstr + '<input class="AddContentButton" type="button" value="Добавить" onclick="AddCatClick()">'
                tempstr = tempstr + '</div>';
                tempstr = tempstr + '</div>';

                tempstr = tempstr+
                    '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                    '<div class=\"content_grid_item_1_content_cats\">'+
                    '<h3>Фото</h3>'+
                    '  </div>'+
                    '<div class=\"content_grid_item_2_content_cats\" >'+
                    '<h3>Название</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_3_content_cats\" >'+
                    '<h3>Позиции</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_4_content_cats\" >'+
                    '<h3></h3>'+
                    '</div>'+
                    '</div>';


                for (let i=0; i<10; i++) {
                    if (i<answer.data.length) {
                        tempstr = tempstr + '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'
                        tempstr = tempstr + '<div class=\"content_grid_item_1_content_cats\">'
                        tempstr = tempstr + '<a class=\"content_grid_item_1_content_link\" href=\"/content?page=1&cat_id='+answer.data[i].CAT_ID+'&ContentType=Positions&filter=\" align=\"center\">'
                        tempstr = tempstr + '<img class=\"content_grid_item_img\" src=\"../content/img/cat/cat_'+answer.data[i].CAT_ID+'.jpg?'+new Date().getTime()+'\"> </a>'
                        tempstr = tempstr + '</div>';

                        tempstr = tempstr+'<div class=\"content_grid_item_2_content_cats\" >'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_content_link\" href=\"/content?page=1&cat_id='+answer.data[i].CAT_ID+'&ContentType=Positions&filter=\"> '+answer.data[i].CAT_NAME+' </a>'
                        tempstr = tempstr +'</div>';

                        if (answer.data[i].Count_POSITIONS==null) {answer.data[i].Count_POSITIONS=0}
                        tempstr = tempstr+'<div class=\"content_grid_item_3_content_cats\" >'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_content_link\" href=\"/content?page=1&cat_id='+answer.data[i].CAT_ID+'&ContentType=Positions&filter=\"> '+answer.data[i].Count_POSITIONS+' </a>'
                        tempstr = tempstr +'</div>';

                        tempstr = tempstr+'<div class=\"content_grid_item_4_content_cats\" >'
                        tempstr = tempstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditCatWindow('+answer.data[i].CAT_ID+',\''+answer.data[i].CAT_NAME+'\',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')">    '
                        if (answer.data[i].Count_POSITIONS==0) {tempstr = tempstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelCatClick('+answer.data[i].CAT_ID+','+pageN+',\''+filter+'\','+content_record_count_on_page+')">    '}
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr +'</div>';
                    }
                }

                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+pagestr+tempstr+pagestr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display="none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function GetContentPos(content_record_count_on_page, pageN, cat_id, filter){
    let post_body  = JSON.stringify({post_type: 'GetContentPos', pageN: pageN, cat_id: cat_id, filter: filter, content_record_count_on_page: content_record_count_on_page});
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
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page=1&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"Первая\"> << </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(pageN-1)+"&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"Предыдущая\"> < </a>"
                }
                for (let i = pageN-3; i<=pageN+3; i++)
                {
                    if ((i>0) && (i<=answer.page_count)){
                        if (i==pageN) {
                            pagestr = pagestr + "<a class=\"page_activ\" href=\"/content?page="+i+"&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                        if (i!=pageN) {
                            pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(i)+"&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"\"> "+i+" </a>"
                        }
                    }
                }
                if (pageN<answer.page_count) {
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+(pageN+1)+"&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"Следующая\"> > </a>"
                    pagestr = pagestr + "<a class=\"page\" href=\"/content?page="+answer.page_count+"&cat_id="+cat_id+"&ContentType=Positions&filter="+filter+"\" title=\"Последняя\"> >> </a>"
                }
                pagestr = pagestr+'</div>'

                tempstr =""
                tempstr = tempstr + '<div style="border: none" class=\"content_grid_sub_tab\" id="content_grid_sub" >'
                tempstr = tempstr + '<div class=\"content_grid_item_1_content_pos\">'
                tempstr = tempstr + '<input class="AddContentButton" type="button" value="Добавить" onclick="ShowEditPosWindow('+cat_id+','+0+',\''+''+'\','+0+',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')">'
                tempstr = tempstr + '</div>';
                tempstr = tempstr + '</div>';

                tempstr = tempstr+
                    '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                    '<div class=\"content_grid_item_1_content_pos\">'+
                    '<h3>Фото</h3>'+
                    '  </div>'+
                    '<div class=\"content_grid_item_2_content_pos\" >'+
                    '<h3>Название</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_3_content_pos\" >'+
                    '<h3>Цена</h3>'+
                    '</div>'+
                    '<div class=\"content_grid_item_4_content_pos\" >'+
                    '<h3></h3>'+
                    '</div>'+
                    '</div>';


                for (let i=0; i<10; i++) {
                    if (i<answer.data.length) {
                        tempstr = tempstr+'<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'
                        tempstr = tempstr+'<div class=\"content_grid_item_1_content_pos\">'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_content_link\" href=javascript:ShowEditPosWindow('+cat_id+','+answer.data[i].POS_ID+',\''+answer.data[i].POS_NAME+'\','+answer.data[i].POS_PRICE+',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+') align=\"center\">' +
                                '<img class=\"content_grid_item_img\" src=\"../content/img/pos/pos_'+answer.data[i].POS_ID+'.jpg?'+new Date().getTime()+'\"> </a>'
                        tempstr = tempstr+'<p>';
                        tempstr = tempstr +'</div>';

                        tempstr = tempstr+'<div class=\"content_grid_item_2_content_pos\" >'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_content_link\" href=javascript:ShowEditPosWindow('+cat_id+','+answer.data[i].POS_ID+',\''+answer.data[i].POS_NAME+'\','+answer.data[i].POS_PRICE+',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')> '+answer.data[i].POS_NAME+' </a>'
                        tempstr = tempstr +'</div>';

                        if (answer.data[i].Count_POSITIONS==null) {answer.data[i].Count_POSITIONS=0}
                        tempstr = tempstr+'<div class=\"content_grid_item_3_content_pos\" >'
                        tempstr = tempstr+'<a class=\"content_grid_item_1_content_link\" href=javascript:ShowEditPosWindow('+cat_id+','+answer.data[i].POS_ID+',\''+answer.data[i].POS_NAME+'\','+answer.data[i].POS_PRICE+',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')>'+answer.data[i].POS_PRICE+'</a>'
                        tempstr = tempstr +'</div>';

                        tempstr = tempstr+'<div class=\"content_grid_item_4_content_pos\" >'
                        tempstr = tempstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditPosWindow('+cat_id+','+answer.data[i].POS_ID+',\''+answer.data[i].POS_NAME+'\','+answer.data[i].POS_PRICE+',\''+answer.UserName+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')">    '
                        tempstr = tempstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelPosClick('+answer.data[i].POS_ID+','+cat_id+','+pageN+',\''+filter+'\','+content_record_count_on_page+')">    '
                        tempstr = tempstr +'</div>';
                        tempstr = tempstr +'</div>';
                    }
                }
                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+pagestr+tempstr+pagestr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display="none"

        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
}

function GetPosText(pos_id) {
    let login = JSON.stringify({post_type: 'Get_Pos_Text', pos_id: pos_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            tinymce.activeEditor.setContent(this.responseText)
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(login);
}

function ShowEditPosWindow(cat_id, pos_id, pos_name, pos_prise, username, filter, content_record_count_on_page, pageN) {
    document.getElementById("loader").style.display="block"
    let login = JSON.stringify({post_type: 'Set_Img_For_Edit', pos_id: pos_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let EditWindow = ''
            if (pos_id==0){pos_name=""; pos_prise=''}
            EditWindow = '<div class="modal_background_edit_pos" id="modal_background_edit_pos" onclick="Modal_Hide()"> </div>' +
                '<div class="edit_pos_modal_window" >' +
                '<span class="window_close" onclick="Modal_Hide()">Закрыть X</span>'

            if (pos_id == 0) {
                EditWindow = EditWindow + '<h2>Добавить позицию</h2>'
            } else {
                EditWindow = EditWindow + '<h2>Редактировать позицию</h2>'
            }
            EditWindow = EditWindow + '<div class="edit_pos_left_side" id="edit_pos_left_side">' +
                '<input type="text" class="edit_pos_name" id="edit_pos_name" placeholder="Название" value="'+pos_name+'">'+
                '<input type="number" class="edit_pos_price" id="edit_pos_price" step="0.01" placeholder="Цена" value="'+pos_prise+'">'
            EditWindow = EditWindow +
                '<div class="edit_pos_img_cnt" id="edit_pos_img_cnt">'+
                '<div style="background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_pos_img" id="edit_pos_img"></div>';
            if (pos_id == 0) {EditWindow = EditWindow + '<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\'\',0,\''+username+'\')">'}
            else {EditWindow = EditWindow +'<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+pos_name+'\','+pos_prise+',\''+username+'\')">'}
            EditWindow = EditWindow +'</div>';
            EditWindow = EditWindow +
                '<input type="button" class="edit_pos_button" id="edit_pos_button" value="Сохранить" onclick="EditPosSave(' + cat_id + ',' + pos_id + ',\''+username+'\',\''+filter+'\','+content_record_count_on_page+','+pageN+')">' +
                '</div>' +
                '<div class="edit_pos_right_side">' +
                '<textarea class="tiny_text" id="tiny_text"> </textarea>' +
                '</div>' +
                '</div>'

            document.getElementById("modal_container_edit_pos").style.display = "block"
            document.getElementById("modal_container_edit_pos").innerHTML = EditWindow
            tinymce.init({
                selector: 'textarea',
                resize: true,
                theme_advanced_resizing : true,
                branding:false,
                plugins: ['link lists','media','fullscreen'],
                placeholder: 'Описание позиции',
                toolbar1: 'fullscreen | undo redo | formatselect fontselect fontsizeselect',
                toolbar2: 'alignleft aligncenter alignright alignjustify | numlist bullist | bold italic underline | link media | forecolor backcolor | removeformat',
                menubar: false,
                setup: function (editor) {
                    editor.on('init',function (e) {
                        GetPosText(pos_id)
                    })
                }
            })
        }
        if (this.readyState==4){ document.getElementById("loader").style.display="none"
        }

    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(login);

}

function ShowEditCatWindow(cat_id, cat_name, username, filter, content_record_count_on_page, pageN) {
    document.getElementById("loader").style.display="block"
    let login = JSON.stringify({post_type: 'Set_Img_For_Edit_Cat', cat_id: cat_id});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let EditWindow = ''
            if (cat_id == 0) {
                cat_name = ""
            }
            EditWindow = '<div class="modal_background_edit_cat" id="modal_background_edit_cat" onclick="Modal_Hide()"> </div>' +
                '<div class="edit_cat_modal_window" >' +
                '<span class="window_close" onclick="Modal_Hide()">Закрыть X</span>'

            if (cat_id == 0) {
                EditWindow = EditWindow + '<h2>Добавить категорию</h2>'
            } else {
                EditWindow = EditWindow + '<h2>Редактировать</h2>'
            }
            EditWindow = EditWindow + '<div class="edit_cat_left_side" id="edit_cat_left_side">' +
                '<input type="text" class="edit_cat_name" id="edit_cat_name" placeholder="Название" value="' + cat_name + '">'
            EditWindow = EditWindow +
                '<div class="edit_cat_img_cnt" id="edit_cat_img_cnt">' +
                '<div style="background-image: url(../temp/edit_cat_' + username + cat_id + '.jpg?' + new Date().getTime() + '); background-color: white" class="edit_cat_img" id="edit_cat_img"></div>';
            if (cat_id == 0) {
                EditWindow = EditWindow + '<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange(' + cat_id + ',\'' + username + '\')">'
            } else {
                EditWindow = EditWindow + '<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange(' + cat_id + ',\'' + username + '\')">'
            }
            EditWindow = EditWindow + '</div>';
            EditWindow = EditWindow +
                '<input type="button" class="edit_cat_button" id="edit_cat_button" value="Сохранить" onclick="EditCatSave(' + cat_id + ',\'' + username + '\',\'' + filter + '\',' + content_record_count_on_page + ',' + pageN + ')">' +
                '</div>'
            document.getElementById("modal_container_edit_cat").style.display = "block"
            document.getElementById("modal_container_edit_cat").innerHTML = EditWindow
        }


        if (this.readyState==4){ document.getElementById("loader").style.display="none"}

    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(login);
}

function EditPosFileOnChange(cat_id, pos_id, pos_name, pos_prise, username) {
    let tempstr = ""
    if (document.getElementById("edit_pos_img_file").files.length == 0) {
    }
    else {
        let formData = new FormData();
        formData.append("pos_id", pos_id);
        formData.append("username", username);
        formData.append("file", document.getElementById("edit_pos_img_file").files[0])
        let request = new XMLHttpRequest();
        request.open('POST', '/set_foto_for_edit_pos');
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    tempstr = '<div style="background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_pos_img" id="edit_pos_img"></div>'
                    if (pos_id == 0) {
                        tempstr = tempstr + '<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\'\',0,\''+username+'\')">'
                    }else{
                        tempstr = tempstr +'<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+pos_name+'\','+pos_prise+',\''+username+'\')">'
                    }

                    document.getElementById("edit_pos_img_cnt").innerHTML =tempstr

                } else {
                    tempstr = '<div style="background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_pos_img" id="edit_pos_img"></div>'
                    if (pos_id == 0) {
                        tempstr = tempstr + '<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\'\',0,\''+username+'\')">'
                    }else{
                        tempstr = tempstr +'<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+pos_name+'\','+pos_prise+',\''+username+'\')">'
                    }

                    document.getElementById("edit_pos_img_cnt").innerHTML =tempstr
                }
            }
        }
        request.send(formData);
    }
}

function EditCatFileOnChange(cat_id, username) {
    let tempstr = ""
    if (document.getElementById("edit_cat_img_file").files.length == 0) {
    }
    else {
        let formData = new FormData();
        formData.append("cat_id", cat_id);
        formData.append("username", username);
        formData.append("file", document.getElementById("edit_cat_img_file").files[0])
        let request = new XMLHttpRequest();
        request.open('POST', '/set_foto_for_edit_cat');
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
//                alert(this.readyState)
                if (this.status == 200) {
                    tempstr = '<div style="background-image: url(../temp/edit_cat_'+username+cat_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_cat_img" id="edit_cat_img"></div>'
                    if (cat_id == 0) {
                        tempstr = tempstr + '<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange('+cat_id+',\''+username+'\')">'
                    }else{
                        tempstr = tempstr +'<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange('+cat_id+',\''+username+'\')">'
                    }
                    document.getElementById("edit_cat_img_cnt").innerHTML =tempstr
                } else {

                }
            }
        }
        request.send(formData);
    }
}

function EditPosSave(cat_id,pos_id, username, filter, content_record_count_on_page, pageN) {
    document.getElementById("modal_container").style.display="none"
    document.getElementById("loader").style.display="block"

    let formData = new FormData();
    formData.append("username", username);
    formData.append("cat_id", cat_id);
    formData.append("pos_id", pos_id);
    formData.append("name", document.getElementById("edit_pos_name").value);
    formData.append("price", document.getElementById("edit_pos_price").value);
    formData.append("text", tinymce.activeEditor.getContent());
    formData.append("file_count", document.getElementById("edit_pos_img_file").files.length)
    if (document.getElementById("edit_pos_img_file").files.length==1){
        formData.append("file", document.getElementById("edit_pos_img_file").files[0])
    }
    let request = new XMLHttpRequest();
    request.open('POST', '/edit_pos');
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                GetContentPos(content_record_count_on_page, pageN, cat_id, filter)
            } else {

            }
        }
    }
    request.send(formData);
    Modal_Hide()
}

function EditCatSave(cat_id, username, filter, content_record_count_on_page, pageN) {
    document.getElementById("modal_container").style.display="none"
    document.getElementById("loader").style.display="block"
    alert("1004 ")
    let formData = new FormData();
    formData.append("username", username);
    formData.append("cat_id", cat_id);
    formData.append("cat_name", document.getElementById("edit_cat_name").value);
    formData.append("file_count", document.getElementById("edit_cat_img_file").files.length)
    alert("1003 ")
    if (document.getElementById("edit_cat_img_file").files.length==1){
        formData.append("file", document.getElementById("edit_cat_img_file").files[0])
    }
    alert("1002 ")
    let request = new XMLHttpRequest();
    request.open('POST', '/edit_cat');
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            alert("1001 "+this.readyState)
            if (this.status == 200) {
                alert("1000")
                GetContentCats(content_record_count_on_page, pageN, cat_id, filter)
            } else {

            }
        }
    }
    request.send(formData);
    Modal_Hide()
}

function DelCatClick(cat_id, pageN, filter, content_record_count_on_page){
    document.getElementById("loader").style.display="block"
    let post_body  = JSON.stringify({post_type: 'DelCatClick', cat_id: cat_id});
    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                GetContentCats(content_record_count_on_page, pageN, cat_id, filter)
            }
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(post_body);
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


