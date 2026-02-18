import * as React from 'react';
import { ARMOR, ITEMS, MAGIC_ITEMS, WEAPONS, EVERYTHING } from '../lib/indexData';
import Modal from '../lib/BetterModal.jsx';
import GenericList from '../lib/GenericList.jsx';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import { checkRequirements } from '../lib/supportUtils.js';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import InventoryList from './InventoryList.jsx';
import EquipmentList from '../lib/listTypes/EquipmentList.jsx';

const EQUIPPED_LISTS = ["Armor", "Weapons"]; // temporary, until I figure out custom lists

export default class Inventory extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.groups = ["Weapons", "Armor", "Misc"];

        this.defaultCustomModalData = {name: '', description: '', category: ''};

        this.state = {
            modalType: 'general',
            showModal: false,
            modalActions: [],
            modalTitle: "Add item",
            selectedItemID: undefined,
            selectedItemData: undefined,
            addTargetList: "Misc",
            customModalData: this.defaultCustomModalData
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
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onModalAddCustomClick = this.onModalAddCustomClick.bind(this);
    }

    componentDidMount() {
        const toUpdate = {};

        if (this.props.characterData.inventory?.length > 0) {
            // Checks whether character uses old version of inventory
            // if so, resets it
            // its still alpha we're allowed to mess with existing character files i think
            if (typeof this.props.characterData.inventory[0].id === 'number') {
                console.log("pre-0.2.0 inventory");
                toUpdate.inventory = { Misc: [] };
            } else if (this.props.characterData.inventory[0].id) {
                console.log("first 0.2.0 inventory");
                toUpdate.inventory = { Misc: this.props.characterData.inventory };
            }
        } else if (this.props.characterData.inventory === undefined) {
            console.log("no inventory");
            toUpdate.inventory = { Misc: [] };
        }

        if (Object.keys(toUpdate).length > 0) {
            return this.props.updateCharacterData(toUpdate);
        }
    }

    openAddModal(targetList = "Misc") {
        this.setState({
            showModal: true,
            modalType: 'general',
            modalTitle: 'Add item',
            modalListData: this.allItems,
            modalActions: [
                { text: 'Cancel', action: () => { } },
                { text: 'Add', action: this.onModalAddItemClick }
            ],
            addTargetList: targetList
        }, () => {
            if (!this.props.characterData.inventory[targetList]) {
                this.props.updateCharacterData({
                    inventory: {
                        ...this.props.characterData.inventory,
                        [targetList]: []
                    }
                })
            }
        });
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
        if (['Weapon', 'Armor'].includes(item.setters?.type) || item.setters?.weapon !== undefined) {
            let baseFilterString = item.setters[item.setters.type.toLowerCase()];
            if (item.setters.weapon) baseFilterString = item.setters.weapon;
            const searchList = item.setters.weapon ? this.searchableWeapons : this.searchableArmor;

            const availableBases = this.filterBases(baseFilterString, searchList);

            // TODO: make this work for edge cases e.g. staff of the woodlands
            // its type=staff rather than weapon but otherwise identical

            if (availableBases.length === 1) {
                // No choices necessary
                const baseData = this.allItems.find(i => i.id === availableBases[0]);
                console.log(baseData);

                this.addToInventory(this.combineIntoItem(item, baseData));

            } else {

                const basesData = this.allItems.filter(i => availableBases.includes(i.id));
                console.log(basesData);

                this.setState({
                    modalListData: basesData,
                    modalActions: [
                        { text: 'Cancel', action: () => { } },
                        { text: 'Add', action: () => this.addWithBase(item) }
                    ],
                    modalTitle: `Choose ${item.setters.type}`,
                    showModal: true,
                    selectedItemData: undefined,
                    selectedItemID: undefined
                });

            }

        } else {
            this.addToInventory(item);
        }
    }

    combineIntoItem(magicItem, base) {
        const combGrants = [];
        const combStats = [];

        // Nonsense to deal with when stat/grant is sometimes a single object rather than an array
        // grrrrrrr XML
        if (base.rules) {
            if (base.rules.grant) {
                if (base.rules.grant?.length) {
                    combGrants.push(...base.rules.grant);
                } else {
                    combGrants.push(base.rules.grant);
                }
            }


            if (base.rules.stat) {
                if (base.rules.stat?.length) {
                    combStats.push(...base.rules.stat);
                } else {
                    combStats.push(base.rules.stat);
                }
            }

        }
        if (magicItem.rules) {
            if (magicItem.rules.grant) {
                if (magicItem.rules.grant?.length) {
                    combGrants.push(...magicItem.rules.grant);
                } else {
                    combGrants.push(magicItem.rules.grant);
                }
            }

            if (magicItem.rules.stat) {
                if (magicItem.rules.stat?.length) {
                    combStats.push(...magicItem.rules.stat);
                } else {
                    combStats.push(magicItem.rules.stat)
                }
            }

        }

        /*

        const grants = [];
        if (item.rules?.grant?.length) {
            grants.push(...item.rules?.grant);
        } else {
            grants.push(item.rules?.grant);
        }
        const stats = [];
        if (item.rules?.stat?.length) {
            stats.push(...item.rules?.stat);
        } else {
            stats.push(item.rules?.stat);
        }

        */

        const item = {
            ...magicItem,
            setters: { ...base.setters, ...magicItem.setters },
            rules: {
                grant: combGrants,
                stat: combStats
            },
            base: base
        };
        return { ...item, formattedName: this.formattedName(item) };
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
            if (checkRequirements(filterStr, o)) {
                results.push(o[0]); // add ID to list
            }
        }

        return results;
    }

    addToInventory(item) {
        let itemID = crypto.randomUUID();

        // Make sure itemID is unique in inventory:
        const combinedInventory = Object.keys(this.props.characterData.inventory).flatMap(k => this.props.characterData.inventory[k]);
        console.log(combinedInventory);
        while (combinedInventory.find(i => i.itemID === itemID) !== undefined) {
            itemID = crypto.randomUUID();
        }


        this.props.updateCharacterData({
            inventory: { ...this.props.characterData.inventory, [this.state.addTargetList]: [...this.props.characterData.inventory[this.state.addTargetList], { ...item, itemID }] }
        }, () => {
            // Only call calculate when actually equipping, no need to run unequip code
            if (EQUIPPED_LISTS.includes(this.state.addTargetList)) this.calculateGrants(item, this.state.addTargetList);
        });

    }

    openCustomModal(targetList = "Misc") {
        this.setState({
            showModal: true,
            modalType: 'custom',
            modalTitle: 'Add custom item',
            modalActions: [
                { text: 'Cancel', action: () => { } },
                { text: 'Add', action: this.onModalAddCustomClick }
            ],
            addTargetList: targetList,
            customModalData: this.defaultCustomModalData
        }, () => {
            if (!this.props.characterData.inventory[targetList]) {
                this.props.updateCharacterData({
                    inventory: {
                        ...this.props.characterData.inventory,
                        [targetList]: []
                    }
                })
            }
        });
    }

    onModalAddCustomClick() {
        const { name='', category='', description='' } = this.state.customModalData;
        if (!name) return alert("Custom items need names");

        this.addToInventory({name, description, type: "Custom Item",setters: {category}});        
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

    onItemClick(listID, itemID) {
        console.log(listID, itemID)

        // Get item data from list and id
        const item = this.props.characterData.inventory[listID].find(i => i.itemID === itemID);

        if (item) {
            this.setState({
                selectedItemID: itemID,
                selectedItemData: item
            });
        }
    }

    onRemoveItem(listID, itemID) {
        const item = this.props.characterData.inventory[listID].find(i => i.itemID === itemID);

        // Close info pane if removed item was selected
        if (itemID === this.state.selectedItemID) {
            this.setState({
                selectedItemID: '',
                selectedItemData: undefined
            });
        }

        this.props.updateCharacterData({
            inventory: {
                ...this.props.characterData.inventory,
                [listID]: this.props.characterData.inventory[listID].filter(i => i.itemID !== itemID)
            }
        }, () => this.calculateGrants(item, "NONE"));
    }

    onDragEnd(result, provided) {
        console.log(result);

        if (result.reason !== 'DROP') return; // Drag cancelled

        if (!result.destination) return; // Dragged outside a container

        const updatedInv = { ...this.props.characterData.inventory };

        const sourceList = result.source.droppableId;
        const destinationList = result.destination.droppableId;

        // Create inventory list if needed
        if (!updatedInv[destinationList]) updatedInv[destinationList] = [];

        const item = updatedInv[sourceList][result.source.index]; // Get item from source
        updatedInv[sourceList].splice(result.source.index, 1); // Remove item from index at source
        updatedInv[destinationList].splice(result.destination.index, 0, item); // Add item to new index at destination

        this.props.updateCharacterData({
            inventory: updatedInv
        }, () => {
            if (EQUIPPED_LISTS.includes(sourceList) !== EQUIPPED_LISTS.includes(destinationList)) {
                // Only recalculate grants if status of item has actually changed
                this.calculateGrants(item, result.destination.droppableId)
            }
        });
    }

    calculateGrants(item, listID) {

        console.log(item);

        // Deals with grants/stats sometimes being a single object rather than array
        // thank you XML god bless
        const grants = [];
        if (item.rules?.grant !== undefined) {
            if (item.rules?.grant?.length !== undefined) {
                grants.push(...item.rules?.grant);
            } else {
                grants.push(item.rules?.grant);
            }
        }

        const stats = [];
        if (item.rules?.stat !== undefined) {
            if (item.rules?.stat?.length !== undefined) {
                stats.push(...item.rules?.stat);
            } else {
                stats.push(item.rules?.stat);
            }
        }

        console.log(grants, item.rules?.grant);

        if (grants.length === 0 && stats.length === 0) return;

        console.log(grants, stats);

        if (EQUIPPED_LISTS.includes(listID)) {
            // Item has been equipped
            const updatedStats = [...this.props.characterData.stats];
            const updatedGrants = [...this.props.characterData.grants];

            if (stats.length > 0) updatedStats.push(...stats);
            if (grants.length > 0) updatedGrants.push(...grants);

            console.log("equipping...", updatedGrants)

            this.props.updateCharacterData({
                stats: updatedStats,
                grants: updatedGrants
            });

        } else {
            // Item has been unequipped
            const updatedStats = [...this.props.characterData.stats];
            const updatedGrants = [...this.props.characterData.grants];

            // For every grant, search through grants to find index (I hate json stringify grr)
            for (const grant of grants) {
                const idx = updatedGrants.findIndex(g => JSON.stringify(g) === JSON.stringify(grant));
                if (idx === -1) continue;

                updatedGrants.splice(idx, 1);
            }

            // Do the same for every stat
            for (const stat of stats) {
                console.log(stat);

                const idx = updatedStats.findIndex(s => JSON.stringify(s) === JSON.stringify(stat));
                if (idx === -1) continue;
                console.log("2:", stat, idx);

                updatedStats.splice(idx, 1);
            }

            console.log("unequipping...", updatedStats);

            // Return if nothing has changed
            if (updatedStats.length === this.props.characterData.stats.length && updatedGrants.length === this.props.characterData.grants.length) {
                return;
            }

            this.props.updateCharacterData({
                stats: updatedStats,
                grants: updatedGrants
            });
        }
    }

    render() {


        const generalListOptions = {
            title: '',

            onItemSelected: (id) => this.setState({ selectedItemID: id, selectedItemData: this.allItems.find(i => i.id === id) }),
            onItemDoubleSelected: () => { },
            doubleSelectedItems: [this.state.selectedItemID]
        }

        return (
            <>
                <div className="tab inventory">
                    <DragDropContext onDragEnd={this.onDragEnd}>

                        <div className="main">
                            <div className="equipment section">
                                <div className="header">Equipped</div>

                                <InventoryList id="Armor" title="Armour" data={this.props.characterData.inventory?.["Armor"]} onAddItemClick={() => this.openAddModal("Armor")} onItemClick={(itemID) => this.onItemClick("Armor", itemID)} onRemoveItemClick={(itemID) => this.onRemoveItem("Armor", itemID)} />
                                <InventoryList id="Weapons" title="Weapons" data={this.props.characterData.inventory?.["Weapons"]} onAddItemClick={() => this.openAddModal("Weapons")} onItemClick={(itemID) => this.onItemClick("Weapons", itemID)} onRemoveItemClick={(itemID) => this.onRemoveItem("Weapons", itemID)} />
                            </div>
                            <div className="divider"></div>
                            <div className="misc section">
                                <div className="header">Inventory</div>
                                <InventoryList id="Misc" title="Uncategorised" data={this.props.characterData.inventory?.["Misc"]} onAddItemClick={() => this.openAddModal()} onItemClick={(itemID) => this.onItemClick("Misc", itemID)} onRemoveItemClick={(itemID) => this.onRemoveItem("Misc", itemID)} onAddCustomClick={() => this.openCustomModal("Misc")} />

                            </div>

                            {/* <button type="button" onClick={() => this.openAddModal()}>Add item</button> */}

                        </div>
                    </DragDropContext>
                    <ChrysalisInfoPane data={this.state.selectedItemData} onClose={() => this.setState({ selectedItemID: '', selectedItemData: undefined })} />
                </div>

                <Modal show={this.state.showModal} title={this.state.modalTitle} actions={this.state.modalActions} onClose={() => { if (!this.state.keepModal) this.setState({ showModal: false, selectedItemID: undefined, selectedItemData: undefined }) }}>
                    {this.state.modalType === 'general' &&

                        <>
                        <EquipmentList {...generalListOptions} data={this.state.modalListData} />
                        {/* <ChrysalisInfoPane data={this.state.selectedItemData} /> */}
                        </>
                    }
                    {this.state.modalType === 'custom' &&

                        <div className="inputList">
                            <div className="inputWrapper">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" value={this.state.customModalData.name} onChange={(e) => this.setState({customModalData: {...this.state.customModalData, [e.target.name]: e.target.value}})} placeholder='My extra special magic item' />
                            </div>

                            <div className="inputWrapper">
                                <label htmlFor="category">Category</label>
                                <input type="text" name="category" value={this.state.customModalData.category} onChange={(e) => this.setState({customModalData: {...this.state.customModalData, [e.target.name]: e.target.value}})} placeholder='What kind of thing is it' />
                            </div>

                            <div className="inputWrapper">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" value={this.state.customModalData.description} rows={6} onChange={(e) => this.setState({customModalData: {...this.state.customModalData, [e.target.name]: e.target.value}})} placeholder='I felt the need to invent a custom item because ...' />
                            </div>
                        </div>

                    }
                </Modal>
            </>
        )
    }
}