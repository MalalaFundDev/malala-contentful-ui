import React, {useState} from 'react';

import {
    Tabs,
    Tab,
    Form,
    HelpText,
    Card,
    SectionHeading
} from '@contentful/forma-36-react-components';
import {EditorExtensionSDK, EntryFieldAPI} from '@contentful/app-sdk';
import {Field} from './Field'

interface EditorProps {
    sdk: EditorExtensionSDK;
}

interface FieldValues {
    [key: string]: any
}

const Entry = (props: EditorProps) => {
    const {entry, locales} = props.sdk
    let tabNames = ['General', 'Heading', "Content", "Buttons", "Spacing", "Background", "Advanced"];
    let [tabs, setTabs] = useState([...tabNames])
    let [currentTab, setCurrentTab] = useState('General')
    let [fieldValues, setFieldValues] = useState<FieldValues>({})

    //Keep track of the field values in state so we can rerender on field change
    if (!Object.values(fieldValues).length) {
        let fieldIdx = 0
        setFieldValues(Object.values(entry.fields).reduce((fields: FieldValues, field) : FieldValues => {
            fields[Object.keys(entry.fields)[fieldIdx]] = field.getValue()
            fieldIdx++;
            return fields
        }, {}))

        Object.values(entry.fields).forEach((field: EntryFieldAPI) => {
            field.onValueChanged((newValue) => {
                if (fieldValues[field.id] !== newValue) {
                    fieldValues[field.id] = newValue
                    setFieldValues(Object.assign({}, fieldValues))
                }
            })
        })
    }


    function renderField(field: EntryFieldAPI, type : string | null = null, label : string | null = null) {
        return <Field field={field} sdk={props.sdk} locales={locales} type={type} label={label}/>
    }


    //function addTab(tab: string) {
    //    if (!tab || tabs.includes(tab)) {
    //        return
    //    }
    //
    //    setTabs([...tabNames, tab])
    //}

    //if (entry.fields.type.getValue() === 'Entry') {
    //    addTab('Component')
    //} else if(entry.fields.type.getValue() === 'Q&A') {
    //    addTab('Q&A')
    //} else {
        if (tabNames.length !== tabs.length) {
            setTabs([...tabNames])
        }
    //}


    return <Form spacing="default" className="f36-margin--2xl">
        <Card className={"f36-padding--l f36-margin-bottom--l"}>
            {renderField(entry.fields.title)}
        </Card>

        <Tabs
            role="navigation"
            withDivider
        >
            {
                tabs.map((tab) => {
                    return <Tab selected={currentTab === tab} id={tab} onSelect={() => setCurrentTab(tab)} key={"tab-" + tab}>
                        {tab}
                    </Tab>;
                })
            }
        </Tabs>

        {
            currentTab === 'General' ?  <div>
                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.type)}
                </Card>
                {
                    entry.fields.type.getValue() === 'Entry' ? <div>
                        <Card className={"f36-padding--l f36-margin-bottom--l"}>
                            {renderField(entry.fields.component)}
                        </Card>
                    </div> : ''
                }
                {
                    entry.fields.type.getValue() === 'Q&A' ? <div>
                        <Card className={"f36-padding--l f36-margin-bottom--l"}>
                            {renderField(entry.fields.data, 'q&a', 'Q&A')}
                        </Card>
                    </div> : ''
                }
                {
                    entry.fields.type.getValue() === 'Embed' ? <div>
                        <Card className={"f36-padding--l f36-margin-bottom--l"}>
                            {renderField(entry.fields.embed)}
                        </Card>
                    </div> : ''
                }
                <Card className={"f36-padding--l"}>
                    {renderField(entry.fields.hideOnMobile)}
                    {renderField(entry.fields.hideOnDesktop)}
                </Card>
            </div>: ''
        }

        {
            currentTab === 'Heading' ? <div>
                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.heading)}
                </Card>
                <Card className={"f36-padding--l"}>
                    {renderField(entry.fields.headingStyle)}
                    {renderField(entry.fields.headingAlignment)}
                    {renderField(entry.fields.mobileHeadingAlignment)}
                    {renderField(entry.fields.headingColor)}
                </Card>
            </div> : ''
        }

        {
            currentTab === 'Content' ? <div>
                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.content)}
                </Card>
                <Card className={"f36-padding--l"}>
                    {renderField(entry.fields.contentColor)}
                    {renderField(entry.fields.alignment)}
                    {renderField(entry.fields.mobileContentAlignment)}
                </Card>
            </div> : ''
        }

        {
            currentTab === 'Buttons' ? <div>
                <Card className={"f36-padding--l"}>
                    {renderField(entry.fields.buttons)}
                </Card>
            </div> : ''
        }

        {
            currentTab === 'Spacing' ? <div>
                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.topPadding)}
                    {renderField(entry.fields.bottomPadding)}
                </Card>
                <Card className={"f36-padding--l"}>
                    {renderField(entry.fields.containerWidth)}
                </Card>
            </div> : ''
        }

        {
            currentTab === 'Background' ? <div>
                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.backgroundImage)}
                    {renderField(entry.fields.mobileBackgroundImage)}
                    {renderField(entry.fields.backgroundStyle)}
                    {renderField(entry.fields.backgroundSize)}
                    <HelpText>
                        Example: 50px. Defaults to 100%.
                    </HelpText>
                </Card>

                <Card className={"f36-padding--l f36-margin-bottom--l"}>
                    {renderField(entry.fields.backgroundColor)}
                    {renderField(entry.fields.backgroundColorMobile)}
                </Card>
            </div> : ''
        }

        {
            currentTab === 'Advanced' ? <div>
                <Card className={"f36-padding--l"}>
                    <SectionHeading className={"f36-padding-bottom--l"}>For developer use only.</SectionHeading>
                    {renderField(entry.fields.slug)}
                    {renderField(entry.fields.customPath)}
                </Card>
            </div> : ''
        }

    </Form>;
};

export default Entry;
