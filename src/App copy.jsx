import React, {Component, useState, useRef, useEffect, useCallback, Fragment} from 'react';
import axios from "axios";
import Avatar from "react-avatar";
import 'rsuite/dist/rsuite.min.css'; // or 'rsuite/dist/rsuite.min.css'
import vmsg from "vmsg";
import AutoScrollDiv from './autoscrolldiv';
import ReactPlayer from 'react-player/youtube';
import { ArrowRight, Mic, MicFill, MicMuteFill,Trash3Fill, CheckLg, CurrencyDollar, Trash3, CursorFill, chat, Cursor, Chat, Book, DatabaseAdd, DatabaseDash, HandThumbsUp, HandThumbsDown, Eyeglasses} from 'react-bootstrap-icons';
import Speech from 'react-speech';
import { COLOR } from 'rsuite/esm/utils/constants';
import { Container, Row, Col, Overlay, Popover, OverlayTrigger, Tooltip, Image,Button,Badge,ToggleButton,ButtonGroup, Alert,Card,Form, FormGroup , FormLabel} from 'react-bootstrap';
import { render } from 'react-dom';
import ReactMarkdown from 'react-markdown'
import configData from "./whitelabel.json"
import appConfigData from "./appconfig.json"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useStream} from 'react-fetch-streams';
import {MsalProvider} from '@azure/msal-react';
import Plot from 'react-plotly.js';
import * as CanvasJS from "@canvasjs/charts";
import Clock from 'react-live-clock';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
} from '@azure/msal-react';
//const audio_msg = new SpeechSynthesisUtterance();
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
<script type="text/javascript" src="https://unpkg.com/react-fetch-streams/dist/index.min.js"></script>
// const recorder = new vmsg.Recorder({
//   wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
// });
 
class App extends Component {
   audio;
   audio_msg;
   recorder;
  constructor(props) {  
    super(props);   
    this.state = {
      msalInstance: props.msalInstance,  
      username: "",    
      value: "",
      chatlog: [""],
      chatlogMetadata: [""],
      Current_response: "",
      messages: [{"role": "", "content": ""}],      
      input: "",
      prompt_tokens: 0,
      completion_tokens:  0,
      current_interaction_cost:0,
      total_tokens_consumed: 0,
      cost:0,
      IsVectorInfoTrig:true,
      vector_count:0,
      model_name: "<model_name>",
      response_received: false,
      temprature: 0.85,
      top_p: 0.2,
      tokens_limit:(1000),
     frequency_penalty: 1,
      presence_penalty: 1,
      isLoading: false,
    isRecording: false,
    result_msg:"",
    memory_result_msg:"",
    recording: "",
    isFilePicked: false,
    selectedFile: "",
    recordbuttonstyle: "recordstartbutton",
    imageurl: "",   
    topic: 5,   
    mute: true, 
    model:2,
    radios : [
      { name: 'Precise', value: 0.2 },
      { name: 'Balanced', value: 0.7 },
      
    ],
    topicradios : [
      { name: 'Requirements', value: 3 },
      { name: 'Technical', value: 4 },
      { name: 'All', value: 5},
    ],
    modelradios : [
      { name: 'Standard', value: 1 },
      { name: 'Advanced', value: 2 },
    ],    
    }
    this.recorder = new vmsg.Recorder({
      wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
    });
 
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.play = this.play.bind(this);
    this.getNextAudio = this.getNextAudio.bind(this);
    this.renderchatlog = this.renderchatlog.bind(this);
    this.ClearForm = this.ClearForm.bind(this);
    this.resettopic = this.resettopic.bind(this);
    this.record = this.record.bind(this);
    this.speak = this.speak.bind(this);
    this.renderAudiowidget =  this.renderAudiowidget.bind(this);
    this.sendWhisperPostRequest = this.sendWhisperPostRequest.bind(this);
    this.ConversationStyleButton = this.ConversationStyleButton.bind(this); 
    this.ConversationTopicButton = this.ConversationTopicButton.bind(this); 
    this.setspeech = this.setspeech.bind(this);    
    this.TokenRange = this.TokenRange.bind(this);
    this.calculateCost = this.calculateCost.bind(this);
    this.ModelNameButton = this.ModelNameButton.bind(this);
    this.DisplayContext = this.DisplayContext.bind(this);
    this.logincheck = this.logincheck.bind(this);
    //this.NavBar = this.NavBar.bind(this);
    this.Footer = this.Footer.bind(this); 
    this.DisplayThumbsUp = this.DisplayThumbsUp.bind(this);
    this.DisplayThumbsDown = this.DisplayThumbsDown.bind(this);
    this.FileUploadPage = this.FileUploadPage.bind(this);
   this.setSelectedFile = this.setSelectedFile.bind(this);
    this.setIsSelected = this.setIsSelected.bind(this);
    this.ClearMemory = this.ClearMemory.bind(this);
    this.GetVectorsInfo = this.GetVectorsInfo.bind(this);
    this.GetVectorsCount = this.GetVectorsCount.bind(this);
    this.audio =  window.speechSynthesis;
    this.audio_msg = new SpeechSynthesisUtterance();
    
   }
   render(){   
   return (    
    <MsalProvider  instance={this.state.msalInstance}>
    <>
    {<this.logincheck />}
    <AuthenticatedTemplate>  
    <Container className="p-3 mb-2 bg-white" style={{marginTop:"0px", height:"800px" , disply:'flex'}} > 
      <Row>
        <Col md className='col-md-2 align-text-top' style={{ paddingTop: "0px", marginTop: "0px"}}>
            <Image  className='align-text-top' style={{width:configData.ORG_LOGO_WIDTH, 
            height:configData.ORG_LOGO_HEIGHT,paddingTop: "0px", 
            marginTop: "0px"}} src={configData.ORG_LOGO_URL}></Image>  
           </Col>
        <Col md className='col-md-7' style={{ paddingTop: "0px", marginTop: "0px", disply:'flex', 
        justifyContent:'center'}} > 
        <h1 style={{display:'flex', justifyContent:'center'}}> 
        {configData.HEADING} </h1>
        <div style={{display:'flex', justifyContent:'center'}}>        
           {configData.SUBHEADING} 
        </div>        
      
        </Col>
        <Col md className='col-md-1' style={{ paddingTop: "0px", marginTop: "0px", alignSelf:"flex-start"}}> 
          <Image   src={configData.SECONDARY_LOGO_URL}  style={{width:"140px", height:"120px",
          paddingTop: "0px", marginTop: "0px", marginLeft:"20px" }}>    
          </Image> 
         </Col>  
         <Col  md className='col-md-1' style={{ paddingTop: "0px", marginTop: "0px", textAlign:"left" }}>
         <div><b>Labs</b></div>  
            
         </Col>    
      </Row>
      <Row >
        <Col md className='col-md-8 bg-light bg-gradient text-dark rounded-top border-right-0' 
        style={ { height: "590px", paddingTop:"0px"} }  >
        <AutoScrollDiv> 
          {             
            this.state.chatlog.map((chat,i) => {             
            if(chat.includes("user:"))
            {              
            return <>         
                <div style={{whiteSpace: 'pre-line', color: "GrayText"}} key={i}>
                <Alert variant='light' className='small'>
                  <Avatar size="30"key={i+2} name={this.username}  round /> 
                {chat.split("user:")[1]} 
                </Alert> </div>
              </>
            }
            else if(chat.includes("assistant:")){   
             // console.log(chat)              
              var assistant_response = chat.split("assistant:")[1];
              //console.log(assistant_response)
              var completion=""
              //console.log(assistant_response)
              var source =""
              var metadata=""
              var context=""
              var full_response=""
               // this.state.Current_response.map((response,i) => { 
                if(i == this.state.chatlog.length-1) 
                full_response = this.state.Current_response;
                else
                full_response = chat.split("assistant:")[1];
               
                if(full_response != undefined && full_response != null && full_response != "")
                     {
                   
                        if(full_response.includes("Source:"))
                                  { 
                                  //  console.log(full_response)
                                  //  console.log(i)
                                    completion = full_response.split("Source:")[0].trim();
                                    var content = full_response.split("Source:")[1]
                                      source =  "<br><i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic;'>Source: " +
                                        content.split("Metadata:")[0].trim(); +
                                      "</p>";
                                      if(content.includes("Metadata:"))
                                      {
                                        if(content.split("Metadata:")[1] != undefined  && content.split("Metadata:")[1] != null
                                          && content.split("Metadata:")[1] != "")
                                        {  
                                          if(content.includes('kbtext:'))
                                          {               
                                          metadata =  "<i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic; font-size: 13px; '>Metadata: " 
                                          + content.split("Metadata:")[1].split('kbtext:')[0].trim()+ "</p>"  
                                          context = content.split("kbtext:")[1].trim();
                                          }
                                          else
                                          {
                                            metadata =  "<i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic; font-size: 13px; '>Metadata: "
                                            + content.split("Metadata:")[1].trim()+ "</p>"
                                          }
                                          metadata=""; // temporray hidden
                                        //  console.log("metadata: " + metadata)                
                                        } 
                                                  
                                      }
                                      else
                                      {                   
                                        source =  "<br><i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic;'>Source: " 
                                        + content + "</p>";
                                        console.log("source: " + source)
                                      }
                                    }
                                    else
                                    {
                                      completion = full_response;
                                    }
                                    
                     }      
             
              return <>              
              <div  style={{whiteSpace: 'pre-line', color: "GrayText"}} key={i+5}>                
                <div style={{textAlign:"end"}}>
                  {this.DisplayThumbsUp(context)}
                  {this.DisplayThumbsDown(context)}
                  {this.DisplayContext(context)}
                </div>
                  <Alert variant='info'>
                    <Avatar size="30" key={i+1} facebook-id="invalidfacebookusername" 
                      src="https://s.gravatar.com/avatar/6c0384c38e447d71bb90be92e7d13a79?s=80" /> 
                         {  htmlToReactParser.parse(  completion, {  replace: function(domNode) {
    if (domNode.type === 'script') {
      var script = document.createElement('script');            
      document.head.appendChild(script);
    }
  }
} )} 
                       {/* <div dangerouslySetInnerHTML={{ __html: completion }} /> */}
                        {/* {  htmlToReactParser.parse("<html> <body height='100%' width='100%'> <table>  <tr>    <td>Cell 1</td>    <td>Cell 2</td>    <td>Cell 3</td>  </tr>  <tr>    <td>Cell 4</td>    <td>Cell 5</td>    <td>Cell 6</td>  </tr></table></body></html>")} */}
                        <br></br>
                        {  htmlToReactParser.parse(source)}
                        {  htmlToReactParser.parse(metadata)}                  
                {/*  <ReactMarkdown className='reactMarkDown' >{chat.split("assistant:")[1]}</ReactMarkdown>  */}
                </Alert>
                </div>
             {this.state.mute =false}          
          
            
             
            
          
              </>      
          }          
          } )
          }
        </AutoScrollDiv> 
        
         </Col>
        <Col md className='col-md-4 bg-light bg-gradient rounded-top'  
        style={ {paddingTop:"5px", height:'580px',
        backgroundColor:configData.THEME_COLORS.SECONDARY} }> 
          <Card>
          <Card.Body className='card  bg-gradient mb4' style={{height:'620px',   borderWidth: "0px", 
          borderBlockStyle:"none", color:configData.THEME_COLORS.FONT_COLOR,   backgroundColor:configData.THEME_COLORS.PRIMARY,paddingTop:"10px"}}>
            <Card.Title style={{textAlign: "center"}}> Knowledge Settings</Card.Title>
            <Card.Text>  </Card.Text>        
              <Card.Text>
                <br></br>
              <Card.Subtitle> Current Knowledge: </Card.Subtitle>
              </Card.Text>
              <Card.Text>
              <Row>
              <Col md className='col-md-9' >  
              Vector Count:  { this.state.vector_count}
              </Col>
              <Col md className='col-md-3'>
            <this.GetVectorsInfo/>
            </Col>
            </Row>
            </Card.Text>

           
           {/*  <Card.Text >
              <Card.Subtitle> Inferencing Capability: </Card.Subtitle>
              </Card.Text>
              <Card.Text>
              {<this.ModelNameButton />}
          </Card.Text>
            <Card.Text>
            <Card.Subtitle> Response Length:  </Card.Subtitle>
            </Card.Text> */}
            <Card.Text >
              <Card.Subtitle> Add Knowledge: </Card.Subtitle>
              </Card.Text>
              <Card.Text>
              <Row>
              <Col md className='col-md-12' >               
              <this.FileUploadPage />
              </Col>            
              </Row>            
             
            </Card.Text>
            <Card.Text>
            <Card.Subtitle>Clear Knowledge: </Card.Subtitle>
            </Card.Text>
            <Card.Text>
            <Row>
              <Col md className='col-md-12' >               
              <this.ClearMemory />
              </Col>            
              </Row>
            </Card.Text>
{/* 
            <Card.Text>
              <Row>
              <Col md className='col-md-2' >
                short
              </Col>
                <Col md className='col-md-6' >            
             {<this.TokenRange />}
              </Col>
              <Col md className='col-md-2' >long
              </Col>
              </Row>
            </Card.Text> */}
          

             <Card.Text>           
            <Card.Subtitle>  Audio:  </Card.Subtitle>
           </Card.Text>           
              <Card.Text> 
              <Row>    
                  <Col md className='col-md-2  rounded' >                  
                 <Button className="btn btn-success" disabled={this.state.isLoading} onClick={this.record}> 
                 <Mic />{this.state.isRecording ? "Stop" : "Speak"}
                  </Button> 
                    </Col>
                    <Col md className='col-md-2'style={{paddingLeft:"30px"}} >
                      <Button className='btn btn-danger' style={{backgroundColor:"#d00000"}} id='btnmute' sz="sm" 
                      disabled={this.state.mute} onClick={() => this.setspeech()}>
                        <MicMuteFill /> Mute </Button>
                      </Col>  
                </Row>
                  <audio src={this.state.recording} hidden="true" controls="controls" />              
            </Card.Text>  
            
            <Card.Text> 
              <Row>    
                  <Col md className='col-md-12  rounded' >  
                   <font color='red' size='8px' ><b>Safety: Please don’t share sensitive info.</b></font>
                  </Col>
                  </Row>
                  </Card.Text>

                  {/* <Card.Text> 
              <Row>    
                  <Col md className='col-md-12  rounded' > 
                  <br></br>
                
                 <a href={configData.LLM_CARD_LINK} target='_blank' >  <font size='4px' > {configData.LLM} </font> </a>
                
                  </Col>
                  </Row>
                  </Card.Text> */}
           
          </Card.Body>          
          </Card> 
          </Col>
      </Row>
        <Row className='bg-light rounded'   style={{paddingBottom: "25px", paddingTop:"0px"}} >              
        <Col md className='col-md-8 bg-light'>    
          <Form onSubmit={this.handleSubmit}  className=" align-items-end">    
          <Row>
            <Col md className='col-md-10'  >
              <Form.Group  controlId="formtext">           
                <Form.Control className='bg-light bg-gradient' autoComplete="off" 
                placeholder="Type your message here..."
                style={{backgroundColor:"lightgray", color: "GrayText"}}  as="input" 
                value={this.state.input} 
                onChange={e => this.setState({input: [e.target.value]})} />
              </Form.Group>
            </Col>
            <Col  className='col-md-1 ' >
            <Form.Group  controlId="submit">           
                <Button type='submit'  className='btn btn-light'  >
                 <Cursor /> 
                </Button>
              </Form.Group>
            </Col>
            <Col  className='col-md-1 text-left ' >
                <Form.Group  controlId="formButton">
                  <Button  className='btn btn-light  '  type="submit"  
                  onClick={this.ClearForm}> <Trash3 /></Button>
                </Form.Group> 
            </Col>           
          </Row>       
        </Form>
        </Col>
        <Col  className='col-md-4 clearfix ' ></Col>
        </Row> 
      </Container>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
      <Container className="p-3 mb-2 bg-white" style={{marginTop:"0px", height:"760px" }}>
      <Row>
      <Col md className='col-md-11' style={{"height":"25px", "paddingTop":"100px", "paddingLeft":"300px"}}> 
        <Alert variant='info' style={{"height": "500px", "width": "600px"}} textAlign= "center" > 
        <div style={{"textAlign": "center", "paddingTop": "50px", "fontSize":"30px" }} >{configData.TAGLINE}</div>  
            <div style={{"textAlign": "center", "paddingTop": "50px", "fontSize":"50px" }} > {configData.HEADING} </div>  
            <div style={{"textAlign": "center", "paddingTop": "50px", "fontSize":"15px" }} >{configData.SUBHEADING}</div>  
        </Alert> 
      </Col>
      </Row>
        </Container>        
         
      </UnauthenticatedTemplate>
      <Row className='bg-light rounded' >
        <Col md className='col-md-2 bg-white' style={{ paddingLeft:"0px", paddingTop:"0px"}}   >
          </Col>
        <Col md className='col-md-6 bg-white'  >
        {this.Footer()}
          </Col>
          <Col md className='col-md-4 bg-white'>
          </Col>
        </Row>
      </>
    </MsalProvider>
  );
} 
renderchatlog(){};
logincheck(){
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal(); 
  const handleLogout = () => {  
    const currentAccount = instance.getAccountByHomeId(instance.getActiveAccount().homeAccountId);
    instance.logoutRedirect({  account: currentAccount})
  };
  const handleLogin = () => {
      instance.loginRedirect({
        scopes: ["User.Read"]
      });
  }
  var username="";
  var country="";
  var ip="";
  const currentAccount = instance.getActiveAccount();
     if(currentAccount)
     {
        username = currentAccount.name;
        country  = currentAccount.idTokenClaims["tenant_ctry"];
        ip = currentAccount.idTokenClaims["ipaddr"]; 
        this.username = username;
     }
     
  return (   
     <Row>
      <Col md className='col-md-1' >    
   </Col>
   <Col md className='col-md-7 justify-content-start' style={{"paddingLeft":"0px", marginLeft:"0px"}}  >
   <Navbar>
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse >
        <AuthenticatedTemplate>
          <Navbar.Text className='small justify-content-start' style={{"color":"grey"}}>
          Country: {country}  &nbsp;&nbsp;  &nbsp;  IP: {ip}  &nbsp;&nbsp; &nbsp;  Local Time: <Clock format={'HH:mm:ss'} ticking={true} timezone={configData.TIME_ZONE} />
          </Navbar.Text>
        
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
          <Navbar.Text>
           
          </Navbar.Text>
          </UnauthenticatedTemplate>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </Col>
<Col md className='col-md-4' style={{ "paddingLeft":"60px"}}  >
      <Navbar>
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-start">
        <AuthenticatedTemplate>
          <Navbar.Text>
            Signed in as: {username}  <a href="#logout" onClick={handleLogout} >Logout</a>
          </Navbar.Text>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
          <Navbar.Text>
            <a href="#login" onClick={handleLogin} >Login</a>
          </Navbar.Text>
          </UnauthenticatedTemplate>
        </Navbar.Collapse>
      </Container>
    </Navbar>
   </Col>
</Row>
  );
}
setTokenLimit(v)
{  
  if(v <10)
   this.state.tokens_limit = (1*8000)/100;
   else
  this.state.tokens_limit = (v*2000)/100;
}

calculateCost(model_name,prompt_tokens, completion_tokens)
{  
  var cost =0;
  var completion_cost =0;
  var prompt_cost =0;
  var total_tokens =0;
  var total_tokens_cost =0;  
  if(model_name == "gpt-4-0314")
  {
      completion_cost = (completion_tokens/1000) * (0.06);
      prompt_cost = (prompt_tokens/1000) * (0.03);
      prompt_cost = Math.round((prompt_cost + Number.EPSILON) * 1000)/1000;
      completion_cost = Math.round((completion_cost + Number.EPSILON) * 1000)/1000;
      cost =completion_cost + prompt_cost;
 }
  else if(model_name == "gpt-3.5-turbo-0301")   { 
    total_tokens = (prompt_tokens + completion_tokens);
    total_tokens_cost = (total_tokens/1000) * (0.002);
    cost = Math.round((total_tokens_cost + Number.EPSILON) * 1000)/1000; 
}
this.state.cost = this.state.cost + cost;
this.state.model_name = model_name;
this.state.current_interaction_cost = cost;
this.state.prompt_tokens = prompt_tokens;
this.state.completion_tokens = completion_tokens;
this.state.total_tokens_consumed = this.state.total_tokens_consumed + (prompt_tokens + completion_tokens);
}
 TokenRange() {
  const [tokens_limit, setValue1 ] = useState(50);
  return (
          <Form.Range
            value={tokens_limit}
            onChange={(y) => {setValue1(Number(y.currentTarget.value)); 
              this.setTokenLimit(Number(y.currentTarget.value));}}
            tooltipPlacement='top'
            tooltip='on'
          />
  );
};
settempValue(v)
{  
  this.state.temprature = v;
  if(this.state.temprature == 0.1)
  {
    this.state.top_p= 1,
    this.state.frequency_penalty = 0,
    this.state.presence_penalty = 0
  }
 else  if(this.state.temprature == 0.85)
  {
    this.state.top_p= 1,
    this.state.frequency_penalty = 0,
    this.state.presence_penalty = 0
  }
}

setModelValue(v)
{
  this.state.model = v;
}
settopicValue(v)
{
  this.state.topic = v;
}
setspeech()
{
 if(this.state.audio_msg != '')
 {  
  this.state.mute = true;
  window.speechSynthesis.cancel();
 }
}

ConversationTopicButton() {
  const [topicradioValue, setTopicRadioValue] = useState(5);
  return (
    <>    
      <ButtonGroup>
        {this.state.topicradios.map((topicradio, idx) => (
          <ToggleButton  style={{width: "130px"}}
            key={idx}
            id={`topicradio-${idx}`}
            type="radio"            
            name="topicradio"
            value={topicradio.value}
            checked={topicradioValue === topicradio.value}
            onChange={(x) => {setTopicRadioValue(Number(x.currentTarget.value)); 
            this.settopicValue(Number(x.currentTarget.value)); this.resettopic()}}>
            {topicradio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
  }

 ConversationStyleButton() {
  const [radioValue, setRadioValue] = useState(0.7);
  return (
    <>    
      <ButtonGroup md>
        {this.state.radios.map((radio, idx) => (
          <ToggleButton md style={{width: "130px"}}
            key={idx}
            id={`radio-${idx}`}
            type="radio"           
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => {setRadioValue(Number(e.currentTarget.value)); 
            this.settempValue(Number(e.currentTarget.value))}}>
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}

DisplayContext(context) {
  const popover = (
    <Popover id="popover-basic" style={{ width:"800px"}}>     
      <Popover.Body style={{ width:"500px", backgroundColor:"white", 
            height:"400px", textAlign:"justify", overflow:"scroll", top: "0px", scrollBehavior:"revert-layer" }}>
        
       {htmlToReactParser.parse(context)}
      </Popover.Body>
    </Popover>
  );
  //console.log(context);
  if( context != undefined && context != '')
  {
    return(
      <>
          <OverlayTrigger trigger="click" placement="right" overlay={popover}>
            <Button variant='white' className="mr-xs" style={{height:"30px", border:"0px"}} > 
            <Book  /></Button>
          </OverlayTrigger>

      </>
    );
  }
}

DisplayThumbsUp(context) {
  if( context != undefined )
  {
  return (
    <>
    <Button variant='white'className="mr-xs" style={{height:"30px", border:"0px"}} > 
    <HandThumbsUp  fill='darkgreen'  /></Button>    
    </>
  );
  }
}

DisplayThumbsDown(context) {
  if( context != undefined )
  {
  return (
    <>
    <Button variant='white' className="mr-xs" style={{height:"30px", border:"0px"}} > 
    <HandThumbsDown fill='darkred'  /></Button> 
    </>
  );
  }
}

ModelNameButton() {
  const [radioValue, setModelName] = useState(1);  
  return (
      <>    
        <ButtonGroup md>
          {this.state.modelradios.map((radio, idx) => (        
            <ToggleButton md style={{width: "130px"}}
              key={idx}
              id={`mradio-${idx}`}
              type="radio"           
              name="mradio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => {setModelName(Number(e.currentTarget.value));   
              this.setModelValue(Number(e.currentTarget.value))}}>
              {radio.name}
            </ToggleButton>        
        ))}
      </ButtonGroup>
    </>
  );
}
Footer() {
  return (
    <Nav  as="ul">
      <Nav.Item as="li" className='small'>
        <Nav.Link href="/Support">Support</Nav.Link>
      </Nav.Item>   
      <Nav.Item as="li" className='small'>
        <Nav.Link href="/Support">About Us</Nav.Link>
      </Nav.Item>   
      <Nav.Item as="li" className='small' style={{paddingTop:"10px"}}>
          © 2023  All rights reserved.  
      </Nav.Item>         
    </Nav>    
  );
}
resettopic = (event) => {  
  this.setState({chatlog: [""], messages: [{"role": "", "content": ""}], 
  input: "",   
  response_received: false});
  event.preventDefault();   
}
ClearForm = (event) => {  
  this.setState({
    chatlog: [""], 
    messages: [{"role": "", "content": ""}],
    input: "", 
    total_tokens_consumed: 0, 
    prompt_tokens: 0,
    completion_tokens:  0,
    cost:0,
    model_name: "",
    response_received: false});
    event.preventDefault();   
}
handleSubmit = (event) => {
  if (!this.state.input[0])
  {
    event.preventDefault();       
    alert("Please enter a valid message");  
  }
   else{
    this.state.messages.push({"role": "user", "content": this.state.input[0]});
    this.state.chatlog.push("user: " + this.state.input[0] + "");   
    this.setState({input: ""});
   
    event.preventDefault();   
    this.sendPostRequest();
  }
};
sendPostRequest = async () => {   
  const currentAccount = this.state.msalInstance.getActiveAccount();
  let username = "";
  let country = "";
  let ip = "";
  let email = ""; 
  if(currentAccount)
  {
     username = currentAccount.name;
     country  = currentAccount.idTokenClaims["tenant_ctry"];
     ip = currentAccount.idTokenClaims["ipaddr"]; 
     email= currentAccount.username;
     this.username = username;
  }
  // iterarte through the messages and check if there are more than 14 messages then only keep the last 14 messages
  if(this.state.messages.length > 18)
  {
    this.state.messages.shift();
    this.state.messages.shift();
  }
 
  const promptvar = {
        messages: this.state.messages,
        input: this.state.input[0] + " |userprofile: username:" + username +
        ", country:" + country + ", ip:" + ip + ", email:" + email,
        temperature: this.state.temprature,
        topic: this.state.topic,
        top_p: this.state.top_p,    
        frequency_penalty: this.state.frequency_penalty,
        presence_penalty: this.state.presence_penalty,
        tokens_limit: this.state.tokens_limit,
        model_name: this.state.model
    };
    try { 
        this.state.Current_response ="Analyzing...";
        let temmp_arr = this.state.chatlog;
        temmp_arr.push("assistant: Analyzing..." );
        this.setState({chatlog: temmp_arr});
        //console.log(temmp_arr)
        //console.log(this.state.messages)
        const resp = await fetch(appConfigData.API_ENDPOINT + "/chat",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          messages: this.state.messages,
          input: this.state.input[0] + " |userprofile: username:" + username +
          ", country:" + country + ", ip:" + ip + ", email:" + email,
          temperature: this.state.temprature,
          topic: this.state.topic,
          top_p: this.state.top_p,    
          frequency_penalty: this.state.frequency_penalty,
          presence_penalty: this.state.presence_penalty,
          tokens_limit: this.state.tokens_limit,
          model_name: this.state.model
      })});          
        var output=""
        const reader = resp.body
        .pipeThrough(new TextDecoderStream())
        .getReader()
        this.state.Current_response =""
        //this.state.chatlog.push("assistant: Analyzing..." );    
      while (true) {
        const { value, done } = await reader.read()
       // console.log(value)
        if(value.includes("[DONE]"))
        {
          //console.log("output");
          console.log(value)
          if(output != "")
          {
            var completion_x="";
            if(output.includes('Source:'))
            {
              //console.log(output);
              completion_x = output.split('Source:')[0];
            }
            else
            {
              completion_x = output;
            }
            this.state.messages.push({"role": "assistant", "content": completion_x}); 
            break;           
          } 
        }
       // console.log(value)
       else
       {
       this.state.Current_response =  this.state.Current_response + value;
       output = output + value;
       //console.log(output)
       }       
       this.setState({response_received: true}); 
       //this.state.chatlog.push("assistant: Analyzing..." );
       
      }
     
           
      
      this.state.chatlog.pop();
            this.state.Current_response = output;
        let temmp_arr2 = this.state.chatlog;
        temmp_arr2.push("assistant: " + output  );
        this.setState({chatlog: temmp_arr2});
       // console.log(this.state.chatlog);
    } 
    catch (err) {
      // Handle Error Here
      console.error(err);
      //remove the Analyzing message
      this.state.chatlog.pop();
      this.state.chatlog.push("assistant:" +err) ;
      this.setState({response_received: true});
  }
   

};


async speak(message) {
  return new Promise((resolve, reject) => {
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(message);
    synth.speak(utterThis);
    utterThis.onend = resolve;
  });
}


sendWhisperPostRequest = async (y) => {   
  const currentAccount = this.state.msalInstance.getActiveAccount();
  let username = "";
  let country = "";
  let ip = "";
  let email = "";
  if(currentAccount)
  {
     username = currentAccount.name;
     country  = currentAccount.idTokenClaims["tenant_ctry"];
     ip = currentAccount.idTokenClaims["ipaddr"]; 
     email= currentAccount.username;
     this.username = username;
  }
  
try { 
 
    this.state.Current_response ="Analyzing...";
    let temmp_arr = this.state.chatlog;
    temmp_arr.push("assistant: Analyzing..." );
    this.setState({chatlog: temmp_arr});
    console.log(temmp_arr)
    console.log(this.state.messages)
    // console.log(this.state.input[0] + " |userprofile: username:" + username +
    // ", country:" + country + ", ip:" + ip + ", email:" + email);
    const resp = await fetch(appConfigData.API_ENDPOINT + "/chat",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      messages: this.state.messages,
      input: y + " |userprofile: username:" + username +
      ", country:" + country + ", ip:" + ip + ", email:" + email,
      temperature: this.state.temprature,
      topic: this.state.topic,
      top_p: this.state.top_p,    
      frequency_penalty: this.state.frequency_penalty,
      presence_penalty: this.state.presence_penalty,
      tokens_limit: this.state.tokens_limit,
      model_name: this.state.model
  })});          
  var output=""
  this.state.Current_response ="";
    const reader = resp.body
    .pipeThrough(new TextDecoderStream())
    .getReader()
   var count=0;





  // while (true) {
  //   const { value, done } = await reader.read()
  //   if (done) { break}
  //  this.state.Current_response =  this.state.Current_response + value;
  //   output = output + value;  
  //   this.setState({response_received: true});       
  // }
  // var completion_x="";
  // if(output != "")
  //     {     
       
  //       this.state.chatlog.pop();
  //       this.state.chatlog.push("assistant: " + output + "");   
  //       if(output.includes('Source:'))
  //       {         
  //         completion_x = output.split('Source:')[0];
  //       }
  //       else
  //       {
  //         completion_x = output;
  //       }
  //       this.state.messages.push({"role": "assistant", "content": completion_x}); 
  //     }
      
  //     let audio = new SpeechSynthesisUtterance(completion_x);
  //     window.speechSynthesis.speak(audio);
  //     return new Promise(resolve => {
  //       audio.onend = resolve;
  //     });
  //     audio=null;
  let user_lang = "engish";
  while (true) {
    const { value, done } = await reader.read()
   // console.log(value)
    if(value.includes("[DONE]"))
    {
      //console.log("output");
     
      user_lang = value.split("lang:")[1];
      console.log(user_lang)
      console.log(value)
      if(output != "")
      {
        var completion_x="";
        if(output.includes('Source:'))
        {
          //console.log(output);
          completion_x = output.split('Source:')[0];
        }
        else
        {
          completion_x = output;
        }
        //this.audio_msg.text = completion_x;
       
       // this.audio_msg.text = "";
        this.state.messages.push({"role": "assistant", "content": completion_x}); 
       // let audio = new SpeechSynthesisUtterance(completion_x);
       
        //window.speechSynthesis.speak(audio);
        
        break;           
      } 
    }
   // console.log(value)
   else
   {
   this.state.Current_response =  this.state.Current_response + value;
   output = output + value;
  

   this.state.mute =false; 
  
  //this.audio_msg.text= ""




   //console.log(output)
   this.setState({response_received: true}); 
   }       
  
   //this.state.chatlog.push("assistant: Analyzing..." );
   
  }
 // this.state.Current_response = completion_x;
 //this.audio_msg.text = this.state.Current_response;
//this.setState({input: ''});


  this.state.chatlog.pop();
  this.state.Current_response = output;
let temmp_arr2 = this.state.chatlog;
temmp_arr2.push("assistant: " + output  );
this.setState({chatlog: temmp_arr2});
//console.log(this.state.chatlog);
console.log("user lang:"+user_lang.toLowerCase())
const voices=window.speechSynthesis.getVoices();
    for(var i = 0; i < voices.length; i++ ) {
      if(voices[i].name.toLowerCase().includes(user_lang.toLowerCase()))
      {
//set the voice to hindi
          this.audio_msg.voice = voices[i];
      }
      console.log(voices[i].name);
    }
this.audio_msg.text = output;
console.log("audo:"+this.audio_msg.text)
window.speechSynthesis.speak(this.audio_msg)
  } 
  catch (err) {
    // Handle Error Here
    console.error(err);
   
    this.state.chatlog.push("assistant:" +err) ;
  this.setState({response_received: true});
}
};
setIsSelected = (value) => {
  this.setState({ isFilePicked: value });
};
setSelectedFile = (value) => {
  this.setState({ selectedFile: value });
};

FileUploadPage()
{
  const changeHandler = (event) => {
		this.setSelectedFile(event.target.files[0]);
		this.setIsSelected(true);
	};
  let username = "";
  let country = "";
  let ip = "";
  let email = "";
  
  const currentAccount = this.state.msalInstance.getActiveAccount();
     if(currentAccount)
     {
        username = currentAccount.name;
        country  = currentAccount.idTokenClaims["tenant_ctry"];
        ip = currentAccount.idTokenClaims["ipaddr"]; 
        this.username = username;
     }
     
  const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));  
  const handleSubmission = () => {
	const formData = new FormData();
  formData.append('file',this.state.selectedFile);
  
  console.log(this.state.selectedFile);
  if(this.state.selectedFile.name != null && this.state.selectedFile.name != undefined) 
  {
  if( this.state.selectedFile.name.includes(".txt") 
  || this.state.selectedFile.name.includes(".pdf") 
  || this.state.selectedFile.name.includes(".py")
  || this.state.selectedFile.name.includes(".java")
  || this.state.selectedFile.name.includes(".js")
  || this.state.selectedFile.name.includes(".html")
  || this.state.selectedFile.name.includes(".cs")
  || this.state.selectedFile.name.includes(".csv")
  || this.state.selectedFile.name.includes(".xlsx")
  || this.state.selectedFile.name.includes(".pptx")
  || this.state.selectedFile.name.includes(".docx"))   
  {
      this.setState({result_msg: "<font color='blue' size='8px' ><b> Please wait - updating knowledge...</b></font>"});
      fetch( appConfigData.API_ENDPOINT + "/upload?username="+this.username,{method: 'POST',body: formData})
      .then((response) => response.json()).then((result) => { 
                  this.GetVectorsCount();
                  this.setState({result_msg: "<font color='green' size='8px'><b> Success - you can me questions now! </b></font>"});
                  //console.log('Success:', result);
                  sleep(2000).then(() => {
                    this.setState({result_msg:''});
                  });
                  
                  this.setSelectedFile("");                  
		              this.setIsSelected(false);
               
      })
      .catch((error) => {
        this.setSelectedFile("");                  
        this.setIsSelected(false);
 
                  this.setState({result_msg: "<font color='red' size='8px' > <b>Sorry - failed to update. Please try again! </b></font>"});
                  console.error('Error:', error);
      });
  }
  else
  {
    this.setState({result_msg: "<font color='red' size='8px' >Supported File Types:<font color='red' size='5px' ><br><b>.txt,.pdf,.docx,.pptx,xlsx,.py,.java,.js,.html,.cs,.csv </b></font>.<br> Any other file types will be ignored in this version.</font>"});
    this.setSelectedFile("");                  
    this.setIsSelected(false);
    sleep(5000).then(() => {
      this.setState({result_msg:''});
    });
  }
} 
else
{
  this.setState({result_msg: "<font color='red' size='8px' ><b>Sorry - please select a file!</b></font>"});
  this.setSelectedFile("");                  
  this.setIsSelected(false);
  sleep(2000).then(() => {  
    this.setState({result_msg:''});
  });
}
 
    };
 // }
 // else
 // {

  //}
  return(
      <div>
                  <input type="file" name="file"  onChange={changeHandler} /> &nbsp; <Button onClick={handleSubmission}> <DatabaseAdd/>Add</Button>  
                  <br></br>  <br></br>     
                  {htmlToReactParser.parse(this.state.result_msg)}
      </div>        
     );
}  


GetVectorsInfo()
{
  const handleSubmission = () => {				
    let username = "";
    const currentAccount = this.state.msalInstance.getActiveAccount();
       if(currentAccount)
       {
          username = currentAccount.name;
          this.username = username;
       }
       
		fetch(
			appConfigData.API_ENDPOINT + "/vectors?username="+this.username,
			{
				method: 'Get'
			}
		)
			.then((response) => response.json())
			.then((result) => {        
        this.setState({vector_count: result});
				//console.log('Success:', result);
			})
			.catch((error) => {
      
				console.error('Error:', error);
			});
      
	};
	
	return(
    <Fragment >
      <div>
        <Button variant='success'  onClick={handleSubmission}>   Refresh</Button> &nbsp;&nbsp; 
        </div>
    </Fragment>
   
)

    
}

GetVectorsCount()
{
  let username = "";
  const currentAccount = this.state.msalInstance.getActiveAccount();
     if(currentAccount)
     {
        username = currentAccount.name;
        this.username = username;
     }
     
		fetch(
			appConfigData.API_ENDPOINT + "/vectors?username="+this.username,
			{
				method: 'Get'
			}
		).then((response) => response.json())
		.then((result) => {        
        this.setState({vector_count: result});
        return result;
			})
			.catch((error) => {      
				console.error('Error:', error);
			});	
}


ClearMemory(){
  const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));
  let username = "";
  const currentAccount = this.state.msalInstance.getActiveAccount();
     if(currentAccount)
     {
        username = currentAccount.name;
        this.username = username;
     }
     
  const handleSubmission = () => {
		const formData = new FormData();
		
  this.setState({memory_result_msg: "<font color='blue'><b>Please wait - erasing  memory...</b></font>"});
		fetch(
			appConfigData.API_ENDPOINT + "/clearmemory?username="+this.username,
			{
				method: 'POST'
			}
		)
			.then((response) => response.json())
			.then((result) => {     
        this.GetVectorsCount()   
        this.setState({memory_result_msg: "<font color='green'><b>Knowledge erased succefully!</b></font>"});
				//console.log('Success:', result);
       
        sleep(2000).then(() => {
          this.setState({memory_result_msg:''});
        });
			})
			.catch((error) => {
        this.setState({memory_result_msg: "<font color='red'><b>Failed to erase knowledege!</b></font>"});
				console.error('Error:', error);
			});
     
	};
	
	return(
    <Fragment >
      <div>
        <Button variant='danger'  onClick={handleSubmission}><DatabaseDash/>  &nbsp;&nbsp; Delete Knowledge</Button> &nbsp;&nbsp;  
        <br></br>  <br></br> 
        {htmlToReactParser.parse(this.state.memory_result_msg)}     
        
      
        </div>
       
       
    </Fragment>
   
)
}


record = async () => {
  try{
  

        this.setState({ isLoading: true });
        let y=""
          if (this.state.isRecording) {            
            const blob = await this.recorder.stopRecording();   
            console.log("finished recording... ");
            const url = appConfigData.API_ENDPOINT + "/whisper";
            const formData = new FormData();
            formData.append('file',blob, 'audio.mp3');   
          const x = await axios.post(url, formData,{}).then(res => { // then print response status   
          y= res.data.text;
          this.setState({ recordbuttonstyle: 'recordstartbutton' });
          });        
          this.setState({
              isLoading: false,
              isRecording: false,
              recording: URL.createObjectURL(blob),
              input: y
          });
            
            this.state.messages.push({"role": "user", "content": y});
            this.state.chatlog.push("user: " + y + "");
            //this.state.chatlog.push("assistant: Analyzing..." );
            this.audio_msg.text=  "Analyzing...";
            this.setState({input: ''});
            await this.sendWhisperPostRequest(y);
          } else {
            try {
              await this.recorder.initAudio();
              await this.recorder.initWorker();
              this.recorder.startRecording();
              this.setState({ recordbuttonstyle: 'recordstopbutton' });
              this.setState({ isLoading: false, isRecording: true });
            } catch (e) {
              console.error(e);
              this.setState({ isLoading: false });
            }
          }
}
catch(err){
  console.log(err);
  //remove the Analyzing message
  this.state.chatlog.pop();
  this.state.chatlog.push("assistant:" +err) ;
this.setState({response_received: true});
this.setState({ isLoading: false,  isRecording: false});
}
};


play = async (para) => 
{
 var i=0;
  var sentences = para.split('\n');

  for (i = 0; i < sentences.length; i++) {
    await this.getNextAudio(sentences[i]);
  }
}

getNextAudio = async(sentence)  =>{
  console.log(sentence);
  let audio = new SpeechSynthesisUtterance(sentence);
  window.speechSynthesis.speak(audio);

  return new Promise(resolve => {
    audio.onend = resolve;
  });
  } 


renderAudiowidget() {
  const { isLoading, isRecording, recordings } = this.state;
  
  return (
    <>
      <button disabled={isLoading} onClick={this.record}>
        {isRecording ? "Stop" : "Record"}
      </button>
     
            <audio src={this.state.recording} controls />
          
    </>
  );
}
};
export default App;
