import * as React from 'react';
import { EVERYTHING } from '../../lib/indexData.js';
import { test } from '../../lib/supportUtils.js';

export default class DescriptionTest extends React.Component {
    constructor(props) {
        super();

        this.props = props;
    }

    render() {
        return (
            test()
        )
    }
}