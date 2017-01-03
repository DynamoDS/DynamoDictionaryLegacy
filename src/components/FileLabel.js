import React from 'react';

export default function FileLabel(props) {
    return (
        <label>
          {props.label}
          {props.loaded ? <img src="images/icons/check.png" width= '30px' alt="prIcon" style={{'padding':'5px', 'marginBottom':'5px'}}/>:null}
          <input type="file" accept={props.accept} style={{
            'display': 'none'
        }} onChange={props.readFile}/></label>
    )
}
