"use strict";

var m = require("mithril");

var mori = require("mori");

window.mori = mori;

var app = {};

app.Todo = function(data) {
    this.title = m.prop(data.title);
    this.completed = m.prop(false);
};

var r = mori.range();
var list = mori.intoArray(mori.take(10000, r)).map(function () {
  return new app.Todo({
    title: 'title()'
  });
});

app.TodoList = function() {
    return list;
};

app.controller = function() {
    this.list = new app.TodoList();
    this.title = m.prop("");
    this.filter = m.prop(m.route.param("filter") || "");
    this.add = function(title) {
        if (this.title()) {
            this.list.push(new app.Todo({
                title: title()
            }));
            this.title("");
        }
    };
    this.isVisible = function(todo) {
        if (this.filter() == "") return true;
        if (this.filter() == "active") return !todo.completed();
        if (this.filter() == "completed") return todo.completed();
    };
    this.clearTitle = function() {
        this.title("");
    };
    this.remove = function(key) {
        this.list.splice(key, 1);
    };
    this.clearCompleted = function() {
        for (var i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i].completed()) {
                this.list.splice(i, 1);
            }
        }
    };
    this.amountCompleted = function() {
        var amount = 0;
        for (var i = 0; i < this.list.length; i++) if (this.list[i].completed()) amount++;
        return amount;
    };
};

app.footer = function(ctrl) {
    return m("footer#footer", [ m("span#todo-count", [ m("strong", ctrl.list.length), " item" + (ctrl.list.length > 1 ? "s" : "") + " left" ]), m("ul#filters", [ m("li", [ m("a[href=/]", {
        config: m.route,
        "class": ctrl.filter() == "" ? "selected" : ""
    }, "All") ]), m("li", [ m("a[href=/active]", {
        config: m.route,
        "class": ctrl.filter() == "active" ? "selected" : ""
    }, "Active") ]), m("li", [ m("a[href=/completed]", {
        config: m.route,
        "class": ctrl.filter() == "completed" ? "selected" : ""
    }, "Completed") ]) ]), ctrl.amountCompleted() == 0 ? "" : m("button#clear-completed", {
        onclick: ctrl.clearCompleted.bind(ctrl)
    }, "Clear completed (" + ctrl.amountCompleted() + ")") ]);
};

app.watchInput = function(ontype, onenter, onescape) {
    return function(e) {
        ontype(e);
        if (e.keyCode == app.ENTER_KEY) onenter();
        if (e.keyCode == app.ESC_KEY) onescape();
    };
};

app.view = function(ctrl) {
    return [ m("header#header", [ m("h1", "todos"), m('input#new-todo[placeholder="What needs to be done?"]', {
        onkeypress: app.watchInput(m.withAttr("value", ctrl.title), ctrl.add.bind(ctrl, ctrl.title), ctrl.clearTitle.bind(ctrl)),
        value: ctrl.title()
    }) ]), m("section#main", [ m("input#toggle-all[type=checkbox]"), m("ul#todo-list", [ ctrl.list.filter(ctrl.isVisible.bind(ctrl)).map(function(task, index) {
        return m("li", {
            "class": task.completed() ? "completed" : ""
        }, [ m(".view", [ m("input.toggle[type=checkbox]", {
            onclick: m.withAttr("checked", task.completed),
            checked: task.completed()
        }), m("label", task.title()), m("button.destroy", {
            onclick: ctrl.remove.bind(ctrl, index)
        }) ]), m("input.edit") ]);
    }) ]) ]), ctrl.list.length == 0 ? "" : app.footer(ctrl) ];
};

app.single = function(ctrl, task, index) {
    return m("li", {
        "class": task.completed() ? "completed" : ""
    }, [ m(".view", [ m("input.toggle[type=checkbox]", {
        onclick: m.withAttr("checked", task.completed),
        checked: task.completed()
    }), m("label", task.title()), m("button.destroy", {
        onclick: ctrl.remove.bind(ctrl, index)
    }) ]), m("input.edit") ]);
};

app.ENTER_KEY = 13;

app.ESC_KEY = 27;

m.route(document.getElementById("todoapp"), "/", {
    "/": app,
    "/:filter": app
});
