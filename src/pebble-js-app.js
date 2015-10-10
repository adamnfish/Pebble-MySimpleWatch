var initialized = false;

function appMessageAck(e) {
    console.log("options sent to Pebble successfully");
}

function appMessageNack(e) {
    console.log("options not sent to Pebble: " + e.error.message);
}

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

Pebble.addEventListener("showConfiguration", function() {
  //localStorage.removeItem('options');
  var options = JSON.parse(localStorage.getItem('options'));
  if (options !== null) {
    console.log("read options: " + JSON.stringify(options));
  }
  else {
    options = JSON.parse("{\"hh-in-bold\":\"1\"}");
    console.log("defaults options: " + JSON.stringify(options));
  }
  
  var uri = 'http://jnoelg.github.io/MySimpleWatch/configurable-3.4.html';
  uri = uri+ '?' + encodeURIComponent(JSON.stringify(options));
  
  console.log("showing configuration");
  Pebble.openURL(uri);
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  // webview closed
  // using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    var options = JSON.parse(decodeURIComponent(e.response));
    console.log("storing options: " + JSON.stringify(options));
    localStorage.setItem('options', JSON.stringify(options));
    
    var hh_in_bold = options["hh-in-bold"];
    console.log("hh-in-bold: " + hh_in_bold);
    
    var mm_in_bold = options["mm-in-bold"];
    console.log("mm-in-bold: " + mm_in_bold);
    
    var locale = options.locale;
    console.log("locale: " + locale);
    
    var hh_strip_zero = options["hh-strip-zero"];
    console.log("hh-strip-zero: " + hh_strip_zero);
    
    var time_sep = options["time-sep"];
    console.log("time-sep: " + time_sep);
    
    Pebble.sendAppMessage(
      {
        "CONFIG_KEY_HH_IN_BOLD":hh_in_bold,
        "CONFIG_KEY_MM_IN_BOLD":mm_in_bold, 
        "CONFIG_KEY_LOCALE":locale,
        "CONFIG_KEY_HH_STRIP_ZERO":hh_strip_zero, 
        "CONFIG_KEY_TIME_SEP":time_sep
      }, 
      appMessageAck, 
      appMessageNack
    );
    
  } else {
    console.log("cancelled");
  }
});