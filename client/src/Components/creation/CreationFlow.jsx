import * as React from 'react';
import CreationNavbar from './CreationNavBar.jsx';
import CreationTab from './CreationTab.jsx';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {}
    }

    render() {
        return (
            <div className='creationFlow fullPane'>
                <CreationNavbar />
                <CreationTab />
            </div>
        )
    }
}