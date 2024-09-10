

import React, {Component, useState, useRef} from 'react';
import axios from "axios";
import Avatar from "react-avatar";
import 'rsuite/dist/rsuite.min.css'; // or 'rsuite/dist/rsuite.min.css'
import vmsg from "vmsg";
import AutoScrollDiv from './autoscrolldiv';
import ReactPlayer from 'react-player/youtube';
import { ArrowRight, Mic, MicFill, MicMuteFill,Trash3Fill,  CurrencyDollar, Trash3, CursorFill, chat, Cursor, Chat} from 'react-bootstrap-icons';
import Speech from 'react-speech';
import { COLOR } from 'rsuite/esm/utils/constants';
import { Container, Row, Col, Overlay, Popover,  Image,Button,Badge,ToggleButton,ButtonGroup, Alert,Card,Form, FormGroup , FormLabel} from 'react-bootstrap';
import { render } from 'react-dom';
import ReactMarkdown from 'react-markdown'

const audio_msg = new SpeechSynthesisUtterance();

const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;


const htmlToReactParser = new HtmlToReactParser();



const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
});
class App extends Component { 
  constructor(props) {  
    super(props);
    this.state = {
      chatlog: [""],
      messages: [{"role": "system", "content": ""}],
      input: "",
      prompt_tokens: 0,
      completion_tokens:  0,
      current_interaction_cost:0,
      total_tokens_consumed: 0,
      cost:0,
      model_name: "<model_name>",
      response_received: false,
      temprature: 0.7,
      top_p: 0.2,
      tokens_limit:(0.3*6000),
     frequency_penalty: 1,
      presence_penalty: 1,
      isLoading: false,
    isRecording: false,
    recording: "",
    recordbuttonstyle: "recordstartbutton",
    imageurl: "",   
    topic: 5,   
    mute: true, 
     radios : [
      { name: 'Strict', value: 0.2 },
      { name: 'Hybrid', value: 0.7 },
      
    ],
    topicradios : [
      { name: 'Requirements', value: 3 },
      { name: 'Technical', value: 4 },
      { name: 'All', value: 5},
    ],
    //https://th.bing.com/th/id/OIP.j9K2AST68Tc9Lb3Fd4N-_QHaHa?pid=ImgDet&rs=1
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderchatlog = this.renderchatlog.bind(this);
    this.ClearForm = this.ClearForm.bind(this);
    this.resettopic = this.resettopic.bind(this);
    this.record = this.record.bind(this);
    this.renderAudiowidget =  this.renderAudiowidget.bind(this);
    this.sendWhisperPostRequest = this.sendWhisperPostRequest.bind(this);
    this.ConversationStyleButton = this.ConversationStyleButton.bind(this); 
    this.ConversationTopicButton = this.ConversationTopicButton.bind(this); 
    this.setspeech = this.setspeech.bind(this);
    this.setOverLayHelp = this.setOverLayHelp.bind(this);
    this.TokenRange = this.TokenRange.bind(this);
    this.calculateCost = this.calculateCost.bind(this);
   
  }
  

  render(){ 
  
  return (  
    <>
 
    <Container className="p-3 mb-2 bg-white" style={{marginTop:"0px", height:"780px" }} > 
      <Row>
        <Col md className='col-md-4 align-text-top' style={{ paddingTop: "0px", marginTop: "0px"}}>
           <Image  className='align-text-top' style={{width:"180px", height:"100px",paddingTop: "0px", marginTop: "0px"}}
           src="https://www.gblabs.com/images/module_images/Partners/Seagate-logo-trans.png"></Image> 
          {/*   <Image  className='align-text-top' style={{width:"180px", height:"100px",paddingTop: "0px", marginTop: "0px"}}
           src= "https://logos-world.net/wp-content/uploads/2021/03/Expedia-Logo-700x394.png"></Image>  */}
          
           </Col>
        <Col md className='col-md-8 align-text-middle' style={{ paddingTop: "20px", marginTop: "0px"}} > 
        {/* <h1>Seagate Lyve CoPilot </h1> */}
        <h1> Lyve Mobile CoPilot </h1></Col>
     
      </Row>
      <Row >
        <Col md className='col-md-8 bg-light bg-gradient text-dark rounded-top border-right-0' 
        style={ { height: "660px", paddingTop:"10px"} }  >
        <AutoScrollDiv  > 
          {this.state.chatlog.map((chat,i) => {
            if(chat.includes("user:")){
            return <>         
              <div style={{whiteSpace: 'pre-line', color: "GrayText"}} key={i}>
              <Alert variant='light'><Avatar size="30"key={i+2} name="User"  round /> 
              {chat.split("user:")[1]} </Alert> </div>
          </>
            }
            else if(chat.includes("assistant:")){              
              return <>          
              <div style={{whiteSpace: 'pre-line', color: "GrayText"}} key={i+5}>                
                &nbsp;<Alert variant='info'><Avatar size="30" key={i+1} facebook-id="invalidfacebookusername" 
                src="https://s.gravatar.com/avatar/6c0384c38e447d71bb90be92e7d13a79?s=80" /> 
               { htmlToReactParser.parse(chat.split("assistant:")[1])} 
                {/*  <ReactMarkdown className='reactMarkDown' >{chat.split("assistant:")[1]}</ReactMarkdown>  */}
                </Alert>
                </div>
             {this.state.mute =false} 
            {window.speechSynthesis.speak(audio_msg)}
            {audio_msg.text= ""}
              </>      
          }
          else if(chat.includes("dall-e:")){              
            return <>          
            <div style={{whiteSpace: 'pre-line',color: "GrayText"}} key={i+5}>
              <Avatar size="30" key={i+1} facebook-id="invalidfacebookusername" 
              src="https://s.gravatar.com/avatar/6c0384c38e447d71bb90be92e7d13a79?s=80" />              
             <br/>
              <img src= {chat.split("dall-e:")[1] } key={i+10} />
              </div>
            <br key={i+4}/>     
          {audio_msg.text = ""}
          {this.setState({mute: false})}
            </>      
        }
          })}
        </AutoScrollDiv> 
         </Col>
        <Col md className='col-md-4 bg-light bg-gradient rounded-top '  style={ {paddingTop:"5px"} }> 
        
          <Card>
          <Card.Body className='card bg-secondary text-light bg-gradient mb4' style={{height:'650px',   borderWidth: "0px", borderBlockStyle:"none", paddingTop:"5px"}}>
            <Card.Title style={{textAlign: "center"}}> Conversation Settings</Card.Title>
            <br></br>
            <Card.Text>
            <Card.Subtitle> Knowledge Base: </Card.Subtitle>
            <br></br>
              
              {<this.ConversationTopicButton />}
      
      </Card.Text>
    <br></br>
    
            <Card.Text width="100%">
              <Card.Subtitle>  Style: </Card.Subtitle>
              <br></br>
              {<this.ConversationStyleButton />}
      </Card.Text>
      <br></br>
     
            <Card.Text>
            <Card.Subtitle> Response Length:  </Card.Subtitle>
            <br></br>
              <Row>
              <Col md className='col-md-2' >
                short
              </Col>
                <Col md className='col-md-6' >            
              <p> {<this.TokenRange />}</p>
              </Col>
              <Col md className='col-md-2' >long
              </Col>
              </Row>
            </Card.Text>
            <Card.Text>
          
            <br></br>
            <Card.Subtitle>  Audio:  </Card.Subtitle>
            <br></br>
                       
              <Row>       
             
                  <Col md className='col-md-2  rounded' >                  
                 <Button className="btn btn-success" disabled={this.state.isLoading} onClick={this.record}> 
                 <Mic />{this.state.isRecording ? "Stop" : "Speak"}
                  </Button> 
                    </Col>
                    <Col md className='col-md-2'style={{paddingLeft:"30px"}} >
                      <Button className='btn btn-danger' id='btnmute' sz="sm" disabled={this.state.mute} onClick={() => this.setspeech()}>
                        <MicMuteFill /> Mute </Button>
                      </Col>  
                </Row>
                  <audio src={this.state.recording} hidden="true" controls="controls" /> 
             
            </Card.Text>
            <br></br>
           
            <Card.Text>
              <Card.Subtitle>  Usage:  </Card.Subtitle>
              <br></br>
              <Row>
              <Col md className='col-md-6' >               
                  Total Tokens: {this.state.total_tokens_consumed}
              </Col>
              <Col md className='col-md-6' >             
                  Total Cost:  <CurrencyDollar /> {this.state.cost}
              </Col>
              </Row>
            </Card.Text>
          </Card.Body>          
          </Card> 
         
          </Col>
      </Row>
     
        <Row className='bg-light rounded'   style={{paddingBottom: "10px"}} >              
        <Col md className='col-md-8 bg-light'  >    
          <Form onSubmit={this.handleSubmit}  className=" align-items-end">    
          <Row>   
            <Col md className='col-md-10'  >
              <Form.Group  controlId="formtext">           
                <Form.Control className='bg-light bg-gradient' autoComplete="off" placeholder="Type your message here..."
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
      
    </>
  );
} 

  renderchatlog(){
 
};

setTokenLimit(v)
{ 
  if(v <10)
   this.state.tokens_limit = (1*8000)/100;
   else
  this.state.tokens_limit = (v*6000)/100;

  //alert((this.state.tokens_limit * 2000)/100)
}

calculateCost(model_name,prompt_tokens, completion_tokens)
{
  
  var cost =0;
  var completion_cost =0;
  var prompt_cost =0;

  //alert(model_name);
  
  if(model_name == "gpt-4-0314")
  {
      completion_cost = (completion_tokens/1000) * (0.06);
      prompt_cost = (prompt_tokens/1000) * (0.03);
      prompt_cost = Math.round((prompt_cost + Number.EPSILON) * 1000)/1000;
      completion_cost = Math.round((completion_cost + Number.EPSILON) * 1000)/1000;
      cost =completion_cost + prompt_cost;
 }
  else if(model_name == "gpt-3.5-turbo")   { 
    total_tokens = (prompt_tokens + completion_tokens);
    total_tokens_cost = (total_tokens/1000) * (0.002);
    cost = Math.round((total_tokens_cost + Number.EPSILON) * 100)/100; 

}
this.state.cost = this.state.cost + cost;
this.state.model_name = model_name;
this.state.current_interaction_cost = cost;
this.state.prompt_tokens = prompt_tokens;
this.state.completion_tokens = completion_tokens;
this.state.total_tokens_consumed = this.state.total_tokens_consumed + (prompt_tokens + completion_tokens);
/* alert(prompt_cost);
alert(completion_cost);
alert(this.state.cost); */

}

 TokenRange() {

  const [tokens_limit, setValue1 ] = useState(60);


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
  if(this.state.temprature == 0.2)
  {
    this.state.top_p= 0.5,
    this.state.frequency_penalty = 0.5,
    this.state.presence_penalty = 0.5
    }

 else  if(this.state.temprature == 0.7)
  {
    this.state.top_p= 1,
    this.state.frequency_penalty = 0.5,
    this.state.presence_penalty = 0.5
    }
    
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
setOverLayHelp()
{
 
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
  
    const handleClick = (event) => {
      setShow(!show);
      setTarget(event.target);
    };
  
    return (
      <div ref={ref}>
        <Button className='btn btn-success rounded' onClick={handleClick}><Chat />  Lyve Oracle</Button>  
        <Overlay
          show={show}
          target={target}
          placement="bottom"
          container={ref}
          containerPadding={20}
        >
          <Popover id="popover-contained">
           
            <Popover.Body>
            Hello! I am your co-pilot for Seagate Lyve Services. I am here to help you with any questions you may have about Lyve Mobile and Lyve Cloud products, project requirements, architecture, and the analysis of Seagate business. With my wisdom and insight, I will be able to provide you with the best possible advice and assistance. I am also here to offer you a compassionate ear and some lighthearted humor when you need it. Let me be your guide and mentor as we explore the world of Seagate Lyve Services.
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    );
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
            onChange={(e) => {setRadioValue(Number(e.currentTarget.value)); this.settempValue(Number(e.currentTarget.value))}}>
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
}

resettopic = (event) => {
  
  this.setState({chatlog: [""], messages: [{"role": "system", "content": "You are a helpful assistant."}], input: "",   
  response_received: false});
  event.preventDefault();   
}

ClearForm = (event) => {
  
  this.setState({chatlog: [""], messages: [{"role": "system", "content": "You are a helpful assistant."}], input: "", total_tokens_consumed: 0, 
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
  //this.setState({chatlog: 'Processing...'});  
  this.state.messages.push({"role": "user", "content": this.state.input[0]});
  this.state.chatlog.push("user: " + this.state.input[0] + "");
  this.state.chatlog.push("assistant: Analyzing..." );  
  
  this.setState({input: ""});
  event.preventDefault();   
   this.sendPostRequest();
  }
};
sendPostRequest = async () => {   
    const promptvar = {
      messages: this.state.messages,
      input: this.state.input[0],
      temperature: this.state.temprature,
    topic: this.state.topic,
    top_p: this.state.top_p,    
    frequency_penalty: this.state.frequency_penalty,
    presence_penalty: this.state.presence_penalty,
    tokens_limit: this.state.tokens_limit,
    };
    try {   
        console.log(this.state.chatlog);    
        const resp = await axios.post("https://api-ssingh.ngrok.io/chat", promptvar); 
        if(!(resp.data.hasOwnProperty('flagged'))){         
        //this.setState({chatlog: resp.data.choices[0].message.content});
        this.state.messages.push({"role": "assistant", "content": resp.data.choices[0].message.content});
        this.state.chatlog.pop();
        if(resp.data.choices[0].message.role.includes("dall-e:")){
          this.setState({model_name: resp.data.model});
          this.state.chatlog.push("dall-e:" + resp.data.choices[0].message.content.split("imageurl:")[1] + "");
      
        }
        else{           
          this.state.chatlog.push("assistant: " + resp.data.choices[0].message.content + "");
       
          //this.setState({prompt_tokens: resp.data.usage.prompt_tokens});
          //this.setState({completion_tokens: resp.data.usage.completion_tokens});
          this.calculateCost( resp.data.model,resp.data.usage.prompt_tokens,resp.data.usage.completion_tokens);
          }
       
        this.setState({response_received: true});
        this.state.messages.shift();
        this.state.messages.shift();
        }
        else{
          this.state.chatlog.push("assistant: your message was flagged as inappropriate. Please try again!") ;
          this.setState({response_received: true});
          
        }
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

sendWhisperPostRequest = async (y) => {   
  const promptvar = {
    messages: this.state.messages,
    input: y,
    temperature: this.state.temprature,
    topic: this.state.topic,
    top_p: this.state.top_p,    
    frequency_penalty: this.state.frequency_penalty,
    presence_penalty: this.state.presence_penalty,
    tokens_limit: this.state.tokens_limit
  };
  try {   
    
      const resp = await axios.post("https://api-ssingh.ngrok.io/chat", promptvar); 
      if(!(resp.data.hasOwnProperty('flagged'))){         
      //this.setState({chatlog: resp.data.choices[0].message.content});
    //  this.state.messages.push({"role": "assistant", "content": resp.data.choices[0].message.content});
      this.state.chatlog.pop();
      if(resp.data.choices[0].message.role.includes("dall-e:")){
        this.setState({model_name: resp.data.model});
        this.state.chatlog.push("dall-e:" + resp.data.choices[0].message.content.split("imageurl:")[1] + "");
        }
        else{
          audio_msg.text = resp.data.choices[0].message.content ;
        this.state.chatlog.push("assistant: " + resp.data.choices[0].message.content + "");
        this.setState({model_name: resp.data.model});
        this.setState({prompt_tokens: resp.data.usage.prompt_tokens});
        this.setState({completion_tokens: resp.data.usage.completion_tokens});
          
        
        }
     
      this.setState({response_received: true});
      this.state.messages.shift();
      this.state.messages.shift();
      
    
      
      }
      else{
        this.state.chatlog.push("assistant: your message was flagged as inappropriate. Please try again!") ;
        this.setState({response_received: true});
      }
  } 
  catch (err) {
    // Handle Error Here
    console.error(err);
   
    this.state.chatlog.push("assistant:" +err) ;
  this.setState({response_received: true});
}
};


record = async () => {
  try{
          this.setState({ isLoading: true });
        var y=""
          if (this.state.isRecording) {
            
            const blob = await recorder.stopRecording();   
            const url = 'https://api-ssingh.ngrok.io/whisper';
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
            this.state.chatlog.push("assistant: Analyzing..." );
            audio_msg.text=  "Analyzing...";
            this.setState({input: ''});
            const chat = await this.sendWhisperPostRequest(y);
          } else {
            try {
              await recorder.initAudio();
              await recorder.initWorker();
              recorder.startRecording();
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
