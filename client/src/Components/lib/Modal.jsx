import * as React from 'react';

export default class Modal extends React.Component {
    constructor(props) {
        super();

        // PROPS: show: boolean, close: function(), title: string, body: JSX, positiveText: string, negativeText: string, onPositive: function(), onNegative: function()
        this.props = props;
        this.onClose = this.onClose.bind(this);
    }

    onClose(then= () => {}) {
        then();
        this.props.close();
    }

    render() {
        if (!this.props.show) {
            return <></>
        }

        console.log('showing modal')

        return (
            <div className="modalOverlay" aria-modal={true} role={'alertdialog'}>
                <div className="modal">
                    <span className="title">{this.props.title}</span>
                    <div className="body">{this.props.body}</div>
                    <div className="actions">
                        <button type="button" className="negative" onClick={() => this.onClose(this.props.onNegative)}>{this.props.negativeText}</button>
                        <button type="button" className="positive" onClick={() => this.onClose(this.props.onPositive)}>{this.props.positiveText}</button>
                    </div>
                </div>
            </div>
        )
    }
}