
var React = require('react');

var Immutable = require('immutable');

var FormStore = require('../stores/FormStore');
var FormActions = require('../actions/FormActions')

var getStateFromStores = function () {
  return {
    forms: FormStore.getAll()
  }
};

var FormList = React.createClass({

  getInitialState: function () {
    return {
      currentForm: Immutable.Map(),
      stores: getStateFromStores()
    };
  },

  componentDidMount: function() {
    FormStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    FormStore.removeChangeListener(this._onChange);
  },

  render: function () {
    return (
      <div>

        <div>
          <button onClick={this._createForm} type="button">CREATE</button>
          <input type="text"
                 onChange={this._formDataChanged.bind(this, 'title')} />
          <i type="button"
                  onClick={this._clearSpecificInput.bind(this, 'title')}>
            &times;
          </i>
        </div>

        {this.state.stores.forms.map(function (form) {
          return (
            <div key={form.get('id')}>
              {form.get('id')}: {form.get('title')}
            </div>
          );
        }).toArray()}

      </div>
    );
  },

  _clearSpecificInput: function (fieldName, event) {
    
  },

  _formDataChanged: function (fieldName, event) {
    this.state.currentForm = this.state.currentForm.set(fieldName,
                                                        event.target.value);
  },

  _createForm: function () {
    var form = this.state.currentForm;
    FormActions.create(form);
  },

  _onChange: function () {
    this.setState({
      stores: getStateFromStores()
    });
  }
})

module.exports = FormList;
