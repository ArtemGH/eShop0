"use strict";
const categories_record_count_on_page = 10
const positions_record_count_on_page = 10
const shopping_record_count_on_page = 10
const content_record_count_on_page = 10
const users_record_count_on_page = 10
const orders_record_count_on_page = 10

const fs = require('fs')
const express = require('express');
const cookieParser = require('cookie-parser');
const jsonParser = express.json();
const app = express();


const addb = require('node-adodb');
addb.debug = true;
const connection = addb.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source='+__dirname+'\\data\\Data.accdb;');

const content = require("./content.js")
const post_exec = require("./post_exec.js")

app.use(express.static('static'));
app.use(cookieParser())
app.use(express.urlencoded());
app.use(express.json());


app.get('/', function(req, res) {
    content.GetCatsPage (req, res,1,categories_record_count_on_page, positions_record_count_on_page,connection);
});

app.get('/categories',function (req, res) {
    content.GetCatsPage(req, res,Number(req.query.page),Number(req.query.record_count_on_page), Number(req.query.positions_record_count_on_page),connection);
})

app.get('/positions', function(req, res) {
    content.GetPositions(req, res,Number(req.query.page),req.query.filtr,req.query.cat,Number(req.query.positions_record_count_on_page),connection);
});

app.get('/position', function(req, res) {
    content.GetPosition(req, res,Number(req.query.pos), connection);
});

app.get('/shoping', function(req, res) {
    content.GetShoping(req, res, req.query.filter)
});

app.get('/content', function(req, res) {
    content.GetContent(req, res, content_record_count_on_page, req.query.page, req.query.cat_id, req.query.ContentType, req.query.filter)
});

app.get('/users', function(req, res) {
    content.GetUsers(req, res,req.query.page,req.query.filter,users_record_count_on_page,connection)
});

app.get('/orders', function(req, res) {
    content.GetOrders(req, res,req.query.page,req.query.filter,orders_record_count_on_page,connection)
});

app.post("/", jsonParser, function (req, res) {
    post_exec.post_exec(req, res, connection);
});

app.post("/edit_pos", function (req, res) {
    post_exec.Edit_Pos(req, res, connection);
});

app.post("/edit_cat", function (req, res) {
    post_exec.Edit_Cat(req, res, connection);
});

app.post("/set_foto_for_edit_pos", function (req, res) {
    post_exec.set_foto_for_edit_pos(req, res, connection);
});

app.post("/set_foto_for_edit_cat", function (req, res) {
    post_exec.set_foto_for_edit_cat(req, res, connection);
});

app.use(function(req, res, next) {
    let html_index = fs.readFileSync("pages/404.html", "utf8");
    res.status(404).send(html_index);
});

app.listen(8080);
