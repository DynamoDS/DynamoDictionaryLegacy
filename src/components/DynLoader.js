import React from 'react';
import FileLabel from './FileLabel';

export default function DynLoader(props){
  return(
    <FileLabel accept ={".dyn"} label = {props.force ? "Add Dynamo File" : "Update Dynamo File"} readFile = {props.readFile} loaded = {props.loaded}/>
  )
}
