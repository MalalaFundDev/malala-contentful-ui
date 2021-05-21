import React from "react";
import 'codemirror/lib/codemirror.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/field-editor-date/styles/styles.css';
import {
    Field as BaseField,
    FieldWrapper,
} from '@contentful/default-field-editors';
import { getEntryURL } from './shared';
import {FormLabel} from "@contentful/forma-36-react-components";

/* @ts-ignore */
import {EditorExtensionSDK, EntryFieldAPI, FieldExtensionSDK, LocalesAPI} from "@contentful/app-sdk";
/* @ts-ignore */
import {ButtonsField, QAndAField, AccentsField} from "malala-contentful-ui";

interface FieldProps {
    field: EntryFieldAPI;
    locales: LocalesAPI;
    sdk: EditorExtensionSDK;
    type: any;
    label: any;
}

export const Field: React.FC<FieldProps> = ({ field, locales, sdk, type, label }) => {
    const extendedField = field.getForLocale(sdk.locales.default);
    const fieldDetails = sdk.contentType.fields.find(({ id }) => id === extendedField.id);
    const fieldEditorInterface = sdk.editor.editorInterface?.controls?.find(
        ({ fieldId }) => fieldId === extendedField.id
    );
    const widgetId = fieldEditorInterface?.widgetId ?? '';

    if (!fieldDetails || !fieldEditorInterface) {
        return null;
    }

    const fieldSdk: FieldExtensionSDK = {
        ...sdk,
        field: extendedField,
        locales,
        parameters: {
            ...sdk.parameters,
            instance: {
                ...sdk.parameters.instance,
                ...fieldEditorInterface?.settings,
            },
        },
    } as any;

    const renderHeading = label ? () => {
        return <FormLabel htmlFor={fieldDetails.name}>{label}</FormLabel>
    } : undefined

    const renderField = function() {
        switch (type) {
            case '39ArQsK2hqsWsIK0WiCGMm':
            case 'accents':
                return  <AccentsField sdk={fieldSdk}/>
            case 'buttons':
                return  <ButtonsField sdk={fieldSdk}/>
            case 'q&a':
                return <QAndAField sdk={fieldSdk}/>
            default:
                return <BaseField widgetId={widgetId} sdk={fieldSdk} isInitiallyDisabled={false} />
        }
    }

    return  <FieldWrapper sdk={fieldSdk} name={fieldDetails.name} getEntryURL={getEntryURL} renderHeading={renderHeading}>
        {renderField()}
    </FieldWrapper>
};