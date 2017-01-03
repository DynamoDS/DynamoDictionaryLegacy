import React from 'react';
import InDepthDescription from './InDepthDescription';
import TextEditor from './TextEditor';
import IconButton from 'material-ui/IconButton';

function InDepthSection(props) {
  let node = props.node;

  return (
      <div className = 'inDepth'>

        <b>In Depth:</b>
          <IconButton tooltip='Edit In Depth Description' touch={true} tooltipPosition="top-center" style={{"top":"-15px","opacity":" 0.5", "right":"-10px"}} onClick = {props.editInDepthClick} className='pull-right'>
            <img height="20px" src="images/icons/edit.svg" id="editButton" className="edB" style={{"opacity":" 0.25"}}/>
            </IconButton>



        <TextEditor node = {node} editInDepth={props.editInDepth}  editInDepthClick = {props.editInDepthClick}/>
          {/*}<InDepthDescription editInDepth = {props.editInDepth} editInDepthClick = {props.editInDepthClick} node = {node}/>*/}

        <hr/>

      </div>
  )
}

export default InDepthSection;
