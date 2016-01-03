//Connect to the server with socket.io
var socket = io.connect();
Date.ts = function() { return Math.ceil(new Date().getTime() / 1000); }

function init() {
  // we will fake sending live data every two seconds.
  setInterval(send_live_data, 2000);
  socket.on('amount', function(data) {
    cc = document.getElementById("bingeez-earned");
    cc.textContent = data["currency_a"];
  });
}

function send_live_data() {
    socket.emit('collect_pay', {"session":"aa", "show":"apple tv", "timestamp": Date.ts() });
}
