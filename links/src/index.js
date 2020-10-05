import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {CheckboxField, FormLabel, TextInput, IconButton, ValidationMessage} from '@contentful/forma-36-react-components';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import {CollapseCard} from "./collapseCard";
import arrayMove from 'array-move'

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;


  constructor(props) {
    super(props);

    let value = props.sdk.field.getValue() ? props.sdk.field.getValue() : {items: []};

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

  defaultItem() {
    return Object.assign({},{
      label: '',
      link: '',
      blank: false
    })
  }

  onExternalChange = () => {
    let value = this.props.sdk.field.getValue();

    if (!value) {
      value = {items: []}
    }

    this.setState({items: value.items});
  };

  onChange = (field, idx, e) => {
    let {items} = this.state;

    if (items[idx] === undefined) {
      items[idx] = this.defaultItem()
    }

    items[idx][field] = e.currentTarget.value

    this.save(items)
  };

  onCheck = (field, idx, e) => {
    let {items} = this.state;

    if (items[idx] === undefined) {
      items[idx] = this.defaultItem()
    }

    items[idx][field] = e.currentTarget.checked

    this.save(items)
  };

  validate()
  {
    let {items} = this.state;

    return !items.some((item) => {
      return !item.label || !item.link
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

  renderTextField(idx, name, label, value, type = 'text') {
    return (
        <div style={{marginTop: "15px", marginBottom: "15px"}}>
          <FormLabel
              htmlFor={name}
              required={true}
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
              onChange={(e) => this.onChange(name, idx, e)}
          />
        </div>
    )
  }

  renderItem(item, idx) {
    const {items} = this.state

    return (
        <CollapseCard key={'item-' + idx}
                      heading='Item'
                      placeholder={item.label}
                      opened={!item.label}
                      sortable={true}
                      canSortUp={!!idx}
                      onSortUp={() => this.moveUp(idx)}
                      canSortDown={idx + 1 !== items.length}
                      onSortDown={() => this.moveDown(idx)}
        >
          {this.renderTextField(idx, 'label', 'Label', item.label)}
          {this.renderTextField(idx, 'link', 'Link', item.link)}

          <CheckboxField
              labelText={"Open in new tab?"}
              name="blank"
              checked={item.blank}
              onChange={e => this.onCheck('blank', idx, e)}
              id="blank"
          />

          <div style={{marginTop: "15px"}}>
            { this.renderAddButton(idx) }
            { this.renderRemoveButton(idx) }
          </div>

        </CollapseCard>
    )
  }

  renderAddButton(idx = null) {
    const {items} = this.state

    if (items.length && ((this.props.sdk.parameters.instance.max !== 0 && items.length >= this.props.sdk.parameters.instance.max) || idx + 1 !== items.length)) {
      return
    }


    return (
        <IconButton
            iconProps={{
              icon: 'Plus'
            }}
            buttonType="positive"
            label="Add New Item"
            onClick={this.add.bind(this)}
        />
    )
  }

  moveUp(idx) {
    if (idx < 1) {
      return
    }

    let {items} = this.state

    items = arrayMove(items, idx, idx - 1)

    this.save(items)
  }

  moveDown(idx) {
    let {items} = this.state

    if (idx + 1 >= items.length) {
      return
    }

    items = arrayMove(items, idx, idx + 1)

    this.save(items)
  }

  renderRemoveButton(idx) {
    const {items} = this.state

    if (items.length <= 0) {
      return
    }

    return (
        <IconButton
            iconProps={{
              icon: 'Delete'
            }}
            buttonType="negative"
            label="Remove Item"
            onClick={() => this.remove(idx)}
        />
    )
  }

  add()
  {
    const {items} = this.state

    items.push(this.defaultItem())

    this.save(items)
  }

  remove(idx)
  {
    const {items} = this.state

    items.splice(idx, 1);

    this.save(items)
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

    return (
        <div>
          { this.renderValidation() }
          { items.length ? items.map(this.renderItem.bind(this)) : this.renderAddButton() }
        </div>
    )
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
