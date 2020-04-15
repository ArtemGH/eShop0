"use strict";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function GetShopingAdminPanel() {
    let str=``;
    let Shoping = {}
    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos=[]
    } else {
        Shoping = JSON.parse(str);
    }
    let post_body  = JSON.stringify({post_type:'CheckShoping',sum:Shoping.sum,CNT:Shoping.CNT,pos:Shoping.pos});

    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    let pagesstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
                Shoping.sum=answer.sum
                Shoping.CNT=answer.CNT
                Shoping.pos=answer.pos
                localStorage.setItem("shoping",JSON.stringify(Shoping))
                document.getElementById("find_login_shoping_count").innerText=answer.CNT+" ("+answer.sum+" грн)"
                document.getElementById("find_login_shoping_count").href = '/shoping?filter='
            }
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((post_body));
}

async function UpDateShoping(filter) {
    let str=``;
    let Shoping = {}
    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos=[]
    } else {
        Shoping = JSON.parse(str);
    }
    let post_body  = JSON.stringify({post_type:'UpDateShoping',filter:filter,sum:Shoping.sum,CNT:Shoping.CNT,pos:Shoping.pos});

    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    let pagesstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)

                tempstr =
                '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                  '<div class=\"content_grid_item_1_content\">'+
                    '<input class="AddContentButton" type="button" value="Заказать" onclick="CreateOrder()">'+
                  '</div>'+
                '</div>';

                tempstr = tempstr+
                '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                  '<div class=\"content_grid_item_1_shoping\">'+
                    '<h3>Фото</h3>'+
                '  </div>'+
                  '<div class=\"content_grid_item_2_shoping\" >'+
                    '<h3>Название</h3>'+
                  '</div>'+
                  '<div class=\"content_grid_item_3_shoping\" >'+
                    '<h3>Цена</h3>'+
                  '</div>'+
                  '<div class=\"content_grid_item_4_shoping\" >'+
                    '<h3>Кол-во</h3>'+
                  '</div>'+
                  '<div class=\"content_grid_item_5_shoping\" >'+
                    '<h3>Сумма</h3>'+
                  '</div>'+
                  '<div class=\"content_grid_item_6_shoping\" >'+
                    '<h3></h3>'+
                  '</div>'+
                '</div>';



                for (let i=0; i<answer.data.length; i++) {
                    if ((i<answer.data.length)&&(answer.data[0].POS_NAME.indexOf!=-1)) {
                        tempstr = tempstr+
                        '<div class=\"content_grid_sub_tab\" id="content_grid_sub" >'+
                          '<div class=\"content_grid_item_1_shoping\">'+
                            '<a class=\"content_grid_item_1_content_link\" align=\"center\">' +
                            '<img class=\"content_grid_item_img\" src=\"../content/img/pos/pos_'+answer.data[i].POS_ID+'.jpg\"> </a>'+
                          '</div>'+
                          '<div class=\"content_grid_item_2_shoping\" >'+
                            '<a class=\"content_grid_item_1_content_link\"> '+answer.data[i].POS_NAME+' </a>'+
                          '</div>'+
                          '<div class=\"content_grid_item_3_shoping\" >'+
                            '<a class=\"content_grid_item_1_content_link\"> '+answer.data[i].POS_PRICE+' </a>'+
                          '</div>';

                           let b=false
                           let tempsum=0

                           for (let j=0; j<Shoping.pos.length; j++) {
                               if (Number(Shoping.pos[j].id) == Number(answer.data[i].POS_ID)) {
                                b=true
                                tempstr = tempstr+'' +
                                '<div class=\"content_grid_item_4_shoping\" >'+
                                  '<a class=\"content_grid_item_1_content_link\" id="count_link_'+answer.data[i].POS_ID+'"> '+Shoping.pos[j].CNT+' </a> <a href="javascript:ShopingCountUp('+Shoping.pos[j].id+')">  +</a>/<a href="javascript:ShopingCountDown('+Shoping.pos[j].id+')">-</a>'+
                                '</div>';
                                tempsum=Shoping.pos[j].CNT;
                              }
                           }
                           if (b==false) {
                              tempstr = tempstr+
                              '<div class=\"content_grid_item_4_shoping\" >'+
                                '<a class=\"content_grid_item_1_content_link\"> Нет на складе </a>'+
                              '</div>';
                           }
                        tempstr = tempstr+
                            '<div class=\"content_grid_item_5_shoping\" >'+
                              '<a class=\"content_grid_item_1_content_link\" id="sum_link_'+answer.data[i].POS_ID+'"> '+Number(tempsum)*Number(answer.data[i].POS_PRICE)+' </a>'+
                            '</div>'+
                            '<div class=\"content_grid_item_6_shoping\" >'+
                              '<input class="DeleteContentButton" type="button" value="Удалить" onclick="ShopingDelete('+answer.data[i].POS_ID+',\''+filter+'\')">    '+
                            '</div>'+
                        '</div>';
                    }
                }
                document.getElementById("content_grid").innerHTML = '<div class="content_grid_loader" id="content_grid_loader"></div>'+tempstr
            }
            document.getElementById("content_grid_loader").style.display = "none"
            document.getElementById("loader").style.display = "none"
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((post_body));

}

async function AddToShoping(id,CNT,price, posname) {
    document.getElementById("loader").style.display = "block"
    await sleep(200)
    let str='';
    let Shoping = {}
    let ShPos = {id:id, CNT:CNT, price:price, posname: posname}
    let b=false

    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos= new Array()

    } else {
        Shoping = JSON.parse(str);
    }

    b=false
    for ( let i = 0; i < Shoping.pos.length; i++) {
        if (ShPos.id==Shoping.pos[i].id){
            b=true
            Shoping.pos[i].CNT=Number(Shoping.pos[i].CNT)+Number(ShPos.CNT)
            Shoping.pos[i].price=Number(Shoping.pos[i].price)+Number(ShPos.price)
        }
    }
    if (b==false) {
        Shoping.pos[Number(Shoping.pos.length)]=ShPos
    }
    Shoping.sum=0
    Shoping.CNT=Shoping.pos.length
    for (let i=0; i<Shoping.pos.length; i++)
    {
        Shoping.sum=Shoping.sum+Shoping.pos[i].price
    }
    localStorage.setItem("shoping",JSON.stringify(Shoping))
    document.getElementById("find_login_shoping_count").innerText=Shoping.CNT+" ("+Shoping.sum+" грн)"
    document.getElementById("content_grid_loader").style.display = "none"
    document.getElementById("loader").style.display = "none"

}

async function ShopingCountUp(id){
    let str='';
    let Shoping = {}
    let b=false

    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos= new Array()

    } else {
        Shoping = JSON.parse(str);
    }

    b=false
    for ( let i = 0; i < Shoping.pos.length; i++) {
        if (id==Shoping.pos[i].id){
            b=true

            Shoping.pos[i].price=Number(Shoping.pos[i].price)+Number(Shoping.pos[i].price/Shoping.pos[i].CNT)
            Shoping.pos[i].CNT=Number(Shoping.pos[i].CNT)+Number(1)
            document.getElementById("count_link_"+id).innerText=Shoping.pos[i].CNT
            document.getElementById("sum_link_"+id).innerText=Shoping.pos[i].price
        }
    }

    Shoping.sum=0
    Shoping.CNT=Shoping.pos.length
    for (let i=0; i<Shoping.pos.length; i++)
    {
        Shoping.sum=Shoping.sum+Shoping.pos[i].price
    }
    localStorage.setItem("shoping",JSON.stringify(Shoping))
    document.getElementById("find_login_shoping_count").innerText=Shoping.CNT+" ("+Shoping.sum+" грн)"
}

async function ShopingCountDown(id){
    let str='';
    let Shoping = {}
    let b=false

    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos= new Array()

    } else {
        Shoping = JSON.parse(str);
    }

    b=false
    for ( let i = 0; i < Shoping.pos.length; i++) {
        if (id==Shoping.pos[i].id){
            b=true
            if (Shoping.pos[i].CNT>1) {
                Shoping.pos[i].price = Number(Shoping.pos[i].price) - Number(Shoping.pos[i].price / Shoping.pos[i].CNT)
                Shoping.pos[i].CNT = Number(Shoping.pos[i].CNT) - Number(1)
                document.getElementById("count_link_" + id).innerText = Shoping.pos[i].CNT
                document.getElementById("sum_link_" + id).innerText = Shoping.pos[i].price
            }
        }
    }

    Shoping.sum=0
    Shoping.CNT=Shoping.pos.length
    for (let i=0; i<Shoping.pos.length; i++)
    {
        Shoping.sum=Shoping.sum+Shoping.pos[i].price
    }
    localStorage.setItem("shoping",JSON.stringify(Shoping))
    document.getElementById("find_login_shoping_count").innerText=Shoping.CNT+" ("+Shoping.sum+" грн)"
}

async function ShopingDelete(id, filter){
    document.getElementById("loader").style.display = "block"
    let str='';
    let Shoping = {}
    let ShopingNew = {}
    let b=0

    ShopingNew.sum=0
    ShopingNew.CNT=0
    ShopingNew.pos= new Array()

    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos= new Array()

    } else {
        Shoping = JSON.parse(str);
    }

    for ( let i = 0; i < Shoping.pos.length; i++) {
        if (id!=Shoping.pos[i].id){
            b = b + 1
            ShopingNew.pos.length = b
            ShopingNew.pos[b-1]=Shoping.pos[i]
        }
    }

    ShopingNew.sum=0
    ShopingNew.CNT=ShopingNew.pos.length
    for (let i=0; i<ShopingNew.pos.length; i++)
    {
        ShopingNew.sum=ShopingNew.sum + ShopingNew.pos[i].price
    }

    localStorage.setItem("shoping",JSON.stringify(ShopingNew))
    GetShopingAdminPanel
    UpDateShoping(filter)

}

async function CreateOrder() {
    document.getElementById("loader").style.display = "block"
    let str='';
    let Shoping = {}
    str=localStorage.getItem("shoping");
    if (str==null){
        Shoping.sum=0
        Shoping.CNT=0
        Shoping.pos=[]
    } else {
        Shoping = JSON.parse(str);
    }
    let post_body  = JSON.stringify({post_type:'CreateOrder',sum:Shoping.sum, CNT:Shoping.CNT,pos:Shoping.pos});

    let xhttp = new XMLHttpRequest();
    let tempstr = '';
    let pagesstr = '';
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let answer = JSON.parse(this.responseText)
//                Shoping.sum=0
//                Shoping.CNT=0
//                Shoping.pos.length=0
//                localStorage.setItem("shoping",JSON.stringify(Shoping))
//                document.getElementById("find_login_shoping_count").innerText=answer.CNT+" ("+answer.sum+" грн)"
//                document.getElementById("find_login_shoping_count").href = '/shoping?filter='
            }
            UpDateShoping("")
        }
    }
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send((post_body));
}

