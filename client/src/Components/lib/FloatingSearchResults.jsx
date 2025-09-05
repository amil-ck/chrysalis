import * as React from 'react';

export default class FloatingSearchResults extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        // PROPS: results: {id: string, title: string, subtitle: string}[], onResultClicked: function(e: Event, id: string), showResults: boolean
    }

    render() {
        if (this.props.showResults) {

            return (
                <div className="floatingWrapper">
                    <div className="floatingSearchResults">
                        {this.props.results.map(result => {
                            return <button className="result" key={"searchresult_" + result.id} onClick={(e) => this.props.onResultClick(e, result.id)}>
                                <span className="title">{result.title}</span>
                                <span className="subtitle">{result.subtitle}</span>
                            </button>
                        })}
                    </div>
                </div>
            )

        } else {
            return <></>
        }
    }
}
