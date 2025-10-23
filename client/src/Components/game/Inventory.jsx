import * as React from 'react';
import { ARMOR, ITEMS, MAGIC_ITEMS, WEAPONS, EVERYTHING } from '../lib/indexData';
import Modal from '../lib/BetterModal.jsx';
import GenericList from '../lib/GenericList.jsx';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import { checkRequirments } from '../lib/supportUtils.js';

export default class Inventory extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.groups = ["Weapons", "Armor", "Misc"];

        this.state = {
            modalType: 'general',
            showModal: false,
            modalActions: [],
            modalTitle: "Add item",
            selectedItemID: undefined,
            selectedItemData: undefined
        }

        this.allItems = MAGIC_ITEMS.concat(WEAPONS).concat(ITEMS).concat(ARMOR);
        this.state.modalListData = this.allItems;

        // Create item lists suitable for checkrequirments:
        this.searchableWeapons = WEAPONS.map(w => {
            return [w.id, w.name, ...w.supports]
        })
        this.searchableArmor = ARMOR.map(a => {
            return [a.id, a.name, ...a.supports]
        })

        this.onModalAddItemClick = this.onModalAddItemClick.bind(this);
    }

    componentDidMount() {
        const toUpdate = {};

        if (this.props.characterData.inventory?.length > 0) {
            // Checks whether character uses old version of inventory
            // if so, resets it
            // its still alpha we're allowed to mess with existing character files i think
            if (typeof this.props.characterData.inventory[0].id === 'number') {
                toUpdate.inventory = [];
            }
        } else if (this.props.characterData.inventory === undefined) {
            toUpdate.inventory = [];
        }

        if (Object.keys(toUpdate).length > 0) {
            return this.props.updateCharacterData(toUpdate);
        }
    }

    openAddModal() {
        this.setState({
            showModal: true,
            modalType: 'general',
            modalTitle: 'Add item',
            modalListData: this.allItems,
            modalActions: [
                {text: 'Cancel', action: ()=>{}},
                {text: 'Add', action: this.onModalAddItemClick}
            ]
        })
    }

    onModalAddItemClick() {
        if (this.state.selectedItemID === undefined) return;

        const item = this.allItems.find(i => i.id === this.state.selectedItemID);
        if (!item) return;

        if (item.type === 'Magic Item') {
            this.addMagicItem(item);
        } else {
            this.addToInventory(item);
        }


        this.setState({
            selectedItemData: undefined,
            selectedItemID: undefined
        })
    }

    addMagicItem(item) {
        if (['Weapon', 'Armor'].includes(item.setters?.type)) {
            const baseFilterString = item.setters[item.setters.type.toLowerCase()];
            const searchList = item.setters.type === 'Weapon' ? this.searchableWeapons : this.searchableArmor;
            
            const availableBases = this.filterBases(baseFilterString, searchList);
            
            if (availableBases.length === 1) {
                // No choices necessary
                const baseData = this.allItems.find(i => i.id === availableBases[0]);

                // const combinedItem = {
                //     ...item,
                //     setters: {...baseData.setters, ...item.setters},
                //     base: baseData
                // }

                this.addToInventory(this.combineIntoItem(item, baseData));

            } else {
                // TODO: give user a choice of bases
                console.log('not supported yet lol')

                const basesData = this.allItems.filter(i => availableBases.includes(i.id));
                console.log(basesData)

                this.setState({
                    modalListData: basesData,
                    modalActions: [
                        {text: 'Cancel', action: () => {}},
                        {text: 'Add', action: () => this.addWithBase(item)}
                    ],
                    modalTitle: `Choose ${item.setters.type}`,
                    showModal: true,
                    selectedItemData: undefined,
                    selectedItemID: undefined
                })
                
            }

        } else {
            this.addToInventory(item);
        }
    }

    combineIntoItem(magicItem, base) {
        return {
            ...magicItem,
            setters: {...base.setters, ...magicItem.setters},
            base: base
        }
    }

    addWithBase(magicItem) {
        if (this.state.selectedItemID === undefined) return;

        const base = this.allItems.find(i => i.id === this.state.selectedItemID);
        if (!base) return;

        this.addToInventory(this.combineIntoItem(magicItem, base));
    }

    filterBases(filterStr, list) {
        const results = [];
        for (const o of list) {
            if (checkRequirments(filterStr, o)) {
                results.push(o[0]); // add ID to list
            }
        }

        return results;
    }

    addToInventory(item, group = 'Misc', action) {
        let itemID = crypto.randomUUID();

        // Make sure itemID is unique in inventory:
        while (this.props.characterData.inventory.find(i => i.itemID === itemID) !== undefined) {
            itemID = crypto.randomUUID();
        }

        // TODO: add item's stats and grants (should be on equip really)

        this.props.updateCharacterData({
            inventory: [...this.props.characterData.inventory, {...item, group, action: action, itemID}]
        })
    }

    formattedName(item) {
        if (!item.setters["name-format"]) return item.name;

        let formatted = `${item.setters["name-format"]}`;

        const statNames = formatted.split("{{").map(str => {
            if (str.includes("}}")) {
                return str.split("}}")[0]; // get substring between brackets
            }
        }).filter(i => !!i); // not null or undefined

        for (const statName of statNames) {
            let replaceWith = "error";
            if (statName === 'parent') {
                // reserved name
                replaceWith = item.base.name;
            } else {
                replaceWith = item.setters[statName];
            }

            formatted = formatted.replace(`{{${statName}}}`, replaceWith);
        }

        return formatted;
    }

    // insertStats(description = '') {
    
    //         let parsedDescription = `${description}`;
    
    //         const statNames = description.split("{{").map(str => {
    //             if (str.includes("}}")) {
    //                 return str.split("}}")[0]; // get substring between brackets
    //             }
    //         }).filter(i => !!i); // not null or undefined
    
    //         console.log(statNames);
    
    //         for (const statName of statNames) {
    //             const value = calculateStat(statName, this.props.characterData);
    //             parsedDescription = parsedDescription.replace(`{{${statName}}}`, value);
    //         }
    
    //         return parsedDescription;
    //     }
    
    render() {

        
        const generalListOptions = {
            title: '',
            columnNames: ["Name", "Type", "Source"],
            shownColumns: ["Name", "Type", "Source"],
            allowFilter: ["Type", "Source"],
            allowSearch: ["Name"],
            columnLocations: ["name", "type", "source"],
            multiValueColumns: [],
            presetFilters: {
                // Source: "Player’s Handbook"
            },
            onItemSelected: (id) => this.setState({selectedItemID: id, selectedItemData: this.allItems.find(i => i.id === id)}),
            onItemDoubleSelected: () => {},
            doubleSelectedItems: [this.state.selectedItemID]
        }

        return (
            <>
                <div className="tab inventory">
                    <div className="main">
                    <div className="misc">
                        {this.props.characterData.inventory.map(item => (
                            <div className="item" key={item.itemID}>
                                <span className="name">{this.formattedName(item)}</span>
                                
                            </div>
                        ))}
                    </div>
                        <button type="button" onClick={() => this.openAddModal()}>Add item</button>
                    </div>
                </div>

                <Modal show={this.state.showModal} title={this.state.modalTitle} actions={this.state.modalActions} onClose={() => {if (!this.state.keepModal) this.setState({showModal: false, selectedItemID: undefined, selectedItemData: undefined})}}>
                    {this.state.modalType === 'general' &&
                    
                    <GenericList {...generalListOptions} data={this.state.modalListData} />
                    
                    }
                    <ChrysalisInfoPane data={this.state.selectedItemData} />
                </Modal>
            </>
        )
    }
}