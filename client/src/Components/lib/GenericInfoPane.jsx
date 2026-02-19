import * as React from 'react';
import DOMPurify from 'dompurify';
import { FiX } from 'react-icons/fi';

export default class GenericInfoPane extends React.Component {
    /**
     * 
     * @param {object} props
     * @param {object} props.data
     * @param {string} props.data.title
     * @param {string} props.data.subtitle
     * @param {{[key: string]: [value: string]}} props.data.attributes
     * @param {string} props.data.description HTML string
     * @param {{[key: string]: [value: string]}} props.data.footerAttributes\
     * @param {boolean} props.data.added
     * @param {string} props.data.type
     * 
     * @param {function()} props.onClose
     * @param {boolean} props.showAddButton
     * @param {function()} props.onAddButtonClick
     */ 
    constructor(props) {
        super();
        this.props = props;
        // Props: data: {title: string, subtitle: string, attributes: {string: string}, description: html string, footerAttributes: {string: string}, added: bool, type: string }
        // onClose: function(), showAddButton: bool, onAddButtonClick: function

    }

    render() {

        if (this.props.data?.title === undefined) {
            return <div className='infoPane hidden'></div>
        }

        const sanitisedDescription = DOMPurify.sanitize(this.props.data.description, { USE_PROFILES: { html: true } });

        return (
            <div className='infoPane'>
                <div className='header'>
                    <div className="top">
                        <div className="titleWrapper">
                            <span className='title'>{this.props.data.title}</span>
                            <span className='subtitle'>{this.props.data.subtitle}</span>
                        </div>
                        <button className='closeButton square' onClick={() => { if (this.props.onClose) this.props.onClose() }}><FiX size={18} /></button>
                    </div>
                    {this.props.showAddButton &&

                        <button type="button" className="addButton">{this.props.data.added ? "- Remove" : "+ Add"} {this.props.data.type || ""}</button>

                    }
                </div>
                {Object.keys(this.props.data.attributes).length > 0 &&

                    <div className='attributes'>
                        {Object.entries(this.props.data.attributes).map(([key, value]) => {
                            return <span className='attribute' key={key}><b>{key}:</b> {value}</span>
                        })}
                    </div>

                }
                <div className='description' dangerouslySetInnerHTML={{ __html: sanitisedDescription }}>

                </div>
                <div className='footer'>
                    {Object.entries(this.props.data.footerAttributes).map(([key, value]) => {
                        return <span className='attribute' key={key}><b>{key}:</b> {value}</span>
                    })}
                </div>
            </div>
        )
    }
}