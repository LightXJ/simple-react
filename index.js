import React from './react.js';
import ReactDOM from './react-dom';

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
          <div>
              <h1>number: {this.state.num}</h1>
              <button onClick={ () => this.onClick() }>add</button>
          </div>
      );
  }
}

ReactDOM.render(
  <div>
    {/* <h1>
      Hello, world!
    </h1>
    <h1>
      Hello, world2!
    </h1>
    <Welcome name="Maria"/>
    <Hello name="Tony" /> */}
    <Counter />
  </div>,
  document.getElementById('root')
);