import React from "react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

export class EditorField extends React.Component {
    quill = null

    constructor(props) {
        super(props);

        this.field = React.createRef()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidMount() {
        this.quill = new Quill(this.field.current, {
            theme: 'snow',
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote'],
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'size': ['small', 'normal', 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'align': [] }],
                ['clean']                                         // remove formatting button
            ]
        });
        this.quill.on('text-change', this.handleChange.bind(this))
    }

    handleChange(delta, oldDelta, source) {
        const {onChange} = this.props
        const converter = new QuillDeltaToHtmlConverter(this.quill.getContents().ops);
        const html = converter.convert()
        onChange(html)
    }

    render() {
        let {value} = this.props

        return <div ref={this.field} dangerouslySetInnerHTML={{__html: value}} />
    }
}
