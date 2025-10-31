import * as React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FiMove } from 'react-icons/fi';

export default class InventoryList extends React.Component {
    constructor(props) {
        super();
        this.props = props;
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

    render() {
        return (
            <Droppable droppableId={this.props.id}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={"card list " + this.props.id} {...provided.droppableProps}>
                        <span className="title">{this.props.title}</span>
                        <div className="body">
                            {this.props.data?.map((item, index) => (
                                <Draggable
                                    draggableId={item.itemID}
                                    index={index}
                                    key={item.itemID}>
                                    {(prov, snap) => (
                                        <div
                                            ref={prov.innerRef}
                                            className="item"
                                            {...prov.draggableProps}
                                        >

                                            <div className="left">
                                                <span className="dragHandle" {...prov.dragHandleProps}><FiMove size={14} /></span>
                                                <span className="name">{this.formattedName(item)}</span>
                                            </div>

                                            <div className="right">

                                            </div>
                                        </div>
                                    )}
                                </Draggable>

                            ))}
                            {provided.placeholder}

                        </div>
                    </div>
                )}

            </Droppable>
        )
    }
}