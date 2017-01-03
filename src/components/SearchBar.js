import React from 'react';




class SearchBar extends React.Component{

  constructor(props){
    super(props);
    this.state={
      value: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    if(event.keyCode==13){
      this.props.searching(event.target.value);
      event.target.value='';
      document.getElementById('page-content-wrapper').scrollTop = 0;
      // this.props.resetActives();
    }
  }



render(){
    return(
        <input type="text" id="searchBox" style={{"display":"table-cell","textAlign":"center","height":"40px", "width":"100%", "marginTop":"-2px","marginLeft":"0px"}} placeholder="search..." onKeyDown = {this.handleChange}/>

    )
  }
}

export default SearchBar;
