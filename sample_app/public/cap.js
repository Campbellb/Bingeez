//Connect to the server with socket.io
var socket = io.connect();
Date.ts = function() { return Math.ceil(new Date().getTime() / 1000); }

var intervals = []

function startItBackUp(session, channel) {
    socket.emit('log', {"session":session, "show":channel });
    socket.emit('back_pay', {"session":session, "show":channel });
}

function startItUp(session, channel) {
    if (intervals.length > 0 ) {
        for (i in intervals) {
            var ci = intervals.pop()
            clearInterval(ci)

        }
    }

  // we will fake sending live data every two seconds.
  intervals.push(setInterval(send_live_data, 2000));
  socket.on('amount', function(data) {
    cc = document.getElementById("bingeez-earned");
    cc.textContent = data["currency_a"];
  });

  function send_live_data() {
      socket.emit('collect_pay', {"session":session, "show":channel, "timestamp": Date.ts() });
  }
}
