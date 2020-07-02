import React from "react";
import {IconButton, TextLink, AssetCard} from '@contentful/forma-36-react-components'

export class ImageField extends React.Component {
    render() {
        let {value} = this.props

        if (!value) {
            return this.renderMissing()
        }

        return  <div style={{display: "flex", flexDirection: 'row', alignItems: 'flex-start'}}>
            <AssetCard src={ value.fields.file['en-US'].url } title={value.fields.title['en-US']} onClick={this.handleClick.bind(this)} status={!!value.sys.publishedAt ? 'published' : 'draft'}>
                {value.fields.title['en-US']}
            </AssetCard>
            <IconButton buttonType={'negative'} iconProps={{
                icon: 'Close',
            }}
             label="Close"
             onClick={this.handleRemove.bind(this)} />
        </div>
    }

    renderMissing()
    {
        return <div className={"image__missing"}>
            <TextLink onClick={this.handleCreate.bind(this)} icon="Plus">Create new asset and link</TextLink>
            <span style={{paddingLeft: '10px', paddingRight: '10px'}}/>
            <TextLink onClick={this.handleLink.bind(this)}  icon="Link">Link existing assets</TextLink>
        </div>
    }

    handleCreate()
    {
        const {sdk} = this.props
        sdk.navigator.openNewAsset({ slideIn: { waitForClose: true } }).then(this.handleLinked.bind(this))
    }

    handleLink()
    {
        const {sdk} = this.props;

        sdk.dialogs.selectSingleAsset(null, { slideIn: { waitForClose: true } }).then(this.handleLinked.bind(this))
    }

    handleClick()
    {
        const {sdk, value} = this.props

        sdk.navigator.openAsset(value.sys.id, { slideIn: {} })
    }

    handleRemove()
    {
        const {onChange} = this.props

        onChange(null)
    }

    handleLinked(entity)
    {
        const {onChange} = this.props

        onChange(entity)
    }
}