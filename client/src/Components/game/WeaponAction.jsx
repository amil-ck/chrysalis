import * as React from 'react';
import { calculateStat } from '../lib/statUtils.js';

export default class WeaponAction extends React.Component {
    /**
     * 
     * @param {object} props
     * @param {object} props.data The weapon object
     * @param {object} props.characterData
     */
    constructor(props) {
        super();
        this.props = props;
    }

    render() {
        let attackBonus = 0;
        let dmgBonus = 0;

        const myCheckSupports = (str) => {
            return !!(this.props.data.supports?.includes(str) || this.props.data.base?.supports?.includes(str));
        }

        const dexMod = calculateStat("dexterity:modifier", this.props.characterData);
        const strMod = calculateStat("strength:modifier", this.props.characterData);

        const isFinesse = myCheckSupports("ID_INTERNAL_WEAPON_PROPERTY_FINESSE");
        const isRanged = myCheckSupports("ID_INTERNAL_WEAPON_CATEGORY_SIMPLE_RANGED") || myCheckSupports("ID_INTERNAL_WEAPON_CATEGORY_MARTIAL_RANGED");

        // Add normal modifier
        if (isFinesse) {
            // Use higher of str and dex
            attackBonus += Math.max(strMod, dexMod);
            dmgBonus += Math.max(strMod, dexMod);
        } else if (isRanged) {
            // Use dex
            attackBonus += dexMod;
            dmgBonus += dexMod;
        } else {
            // Use str
            attackBonus += strMod
            dmgBonus += strMod;
        }

        // Add proficiency
        const itemProf = this.props.data.setters?.proficiency;
        console.log(itemProf)
        if (itemProf && this.props.characterData.grants.some(g => g.id === itemProf)) {
            attackBonus += calculateStat("proficiency", this.props.characterData);
        }
        
        return (
            <div className="weapon action">
                <div className="heading">
                    <div className="left">
                        <span className="name">{this.props.data.formattedName || this.props.data.name}</span>
                        <div className="subtitle">
                            <span className="actionStr">{this.props.data.base ? this.props.data.base.type : this.props.data.type}</span>
                        </div>
                    </div>
                    <div className="right">
                        <button type='button'>+{attackBonus}</button>
                        {/* <button type="button" className={this.state.collapsed ? "collapse collapsed" : "collapse"} onClick={_ => this.setState({ collapsed: !this.state.collapsed })}><FiChevronDown size={18} /></button> */}
                        <button type='button'>{this.props.data.setters.damage}+{dmgBonus}</button>
                        {this.props.data.setters.versatile && <button type='button'>({this.props.data.setters.versatile}+{dmgBonus})</button>}
                    </div>
                </div>
            </div>
        )
    }
}