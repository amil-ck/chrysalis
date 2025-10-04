import * as React from 'react';
import GenericList from '../lib/GenericList.jsx';
import { FiTrash2 } from 'react-icons/fi';
import { EVERYTHING } from '../lib/indexData.js';
// import {Checkbox} from "expo-checkbox";
// import ExpoCheckbox from 'expo-checkbox/build/ExpoCheckbox.js';

// const CATEGORIES = [
    // {id: "Armor", name:"Armor"}
// ]

const CATEGORYLIST = ["Armor", "Weapon"];
const CATEGORIES = CATEGORYLIST.map(id => {return {id: id, name: id}});

export default class Inventory extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            items: [],

            currentlyAdding: false,
            currentlyAddEquip: false,

            category: null,

            name: "",
            description: "",
            action: false,
            id: 0
        }

        this.addItem = this.addItem.bind(this);
    }

    render () {
        const propsToPass = {
            data: this.state.items,
            title: "Inventory",
            columnNames: ["Name", "description"],
            shownColumns: ["Name", "description"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["name", "description"],
            multiValueColumns: [],
            presetFilters: {},

            selectedItemID: null,
            doubleSelectedItems: [],
        };


        return (
            <div style={{display: 'flex', flexDirection: "column", overflow: "auto"}}>
                {/* <button type='button' className='minimiseBtn' onClick={this.addItemFrom}>+ Add Item From Equipment </button> */}
                <button type='button' className='minimiseBtn' onClick={() => this.setState({currentlyAdding: !this.state.currentlyAdding})}>{this.state.currentlyAdding ? "- Minimise Custom Menu" : "+ Add Custom Item"}</button>
                {this.state.currentlyAdding && this.menuAddItem()}

                <button type='button' className='minimiseBtn' onClick={() => this.setState({currentlyAddEquip: !this.state.currentlyAddEquip})}>{this.state.currentlyAddEquip ? "- Minimise Equipment Menu" : "+ Add Equipment Item"}</button>
                {this.state.currentlyAddEquip && this.menuEquip()}

                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>description</th>
                            <th>delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(
                                item => {return <tr>
                                                    <th>{item.name}</th>
                                                    <th>{item.description}</th>
                                                    <th><button type="button" className='square' title='Delete character' onClick={() => this.deleteItem(item.id)}><FiTrash2 size={18}/></button></th>
                                                </tr>}
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    menuAddItem() {
        return (
            <div style={{display: 'flex', flexDirection: "column"}}>
                Name:
                <input onChange={text => this.setState({name: text.target.value})}></input>
                Description:
                <input onChange={text => this.setState({description: text.target.value})}></input>
                Action?:
                <input type="checkbox" style={{height: 50, width: 50, backgroundColor: this.state.action ? "red" : "gray"}} onChange={e => this.setState({action: e.target.checked})}></input>
                
                <button type='button' className='minimiseBtn' onClick={this.addItem}>+ Add Item </button>
            </div>
        )
    }

    menuEquip() {
        const categoryChoice = {
            data: CATEGORIES,
            title: "category choice",
            columnNames: ["Name"],
            shownColumns: ["Name"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["id"],
            multiValueColumns: [],
            presetFilters: {},

            selectedItemID: null,
            doubleSelectedItems: (this.state.category !== null) ? [this.state.category] : [],

            onItemSelected: (id) => this.setState({category: id}, console.log(this.state.category)),
            onItemDoubleSelected: (id) => (this.state.category === id) ? this.setState({category: null}) : this.setState({category: id})
        }

        // const categoryName = CATEGORIES.find(e => e.id === this.state.category)?.name;
        const categoryName = this.state.category;

        console.log(categoryName);

        const itemChoice = {
            data: EVERYTHING.filter(e => e.type === categoryName),
            title: categoryName,
            columnNames: ["Name"],
            shownColumns: ["Name"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["name"],
            multiValueColumns: [],
            presetFilters: {},

            selectedItemID: null,
            doubleSelectedItems: [],

            onItemSelected: (id) => {},
            onItemDoubleSelected: (id) => this.addEquipItem(id)
        }


        return (
            // <div style={{display: 'flex', flexDirection: "column"}}>
            //     Hello equpi time
            // </div>
            <>
                <GenericList {...categoryChoice}/>
                <GenericList {...itemChoice}/>
            </>
        )
    }


    addItem() {
        this.setState({items: [...this.state.items, {name: this.state.name, description: this.state.description, id: this.state.id, action: this.state.action}], id: this.state.id + 1},
            () => console.log(this.state.items));
    }

    addEquipItem(id) {
        const item = EVERYTHING.find(e => e.id === id);
        item.itemId = item.id;
        item.id = this.state.id;
        
        this.setState({items: [...this.state.items, item], id: this.state.id + 1},
            () => console.log(this.state.items));
    }

    deleteItem(id) {
        this.setState({items: this.state.items.filter(e => e.id !== id)});
    }


}