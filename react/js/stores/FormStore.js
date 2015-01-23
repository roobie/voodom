
var VoodomDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FormConstants = require('../constants/FormConstants');
var assign = require('object-assign');
var Immutable = require('immutable');

var CHANGE_EVENT = 'change';

var _forms = Immutable.Map({ });

var FormStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
  * @param {function} callback
  */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _forms.get(id);
  },

  getAll: function() {
    return _forms;
  }
});

var createId = (function () {
  var counter = parseInt('xyz', 36);
  return function () {
    return (++counter).toString(36);
  };
})();

FormStore.dispatchToken = VoodomDispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.type) {
    case FormConstants.FORM_CREATE:
      var id = createId(),
          form = payload.form;
      form = form.set('id', id);
      _forms = _forms.set(id, form);

      setTimeout(function () {
        FormStore.emitChange();
      }, 500);
      break;
    default:
      // nothing.
  }
});

module.exports = FormStore;
