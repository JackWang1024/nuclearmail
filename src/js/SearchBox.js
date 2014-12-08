/** @jsx React.DOM */

var Button = require('./Button');
var Colors = require('./Colors');
var React = require('react');

var PropTypes = React.PropTypes;

var SearchBox = React.createClass({
  propTypes: {
    onQueryChange: PropTypes.func.isRequired,
    onQuerySubmit: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
  },

  _onQueryKeyDown(e) {
    if (e.key === 'Enter') {
      this.props.onQuerySubmit(this.props.query);
    }
  },

  _onQueryChange(e) {
    this.props.onQueryChange(e.target.value);
  },

  _onSearchClick() {
    this.props.onQuerySubmit(this.props.query);
  },

  render() /*object*/ {
    return (
      <span style={this.props.style}>
        <input
          style={styles.input}
          value={this.props.query}
          onChange={this._onQueryChange}
          onKeyDown={this._onQueryKeyDown}
          type="search"
        />
        <Button
          onClick={this._onSearchClick}
          use="special">
          Search
        </Button>
      </span>
    );
  }
});

var styles = {
  input: {
    marginRight: '8px',
    width: '400px',
  },
};

module.exports = SearchBox;
