import React from 'react';
import FileLabel from './FileLabel';

export default function ImageLoader(props) {
    return (<FileLabel accept ={"image/*"} label={props.force ? "Add Image File" : "Update Image File"} readFile={props.readFile} loaded = {props.loaded} />)
}
