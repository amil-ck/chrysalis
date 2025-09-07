import * as React from 'react';
import { CLASSES } from '../../lib/indexData.js';

export default class DescriptionTest extends React.Component {
    constructor(props) {
        super();

        this.props = props;
    }

    render() {
        return (
            this.props.creationData.allGrants.map(id => {
                const element = CLASSES.find(e => e.id === id);
                console.log(id);
                console.log(element);
                // console.log(element.name);
                
                if (element !== undefined) {
                    return <>
                    ID: {id}
                    <br></br>
                    Name: {element.name}
                    <br></br>
                    <p> Hello </p>
                    <br></br>
                    <br></br>
                    </>;
                }
            })
        )
    }
}