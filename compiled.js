

class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }
  setState(stateChange) {
    Object.assign(this.state, stateChange);
    renderComponent(this);
  }
}

function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  };
}

function renderComponent(component) {
  let base;
  let renderer = component.render();
  if (component.base && component.ComponentWillUpdate) {
    component.ComponentWillUpdate();
  }
  base = _render(renderer);
  if (component.base) {
    if (component.ComponentDidUpdate) {
      component.ComponentDidUpdate();
    }
    if (component.ComponentDidMount) {
      component.ComponentDidMount();
    }
  }
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }
  component.base = base;
  base._component = component;
}

const React = {
  createElement,
  Component
};

const ReactDOM = {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  }
};

function render(vnode, container) {
  // 将渲染结果挂载到真正的DOM上
  return container.appendChild(_render(vnode));
}

function _render(vnode) {
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);
  // 当vnode为字符串时，渲染结果是一段文本
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode);
    return textNode;
  }

  if (typeof vnode.tag == 'function') {
    const component = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(component, vnode.attrs);
    return component.base;
  }

  const dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      setAttribute(dom, key, value); // 设置属性
    });
  }

  vnode.children.forEach(child => render(child, dom)); // 递归渲染子节点

  return dom;
}

function setAttribute(dom, name, value) {
  // 如果属性名是className，则改回class
  if (name === 'className') name = 'class';

  // 如果属性名是onXXX，则是一个事件监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
    // 如果属性名是style，则更新style对象
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {
      for (let name in value) {
        // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
        dom.style[name] = typeof value[name] === 'number' ? value[name] + 'px' : value[name];
      }
    }
    // 普通属性则直接更新属性
  } else {
    if (name in dom) {
      dom[name] = value || '';
    }
    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

// 创建组件
function createComponent(component, props) {
  let inst;
  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
    // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function () {
      return this.constructor(props);
    };
  }
  return inst;
}

// set props
function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }
  component.props = props;
  renderComponent(component);
}

function Welcome(props) {
  return React.createElement(
    'h1',
    null,
    'welcome, ',
    props.name
  );
}

class Hello extends React.Component {
  ComponentWillUpdate() {
    console.log('ComponentWillUpdate');
  }

  ComponentDidUpdate() {
    console.log('ComponentDidUpdate');
  }

  ComponentDidMount() {
    console.log('ComponentDidMount');
  }

  render() {
    return React.createElement(
      'h1',
      null,
      'Hello, ',
      this.props.name
    );
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    };
  }

  componentWillUpdate() {
    console.log('update');
  }

  componentWillMount() {
    console.log('mount');
  }

  onClick() {
    this.setState({ num: this.state.num + 1 });
  }

  render() {
    return React.createElement(
      'div',
      { onClick: () => this.onClick() },
      React.createElement(
        'h1',
        null,
        'number: ',
        this.state.num
      ),
      React.createElement(
        'button',
        null,
        'add'
      )
    );
  }
}

ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(
    'h1',
    null,
    'Hello, world!'
  ),
  React.createElement(
    'h1',
    null,
    'Hello, world2!'
  ),
  React.createElement(Welcome, { name: 'Maria' }),
  React.createElement(Hello, { name: 'Tony' }),
  React.createElement(Counter, null)
), document.getElementById('root'));
