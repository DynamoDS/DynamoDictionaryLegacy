import React from 'react';
import ModalExample from './ModalExample';
import IconButton from 'material-ui/IconButton';



export default function ExampleAdd(props){
    return(
      <IconButton width="40px" tooltip='Add Example File' touch={true} tooltipPosition="top-center" style={{"padding": "0", 'margin':'0', "color":"gray"}}  onClick = {()=>{props.exAdd(props.node)}}>
      <img  src="images/icons/add.svg"/>
      </IconButton>
    )
}
