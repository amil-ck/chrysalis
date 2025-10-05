import * as React from 'react';
import { FiX } from 'react-icons/fi';

export default class Chip extends React.Component {
    handleRemoveClick(e) {
        e.stopPropagation();
        this.props.onRemove();
    }

    render() {
        return <span {...this.props} className={"chip " + this.props.className}><span>{this.props.text}</span>{this.props.onRemove && <button type='button' onClick={e => this.handleRemoveClick(e)}><FiX size={16} /></button>}</span>
    }
}