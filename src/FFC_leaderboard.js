import React, { Component } from 'react';
import './App.css';

var $ = require("jquery");

 function Headers(props){
  return (
           <tr>
            <th>Rank</th>
            <th>User Name</th>
            <th className="click" onClick={props.sortRecent} >Points in last 30 days</th>
            <th className="click" onClick={props.sortAllTime} >All time Points</th>
          </tr>   
    )
 } 

class App extends Component {
constructor(props) {
    super(props);
    this.state = {arr:[]};
    this.handleRecent = this.handleRecent.bind(this);
    this.handleAll = this.handleAll.bind(this);
    this.getData=this.getData.bind(this);
  }

componentDidMount(){
  let self=this;
  let link='https://fcctop100.herokuapp.com/api/fccusers/top/recent';
  let mystate=[];
  $.getJSON(link,function(data){
      data.forEach(res => {
        mystate.push([res.username, res.img, res.recent, res.alltime])
      })
      self.setState({arr:mystate})
  }); 
}

getData(){
  const list=this.state.arr;
  const lines=list.map( function(line, index) { 
    return (
      <tr key={line[0]}>
        <td>{index+1}</td>
        <td>{line[0]} <span><img src={line[1]} width="20px" /> </span></td>
        <td>{line[2]} </td>
        <td>{line[3]} </td>
      </tr>
    )
  })
  return lines;
}

handleRecent(){
  const list=this.state.arr;
  list.sort((a,b)=> b[2]-a[2]);
  this.setState({arr:list});
}

handleAll(){
  const list=this.state.arr;
  list.sort((a,b) => b[3]-a[3]);
  this.setState({arr:list});
}

render() {
  return (
      <div className="App">
        <div className="header">FFC Camper Leaderboard</div>
        <table>
          <thead><Headers sortRecent={this.handleRecent} sortAllTime={this.handleAll} /></thead>
          <tbody>{this.getData()}</tbody>
        </table>
      </div>
    );
  }
}


