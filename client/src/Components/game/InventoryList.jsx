import * as React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FiEdit, FiMove, FiPlus, FiTrash2 } from 'react-icons/fi';

export default class InventoryList extends React.Component {
    /**
     * 
     * @param {object} props
     * @param {string} props.id
     * @param {string} props.title 
     * @param {object[]} props.data
     * @param {function(string)} props.onItemClick
     * @param {function()} props.onAddItemClick
     * @param {function(string)} props.onRemoveItemClick
     * @param {function()?} props.onAddCustomClick
     */
    constructor(props) {
        super();
        this.props = props;
    }

    // formattedName(item) {
    //     if (!item.setters["name-format"]) return item.name;

    //     let formatted = `${item.setters["name-format"]}`;

    //     const statNames = formatted.split("{{").map(str => {
    //         if (str.includes("}}")) {
    //             return str.split("}}")[0]; // get substring between brackets
    //         }
    //     }).filter(i => !!i); // not null or undefined

    //     for (const statName of statNames) {
    //         let replaceWith = "error";
    //         if (statName === 'parent') { // reserved name
    //             replaceWith = item.base.name;
    //         } else {
    //             replaceWith = item.setters[statName];
    //         }

    //         formatted = formatted.replace(`{{${statName}}}`, replaceWith);
    //     }

    //     return formatted;
    // }

    render() {
        return (
            <Droppable droppableId={this.props.id}>
                {(provided, snapshot) => (
                    <div className={"card list inventoryList " + this.props.id} >
                        <span className="title">{this.props.title}</span>
                        <div className="body" ref={provided.innerRef} {...provided.droppableProps} >
                            {this.props.data?.map((item, index) => (
                                <Draggable
                                    draggableId={item.itemID}
                                    index={index}
                                    key={item.itemID}>
                                    {(prov, snap) => (
                                        <div
                                            ref={prov.innerRef}
                                            className="item"
                                            onClick={() => this.props.onItemClick(item.itemID)}
                                            {...prov.draggableProps}
                                        >
                                            <div className="dragHandle" {...prov.dragHandleProps}><FiMove size={14} /></div>
                                            <div className="left">
                                                <span className="name">{item.formattedName || item.name}</span>
                                                <span className="type">{item.type} &bull; {item.setters.category}</span>
                                            </div>

                                            <div className="right">
                                                <button type="button" title='Delete item' onClick={(e) => {
                                                    e.stopPropagation(); // stops the item being clicked when inner button is clicked
                                                    this.props.onRemoveItemClick(item.itemID)
                                                }}><FiTrash2 size={14} /></button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>

                            ))}
                            {provided.placeholder}
                            {(!this.props.data || this.props.data.length === 0) &&

                                <>


                                </>

                            }


                        </div>
                        <div className="actions">
                            <button type="button" onClick={this.props.onAddItemClick}><FiPlus size={14} /> Add item</button>
                            {this.props.onAddCustomClick && 
                            
                            <button type="button" onClick={this.props.onAddCustomClick}><FiEdit size={14} /> Add custom</button>

                            }
                        </div>
                    </div>
                )}

            </Droppable>
        )
    }
}