import React from "react";
import {FormLabel, ValidationMessage, TextInput} from "@contentful/forma-36-react-components";
import PropTypes from "prop-types";
import {Sortable, CollapseCard, EditorField, ImageField} from './index'

export class RepeatableField extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    get defaultItem() {
        return Object.assign({}, {
            title: '',
            image: null,
            description: '',
            linkLabel: '',
            url: ''
        })
    }


    constructor(props) {
        super(props);

        let value = props.sdk.field.getValue() ? props.sdk.field.getValue() : {items: [this.defaultItem]};


        this.state = {
            items: value.items ? value.items : [this.defaultItem],
            error: null
        }
    }

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
            return !item.image
                || this.props.sdk.parameters.instance.title && !item.title
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

                {(() => {
                    switch (type) {
                        case 'editor':
                            return  <EditorField
                                value={value}
                                onChange={value => this.onChange(name, idx, value)}
                            />;
                        case 'image':
                            return <ImageField
                                value={value}
                                sdk={this.props.sdk}
                                onChange={value => this.onChange(name, idx, value)}
                            />;
                        default:
                            return <TextInput
                                width="full"
                                type={type}
                                id={name}
                                testId={name}
                                value={value}
                                required={true}
                                onChange={(e) => this.onChange(name, idx, e.currentTarget.value)}
                            />;
                    }
                })()}
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
                {this.props.sdk.parameters.instance.title ? this.renderField(idx, 'title', 'Title', item.title, 'text') : null}
                {this.props.sdk.parameters.instance.description ? this.renderField(idx, 'description', 'Description', item.description, 'editor') : null}
                {this.props.sdk.parameters.instance.linkLabel ? this.renderField(idx, 'linkLabel', 'Link Label', item.linkLabel, 'text') : null}
                {this.props.sdk.parameters.instance.url ? this.renderField(idx, 'url', 'Url', item.url, 'text') : null}
                {this.props.sdk.parameters.instance.image ? this.renderField(idx, 'image', 'Image', item.image, 'image', true) : null}

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
