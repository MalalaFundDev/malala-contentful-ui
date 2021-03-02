import React from 'react';
import PropTypes from 'prop-types';
import {TextField, ValidationMessage, SelectField, Option} from '@contentful/forma-36-react-components';
import {CollapseCard} from "./collapseCard";
import {Sortable} from "./sortable";
import {FieldGroup} from "./fieldGroup";

export class Buttons extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };
    detachExternalChangeHandler = null;

    get defaultItem() {
        return Object.assign({}, {
            label: '',
            color: 'transparent',
            link: '',
            icon: ''
        })
    }


    constructor(props) {
        super(props);

        let items = props.sdk.field.getValue() ? props.sdk.field.getValue() : [this.defaultItem];

        this.state = {
            items,
            error: null
        }
    }

    onExternalChange = () => {
        let items = this.props.sdk.field.getValue();

        if (!items) {
            items = [this.defaultItem]
        }

        this.setState({items});
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
            return !item.label || !item.color || !item.link
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

        this.props.sdk.field.setValue(items)
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

                <TextField id={`label-${idx}`} name="label" labelText={'Label'} value={item.label} onChange={(e) => this.onChange('label', idx, e.currentTarget.value)} required />

                <FieldGroup>
                    <SelectField id={`color-${idx}`} name={"color"} labelText={"Color"} value={item.color} onChange={(e) => this.onChange('color', idx, e.currentTarget.value)} required>
                        <Option value={'transparent'}>Transparent</Option>
                        <Option value={'white'}>White</Option>
                        <Option value={'malala'}>Malala</Option>
                        <Option value={'link'}>Link</Option>
                    </SelectField>
                </FieldGroup>

                <FieldGroup>
                    <TextField id={`link-${idx}`} name="link" labelText={'Link'} value={item.link} onChange={(e) => this.onChange('link', idx, e.currentTarget.value)} required />
                </FieldGroup>

                <FieldGroup>
                    <SelectField id={`icon-${idx}`} name={"icon"} labelText={"Icon"} value={item.icon} onChange={(e) => this.onChange('icon', idx, e.currentTarget.value)}>
                        <Option value={''}>No Icon</Option>
                        <Option value={'chevron'}>Chevron</Option>
                        <Option value={'arrow'}>Arrow</Option>
                    </SelectField>
                </FieldGroup>

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

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
