import React from 'react';
import ReactDOM from 'react-dom';

class InDepthDescription extends React.Component{
  componentDidMount() {
      //https://www.dhariri.com/posts/57c724e4d1befa66e5b8e056
      document.addEventListener('click', this.handleClickOutside.bind(this), true);
  }
  componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside.bind(this), true);
  }

  handleClickOutside(event) {
    if(this.props.editInDepth){
      const domNode = ReactDOM.findDOMNode(this);
      if ((!domNode || !domNode.contains(event.target))) {
          this.props.node.inDepth = domNode.value; //this is a mutation, could be improved
          this.props.editInDepthClick();
      }
    }
  }

  render(){
    let props = this.props;
    let node  = props.node;

    return (
      props.editInDepth ?
      (<textarea id="inDepthDescription" style={{"color": "gray"}} defaultValue = {node.inDepth} />)
      :
      (<pre id="inDepthDescription" style={{"color": "gray"}}>{node.inDepth}</pre>)
    )
  }
}

export default InDepthDescription;
