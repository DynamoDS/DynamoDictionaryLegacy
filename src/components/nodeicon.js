import React from 'react';
import { Link } from 'react-router';
import path from 'path';

import lineageToRoute from './utils/lineageRouter'

function NodeIcon(props) {
    return (<Link to={`/${lineageToRoute(props.node)}`}> <
        img className = "im"
        height = {props.width}
        style = {
            {
                "backgroundColor": "rgb(34,34,34)",
                "marginRight":"10px"
            }
        }
        src = {
            path.join('images', props.node.SmallIcon)
        }
        /></Link>
    )
}

export default NodeIcon;
