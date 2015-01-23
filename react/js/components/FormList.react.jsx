
var React = require('react');

var Immutable = require('immutable');

var FormStore = require('../stores/FormStore');
//var FormActions = require('../actions/FormActions');

var FormDetail = require('./FormDetail.react.jsx');
var FormListItem = require('./FormListItem.react.jsx');

var getStateFromStores = function () {
  return {
    forms: FormStore.getAll()
  }
};

var FormList = React.createClass({

  getInitialState: function () {
    return {
      selectedForm: Immutable.Map(),
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
          <FormDetail
            form={this.state.selectedForm}
            onFormDataChange={this._onFormDataChanged}/>
        </div>

        <div>
          <table>
            <thead>
              <th>Title</th>
            </thead>
            <tbody>
              {this.state.stores.forms.map((function (form) {
                return (
                  <FormListItem
                    key={form.get('id')}
                    form={form}
                    onClick={this._selectForm.bind(this, form)} />
                );
              }).bind(this)).toArray()}
            </tbody>
          </table>
        </div>

      </div>
    );
  },

  _selectForm: function (form) {
    this.setState({
      selectedForm: form
    })
  },

  _onFormDataChanged: function (fieldName, event) {
    this.setState({
      selectedForm: this.state.selectedForm.set(
        fieldName, event.target.value)
    });
  },

  _onChange: function () {
    this.setState({
      stores: getStateFromStores()
    });
  }
})

module.exports = FormList;
