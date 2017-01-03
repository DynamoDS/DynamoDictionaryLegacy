import React from 'react';
import NodeIcon from './nodeicon';

function NodeTitle(props) {
    let lastLeaf = props.lastLeaf;

    return (
      <div className='nodeName'>
          {((!lastLeaf.Arr)
              ? <NodeIcon node={lastLeaf} width="30px" handleClick={props.handleClick}/>
              : null)}
          {lastLeaf.TempName || lastLeaf.Name}
      </div>
    )

}

export default NodeTitle;
