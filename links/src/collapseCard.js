import React from 'react';
import {Card, SectionHeading, IconButton} from '@contentful/forma-36-react-components';

export class CollapseCard extends React.Component {
    spacing={marginTop: "15px", marginBottom: "15px"}

    constructor(props) {
        super(props);

        this.state = {
            opened: !!props.opened,
        }
    }

    renderOpened() {
        const {heading,  children} = this.props
        return  <Card title='Item' style={this.spacing}>
            <SectionHeading
                element="h3"
            >
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}}>
                        {heading}
                    </div>
                    <div style={{flexGrow: 0, paddingLeft: '15px'}}>
                        {this.renderCloseButton()}
                    </div>
                </div>
            </SectionHeading>

            {children}
        </Card>
    }

    renderClosed() {
        const {heading, placeholder} = this.props

        return <Card title='Item' style={this.spacing}>
            <SectionHeading
                element="h3"
            >
                <div style={{display: 'flex'}}>
                    <div style={{flexGrow: 1}} onClick={this.open.bind(this)}>
                        {placeholder ? placeholder : `New ${heading}`}
                    </div>
                    <div style={{flexGrow: 0, paddingLeft: '15px', display: 'flex'}}>
                        {this.renderSortUp()}
                        {this.renderSortDown()}
                    </div>
                </div>
            </SectionHeading>
        </Card>
    }

    renderCloseButton() {
        const {opened} = this.state

        if (!opened) {
            return
        }

        return (
            <IconButton
                iconProps={{
                    icon: 'Close'
                }}
                label="Close"
                onClick={this.close.bind(this)}
            />
        )
    }

    renderSortUp()
    {
        const {sortable, canSortUp, onSortUp} = this.props

        if (!sortable || !canSortUp || !onSortUp) {
            return
        }

        return <IconButton
            iconProps={{
                icon: 'ChevronUp'
            }}
            label="Move Up"
            onClick={onSortUp}
            style={{paddingRight: '8px'}}
        />
    }

    renderSortDown()
    {
        const {sortable, canSortDown, onSortDown} = this.props

        if (!sortable || !canSortDown || !onSortDown) {
            return
        }

        return <IconButton
            iconProps={{
                icon: 'ChevronDown'
            }}
            label="Move Up"
            onClick={onSortDown}
            style={{paddingRight: '8px'}}
        />
    }

    open()
    {
        this.setState({opened: true})
    }

    close()
    {
        this.setState({opened: false})
    }

    render() {
        const {opened} = this.state

        if (opened) {
            return this.renderOpened()
        }

        return this.renderClosed()
    }
}