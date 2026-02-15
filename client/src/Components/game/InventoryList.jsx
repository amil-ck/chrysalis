import * as React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FiMove, FiPlus } from 'react-icons/fi';

export default class InventoryList extends React.Component {
    /**
     * 
     * @param {object} props
     * @param {string} props.id
     * @param {string} props.title 
     * @param {object[]} props.data
     * @param {function(string)} props.onItemClick
     * @param {function(string)} props.onAddItemClick
     * @param {function(string)} props.onRemoveItemClick
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
                    <div  className={"card list inventoryList " + this.props.id} >
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
                                            <span className="dragHandle" {...prov.dragHandleProps}><FiMove size={14}/></span>
                                            <div className="left">
                                                <span className="name">{item.formattedName || item.name}</span>
                                            </div>

                                            <div className="right">
                                                <button type="button" onClick={(e) => {
                                                    e.stopPropagation(); // stops the item being clicked when inner button is clicked
                                                    this.props.onRemoveItemClick(item.itemID)
                                                }}>del</button>
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
                            <button type="button" onClick={this.props.onAddItemClick}><FiPlus size={14} /> Add item</button>
                        </div>
                    </div>
                )}

            </Droppable>
        )
    }
}