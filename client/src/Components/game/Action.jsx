import * as React from 'react';

import { FiChevronDown } from 'react-icons/fi';
import Slots from '../lib/Slots.jsx';

export default class Action extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            collapsed: !!this.props.startCollapsed
        }

        // props: data: action object, onChange: function(newValue), startCollapsed: bool
    }

    render() {

        return (
            <div className="action">
                <div className="heading">
                    <div className="left">
                        <span className="name">{this.props.data.name}</span>
                        <div className="subtitle">
                            <span className="actionStr">{this.props.data.action}</span>
                            
                            {this.props.data.maxUsage && this.props.data.maxUsage > 0 &&
                                <> 
                                <span className="actionStr">&nbsp;({this.props.data.usageStr})</span>
                                <Slots label="Uses: " value={this.props.useValue} max={Number(this.props.data.maxUsage)} onChange={this.props.onChange} />
                                </>
                            }
                        </div>
                    </div>
                    <div className="right">
                        <button type="button" className={this.state.collapsed ? "collapse collapsed" : "collapse"} onClick={_ => this.setState({ collapsed: !this.state.collapsed })}><FiChevronDown size={18} /></button>
                    </div>
                </div>
                <div className={this.state.collapsed ? "description collapsed collapsible" : "description collapsible"} dangerouslySetInnerHTML={{__html: this.props.data.description}}>
                    {/* {this.props.data.description} */}
                </div>
            </div>
        )
    }
}