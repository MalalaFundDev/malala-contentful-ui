import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {FormLabel, TextInput, ValidationMessage} from '@contentful/forma-36-react-components';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import {CollapseCard, Sortable} from "malala-contentful-ui";

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };
  detachExternalChangeHandler = null;

  get defaultItem() {
    return Object.assign({}, {
      label: '',
      stat: '',
      decimalPlaces: '',
      prefix: '',
      suffix: ''
    })
  }


  constructor(props) {
    super(props);

    let value = props.sdk.field.getValue() ? props.sdk.field.getValue() : {items: [this.defaultItem]};

    this.state = {
      items: value.items,
      error: null
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

    if (!value) {
      value = {items: [this.defaultItem]}
    }

    this.setState({items: value.items});
  };

  onChange = (field, idx, value) => {
    let {items} = this.state;

    if (items[idx] === undefined) {
      items[idx] = this.defaultItem
    }

    items[idx][field] = value

    this.save(items)
  };

  onSortChange(items)
  {
    this.save(items)
  }

  validate()
  {
    let {items} = this.state;

    return !items.some((item) => {
      return !item.stat || !item.label
    })
  }

  save(items) {
    this.setState({items});

    if (!this.validate()) {
      this.setState({error: 'Please complete all required fields.'})
      this.props.sdk.field.setInvalid(true)
    } else {
      this.setState({error: null})
      this.props.sdk.field.setInvalid(false)
    }

    this.props.sdk.field.setValue({items})
  }

  renderField(idx, name, label, value, type = 'text', required = false) {
    return (
        <div style={{marginTop: "15px", marginBottom: "15px"}}>
          <FormLabel
              htmlFor={name}
              required={required}
              requiredText="required"
              testId={name}
          >
            {label}
          </FormLabel>

          <TextInput
              width="full"
              type={type}
              id={name}
              testId={name}
              value={value}
              required={true}
              onChange={(e) => this.onChange(name, idx, e.currentTarget.value)}
          />
        </div>
    )
  }

  renderItem({item, idx, Sortable}) {
    const {items} = this.state

    return (
        <CollapseCard key={'item-' + idx}
                      heading='Item'
                      placeholder={item.title}
                      opened={!item.title}
                      sortable={true}
                      canSortUp={!!idx}
                      onSortUp={() => Sortable.moveUp(idx)}
                      canSortDown={idx + 1 !== items.length}
                      onSortDown={() => Sortable.moveDown(idx)}
        >
          {this.renderField(idx, 'label', 'Label', item.label, 'text', true)}
          {this.renderField(idx, 'stat', 'Stat', item.stat, 'text', true)}
          {this.renderField(idx, 'decimalPlaces', 'Decimal Places', item.decimalPlaces, 'number')}
          {this.renderField(idx, 'prefix', 'Prefix', item.prefix)}
          {this.renderField(idx, 'suffix', 'Suffix', item.suffix)}

          <div style={{marginTop: "15px"}}>
            { Sortable.renderAddButton(idx) }
            { Sortable.renderRemoveButton(idx) }
          </div>

        </CollapseCard>
    )
  }

  renderValidation()
  {
    const {error} = this.state

    if (!error) {
      return
    }

    return (
        <ValidationMessage>
          {error}
        </ValidationMessage>
    )
  }

  render() {
    const {items} = this.state

    return  <div>
      { this.renderValidation() }
      <Sortable
          defaultItem={this.defaultItem}
          onChange={(items) => this.onSortChange(items)}
          items={items}
          renderItem={this.renderItem.bind(this)}
      />
    </div>
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
