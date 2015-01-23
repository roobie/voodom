
var AppDispatcher = require('../dispatcher/AppDispatcher');
var FormConstants = require('../constants/FormConstants');

var FormActions = {
  create: function (form) {
    AppDispatcher.dispatch({
      action: {
        type: FormConstants.FORM_CREATE
      },
      form: form
    });
  },

  update: function (form) {
    AppDispatcher.dispatch({
      action: {
        type: FormConstants.FORM_UPDATE
      },
      form: form
    })
  }
  // etc.
};

module.exports = FormActions;
