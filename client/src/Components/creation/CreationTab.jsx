import * as React from 'react';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            navigationTab: props.navigationTab
        };
    }

    render() {
        return (
            <div className='tab'>
                
            </div>
        )
    }
}