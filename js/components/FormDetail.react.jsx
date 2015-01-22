
var React = require('react');

var Immutable = require('immutable');

var FormStore = require('../stores/FormStore');
var FormActions = require('../actions/FormActions');

var FormDetail = React.createClass({

  render: function () {
    var form = this.props.form || Immutable.Map();

    return (
      <div>
        {this.props.form.get('id') ?
          <div className="form-group">
            <input value={this.props.form.get('id')} disabled/>
          </div>: void 0}
        <div className="form-group">
          <label htmlFor={this.getElemId('title')}>Title:</label>
          <input
            id={this.getElemId('title')}
            type="text"
            onChange={this._onFormDataChanged.bind(this, 'title')}
            value={form.get('title')}/>
        </div>

        <button onClick={this._persistForm} type="button">
          CREATE
        </button>
        <button onClick={this._clearSpecificInput.bind(this, 'title')} type="button">
          &times;
        </button>
      </div>
    );
  },

  _persistForm: function () {
    var isValid = function (form) {
      return !!form.get('title');
    }
    var form = this.props.form;
    if (isValid(form)) {
      FormActions.create(form);
    }
  },

  _clearSpecificInput: function (fieldName, event) {
  },

  _onFormDataChanged: function (fieldName, event) {
    this.props.onFormDataChange(fieldName, event);
  },

  getElemId: function (entId, name) {
    return (this.props.form ?
      this.props.form.get('id') : 'null') + '_' + name;
  }
});

module.exports = FormDetail;
