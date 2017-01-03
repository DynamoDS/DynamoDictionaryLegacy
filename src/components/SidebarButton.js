import React from 'react';
import { Link } from 'react-router';

import NodeIcon from './nodeicon';
import lineageToRoute from './utils/lineageRouter'




function SidebarButton(props) {
    return (
        <Link to={`/${lineageToRoute(props.ob)}`}><button className={props.classes} style={{
            'paddingLeft': '20px',
            'paddingRight': '20px',
            'whiteSpace': 'nowrap'
        }}>
            {(!props.ob.Arr)
                ? <NodeIcon node={props.ob} width="20px"/>
                : null}
            {props.ob.Name}
          </button>
        </Link>
    )
}
export default SidebarButton;
