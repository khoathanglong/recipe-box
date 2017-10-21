import React, { Component } from 'react';
import './App.css';
import {Panel, Accordion,OverlayTrigger, Tooltip} from 'react-bootstrap';
import {DropdownButton, MenuItem, Button, Grid, Row, Col, Modal, ButtonGroup, Well, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
var $ = require("jquery");


function AddRecipe (props){
  return (
    <Well>
      <FormGroup >
        <ControlLabel>Recipe Name</ControlLabel>
        <FormControl type="text" placeholder='Enter Recipe Name' id="nameBox"></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Recipe Ingredients</ControlLabel>
        <FormControl id="contentBox" type='text' placeholder='Split your ingredients by a comma. For Example: sugar, eggs,...' ></FormControl>
      </FormGroup>
      <hr />
      <Button type='Button' bsStyle='primary' onClick={props.onAdd} >Add</Button>
    </Well>
  )
}

function Edit(props){
  return(
    <ButtonGroup>
      <OverlayTrigger placement="bottom" overlay={(<Tooltip>Select a Recipe to Delete</Tooltip>)}>
        <Button bsStyle='danger' onClick={props.onDelete} >Delete</Button>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={(<Tooltip>Select a Recipe to Edit</Tooltip>)}>
        <Button bsStyle='primary' onClick={props.onEdit} >Edit </Button>
      </OverlayTrigger>
    </ButtonGroup>
  )
}

function RecipeContent(props){
  return(
    <ul>
      {props.RecipeContent.map(content => <MenuItem key={content} >{content}</MenuItem>)}
    </ul>
  )
}

function RecipeName(props){
  function generateRecipes (obj){
    const recipes = obj.RecipeName.map ((recipe,i) => 
      (
          <Panel  key={recipe+i} header={recipe} eventKey={i} bsStyle='primary' onSelect={props.onSelect} >
            <RecipeContent RecipeContent={obj.RecipeContent[i]} />
          </Panel>
      ) 
    )
    return recipes
  }


  return (
      <Accordion>
        {generateRecipes(props.RecipeName)}
      </Accordion>
  )
}

class RecipeBoard extends Component{
  render(){
    return (  
      <Well>
        <RecipeName RecipeName={this.props.RecipeContent} 
                    onSelect={this.props.onSelect} 
                    onEdit={this.props.onEdit} />
        <hr/>
        <Edit onEdit={this.props.onEdit} 
              onDelete={this.props.onDelete} 
               />
      </Well>
    )
  }
}

class App extends Component {
constructor(props) {
    super(props);
    this.state = { RecipeContent: [['sugar','eggs','water']], 
                   RecipeName: ['Example'],
                   selectedRecipe: -1 };
    this.handleDelete = this.handleDelete.bind(this);  
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEdit   = this.handleEdit.bind(this);
    this.handleAdd    = this.handleAdd.bind(this);
  }

componentWillMount(){
 localStorage.setItem("Example", '["Example"]' );
}

componentDidMount(){
  const RecipeName=[];
  const RecipeContent=[];
  for (var i = 0; i< localStorage.length; i++){
    RecipeName.push(localStorage.key(i));
    RecipeContent.push(JSON.parse(localStorage.getItem(RecipeName[i])));
  }
  this.setState({RecipeName:RecipeName, RecipeContent:RecipeContent })
}


handleSelect(e) { //e is the eventKey in the panel
  this.setState(  (prevState) => ( {selectedRecipe: prevState.selectedRecipe-prevState.selectedRecipe+e} ));
}

handleDelete(){
  let RecipeName=this.state.RecipeName.slice();
  let RecipeContent=this.state.RecipeContent.slice();
  let selectedRecipe=this.state.selectedRecipe;
  if (selectedRecipe==null) return;
  localStorage.removeItem(RecipeName[selectedRecipe]);//delete Recipe in the local Storage
  RecipeName.splice(selectedRecipe,1);
  RecipeContent.splice(selectedRecipe,1);
  this.setState({RecipeName:RecipeName, RecipeContent:RecipeContent})
}  

handleEdit(){
  let RecipeName=this.state.RecipeName.slice();
  let RecipeContent=this.state.RecipeContent.slice();
  let selectedRecipe=this.state.selectedRecipe;
  $('#nameBox').val(RecipeName[selectedRecipe]);
  $('#contentBox').val(RecipeContent[selectedRecipe]);
}


handleAdd(){
  let selectedRecipe=this.state.selectedRecipe;
  let newRecipeName=$('#nameBox').val();
  let newRecipeContent=$('#contentBox').val();
  if(newRecipeContent.search(/\w/)===-1 ||newRecipeName.search(/\w/)===-1) return; //text must contain at least 1 character
  newRecipeContent=newRecipeContent.replace(/\,(?!\s)/.exec(newRecipeContent),','); // replace Space after comma with ''
  newRecipeContent=newRecipeContent.split(',');
  let RecipeName=this.state.RecipeName.slice();
  let RecipeContent=this.state.RecipeContent.slice();

  localStorage.setItem(newRecipeName, JSON.stringify(newRecipeContent)); //store input to localStorage

  if (RecipeName.indexOf(newRecipeName)===-1){ //if name existed, only adjust ingredients
    RecipeName.push(newRecipeName);
    RecipeContent.push(newRecipeContent);
    this.setState({RecipeContent:RecipeContent, RecipeName: RecipeName });
  }else{
    RecipeContent.splice(selectedRecipe,1);
    RecipeContent.push(newRecipeContent);
    this.setState({RecipeContent:RecipeContent});
  }
}

render() {
  return (
      <div className="App">
      <h2 className='text-center'>FreeCodeCamp Recipe-Box</h2>
        <Row bsClass='container'>
          <Col sm={12} md={5}> <AddRecipe onAdd={this.handleAdd} /></Col>
          <Col sm={12} md={5} mdOffset={1} > 
            <RecipeBoard RecipeContent={this.state} 
                         onDelete={this.handleDelete} 
                         onEdit={this.handleEdit} 
                         onSelect={this.handleSelect} />          
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
