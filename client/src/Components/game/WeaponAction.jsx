import * as React from 'react';

export default class WeaponAction extends React.Component {
    /**
     * 
     * @param {object} props
     * @param {object} props.data The weapon object
     */
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        return (
            <div className="weapon action">
                <div className="heading">
                    <div className="left">
                        <span className="name">{this.props.data.formattedName || this.props.data.name}</span>
                        <div className="subtitle">
                            <span className="actionStr">{this.props.data.base ? this.props.data.base.type : this.props.data.type}</span>

                            {this.props.data.maxUsage && this.props.data.maxUsage > 0 &&
                                <>
                                    <span className="actionStr">&nbsp;({this.props.data.usageStr})</span>
                                    <Slots label="Uses: " value={this.props.useValue} max={Number(this.props.data.maxUsage)} onChange={this.props.onChange} />
                                </>
                            }
                        </div>
                    </div>
                    <div className="right">
                        {/* <button type="button" className={this.state.collapsed ? "collapse collapsed" : "collapse"} onClick={_ => this.setState({ collapsed: !this.state.collapsed })}><FiChevronDown size={18} /></button> */}
                    </div>
                </div>
            </div>
        )
    }
}