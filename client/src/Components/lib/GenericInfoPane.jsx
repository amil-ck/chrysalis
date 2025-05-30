import * as React from 'react';

export default class GenericInfoPane extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        // Props: data: {title: string, subtitle: string, attributes: {string: string}, description: god knows, source: string }
        // onClose: function()

    }

    render() {

        if (this.props.data?.title === undefined) {
            return <div className='infoPane hidden'></div>
        }

        return (
            <div className='infoPane'>
                <div className='header'>
                    <div className="titleWrapper">
                        <span className='title'>{this.props.data.title}</span>
                        <span className='subtitle'>{this.props.data.subtitle}</span>
                    </div>
                    <button className='closeButton' onClick={() => {if (this.props.onClose) this.props.onClose()}}>x</button>
                </div>
                <div className='attributes'>
                    {Object.entries(this.props.data.attributes).map(([key, value]) => {
                        return <span className='attribute' key={key}><b>{key}:</b> {value}</span>
                    })}
                </div>
                <div className='description'>
                    {JSON.stringify(this.props.data.description)}
                </div>
                <div className='footer'>
                    <b>Source:</b> {this.props.data.source}
                </div>
            </div>
        )
    }
}