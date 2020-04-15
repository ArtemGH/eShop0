"use strict";

const fs = require('fs')

async function GetCatsPage (req, res, pageN, record_count_on_page, positions_record_count_on_page, connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDateCategoriesPage('+pageN+','+record_count_on_page+','+positions_record_count_on_page+')</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetPositions(req, res,pageN,filtr,cat_id,record_count_on_page,connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDatePositionsPage('+pageN+',"'+filtr+'",'+cat_id+','+record_count_on_page+')</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetPosition(req, res,pos_id,connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDatePositionPage('+pos_id+')</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetShoping(req, res, filter, connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDateShoping("'+filter+'")</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetContent(req, res, content_record_count_on_page, pageN, cat_id, ContentType, filter) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after =''
    if (ContentType=="Categories"){
        need_scripts_after = '<script>GetContentCats('+content_record_count_on_page+','+pageN+','+cat_id+',"'+filter+'")</script><script>logCheck()</script>'
    } else {
        need_scripts_after = '<script>GetContentPos('+content_record_count_on_page+','+pageN+','+cat_id+',"'+filter+'")</script><script>logCheck()</script>'
    }
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetUsers(req, res,pageN,filter,record_count_on_page,connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDateUsersPage('+pageN+',"'+filter+'",'+record_count_on_page+')</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

async function GetOrders(req, res,pageN,filter,record_count_on_page,connection) {
    let html_index = fs.readFileSync("pages/index.html", "utf8");
    let need_scripts_before = ''
    let need_scripts_after = '<script>UpDateOrdersPage('+pageN+',"'+filter+'",'+record_count_on_page+')</script><script>logCheck()</script>'
    html_index = html_index.replace('MarkerScriptBefore',need_scripts_before)
    html_index = html_index.replace('MarkerScriptAfter',need_scripts_after)
    res.send(html_index);
}

exports.GetCatsPage = GetCatsPage
exports.GetPositions = GetPositions
exports.GetPosition = GetPosition
exports.GetShoping = GetShoping
exports.GetContent = GetContent
exports.GetUsers = GetUsers
exports.GetOrders = GetOrders
