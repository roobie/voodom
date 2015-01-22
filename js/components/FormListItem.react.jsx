
var React = require('react');

var FormListItem = React.createClass({

  render: function () {
    var form = this.props.form;

    return (
      <tr {...this.props}>
        <td>{form.get('title')}</td>
      </tr>
    );
  }
});

module.exports = FormListItem;
