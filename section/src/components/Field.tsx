import {EditorExtensionSDK, EntryFieldAPI, FieldAPI, LocalesAPI} from "@contentful/app-sdk";
import React from "react";
import {FieldGroup, FormLabel, ValidationMessage} from "@contentful/forma-36-react-components";
import {SingleLineEditor} from "@contentful/field-editor-single-line"
import {DropdownEditor} from "@contentful/field-editor-dropdown"
import {RichTextEditor} from "@contentful/field-editor-rich-text";
import {SingleEntryReferenceEditor} from '@contentful/field-editor-reference';
import { BooleanEditor } from '@contentful/field-editor-boolean';

/* @ts-ignore */
import {ButtonsField} from "malala-contentful-ui";

interface FieldProps {
    sdk: EditorExtensionSDK,
    field: EntryFieldAPI;
    locales: LocalesAPI;
}

export function Field(props: FieldProps) {
    const {sdk, field} = props;
    const extendedField = (field as any) as FieldAPI;
    extendedField.onSchemaErrorsChanged = () => () => null;
    extendedField.setInvalid = () => null;
    extendedField.locale = sdk.locales.default;
    const key = 'field-' + field.id

    const fieldDetails = sdk.contentType.fields.find(({id}) => id === extendedField.id);
    const fieldEditorInterface = sdk.editor.editorInterface?.controls?.find(
        ({fieldId}) => fieldId === extendedField.id
    );


    let fieldSdk: any = sdk;
    fieldSdk.field = extendedField;
    fieldSdk = Object.assign(fieldSdk, {
        parameters: {
            instance: {
                permissions: {
                    canAccessAssets: true,
                    canCreateAssets: true,
                    canCreateEntryOfContentType: () => true
                }
            }
        }
    });


    function renderField() {
        if (!fieldDetails || !fieldEditorInterface || !fieldDetails) {
            return ''
        }

        switch (fieldEditorInterface.widgetId) {
            case 'dropdown':
                return  <DropdownEditor field={extendedField}
                                        locales={sdk.locales}
                                        isInitiallyDisabled={false}
                                        key={key}/>
            case 'richTextEditor':
                return  <RichTextEditor sdk={fieldSdk}/>
            case 'singleLine':
                return <SingleLineEditor field={extendedField}
                                         locales={sdk.locales}
                                         isInitiallyDisabled={false}
                                         withCharValidation={false}/>
            case '39ArQsK2hqsWsIK0WiCGMm':
                return  <ButtonsField sdk={fieldSdk}/>
            case 'entryCardEditor':
                return  <SingleEntryReferenceEditor viewType={"card"} sdk={fieldSdk} hasCardEditActions={true} parameters={{ instance: {} }} isInitiallyDisabled={false}/>
            case 'boolean':
                return <BooleanEditor field={extendedField} isInitiallyDisabled={false}/>
            default:
               return <ValidationMessage>
                   {fieldEditorInterface.widgetId} is not implemented
               </ValidationMessage>
        }
    }

    if (!fieldDetails || !fieldEditorInterface) {
        return  <ValidationMessage>
            Error displaying field.
        </ValidationMessage>
    }


    return <FieldGroup key={key} className={"f36-padding--s"}>
        <FormLabel htmlFor={fieldDetails.name}>{fieldDetails.name}</FormLabel>
        {renderField()}
    </FieldGroup>
}