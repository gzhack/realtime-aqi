var CronJob = require('cron').CronJob;
var request = require('request');
var _ = require('lodash');
var fs = require('fs');

var updateTime;

var isExist = function(str) {
  try{
    var fd = fs.openSync('./data/'+str, 'r');
    fs.closeSync(fd);
    return true;
  }catch(e) {
    return false;
  }
};

var job = new CronJob('0 '+ _.range(0, 60, 30).join(',') +' * * * *', function() {
  request.post({
    url: 'http://210.72.1.216:8080/gzaqi_new/MapData.cshtml',
    formData: {OpType:'GetAllRealTimeData'}
  }, function(err, res, body) {
    var time = body.match(/Date\(([0-9]*)\)/)[1];

    if (!isExist(time)) {
      updateTime = time;

      fs.writeFile('./data/'+time, body, function(err) {
        request.post({
          url: 'https://hook.bearychat.com/=bw5Mw/incoming/d26f293f1db242772bde34bd4dab336d',
          json: true,
          body: {text:(err?('write file '+time+' failed'):(time+' saved'))}
        });
      })
    }
  });

  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  }, function () {
    /* This function is executed when the job stops */
  },
  true /* Start the job right now */
);
