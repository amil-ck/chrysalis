import * as React from 'react';

export default class SpellcastingList extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        // PROPS: data: [{}], onItemSelect: function(id), selectedItemID: string
    }

    render() {


        return (
            <div className="spellcastingList">
                <div className="level">
                    <div className="header">
                        <span className="title">Cantrips</span>
                        <hr />
                        <button type="button">v</button>
                    </div>
                    <div className="list"></div>
                </div>
                <div className="level">
                    <div className="header">
                        <span className="title">Level 1</span>
                        <hr />
                        <div className="slots">
                            <span className="slot used"></span>
                            <span className="slot used"></span>
                            <span className="slot"></span>
                            <span className="slot"></span>
                        </div>
                        <button type="button">v</button>
                    </div>
                    <div className="list"></div>
                </div>
            </div>
        )
    }
}