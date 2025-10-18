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
            selectedItemID: undefined,
            selectedItemData: undefined
        }

        this.allItems = MAGIC_ITEMS.concat(WEAPONS).concat(ITEMS).concat(ARMOR);

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

                const combinedItem = {
                    ...item,
                    setters: {...baseData.setters, ...item.setters},
                    base: baseData
                }

                this.addToInventory(combinedItem);

            } else {
                // TODO: give user a choice of bases
                console.log('not supported yet lol')
            }

        } else if (item.setters?.type === 'Armor') {
        } else {
            this.addToInventory(item);
        }
    }

    filterBases(filterStr, list) {
        // TODO: incorporate checkRequirments
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
    
    render() {

        
        const generalListOptions = {
            data: this.allItems,
            title: 'Items',
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
                        <button type="button" onClick={() => this.openAddModal()}>Add item</button>
                    </div>
                </div>

                <Modal show={this.state.showModal} title="Add item" actions={this.state.modalActions} onClose={() => {this.setState({showModal: false})}}>
                    {this.state.modalType === 'general' &&
                    
                    <GenericList {...generalListOptions} />
                    
                    }
                    <ChrysalisInfoPane data={this.state.selectedItemData} />
                </Modal>
            </>
        )
    }
}