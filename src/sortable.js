import React from 'react';
import {IconButton} from '@contentful/forma-36-react-components';
import arrayMove from 'array-move'

export class Sortable extends React.Component {

    get defaultItem() {
        const {defaultItem} = this.props
        return Object.assign({}, defaultItem)
    }


    renderAddButton(idx) {
        const {items} = this.props

        if (idx + 1 !== items.length) {
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

        let {onChange, items} = this.props

        items = arrayMove(items, idx, idx - 1)

        onChange(items)
    }

    moveDown(idx) {
        let {onChange, items} = this.props

        if (idx + 1 >= items.length) {
            return
        }

        items = arrayMove(items, idx, idx + 1)

        onChange(items)
    }

    renderRemoveButton(idx) {
        const {items} = this.props

        if (items.length <= 1) {
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
        let {onChange, items} = this.props

        items.push(this.defaultItem)

        onChange(items)
    }

    remove(idx)
    {
        let {onChange, items} = this.props

        items.splice(idx, 1);

        onChange(items)
    }

    render() {
        const {items} = this.props

        return (
            <div className={'sortable'}>
                { items.map((item, idx) => this.renderItem(item, idx)) }
            </div>
        )
    }

    renderItem(item, idx) {
        const {renderItem} = this.props

        return <div className={'sortable__item'} key={`sortable-${idx}`}>
            { renderItem({item, idx, Sortable: this})}
        </div>
    }
}
