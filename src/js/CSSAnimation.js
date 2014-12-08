/** @jsx React.DOM */

var ClientID = require('./ClientID');
var PrefixFree = require('./PrefixFree');
var _ = require('lodash');
var hyphenateStyleName = require('react/lib/hyphenateStyleName');

var style = document.createElement('style');
style.type = 'text/css';
document.head.appendChild(style);

class CSSAnimation {
  constructor(keyframes) {
    this._name = 'Anim-' + ClientID.get();

    var rule = '@keyframes ' + this._name + ' {\n' +
      _.map(keyframes, (props, percentage) => {
        return '  ' + percentage + ' {\n' + _.map(props, (value, key) => {
          return '    ' + hyphenateStyleName(key) + ': ' + value + ';';
        }).join('\n') +
        '\n  }';
      }).join('\n') +
      '\n}\n';

    var prefixed = PrefixFree.prefixCSS(rule, /*raw*/ true);
    console.log(prefixed)

    style.sheet.insertRule(prefixed, style.sheet.cssRules.length);
  }

  toString() {
    return this._name;
  }
}

module.exports = CSSAnimation;