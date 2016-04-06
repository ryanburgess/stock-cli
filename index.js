'use strict';
const cheerio = require('cheerio');
const request = require('request');
const Table = require('cli-table');
const colors = require('colors');

module.exports = function stock(symbol) {
  
  const url = 'http://finance.yahoo.com/q?s=' + symbol;
  const table = new Table();

  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    const $ = cheerio.load(body);
    const stockNum = $('.time_rtq_ticker').text();
    const title = $('#yfi_rt_quote_summary .title').text();
    const rtq = $('#yfi_rt_quote_summary .time_rtq_content').text().trim();

    const price = rtq[0].trim();
    const percent = rtq[1].replace(')', '');
    const updated = $('.time_rtq').text().trim();
    const prev = $('#table1').find('td').eq(0).text();
    const open = $('#table1').find('td').eq(1).text();
    const bid = $('#table1').find('td').eq(2).text();

    table.push(
      { 'Prev close': prev },
      { 'Open': open },
      { 'Bid': bid }
    );

    console.log('\n' + title.white);

    if($('#yfi_rt_quote_summary .time_rtq_content').hasClass('down_r')){
      console.log(stockNum.bold.red + ' ▼'.red + ' ' + rtq)
    }else{
      console.log(stockNum.bold.green + ' ▲'.green + ' ' + rtq)
    }

    console.log(updated);

    console.log('\n' + table.toString() + '\n');
  });
};