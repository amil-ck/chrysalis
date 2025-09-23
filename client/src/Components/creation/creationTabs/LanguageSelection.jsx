import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { EVERYTHING } from '../../lib/indexData';
import { checkSupports } from './supportUtils.js';

export default class LanguageSelection extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        const languages = [];
        console.log(this.props.characterData.creationData.languages);
        for (const x of Object.values(this.props.characterData.creationData.languages)) {
            languages.push(...x);
        }

        this.state = {
            languages: languages,
            listsData: {},
            selectedFeatureID: null
        }
    }

    filterDataMultiple(array, type, value) {
        return array.filter(e => this.access(type, e) !== undefined && checkSupports(value, this.access(type, e)))
    }

    access(path, object) {
        return path.split('.').reduce((o, i) => o?.[i], object)
    }

    onFeatureDoubleSelected(id, array, max) {
        console.log(array);
        console.log(this.state);
        let actualArray = this.access(array, this.state)

        if (!actualArray.includes(id) && actualArray.length < max) {
            console.log('feat added: ' + id);
            actualArray.push(id)
        } else if (actualArray.includes(id)) {
            console.log('feat removed: ' + id)
            actualArray.splice(actualArray.findIndex(e => e === id), 1);
        }

        this.setState({languages: this.state.languages});
    }

    onFeatureSelected(id) {

    }




    render() {
        return (
            <div className='tab'>
                <div className='main'>
                    {this.state.languages.filter(
                        e => true
                        // e => (this.filterDataMultiple(EVERYTHING, "supports", e.supports).length !== 0)
                    ).map(
                        e => {
                            if (this.state.listsData[e.name] === undefined) {
                                this.state.listsData[e.name] = [];
                                this.setState({
                                    listsData: {...this.state.listsData}
                                })
                            }

                            console.log(this.state);

                            return <ClassList
                                onItemSelected={this.onFeatureSelected}
                                selectedItemID={this.state.selectedFeatureID}
                                onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "listsData." + e.name, e.number || 1)}
                                doubleSelectedItems={this.state.listsData[e.name]}
                                maxDoubleSelected={e.number || 1}
                                // presetFilters={{Supports: e}}
                                title={e.name}
                                data={this.filterDataMultiple(EVERYTHING, "supports", e.supports)}
                            />}
                    )}
                </div>
            </div>
        )
    }
}