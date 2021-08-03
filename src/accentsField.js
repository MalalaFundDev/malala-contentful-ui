import React from 'react';
import PropTypes from 'prop-types';
import {
    Asset,
    TextField,
    ValidationMessage,
    Table,
    TableCell,
    TableBody,
    TableRow,
    FormLabel,
    CheckboxField, SelectField, Option,
    Icon
} from '@contentful/forma-36-react-components';
import {CollapseCard} from "./collapseCard";
import {Sortable} from "./sortable";
import {FieldGroup} from "./fieldGroup";
import {ImageField} from './imageField'
import uniqid from 'uniqid'

export class AccentsField extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };
    detachExternalChangeHandler = null;

    get defaultItem() {
        return Object.assign({}, {
            key: uniqid(),
            width: '50px',
            height: '50px',
            top: '',
            right: '',
            bottom: '',
            left: '',
            image: '',
            desktop: true,
            tablet: true,
            mobile: true,
            parallax: true,
            speed: '1',
            z: '1',
            open: false
        })
    }


    constructor(props) {
        super(props);

        let items = props.sdk.field.getValue() ? props.sdk.field.getValue() : [this.defaultItem];
        items = items.map(item => {
            if (!item.key) {
                item.key = uniqid()
            }
            item.open = false
            return item
        })

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

    openItem(item) {
        let {items} = this.state;
        items = items.map((i) => {
            if (i.key === item.key) {
                i.open = true
            }
        })
        this.setState(items)
    }

    closeItem(item) {
        let {items} = this.state;
        items = items.map((i) => {
            if (i.key === item.key) {
                i.open = false
            }
        })
        this.setState(items)
    }

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
                          heading='Image'
                          placeholder={item.title}
                          opened={!item.title}
                          sortable={true}
                          canSortUp={!!idx}
                          onSortUp={() => Sortable.moveUp(idx)}
                          canSortDown={idx + 1 !== items.length}
                          onSortDown={() => Sortable.moveDown(idx)}
            >
                {item.open ? this.renderSettings(item, idx) : this.renderImage(item, idx)}

                <div style={{marginTop: "15px"}}>
                    {Sortable.renderAddButton(idx)}
                    {Sortable.renderRemoveButton(idx)}
                </div>

            </CollapseCard>
        )
    }

    renderImage(item, idx) {
        return <FieldGroup>
            <div style={{display: "flex"}}>
                <ImageField id={`image-${idx}`} sdk={this.props.sdk}
                            onChange={(value) => this.onChange('image', idx, value)}
                            value={item.image}/>
                <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
                    <Icon icon="Settings" size="small" onClick={() => this.openItem(item)}/>
                </div>
            </div>

        </FieldGroup>
    }

    renderSettings(item, idx) {
        return <div>
            <Table style={{width: '100%'}}>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2} onClick={() => this.closeItem(item)}>
                            {item.image ? <Asset src={item.image.fields.file['en-US'].url} style={{width: "50px"}}/> : <Icon icon="Asset" size="large" />}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <FieldGroup>
                                <TextField id={`width-${idx}`} name="width" labelText={'width'} value={item.width}
                                           onChange={(e) => this.onChange('width', idx, e.currentTarget.value)}
                                           helpText="Example: 50px" required/>
                            </FieldGroup>

                            <FieldGroup>
                                <TextField id={`height-${idx}`} name="height" labelText={'height'} value={item.height}
                                           onChange={(e) => this.onChange('height', idx, e.currentTarget.value)}
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
                                <CheckboxField id={`parallax-${idx}`} labelText={'Enable parallax scrolling?'}  name="parallax" checked={item.parallax !== false}
                                               onChange={(e) => this.onChange('parallax', idx, e.currentTarget.checked)} style={{"marginRight": "5px"}}
                                />
                            </FieldGroup>

                            {item.parallax !== false ? <FieldGroup>
                                <SelectField id={`speed-${idx}`} name={"speed"} labelText={"Speed"} value={item.speed} onChange={(e) => this.onChange('speed', idx, e.currentTarget.value)}>
                                    <Option value={'1'}>1</Option>
                                    <Option value={'2'}>2</Option>
                                    <Option value={'3'}>3</Option>
                                </SelectField>
                            </FieldGroup> : ''}
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
                    </TableRow>
                </TableBody>
            </Table>
        </div>
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
