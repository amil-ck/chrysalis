import * as React from 'react';

export default class InfoPane extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        // Props: data: {title: string, subtitle: string, attributes: {string: string}, description: god knows, source: string }

    }

    parseDescription(descObj) {}

    render() {

        if (this.props.data.title === undefined) {
            return <div className='infoPane'></div>
        }

        return (
            <div className='infoPane'>
                <div className='header'>
                    <span className='title'>{this.props.data.title}</span>
                    <span className='subtitle'>{this.props.data.subtitle}</span>
                </div>
                <div className='attributes'>
                    {Object.entries(this.props.data.attributes).map(([key, value]) => {
                        return <span className='attribute' key={key}>{key}: {value}</span>
                    })}
                </div>
                <div className='description'>
                    {JSON.stringify(this.props.data.description)}
                </div>
                <div className='footer'>
                    Source: {this.props.data.source}
                </div>
            </div>
        )
    }
}