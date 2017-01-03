import React from 'react';
import { Link } from 'react-router';
import lineageToRoute from './utils/lineageRouter'

import classNames from 'classnames';

import {flatten, flattenHierarchy} from './utils/array';


import ExampleSection from './ExampleSection';
import NodeInfo from './NodeInfo';
import NodeTitle from './NodeTitle';
import DynamoHierarchy from './DynamoHierarchy';
import Home from './Home';



class Branch extends React.Component {
    constructor() {
        super();
        this.nodeDetail = this.nodeDetail.bind(this);
        this.detailList = this.detailList.bind(this);
        this.extractHierarchy = this.extractHierarchy.bind(this);
        this.hierarchyIterator = this.hierarchyIterator.bind(this);
    }

    nodeDetail(ob) {
        // console.log(ob)
        return [
            ob.Description
                ? this.detailList('nodeDesc', 'Description', ob.Description, 0)
                : null,
            ob.Inputs
                ? this.detailList('nodeIn', 'Inputs', ob.Inputs, 1)
                : null,
            ob.Outputs
                ? this.detailList('nodeDesc', 'Outputs', ob.Outputs, 2)
                : null, < ExampleSection node = {
                ob
            }
            key = {
                3
            }
            editInDepthClick = {
                this.props.editInDepthClick
            }
            editInDepth = {
                this.props.editInDepth
            }
            key = {
                3
            }
            updateExample = {this.props.updateExample}
            />
        ]
    }

    detailList(cn, title, body, key) {

        return (
            <div className={cn} key={key}>
                <br/>
                <b>{title}:</b>
                <br/> {key === 1
                    ? body.map((b, i) => (
                        <text style={{
                            'color': 'gray'
                        }} key={i}>{b.Name}: {b.Type}<br/></text>
                    ))
                    : key === 2
                        ? body.map((b, i) => (
                            <text key={i} style={{
                                'color': 'gray'
                            }}>Type: {b.Name}<br/><hr/></text>
                        ))

                        : <text style={{
                            'color': 'gray'
                        }}>{body}</text>
}
            </div>
        )
    }

    extractHierarchy(ob) {
        return this.hierarchyIterator(ob).reverse().map((n, i) => (n.Arr
            ? (
                <Link to={`/${lineageToRoute(n)}`} key={i}  className="addedText" >{n.Lineage
                        ? n.Name
                        : null}{(n.Arr && n.Arr[0].Arr)
                        ? ','
                        : null}&nbsp;</Link>
            )
            : {}))
    }
    hierarchyIterator(ob) {
        if (ob && ob.Parent != 'Home') {
            return [ob.Parent].concat(this.hierarchyIterator(ob.Parent)).filter((el) => el)
        } else {
            return [];
        }
    }
    render() {
        // console.log(props.mainObjects)
        let props = this.props;
        let actives = props.actives;
        let lastLeaf = actives[actives.length - 1];

        let hierarchy = props.actives.length;

        return (!props.searching && !props.actives[0]
            ? <Home/>
            : (
                <div  style={{'padding':'10%', 'paddingTop':'30px'}}>
                    <div style={{
                        'paddingLeft': '30px',
                        'paddingRight': '30px'
                    }}>

                        {!props.searching
                            ? <NodeTitle lastLeaf={lastLeaf} handleClick={props.handleClick}/>
                            : <div className='nodeName'>Search: {props.searchVal}</div>
                        }
                        <hr/> {!props.searching
                            ? <DynamoHierarchy lastLeaf={lastLeaf} extractHierarchy={this.extractHierarchy} nodeDetail={this.nodeDetail}/>
                            : null}

                        <div className='outer'>
                            <div className='imageTiles'>
                                {props.searching
                                    ? props.searches.map((node, i) => {

                                        return (<NodeInfo handleClick={props.handleClick} node={node} i={i} key={i} extractHierarchy={this.extractHierarchy}/>)
                                    })

                                    : lastLeaf.Arr
                                        ? (flatten(flattenHierarchy(lastLeaf))).map((node, i) => {
                                          if(i<50){
                                            return (<NodeInfo handleClick={props.handleClick} node={node} i={i} key={i} extractHierarchy={this.extractHierarchy}/>)
                                          }
                                        })
                                        : null
}
                            </div>
                        </div>
                    </div>
                </div>
            ))
    }

}

export default Branch;
