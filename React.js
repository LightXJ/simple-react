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

function renderComponent(component){
  let base;
  let renderer = component.render();
  if( component.base && component.ComponentWillUpdate ){
    component.ComponentWillUpdate();
  }
  base = _render( renderer );
  if( component.base ){
    if( component.ComponentDidUpdate ){
      component.ComponentDidUpdate();
    }
    if( component.ComponentDidMount ){
      component.ComponentDidMount();
    }
  }
  if ( component.base && component.base.parentNode ) {
    component.base.parentNode.replaceChild( base, component.base );
  }
  component.base = base;
  base._component = component;
}


const React = {
  createElement,
  Component
};

export default React;