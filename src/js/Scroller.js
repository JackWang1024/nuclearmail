/**
 * @jsx React.DOM
 *
 * A fancy, Facebook-style scrollbar.
 *
 * Known issues:
 * - scrolling over the scrollbar does not work
 * - clicking the scrollbar not on the thumb doesn't scroll
 */

// Inspired by:
// https://github.com/leoselig/jsFancyScroll/

var Colors = require('./Colors');
var InfiniteScroll = require('./InfiniteScroll');
var React = require('react');
var sx = require('./StyleSet');

var PropTypes = React.PropTypes;
var PureRenderMixin = React.addons.PureRenderMixin;

var scrollBarWidth = '15px';

var Scroller = React.createClass({
  propTypes: InfiniteScroll.propTypes,

  mixins: [PureRenderMixin],

  getInitialState() /*object*/ {
    return {
      scrollTop: 0,
      scrollHeight: 1,
      offsetHeight: 1,
    };
  },

  componentDidMount() {
    window.addEventListener('resize', this._onScroll);
    this._onScroll();
  },

  componentDidUpdate() {
    this._onScroll();
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._onScroll);
  },

  _attachBodyListeners() {
    document.addEventListener('mouseup', this._onDocumentMouseUp);
    document.addEventListener('mouseleave', this._onDocumentMouseUp);
    document.addEventListener('mousemove', this._onDocumentMouseMove);
    document.addEventListener('selectstart', this._onDocumentSelectStart);
    this._previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
  },

  _detachBodyListeners() {
    document.removeEventListener('mouseup', this._onDocumentMouseUp);
    document.removeEventListener('mouseleave', this._onDocumentMouseUp);
    document.removeEventListener('mousemove', this._onDocumentMouseMove);
    document.removeEventListener('selectstart', this._onDocumentSelectStart);
    document.body.style.userSelect = this._previousUserSelect;
  },

  _onScroll() {
    var viewport = this.refs.viewport.getDOMNode();
    this.setState({
      scrollTop: viewport.scrollTop,
      scrollHeight: viewport.scrollHeight,
      offsetHeight: viewport.offsetHeight,
    });
  },

  _onDocumentSelectStart(event) {
    event.preventDefault();
  },

  _onScrollbarMouseDown(event) {
    this._attachBodyListeners();
    this._isMouseDown = true;
    this._lastPageY = event.pageY;
    this.setState({isMouseDown: true});
  },

  _onDocumentMouseUp(event) {
    this._detachBodyListeners();
    this._isMouseDown = false;
    this.setState({isMouseDown: false});
  },

  _onDocumentMouseMove(event) {
    if (this._isMouseDown) {
      var scale = this._getScale();
      var diff = event.pageY - this._lastPageY;
      var viewport = this.refs.viewport.getDOMNode();
      var newScrollTop = (viewport.scrollTop + diff / scale);

      viewport.scrollTop = Math.max(0, newScrollTop);
      this._lastPageY = event.pageY;
    }
  },

  _onScrollerMouseEnter() {
    this.setState({isHover: true});
  },

  _onScrollerMouseLeave() {
    this.setState({isHover: false});
  },

  _getScale() {
    return this.state.offsetHeight / this.state.scrollHeight;
  },

  render() /*object*/ {
    var scale = this._getScale();
    var thumbHeight = this.state.offsetHeight * scale;
    var thumbTop = this.state.scrollTop * scale;

    return (
      <div
        style={sx(this.props.style, styles.scroller)}
        onMouseEnter={this._onScrollerMouseEnter}
        onMouseLeave={this._onScrollerMouseLeave}>
        <div
          style={sx(
            styles.scrollbar,
            (this.state.isHover || this.state.isMouseDown) && styles.scrollbarHover
          )}
          onMouseDown={this._onScrollbarMouseDown}>
          <div
            style={sx(styles.thumb, {height: thumbHeight, top: thumbTop})}
          />
        </div>
        <InfiniteScroll
          {...this.props}
          style={styles.viewport}
          onScroll={this._onScroll}
          ref="viewport">
          <div style={styles.content}>
            {this.props.children}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
});

var styles = {
  scroller: {
    overflow: 'hidden',
    position: 'relative',
  },

  scrollbar: {
    bottom: 0,
    opacity: 0,
    position: 'absolute',
    right: '0',
    top: 0,
    transition: 'opacity .25s',
    width: '8px',
  },

  scrollbarHover: {
    opacity: 1,
  },

  thumb: {
    background: 'rgba(0, 0, 0, .4)',
    borderRadius: '4px',
    position: 'absolute',
    right: '0',
    width: '8px',
  },

  viewport: {
    height: '100%',
    marginRight: '-' + scrollBarWidth,
    overflowX: 'hidden',
    overflowY: 'scroll',
    paddingRight: scrollBarWidth,
    width: '100%',
  },

  content: {
    marginRight: '-' + scrollBarWidth,
  },
};

module.exports = Scroller;
