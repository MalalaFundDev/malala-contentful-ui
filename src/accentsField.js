import React from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    ValidationMessage,
    Table,
    TableCell,
    TableBody,
    TableRow,
    FormLabel,
    CheckboxField, SelectField, Option
} from '@contentful/forma-36-react-components';
import {CollapseCard} from "./collapseCard";
import {Sortable} from "./sortable";
import {FieldGroup} from "./fieldGroup";
import {ImageField} from './imageField'

export class AccentsField extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };
    detachExternalChangeHandler = null;

    get defaultItem() {
        return Object.assign({}, {
            width: '50px',
            top: '',
            right: '',
            bottom: '',
            left: '',
            image: '',
            desktop: true,
            tablet: true,
            mobile: true,
            speed: '1',
            z: '1'
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

    onSortChange(items) {
        this.save(items)
    }

    validate() {
        let {items} = this.state;

        return !items.some((item) => {
            return !item.image
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

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <FieldGroup>
                                    <TextField id={`width-${idx}`} name="width" labelText={'width'} value={item.width}
                                               onChange={(e) => this.onChange('width', idx, e.currentTarget.value)}
                                               helpText="Example: 50px" required/>
                                </FieldGroup>

                                <FieldGroup>
                                    <TextField id={`z-${idx}`} name="z" labelText={'Stack order'} value={item.z}
                                               onChange={(e) => this.onChange('z', idx, e.currentTarget.value)}
                                               helpText="Higher numbers will display on top"/>
                                </FieldGroup>

                                <FieldGroup>
                                    <FormLabel htmlFor={`show-on-${idx}`}>
                                        Show on
                                    </FormLabel>
                                    <div id={`show-on-${idx}`}>
                                        <CheckboxField id={`desktop-${idx}`} labelText={'Desktop'}  name="desktop" checked={item.desktop}
                                                  onChange={(e) => this.onChange('desktop', idx, e.currentTarget.checked)} style={{"marginRight": "5px"}}
                                              />

                                        <CheckboxField id={`tablet-${idx}`} labelText={'Tablet'}  name="tablet" checked={item.tablet}
                                                       onChange={(e) => this.onChange('tablet', idx, e.currentTarget.checked)}  style={{"marginRight": "5px"}}
                                        />

                                        <CheckboxField id={`mobile-${idx}`} labelText={'Mobile'}  name="mobile" checked={item.mobile}
                                                       onChange={(e) => this.onChange('mobile', idx, e.currentTarget.checked)}
                                        />
                                    </div>
                                </FieldGroup>

                                <FieldGroup>
                                    <SelectField id={`speed-${idx}`} name={"speed"} labelText={"Speed"} value={item.speed} onChange={(e) => this.onChange('speed', idx, e.currentTarget.value)}>
                                        <Option value={'1'}>1</Option>
                                        <Option value={'2'}>2</Option>
                                        <Option value={'3'}>3</Option>
                                    </SelectField>
                                </FieldGroup>
                            </TableCell>
                            <TableCell align={"center"}>
                                <FieldGroup>
                                    <div style={{"textAlign": "left"}}>
                                        <FormLabel htmlFor={'position'}>
                                            Position
                                        </FormLabel>
                                    </div>


                                    <table style={{maxWidth: '300px'}} id={'position'}>
                                        <tbody>
                                        <tr>
                                            <td/>
                                            <td>
                                                <TextField id={`top-${idx}`} name="Top" labelText={'Top'}
                                                           value={item.top}
                                                           onChange={(e) => this.onChange('top', idx, e.currentTarget.value)}
                                                           helpText="Example: 10%"/>
                                            </td>
                                            <td/>
                                        </tr>

                                        <tr>
                                            <td>
                                                <TextField id={`left-${idx}`} name="left" labelText={'Left'}
                                                           value={item.left}
                                                           onChange={(e) => this.onChange('left', idx, e.currentTarget.value)}/>
                                            </td>
                                            <td/>
                                            <td>
                                                <TextField id={`right-${idx}`} name="right" labelText={'Right'}
                                                           value={item.right}
                                                           onChange={(e) => this.onChange('right', idx, e.currentTarget.value)}/>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td/>
                                            <td>
                                                <TextField id={`bottom-${idx}`} name="bottom" labelText={'Bottom'}
                                                           value={item.bottom}
                                                           onChange={(e) => this.onChange('bottom', idx, e.currentTarget.value)}/>
                                            </td>
                                            <td/>
                                        </tr>
                                        </tbody>
                                    </table>


                                </FieldGroup>
                            </TableCell>
                            <TableCell>
                                <FormLabel htmlFor={'image-id'}>
                                    Image
                                </FormLabel>
                                <FieldGroup>
                                    <ImageField id={`image-${idx}`} sdk={this.props.sdk}
                                                onChange={(value) => this.onChange('image', idx, value)}
                                                value={item.image}/>
                                </FieldGroup>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div style={{marginTop: "15px"}}>
                    {Sortable.renderAddButton(idx)}
                    {Sortable.renderRemoveButton(idx)}
                </div>

            </CollapseCard>
        )
    }

    renderValidation() {
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

        return <div>
            {this.renderValidation()}
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
