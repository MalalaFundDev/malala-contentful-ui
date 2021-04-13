import React from 'react';
import PropTypes from 'prop-types';
import {TextField, ValidationMessage, FormLabel, HelpText} from '@contentful/forma-36-react-components';
import {CollapseCard} from "./collapseCard";
import {Sortable} from "./sortable";
import {FieldGroup} from "./fieldGroup";
import {EditorField} from './editorField'

export class QAndAField extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };
    detachExternalChangeHandler = null;

    get defaultItem() {
        return Object.assign({}, {
            question: '',
            answer: '',
            anchor: ''
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
            return !item.question || !item.answer
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

        try {
            return (
                <CollapseCard key={'item-' + idx}
                              heading='Item'
                              placeholder={item.question}
                              opened={!item.question}
                              sortable={true}
                              canSortUp={!!idx}
                              onSortUp={() => Sortable.moveUp(idx)}
                              canSortDown={idx + 1 !== items.length}
                              onSortDown={() => Sortable.moveDown(idx)}
                >

                    <TextField id={`question-${idx}`} name="questions" labelText={'Question'} value={item.question} onChange={(e) => this.onChange('question', idx, e.currentTarget.value)} required />

                    <FieldGroup>
                        <FormLabel htmlFor={`answer-${idx}`} required>
                            Answer
                        </FormLabel>
                        <EditorField vid={`answer-${idx}`} name="answer" value={item.answer} onChange={value => this.onChange('answer', idx, value)} required />
                    </FieldGroup>

                    <TextField id={`anchor-${idx}`} name="anchor" labelText={'Anchor'} value={item.anchor} onChange={(e) => this.onChange('anchor', idx, e.currentTarget.value)} />
                    <HelpText>
                        malala.org/page#{item.anchor ? item.anchor : 'anchor'}
                    </HelpText>

                    <div style={{marginTop: "15px"}}>
                        { Sortable.renderAddButton(idx) }
                        { Sortable.renderRemoveButton(idx) }
                    </div>
                </CollapseCard>
            )
        } catch (e) {
            console.log(e)
        }
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
