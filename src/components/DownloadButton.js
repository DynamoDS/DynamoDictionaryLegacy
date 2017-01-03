import React from 'react';
import IconButton from 'material-ui/IconButton';

function DownloadButton(props) {
    let node = props.node;
    return (
            <a href = {props.dynPath} download>
              <IconButton tooltip='Download Dynamo File' touch={true} tooltipPosition="top-center" style={{"top":"-4px","opacity":" 0.5", 'padding':'0', 'width':"30px", 'height':'30px', 'marginTop':'0px', 'marginRight':'0px'}}  className='pull-right'>
              <img height="18px" src="images/icons/download.svg"/>
              </IconButton>
            </a>
        )
    }

export default DownloadButton;
