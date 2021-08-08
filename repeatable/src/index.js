import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { RepeatableField} from "malala-contentful-ui";

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };
  detachExternalChangeHandler = null;


  constructor(props) {
    super(props);

    let value = props.sdk.field.getValue() ? props.sdk.field.getValue() : null;

    this.state = {
      value
    }
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = () => {
    let value = this.props.sdk.field.getValue();

    this.setState({value});
  };


  render() {
    const {sdk} = this.props

    return  <RepeatableField
        sdk={sdk}
    />
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'));
});
