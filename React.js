import { renderComponent } from '../react-dom/diff.js'

class Component {
  constructor( props = {} ) {
    this.state = {};
    this.props = props;
  }
  setState( stateChange ){
    enqueueSetState( stateChange, this);
  }
}

function createElement( tag, attrs, ...children ) {
  return {
      tag,
      attrs,
      children
  }
}

const setStateQueue = [];
const renderQueue = [];
function enqueueSetState( stateChange, component){
  if ( setStateQueue.length === 0 ) {
    defer( flush );
  }
  setStateQueue.push( {
    stateChange,
    component
  });
  // 如果renderQueue里没有当前组件，则添加到队列中
  if ( !renderQueue.some( item => item === component ) ) {
    renderQueue.push( component );
  }
}

function flush(){
  let item;
  let component;
  while( item = setStateQueue.shift() ){
    const { stateChange, component } = item;
    if( !component.preveState ){
      component.preveState = Object.assign({}, component.state);
    }

    if( typeof stateChange == 'function' ){
      Object.assign(component.state, stateChange(component.preveState, component.props));
    }else{
      Object.assign(component.state, stateChange);
    }
    component.preveState = component.state;
  }

  // 渲染每一个组件
  while( component = renderQueue.shift() ) {
    renderComponent( component );
  }
}

function defer(fn){
  return Promise.resolve().then(fn)
}

const React = {
  createElement,
  Component
};

export default React;