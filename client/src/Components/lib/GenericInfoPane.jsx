import * as React from 'react';
import DOMPurify from 'dompurify';

export default class GenericInfoPane extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        // Props: data: {title: string, subtitle: string, attributes: {string: string}, description: html string, source: string }
        // onClose: function()

    }

    render() {

        if (this.props.data?.title === undefined) {
            return <div className='infoPane hidden'></div>
        }

        const sanitisedDescription = DOMPurify.sanitize(this.props.data.description, {USE_PROFILES: {html: true}});
        console.log(this.props.data.description, sanitisedDescription);

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
                <div className='description' dangerouslySetInnerHTML={{__html: sanitisedDescription}}>
                    
                </div>
                <div className='footer'>
                    <b>Source:</b> {this.props.data.source}
                </div>
            </div>
        )
    }
}