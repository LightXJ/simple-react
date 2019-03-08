

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
  if( component.base && component.componentWillUpdate ){
    component.componentWillUpdate();
  }
  base = _render( renderer );
  // 这里有问题，下次setState时才会触发这些方法
  if( component.base ){
    if( component.componentDidUpdate ){
      component.componentDidUpdate();
    }
    if( component.componentDidMount ){
      component.componentDidMount();
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

const ReactDOM = {
  render: ( vnode, container ) => {
      container.innerHTML = '';
      return render( vnode, container );
  }
}

function render(vnode, container){
  // 将渲染结果挂载到真正的DOM上
  return container.appendChild( _render( vnode ) );
}

function _render( vnode ) {
  if ( vnode === undefined || vnode === null || typeof vnode === 'boolean' ) vnode = '';
  if ( typeof vnode === 'number' ) vnode = String( vnode );
  // 当vnode为字符串时，渲染结果是一段文本
  if ( typeof vnode === 'string' ) {
      const textNode = document.createTextNode( vnode );
      return textNode;
  }

  if( typeof vnode.tag == 'function' ){
    const component = createComponent( vnode.tag, vnode.attrs );
    setComponentProps( component, vnode.attrs );
    return component.base;
  }

  const dom = document.createElement( vnode.tag );

  if ( vnode.attrs ) {
      Object.keys( vnode.attrs ).forEach( key => {
          const value = vnode.attrs[ key ];
           setAttribute( dom, key, value );    // 设置属性
      } );
  }

  vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点

  return dom;
}


function setAttribute( dom, name, value ) {
  // 如果属性名是className，则改回class
  if ( name === 'className' ) name = 'class';

  // 如果属性名是onXXX，则是一个事件监听方法
  if ( /on\w+/.test( name ) ) {
      name = name.toLowerCase();
      dom[ name ] = value || '';
  // 如果属性名是style，则更新style对象
  } else if ( name === 'style' ) {
      if ( !value || typeof value === 'string' ) {
          dom.style.cssText = value || '';
      } else if ( value && typeof value === 'object' ) {
          for ( let name in value ) {
              // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
              dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
          }
      }
  // 普通属性则直接更新属性
  } else {
      if ( name in dom ) {
          dom[ name ] = value || '';
      }
      if ( value ) {
          dom.setAttribute( name, value );
      } else {
          dom.removeAttribute( name );
      }
  }
}

// 创建组件
function createComponent( component, props ) {
  let inst;
  // 如果是类定义组件，则直接返回实例
  if ( component.prototype && component.prototype.render ) {
      inst = new component( props );
  // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
      inst = new Component( props );
      inst.constructor = component;
      inst.render = function() {
          return this.constructor( props );
      }
  }
  return inst;
}

// set props
function setComponentProps(component, props) {
  if ( !component.base ) {
    if ( component.componentWillMount ) component.componentWillMount();
  } else if ( component.componentWillReceiveProps ) {
    component.componentWillReceiveProps( props );
  }
  component.props = props;
  renderComponent( component );
}


function Welcome(props){
  return <h1>welcome, {props.name}</h1>;
}

class Hello extends React.Component {
  componentWillUpdate(){
    console.log('componentWillUpdate');
  }

  componentDidUpdate(){
    console.log('componentDidUpdate');
  }

  componentDidMount(){
    console.log('componentDidMount');
  }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

class Counter extends React.Component {
  constructor( props ) {
      super( props );
      this.state = {
          num: 0
      }
  }

  componentDidUpdate(){
    console.log('componentDidUpdate');
  }

  componentDidMount(){
    console.log('componentDidMount');
  }


  componentWillUpdate() {
      console.log( 'willUpdate' );
  }

  componentWillMount() {
      console.log( 'willMount' );
  }

  onClick() {
      this.setState( { num: this.state.num + 1 } );
  }

  render() {
      return (
          <div onClick={ () => this.onClick() }>
              <h1>number: {this.state.num}</h1>
              <button>add</button>
          </div>
      );
  }
}

ReactDOM.render(
  <div>
    <h1>
      Hello, world!
    </h1>
    <h1>
      Hello, world2!
    </h1>
    <Welcome name="Maria"/>
    <Hello name="Tony" />
    <Counter />
  </div>,
  document.getElementById('root')
);