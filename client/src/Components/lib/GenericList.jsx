import * as React from 'react';

export default class GenericList extends React.Component {
    constructor(props) {
        super();

        this.props = props;



        this.state = {
            data: this.props.data,
            columns: this.props.columns
        }
    }

    render() {

        const dataToRender = this.state.data.map(item => {

        })

        return (
            <div className={"listWrapper"}>
                <table>
                    <thead>
                        <tr>
                            {this.state.columns.map(colName => {
                                return <th key={colName}>{colName}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(item => {
                            return (
                                <tr key={item.id}>
                                    {this.state.columns.map(col => {
                                        return <td>{item[col]}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}