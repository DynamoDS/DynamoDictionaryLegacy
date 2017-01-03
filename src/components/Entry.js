//import modules
import * as d3 from 'd3';
import p from './utils/promise';
//create promises for two data files to be read
const pStatic = p.promisify(d3.xml, "data/Dynamo_Library.xml")
const pEdit = p.promisify(d3.json, "data/Dynamo_Nodes_Documentation.json")

//resolve promises
export default Promise.all([pStatic, pEdit])


