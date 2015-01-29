var m = require("mithril");

var chain = {};

/// [ Model
var save = function(list) {
  var d = m.deferred();
  setTimeout(function () {
    d.resolve(localStorage["chain-app.list"] = JSON.stringify(list()));
    m.redraw();
  }, 100);

  return d.promise;
};

var load = function() {
  var d = m.deferred();
  setTimeout(function () {
    d.resolve(JSON.parse(localStorage["chain-app.list"] || "[]"));
    m.redraw();
  }, 100);

  return d.promise;
};

var today = function() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, -now.getTimezoneOffset(), 0, 0);
};

var resetDate = function() {
  return localStorage["chain-app.start-date"] = chain.today().getTime();
};

var startDate = function() {
  return new Date(parseInt(localStorage["chain-app.start-date"] || resetDate()));
};

var dateAt = function(index) {
  var date = new Date(startDate());
  date.setDate(date.getDate() + index);
  return date;
};

var indexAt = function(x, y) {
  return y * 7 + x;
};
/// ]

/// [ Util
var repeat = function(times, subject) {
  var output = [];
  for (var i = 0; i < times; i++) output.push(subject(i));
  return output;
};
/// ]

/// [ Controller
chain.controller = function() {
  var list = m.prop([]);
  load().then(list);

  this.isChecked = function(index) {
    return list()[index];
  };

  this.check = function(index, status) {
    if (dateAt(index).getTime() >= today().getTime()) {
      list()[index] = status;
      save(list);
    }
  };
};
/// ]

/// [ View
var checks = function(ctrl, index) {
  return {
    onclick: function() {
      ctrl.check(index, this.checked);
    },
    checked: ctrl.isChecked(index)
  };
};

var highlights = function(index) {
  return {
    style: {
      background: dateAt(index).getTime() == today().getTime() ? "silver" : ""
    }
  };
};

chain.view = function(ctrl) {
  return m("div", [
    m("table", repeat(7, function(y) {
      return m("tr", repeat(7, function(x) {
        var index = indexAt(x, y);
        return m("td", highlights(index), [
          m("input[type=checkbox]", checks(ctrl, index))
        ]);
      }));
    }))
  ]);
};
/// ]

module.exports = chain;
