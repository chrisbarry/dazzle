var interval = null;
self.addEventListener('message', function (e) {
  switch (e.data) {
    case 'start':
      interval = setInterval(function () {
        self.postMessage('tick');
      }, 200);
      break;
    case 'stop':
      clearInterval(interval);
      break;
  };
}, false);

console.log("ticker");