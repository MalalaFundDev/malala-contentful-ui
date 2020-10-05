import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {FormLabel, TextInput, Card, SectionHeading, IconButton, ValidationMessage} from '@contentful/forma-36-react-components';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class App extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    };

    detachExternalChangeHandler = null;


    constructor(props) {
        super(props);

        let value = props.sdk.field.getValue() ? props.sdk.field.getValue() : {articles: []};

        this.state = {
            articles: value.articles,
            error: null
        }
    }

    componentDidMount() {
        this.props.sdk.window.startAutoResizer();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    }

    componentWillUnmount() {
        if (this.detachExternalChangeHandler) {
            this.detachExternalChangeHandler();
        }
    }

    defaultArticle() {
        return {
            title: '',
            date: '',
            source: '',
            link: ''
        }
    }

    onExternalChange = () => {
        let value = this.props.sdk.field.getValue();

        if (!value) {
            value = {articles: []}
        }

        this.setState({articles: value.articles});
    };

    onChange = (field, idx, e) => {
        let {articles} = this.state;

        if (articles[idx] === undefined) {
            articles[idx] = {
                title: '',
                date: '',
                source: '',
                link: ''
            }
        }

        articles[idx][field] = e.currentTarget.value

        this.save(articles)
    };

    validate()
    {
        let {articles} = this.state;

        return !articles.some((article) => {
            return !article.title || !article.date || !article.source || !article.link
        })
    }

    save(articles) {
        this.setState({articles});

        if (!this.validate()) {
            this.setState({error: 'Please complete all required fields.'})
            this.props.sdk.field.setInvalid(true)
        } else {
            this.setState({error: null})
            this.props.sdk.field.setInvalid(false)

        }

        this.props.sdk.field.setValue({articles})
    }

    renderTextField(idx, name, label, value, type = 'text') {
        return (
            <div style={{marginTop: "15px", marginBottom: "15px"}}>
                <FormLabel
                    htmlFor={name}
                    required={true}
                    requiredText="required"
                    testId={name}
                >
                    {label}
                </FormLabel>

                <TextInput
                    width="full"
                    type={type}
                    id={name}
                    testId={name}
                    value={value}
                    required={true}
                    onChange={(e) => this.onChange(name, idx, e)}
                />
            </div>
        )
    }

    renderArticle(article, idx) {
        const {articles} = this.state

        return (
            <Card key={'article-' + idx} title='Article' style={{marginTop: "15px", marginBottom: "15px"}}>
                <SectionHeading
                    element="h3"
                >
                    Article
                </SectionHeading>

                {this.renderTextField(idx, 'title', 'Title', article.title)}
                {this.renderTextField(idx, 'date', 'Date', article.date)}
                {this.renderTextField(idx, 'source', 'Source', article.source)}
                {this.renderTextField(idx, 'link', 'Link', article.link, 'url')}


                { this.renderAddButton(idx) }
                { this.renderRemoveButton(idx) }
            </Card>
        )
    }

    renderAddButton(idx = null) {
        const {articles} = this.state

        if (articles.length && (articles.length >= 3 || idx + 1 !== articles.length)) {
            return
        }

        return (
            <IconButton
                iconProps={{
                    icon: 'Plus'
                }}
                buttonType="positive"
                label="Add New Article"
                onClick={this.add.bind(this)}
            />
        )
    }

    renderRemoveButton(idx) {
        const {articles} = this.state

        if (articles.length <= 0) {
            return
        }

        return (
            <IconButton
                iconProps={{
                    icon: 'Delete'
                }}
                buttonType="negative"
                label="Remove Article"
                onClick={() => this.remove(idx)}
            />
        )
    }

    add()
    {
        const {articles} = this.state

        articles.push(this.defaultArticle())

        this.save(articles)
    }

    remove(idx)
    {
        const {articles} = this.state

        articles.splice(idx, 1);

        this.save(articles)
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
        const {articles} = this.state

        return (
            <div>
                { this.renderValidation() }
                { articles.length ? articles.map(this.renderArticle.bind(this)) : this.renderAddButton() }
            </div>
        )
    }
}

init(sdk => {
    ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
