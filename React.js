import { renderComponent } from '../react-dom/diff.js'

class Component {
  constructor( props = {} ) {
    this.state = {};
    this.props = props;
  }
  setState( stateChange ){
    Object.assign(this.state, stateChange);
    renderComponent(this);
  }
}

function createElement( tag, attrs, ...children ) {
  return {
      tag,
      attrs,
      children
  }
}


const React = {
  createElement,
  Component
};

export default React;