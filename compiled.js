import React from './react.js';
import ReactDOM from './react-dom/index.js';

function Welcome(props) {
  return React.createElement(
    'h1',
    null,
    'welcome, ',
    props.name
  );
}

class Hello extends React.Component {
  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentDidMount() {
    console.log('componentDidMount');
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

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentDidMount() {
    console.log('componentDidMount');
    // for(let i =0; i< 50; i++){
    //   this.setState({num: this.state.num+1 });
    // }
    for (let j = 0; j < 50; j++) {
      this.setState(prevState => {
        return {
          num: prevState.num + 1
        };
      });
    }
  }

  componentWillUpdate() {
    console.log('willUpdate');
  }

  componentWillMount() {
    console.log('willMount');
  }

  onClick() {
    this.setState({ num: this.state.num + 1 });
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        'number: ',
        this.state.num
      ),
      React.createElement(
        'button',
        { onClick: () => this.onClick() },
        'add'
      )
    );
  }
}

ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(Counter, null)
), document.getElementById('root'));
