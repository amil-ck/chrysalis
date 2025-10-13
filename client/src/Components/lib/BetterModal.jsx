import * as React from 'react';

export default class Modal extends React.Component {
    constructor(props) {
        super();
        this.props = props;
    }

    onClose(then = () => {}) {
        then();
        this.props.onClose();
    }

    render() {
        if (!this.props.show) return <></>;

        return (
            <div {...this.props} className="modalOverlay" aria-modal={true} role={'alertdialog'}>
                <div className="modal">
                    <span className="title">{this.props.title}</span>
                    <div className="body">{this.props.children}</div>
                    <div className="actions">
                        {this.props.negativeText &&
                            <button type="button" className="negative" onClick={() => this.onClose(this.props.onNegative)}>{this.props.negativeText}</button>
                        }
                        <button type="button" className="positive" onClick={() => this.onClose(this.props.onPositive)}>{this.props.positiveText}</button>
                    </div>
                </div>
            </div>
        )
    }
}