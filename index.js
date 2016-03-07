var cheerio = require('cheerio');
var request = require('request');
var Table = require('cli-table');
var colors = require('colors');

module.exports = function stock(symbol) {
  
  var url = 'http://finance.yahoo.com/q?s=' + symbol;
  var table = new Table();

  request({
      method: 'GET',
      url: url
    }, function(err, response, body, callback) {
    if (err) return console.error(err);
    $ = cheerio.load(body);
    var stockNum = $('.time_rtq_ticker').text();
    var title = $('#yfi_rt_quote_summary .title').text();
    var rtq = $('#yfi_rt_quote_summary .time_rtq_content').text().trim();

    var price = rtq[0].trim();
    var percent = rtq[1].replace(')', '');
    var updated = $('#yfs_t53_nflx').text();
    var prev = $('#table1').find('td').eq(0).text();
    var open = $('#table1').find('td').eq(1).text();
    var bid = $('#table1').find('td').eq(2).text();

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