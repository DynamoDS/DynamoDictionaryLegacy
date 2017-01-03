import React from 'react';
import path from 'path';

import DownloadButton from './DownloadButton';
import EditButton_Files from './EditButton_Files';
import ExampleImage from './ExampleImage';
import ExampleFile_Lightbox from './ExampleFile_Lightbox';

function ExampleFile(props) {
    let node = props.node;
    let index = props.index;
    let dynName = typeof node.dynFile[index] === 'object'
        ? node.dynFile[index].original
        : node.dynFile[index]
    let dyn = props.dynPaths[index];
    return (
        <div className='exSample' style={{
            'display': 'inline-block'
        }}>
            <div className='exIcons'>
                <text style={{
                    'opacity': '0.45',
                    'paddingRight': '20px'
                }}>
                    {dynName}
                </text>
                <EditButton_Files node={node} turnOnModal={props.turnOnModal} index={index}/>
                <DownloadButton node={node} dynPath={dyn}/>
            </div>
            <ExampleImage imageSrc={props.imgPaths[index]} index={index} handleClick={props.openLightbox}/>
        </div>
    )
}

export default ExampleFile;
