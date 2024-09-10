import React, {
  Component,
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import axios from "axios";
import Avatar from "react-avatar";
import "rsuite/dist/rsuite.min.css"; // or 'rsuite/dist/rsuite.min.css'
import vmsg from "vmsg";
import AutoScrollDiv from "./autoscrolldiv";
import ReactPlayer from "react-player/youtube";
import {
  ArrowRight,
  Mic,
  MicFill,
  MicMuteFill,
  Trash3Fill,
  CheckLg,
  CurrencyDollar,
  Trash3,
  CursorFill,
  chat,
  Cursor,
  Chat,
  Book,
  DatabaseAdd,
  DatabaseDash,
  HandThumbsUp,
  HandThumbsDown,
  Eyeglasses,
  Gear,
  InfoCircle,
  PlusLg,
  PersonFill,
  StopFill,
  VolumeMute,
  Link45deg,
  ArrowClockwise,
} from "react-bootstrap-icons";
import Speech from "react-speech";
import { COLOR } from "rsuite/esm/utils/constants";
import {
  Container,
  Row,
  Col,
  Overlay,
  Close,
  Popover,
  OverlayTrigger,
  Tooltip,
  Image,
  Button,
  Badge,
  ToggleButton,
  ButtonGroup,
  Alert,
  Card,
  Form,
  FormGroup,
  FormLabel,
  Dropdown,
  Modal,
  Spinner,
} from "react-bootstrap";
import { render } from "react-dom";
import ReactMarkdown from "react-markdown";
import configData from "./whitelabel.json";
import appConfigData from "./appconfig.json";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useStream } from "react-fetch-streams";
import { MsalProvider } from "@azure/msal-react";
import Plot from "react-plotly.js";
import * as CanvasJS from "@canvasjs/charts";
import Clock from "react-live-clock";
import { Link } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
} from "@azure/msal-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FaRegCopy } from "react-icons/fa";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import HighlightSearch from "./HighlightSearch";
import rehypeRaw from "rehype-raw";

//const audio_msg = new SpeechSynthesisUtterance();
const ReactDOMServer = require("react-dom/server");
const HtmlToReactParser = require("html-to-react").Parser;
const htmlToReactParser = new HtmlToReactParser();
<script
  type="text/javascript"
  src="https://unpkg.com/react-fetch-streams/dist/index.min.js"
></script>;
// const recorder = new vmsg.Recorder({
//   wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
// });

class App extends Component {
  audio;
  audio_msg;
  recorder;
  dataFetched = false; //flag to check if app setting's data is fetched from the server
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      msalInstance: props.msalInstance,
      jsonConfData: props.jsonConfData, //state to store the configuration data
      isVectorLoading: true, //flag to check if vector count is fetched from the server
      showKnowSettings: false, //flag to show/hide knowledge settings
      isShowContainer: false, //flag to show/hide the container
      username: "",
      value: "",
      chatlog: [""],
      chatlogMetadata: [""],
      Current_response: "",
      messages: [{ role: "", content: "" }],
      input: "",
      prompt_tokens: 0,
      completion_tokens: 0,
      current_interaction_cost: 0,
      total_tokens_consumed: 0,
      cost: 0,
      IsVectorInfoTrig: true,
      vector_count: 0,
      vector_count_error: "",
      model_name: "<model_name>",
      response_received: false,
      temprature: 0.85,
      top_p: 0.2,
      tokens_limit: 1000,
      frequency_penalty: 1,
      presence_penalty: 1,
      isLoading: false,
      isRecording: false,
      result_msg: "",
      memory_result_msg: "",
      recording: "",
      isFilePicked: false,
      selectedFile: "",
      recordbuttonstyle: "recordstartbutton",
      imageurl: "",
      topic: 5,
      mute: true,
      model: 2,
      radios: [
        { name: "Precise", value: 0.2 },
        { name: "Balanced", value: 0.7 },
      ],
      topicradios: [
        { name: "Requirements", value: 3 },
        { name: "Technical", value: 4 },
        { name: "All", value: 5 },
      ],
      modelradios: [
        { name: "Standard", value: 1 },
        { name: "Advanced", value: 2 },
      ],
      fileName: "",
    };
    this.recorder = new vmsg.Recorder({
      wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.play = this.play.bind(this);
    this.getNextAudio = this.getNextAudio.bind(this);
    this.renderchatlog = this.renderchatlog.bind(this);
    this.ClearForm = this.ClearForm.bind(this);
    this.resettopic = this.resettopic.bind(this);
    this.record = this.record.bind(this);
    this.speak = this.speak.bind(this);
    this.renderAudiowidget = this.renderAudiowidget.bind(this);
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
    this.audio = window.speechSynthesis;
    this.audio_msg = new SpeechSynthesisUtterance();
  }
  //  componentDidMount() {
  //   window.addEventListener('scroll', this.handleScroll);
  //   }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  render() {
    const jsonConfData =
      this.state.jsonConfData !== "" ? JSON.parse(this.state.jsonConfData) : "";
    console.log("Configuration Data: " + JSON.stringify(jsonConfData)); // Logs the content of the JSON file
    return (
      <MsalProvider instance={this.state.msalInstance}>
        <>
          <this.logincheck />
          <AuthenticatedTemplate>
            {this.state.isShowContainer && (
              <Container fluid="true">
                <Row className=" m-0 p-0">
                  <Col
                    md="3"
                    // style={{
                    //   display: this.state.knowledgeSetting ? "none" : "block",
                    // }}
                  >
                    <div
                      md
                      className="rounded-top responsive-col order-1 order-md-2 fixed-bottom-col hide-show show"
                    >
                      <div style={{ position: "relative" }}>
                        <div
                          onClick={() =>
                            this.setState({
                              showKnowSettings: !this.state.showKnowSettings,
                            })
                          }
                          className="mobile-only"
                        >
                          &times;
                        </div>
                        <div>
                          <Row>
                            <Col></Col>
                            <Col md="auto">
                              {/* <div className="SettingsCircle">
                              <XLg
                                // onClick={this.updateKnowledgeSetting}
                                style={{ color: "#fff" }}
                              />
                            </div> */}
                            </Col>
                          </Row>
                        </div>

                        <Card className="bg-base">
                          <Card.Body
                            className="p-1 pb-0"
                            style={{
                              borderWidth: "0px",
                              borderBlockStyle: "none",
                              color: configData.THEME_COLORS.FONT_COLOR,
                            }}
                          >
                            <Row className="mb-3">
                              <Col>
                                <div className="sectionTitle">
                                  Knowledge Settings
                                </div>
                              </Col>
                              <Col md="auto">
                                {" "}
                                <this.GetVectorsInfo />
                              </Col>
                            </Row>
                            <div className="innerCard">
                              <Row>
                                <Col>
                                  <div className="innerSectionTitle">
                                    Current Knowledge
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  xs={12}
                                  md={9}
                                  className="mb-3 mb-md-0"
                                  style={{ lineHeight: "2.1rem" }}
                                >
                                  <span className="GrayText">
                                    Vector Count:{" "}
                                    {this.state.isVectorLoading ? (
                                      <Spinner animation="border" size="sm" />
                                    ) : this.state.vector_count_error !== "" ? (
                                      this.state.vector_count_error
                                    ) : (
                                      this.state.vector_count
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </div>

                            <div className="innerCard">
                              <div className="innerSectionTitle">
                                Add Knowledge
                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={
                                    <Tooltip id="file-types-tooltip">
                                      pdf, doc, csv files are allowed
                                    </Tooltip>
                                  }
                                >
                                  <InfoCircle className="ms-2" />
                                </OverlayTrigger>
                              </div>
                              <Card.Text>
                                <Row className="">
                                  <Col xs={12}>
                                    <this.FileUploadPage />
                                  </Col>
                                </Row>
                              </Card.Text>
                            </div>
                            <div className="innerCard">
                              <div className="innerSectionTitle">
                                Clear Knowledge
                              </div>
                              <Card.Text>
                                <Row>
                                  <Col xs={12}>
                                    <this.ClearMemory />
                                  </Col>
                                </Row>
                              </Card.Text>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                    <div className="orgWrap mt-3 ">
                      <Row className="rowFit">
                        <Col
                          md="12"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            disply: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {jsonConfData.leftImg != "" &&
                            jsonConfData.leftImg != null && (
                              <Image
                                className="align-text-top"
                                style={{
                                  width: configData.ORG_LOGO_WIDTH,
                                  height: configData.ORG_LOGO_HEIGHT,
                                  paddingTop: "0px",
                                  marginTop: "0px",
                                }}
                                src={jsonConfData.leftImg}
                              ></Image>
                            )}
                          <h1>{jsonConfData.headingTxt} </h1>
                          <div className="orgSubhead">
                            {jsonConfData.subheadingTxt}
                          </div>
                        </Col>

                        {/* <Col md="12">
                          <div className="d-flex align-items-center orgSection">
                            <div className="flex-shrink-0">
                              <Image
                                src={configData.SNOWFLAKE_AGENT_LOGO_URL}
                                width="120px"
                                alt="..."
                              />
                            </div>
                            <div className="flex-grow-1 ms-3 text-start">
                              <h3>Snowflake</h3>
                              <div>This is some content from a test</div>
                            </div>
                          </div>
                        </Col>
                        <Col md="12">
                          <div className="d-flex align-items-center orgSection">
                            <div className="flex-shrink-0">
                              <Image
                                src={configData.SNOWFLAKE_AGENT_LOGO_URL}
                                width="120px"
                                alt="..."
                              />
                            </div>
                            <div className="flex-grow-1 ms-3 text-start">
                              <h3>Snowflake</h3>
                              <div>This is some content from a test</div>
                            </div>
                          </div>
                        </Col> */}

                        {/* <Col
                        md="auto"
                        style={{
                          paddingTop: "0px",
                          marginTop: "0px",
                          alignSelf: "flex-start",
                        }}
                      >
                        <Image
                          src={configData.SECONDARY_LOGO_URL}
                          style={{
                            height: "80px",
                            paddingTop: "0px",
                            marginTop: "0px",
                            marginLeft: "20px",
                          }}
                        ></Image>
                      </Col> */}
                      </Row>
                      <Row></Row>
                    </div>
                  </Col>
                  <Col>
                    <div
                      className="chatBg radiusCustom p-0"
                      style={{ marginTop: "0px" }}
                    >
                      {/* <div className="chatHeadBg p-3 round-top"><Row>
                        <Col
                          md="auto"
                          style={{ paddingTop: "0px", marginTop: "0px" }}
                        >
                          <Image
                            className="align-text-top"
                            style={{
                              width: configData.ORG_LOGO_WIDTH,
                              height: configData.ORG_LOGO_HEIGHT,
                              paddingTop: "0px",
                              marginTop: "0px",
                            }}
                            src={configData.ORG_LOGO_URL}
                          ></Image>
                        </Col>
                        <Col
                          md
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            disply: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <h1
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              color: "#fff",
                            }}
                          >
                            {configData.HEADING}{" "}
                          </h1>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              color: "#ccc",
                            }}
                          >
                            {configData.SUBHEADING}
                          </div>
                        </Col>
                        <Col
                          md="auto"
                          style={{
                            paddingTop: "0px",
                            marginTop: "0px",
                            alignSelf: "flex-start",
                          }}
                        >
                          <Image
                            src={configData.SECONDARY_LOGO_URL}
                            style={{
                              height: "80px",
                              paddingTop: "0px",
                              marginTop: "0px",
                              marginLeft: "20px",
                            }}
                          ></Image>
                        </Col>
                      </Row> </div> */}

                      <div
                        md
                        className="text-dark rounded-top border-right-0"
                        style={{
                          height: "calc(100vh - 220px)",
                          paddingTop: "0px",
                        }}
                      >
                        <AutoScrollDiv popupVisible={this.state.popupVisible}>
                          {this.state.chatlog.map((chat, i) => {
                            if (chat.includes("user:")) {
                              return (
                                <div className="d-flex justify-content-end">
                                  <Row
                                    className="justify-content-end userSize mt-2"
                                    key={i}
                                  >
                                    <Col className="pe-0">
                                      <div className="user-box">
                                        {chat.split("user:")[1]}
                                      </div>
                                    </Col>
                                    <Col md="auto">
                                      <Avatar
                                        className="userAvatar"
                                        size="40"
                                        key={i + 2}
                                        name={this.username}
                                        round
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            } else if (chat.includes("assistant:")) {
                              // console.log(chat)
                              var assistant_response =
                                chat.split("assistant:")[1];
                              //console.log(assistant_response)
                              var completion = "";
                              //console.log(assistant_response)
                              var source = "";
                              var metadata = "";
                              var context = "";
                              var full_response = "";
                              // this.state.Current_response.map((response,i) => {
                              if (i == this.state.chatlog.length - 1)
                                full_response = this.state.Current_response;
                              else full_response = chat.split("assistant:")[1];
                              // console.log(chat.split("assistant:")[1])

                              if (
                                full_response != undefined &&
                                full_response != null &&
                                full_response != ""
                              ) {
                                if (full_response.includes("Source:")) {
                                  //  console.log(full_response)
                                  console.log(full_response);
                                  var source_value = full_response
                                    .split("Metadata:")[0]
                                    .trim()
                                    .split("Source:")[1];
                                  completion = full_response
                                    .split("Source:")[0]
                                    .trim();
                                  var metadata_value = full_response
                                    .split("Metadata:")[1]
                                    .trim()
                                    .split("kbtext:")[0];
                                  var kbtext_value = full_response
                                    .split("[DONE]")[0]
                                    .trim()
                                    .split("kbtext:")[1];

                                  console.log("source_value: " + source_value);
                                  console.log("completion: " + completion);
                                  console.log(
                                    "metadata_value: " + metadata_value
                                  );
                                  console.log("kbtext_value: " + kbtext_value);
                                  if (
                                    source_value != "" &&
                                    source_value != undefined &&
                                    source_value != null
                                  )
                                    source =
                                      "<br><i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic;'>Source: " +
                                      source_value +
                                      "</p>";
                                  if (
                                    metadata_value != "" &&
                                    metadata_value != undefined &&
                                    metadata_value != null
                                  )
                                    metadata =
                                      "<i class='bi bi-check-lg'></i> <p style='color:darkgreen; font-style: italic; font-size: 13px; '>Metadata: " +
                                      metadata_value +
                                      "</p>";
                                  if (
                                    kbtext_value != "" &&
                                    kbtext_value != undefined &&
                                    kbtext_value != null
                                  )
                                    context = kbtext_value;
                                } else {
                                  completion = full_response;
                                }
                              }
                              return (
                                <div className="d-flex justify-content-start">
                                  <Row
                                    className="justify-content-start assistentSize mt-2"
                                    key={i}
                                  >
                                    <Col md="auto">
                                      <div className="avtarCircle">
                                        {" "}
                                        <PersonFill size={24} />
                                      </div>
                                    </Col>
                                    <Col className="ps-0">
                                      <div
                                        className="assistant-box"
                                        key={i + 5}
                                      >
                                        <div className="actionButton hidde">
                                          {this.DisplayThumbsUp(context)}
                                          {this.DisplayThumbsDown(context)}
                                          {this.DisplayContext(
                                            context
                                             //"<div><font color=blue> <b> Knowledge Base Extract </b></font> <br><p align=justify>metrics category overview: the 'income & expense' category encompasses a wide range of financial metrics critical for analyzing a bank's financial health and performance. understanding these metrics allows stakeholders to evaluate how well the bank generates income from its core operations and how it manages expenses related to those operations. key metrics: interest expense, interest income, net income, noninterest expense, net operating income, net interest income (tax equivalent), total noninterest income key metric 1 name: interest expense on federal funds purchased & repos (% of average assets) key metric 1 definition: this metric measures the annualized interest expense on funds purchased and repurchase agreements as a percentage of average total assets, providing insights into the cost efficiency and funding structure. key metric 2 name: interest expense on time deposits of $250,000 or more key metric 2 definition: this metric represents the interest expense associated with large time deposits over $250,000. it's critical for assessing the bank's cost of maintaining high-value deposits and funding stability.</p></hr></div><div><font color=blue> <b> Knowledge Base Extract </b></font> <br><p align=justify>key metric 3 name: interest income from federal funds sold & resales (% of average assets) key metric 3 definition: this metric measures the annualized interest income derived from federal funds sold and repurchase agreements relative to average total assets, highlighting its contribution to overall asset profitability. key metric 4 name: net income of bank and minority interests key metric 4 definition: represents the income of the bank including minority interests before taxes and extraordinary items, crucial for understanding the bank's profitability from core and non-core business operations. key metric 5 name: net interest income (tax equivalent) (% of average assets) key metric 5 definition: this metric provides the net interest income (considering tax equivalents) as a percentage of average assets, serving as a key indicator of the bank’s core profitability and efficiency in using its assets. key metric 6 name: total noninterest expense key metric 6 definition: summarizes all expenses of the bank not related to interest, such as salaries, rents, and utilities, important for analyzing the bank's operational efficiency.</p></hr></div>"
                                          )}
                                          {/* {this.DisplayEVal()} */}
                                        </div>
                                        <div>
                                          {
                                            <ReactMarkdown
                                              children={completion}
                                              components={{
                                                code(props) {
                                                  const {
                                                    children,
                                                    className,
                                                    node,
                                                    ...rest
                                                  } = props;
                                                  const match =
                                                    /language-(\w+)/.exec(
                                                      className || ""
                                                    );
                                                  return match ? (
                                                    <div className="parentDiv">
                                                      <CopyToClipboard
                                                        text={children}
                                                        className="copyButton"
                                                      >
                                                        <button title="Copy to clipboard">
                                                          <FaRegCopy />
                                                        </button>
                                                      </CopyToClipboard>
                                                      <SyntaxHighlighter
                                                        {...rest}
                                                        PreTag="div"
                                                        children={String(
                                                          children
                                                        ).replace(/\n$/, "")}
                                                        language={match[1]}
                                                        style={atomDark}
                                                      />
                                                    </div>
                                                  ) : (
                                                    <code
                                                      {...rest}
                                                      className={"codeStyle"}
                                                    >
                                                      {children}
                                                    </code>
                                                  );
                                                },
                                              }}
                                              rehypePlugins={[rehypeRaw]}
                                            />
                                          }
                                          {/* <div dangerouslySetInnerHTML={{ __html: completion }} /> */}
                                          {/* {  htmlToReactParser.parse("<html> <body height='100%' width='100%'> <table>  <tr>    <td>Cell 1</td>    <td>Cell 2</td>    <td>Cell 3</td>  </tr>  <tr>    <td>Cell 4</td>    <td>Cell 5</td>    <td>Cell 6</td>  </tr></table></body></html>")} */}

                                          {/* htmlToReactParser.parse(  completion ) */}
                                          {/* <div dangerouslySetInnerHTML={{ __html: completion }} /> */}
                                          {/* {  htmlToReactParser.parse("<html> <body height='100%' width='100%'> <table>  <tr>    <td>Cell 1</td>    <td>Cell 2</td>    <td>Cell 3</td>  </tr>  <tr>    <td>Cell 4</td>    <td>Cell 5</td>    <td>Cell 6</td>  </tr></table></body></html>")} */}

                                          {htmlToReactParser.parse(source)}
                                          {htmlToReactParser.parse(metadata)}
                                          {/*  <ReactMarkdown className='reactMarkDown' >{chat.split("assistant:")[1]}</ReactMarkdown>  */}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  {(this.state.mute = false)}
                                </div>
                              );
                            }
                          })}
                        </AutoScrollDiv>
                      </div>

                      <Form
                        onSubmit={this.handleSubmit}
                        className="align-items-end p-3"
                      >
                        <Row>
                          <Col md="auto" className="pe-0">
                            <Button
                              className={`micBtn ${
                                this.state.isRecording ? "blink" : ""
                              }`}
                              disabled={this.state.isLoading}
                              onClick={this.record}
                            >
                              {this.state.isLoading ||
                              this.state.isRecording ? (
                                <StopFill size={30} />
                              ) : (
                                <MicFill />
                              )}
                            </Button>
                          </Col>
                          {/* {this.state.isRecording === true && ( */}
                          <Col md="auto" className="pe-0">
                            <Button
                              className="btn muteBtn"
                              id="btnmute"
                              disabled={this.state.mute}
                              onClick={() => this.setspeech()}
                            >
                              <VolumeMute size={30} />
                            </Button>
                          </Col>
                          {/* )} */}
                          {/* <Col md="auto" className="pe-0">
                          <Button
                            className="btn muteBtn"
                            id="btnmute"
                            disabled={this.state.mute}
                            onClick={() => this.setspeech()}
                          >
                            <VolumeMute size={30} />
                          </Button>
                        </Col> */}
                          <Col>
                            <div className="messageBox">
                              <Row>
                                <Col>
                                  <Form.Group controlId="formtext">
                                    <Form.Control
                                      autoComplete="off"
                                      className="transparent"
                                      placeholder="Type your message here..."
                                      as="input"
                                      value={this.state.input}
                                      onChange={(e) =>
                                        this.setState({
                                          input: [e.target.value],
                                        })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md="auto">
                                  <Form.Group controlId="submit">
                                    <Button type="submit" className="send">
                                      <CursorFill />
                                    </Button>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col md="auto">
                            <Form.Group controlId="formButton">
                              <Button
                                className="clear"
                                type="submit"
                                onClick={this.ClearForm}
                              >
                                <Trash3 style={{ marginTop: "-5px" }} /> Clear
                                All
                              </Button>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </Container>
            )}
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Container
              className="p-3 mb-2 bg-white"
              style={{ marginTop: "0px", minHeight: "760px" }}
            >
              <Row
                className="justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <Col xs={12} md={8} lg={6}>
                  <Alert
                    variant="info"
                    className="text-center"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid rgb(0, 123, 255)",
                    }}
                  >
                    <div style={{ paddingTop: "50px", fontSize: "30px" }}>
                      {configData.TAGLINE}
                    </div>
                    <div style={{ paddingTop: "50px", fontSize: "50px" }}>
                      {configData.HEADING}
                    </div>
                    <div style={{ paddingTop: "50px", fontSize: "15px" }}>
                      {configData.SUBHEADING}
                    </div>
                  </Alert>
                </Col>
              </Row>
            </Container>
          </UnauthenticatedTemplate>
          <Container fluid="true">{this.Footer()}</Container>
        </>
      </MsalProvider>
    );
  }
  handleScroll = () => {
    const navbar = document.querySelector(".custom-navbar");
    if (window.scrollY > 0) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  renderchatlog() {}
  logincheck() {
    const isAuthenticated = useIsAuthenticated();
    const { instance, inProgress } = useMsal();
    const handleLogout = () => {
      const currentAccount = instance.getAccountByHomeId(
        instance.getActiveAccount().homeAccountId
      );
      instance.logoutRedirect({ account: currentAccount });
    };
    const handleLogin = () => {
      instance.loginRedirect({
        scopes: ["User.Read"],
      });
    };
    var username = "";
    var country = "";
    var ip = "";
    const currentAccount = instance.getActiveAccount();
    if (currentAccount) {
      username = currentAccount.name;
      country = currentAccount.idTokenClaims["tenant_ctry"];
      ip = currentAccount.idTokenClaims["ipaddr"];
      this.username = username;
      if (!this.dataFetched) {
        this.getConfigdata(currentAccount.username);
        this.GetVectorsCount();
        window.addEventListener("scroll", this.handleScroll);
        this.dataFetched = true;
      }
    }
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </a>
    ));
    return (
      <header className="nav-Bg">
        <Container fluid="true">
          <Row className="justify-content-between p-0 m-0">
            <Col md="auto">
              <Image
                style={{
                  width: configData.ORG_LOGO_WIDTH,
                  height: "40px",
                  paddingTop: "0px",
                  marginTop: "10px",
                }}
                src={configData.SECONDARY_LOGO_URL}
              ></Image>
            </Col>
            <Col>
              <Navbar>
                <Navbar.Toggle />
                <Navbar.Collapse>
                  <AuthenticatedTemplate>
                    <Navbar.Text
                      className="small justify-content-start"
                      style={{ color: "white", fontSize: "16px" }}
                    >
                      <span className="me-3">
                        {" "}
                        {country && `Country: ${country}   `}
                      </span>
                      <span className="me-3"> {ip && `IP: ${ip}   `}</span>
                      <span> Local Time: </span>
                      <Clock
                        format={"HH:mm:ss"}
                        ticking={true}
                        timezone={configData.TIME_ZONE}
                      />
                    </Navbar.Text>
                  </AuthenticatedTemplate>
                  <UnauthenticatedTemplate>
                    <Navbar.Text></Navbar.Text>
                  </UnauthenticatedTemplate>
                </Navbar.Collapse>
              </Navbar>
            </Col>
            <Col md="auto">
              <Navbar className="padAdjust">
                <Container>
                  <Navbar.Toggle />
                  <Navbar.Collapse className="justify-content-start">
                    <AuthenticatedTemplate>
                      <Dropdown>
                        <Dropdown.Toggle
                          as={CustomToggle}
                          id="dropdown-custom-components username"
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div className="user-icon">
                              {username
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </div>
                            <div className="nav-desktop-only username">
                              {username}
                            </div>
                          </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-menu-custom">
                          <Dropdown.Item disabled>
                            Signed in as:
                            <div> {username}</div>
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as={Link} to="/">
                            Home
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/config">
                            App Settings
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/pie">
                            PIE Settings
                          </Dropdown.Item>
                          <Dropdown.Item href="#logout" onClick={handleLogout}>
                            Logout
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                      <Navbar.Text>
                        <a href="#login" onClick={handleLogin}>
                          Login
                        </a>
                      </Navbar.Text>
                    </UnauthenticatedTemplate>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </Col>
          </Row>
        </Container>
      </header>
    );
  }
  getConfigdata(username) {
    const response = fetch(appConfigData.API_ENDPOINT + "/getConfigData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((response) => {
        if (!response.ok && response.status === 404) {
          return response.text().then((text) => {
            if (text === "User not found.") {
              //window.location.href = '/config';
              //this.context.router.transitionTo('/config');
              this.props.history.push("/config");
            } else {
              throw new Error(text);
            }
          });
        } else {
          this.setState({ isShowContainer: true });
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          this.setState({ jsonConfData: JSON.stringify(data.configData) });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  setTokenLimit(v) {
    if (v < 10) this.state.tokens_limit = (1 * 8000) / 100;
    else this.state.tokens_limit = (v * 2000) / 100;
  }

  calculateCost(model_name, prompt_tokens, completion_tokens) {
    var cost = 0;
    var completion_cost = 0;
    var prompt_cost = 0;
    var total_tokens = 0;
    var total_tokens_cost = 0;
    if (model_name == "gpt-4-0314") {
      completion_cost = (completion_tokens / 1000) * 0.06;
      prompt_cost = (prompt_tokens / 1000) * 0.03;
      prompt_cost = Math.round((prompt_cost + Number.EPSILON) * 1000) / 1000;
      completion_cost =
        Math.round((completion_cost + Number.EPSILON) * 1000) / 1000;
      cost = completion_cost + prompt_cost;
    } else if (model_name == "gpt-3.5-turbo-0301") {
      total_tokens = prompt_tokens + completion_tokens;
      total_tokens_cost = (total_tokens / 1000) * 0.002;
      cost = Math.round((total_tokens_cost + Number.EPSILON) * 1000) / 1000;
    }
    this.state.cost = this.state.cost + cost;
    this.state.model_name = model_name;
    this.state.current_interaction_cost = cost;
    this.state.prompt_tokens = prompt_tokens;
    this.state.completion_tokens = completion_tokens;
    this.state.total_tokens_consumed =
      this.state.total_tokens_consumed + (prompt_tokens + completion_tokens);
  }
  TokenRange() {
    const [tokens_limit, setValue1] = useState(50);
    return (
      <Form.Range
        value={tokens_limit}
        onChange={(y) => {
          setValue1(Number(y.currentTarget.value));
          this.setTokenLimit(Number(y.currentTarget.value));
        }}
        tooltipPlacement="top"
        tooltip="on"
      />
    );
  }
  settempValue(v) {
    this.state.temprature = v;
    if (this.state.temprature == 0.1) {
      (this.state.top_p = 1),
        (this.state.frequency_penalty = 0),
        (this.state.presence_penalty = 0);
    } else if (this.state.temprature == 0.85) {
      (this.state.top_p = 1),
        (this.state.frequency_penalty = 0),
        (this.state.presence_penalty = 0);
    }
  }

  setModelValue(v) {
    this.state.model = v;
  }
  settopicValue(v) {
    this.state.topic = v;
  }
  setspeech() {
    if (this.state.audio_msg != "") {
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
            <ToggleButton
              style={{ width: "130px" }}
              key={idx}
              id={`topicradio-${idx}`}
              type="radio"
              name="topicradio"
              value={topicradio.value}
              checked={topicradioValue === topicradio.value}
              onChange={(x) => {
                setTopicRadioValue(Number(x.currentTarget.value));
                this.settopicValue(Number(x.currentTarget.value));
                this.resettopic();
              }}
            >
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
            <ToggleButton
              md
              style={{ width: "130px" }}
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => {
                setRadioValue(Number(e.currentTarget.value));
                this.settempValue(Number(e.currentTarget.value));
              }}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </>
    );
  }

  DisplayContext(context) {
    const { searchQuery, content } = this.state;
    const popover = (
      <Popover
        id="popover-basic"
        data-bs-placement="left"
        className="popoverSize"
        style={{ border: "5px solid #fff" }}
      >
        <Popover.Body
          style={{
            width: "100%",
            backgroundColor: "white",
            height: "400px",
            textAlign: "justify",
            overflowY: "auto",
            top: "0px",
            borderRadius: "20px",
            scrollBehavior: "revert-layer",
            marginRight: "20px",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => this.setState({ searchQuery: e.target.value })}
            placeholder="Search..."
            className="searchField"
          />
          <HighlightSearch content={context} searchTerm={searchQuery} />
          {/* {htmlToReactParser.parse(context)} */}
        </Popover.Body>
      </Popover>
    );

    console.log(context);

    if (context != undefined && context != "") {
      return (
        <>
          <OverlayTrigger
            rootClose
            trigger="click"
            placement="left"
            overlay={popover}
            onToggle={(e) => {
              this.setState({ searchQuery: "", popupVisible: false });
            }}
          >
            <Button
              variant="white"
              className="mr-xs"
              style={{ border: "0px" }}
              onClick={(e) => {
                e.preventDefault(); // Prevent default action of the click event
                this.setState({ searchQuery: "", popupVisible: true });
              }}
              //onClick={() => this.setState({ searchQuery: "" })}
            >
              <Book />
            </Button>
          </OverlayTrigger>
        </>
      );
    }
  }

  DisplayThumbsUp(context) {
    if (context != undefined) {
      return (
        <>
          <Button
            variant="white"
            className="mr-xs"
            style={{ height: "30px", border: "0px" }}
          >
            <HandThumbsUp fill="darkgreen" />
          </Button>
        </>
      );
    }
  }

  DisplayThumbsDown(context) {
    if (context != undefined) {
      return (
        <>
          <Button
            variant="white"
            className="mr-xs"
            style={{ height: "30px", border: "0px" }}
          >
            <HandThumbsDown fill="darkred" />
          </Button>
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
            <ToggleButton
              md
              style={{ width: "130px" }}
              key={idx}
              id={`mradio-${idx}`}
              type="radio"
              name="mradio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => {
                setModelName(Number(e.currentTarget.value));
                this.setModelValue(Number(e.currentTarget.value));
              }}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </>
    );
  }
  Footer() {
    return (
      <Row className="m-0 p-0 align-items-center">
        <Col>
          <Nav as="ul">
            <Nav.Item as="li" className="small">
              <Nav.Link href="/Support">Support</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li" className="small">
              <Nav.Link href="/Aboutus">About Us</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md="auto" className="small">
          © {new Date().getFullYear()} All rights reserved.
        </Col>
      </Row>
    );
  }
  resettopic = (event) => {
    this.setState({
      chatlog: [""],
      messages: [{ role: "", content: "" }],
      input: "",
      response_received: false,
    });
    event.preventDefault();
  };
  ClearForm = (event) => {
    this.setState({
      chatlog: [""],
      messages: [{ role: "", content: "" }],
      input: "",
      total_tokens_consumed: 0,
      prompt_tokens: 0,
      completion_tokens: 0,
      cost: 0,
      model_name: "",
      response_received: false,
    });
    event.preventDefault();
  };
  handleSubmit = (event) => {
    if (!this.state.input[0]) {
      event.preventDefault();
      alert("Please enter a valid message");
    } else {
      this.state.messages.push({ role: "user", content: this.state.input[0] });
      this.state.chatlog.push("user: " + this.state.input[0] + "");
      this.setState({ input: "" });

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
    if (currentAccount) {
      username = currentAccount.name;
      country = currentAccount.idTokenClaims["tenant_ctry"];
      ip = currentAccount.idTokenClaims["ipaddr"];
      email = currentAccount.username;
      this.username = username;
    }
    // iterarte through the messages and check if there are more than 14 messages then only keep the last 14 messages
    if (this.state.messages.length > 18) {
      this.state.messages.shift();
      this.state.messages.shift();
    }

    const promptvar = {
      messages: this.state.messages,
      input:
        this.state.input[0] +
        " |userprofile: username:" +
        username +
        ", country:" +
        country +
        ", ip:" +
        ip +
        ", email:" +
        email,
      temperature: this.state.temprature,
      topic: this.state.topic,
      top_p: this.state.top_p,
      frequency_penalty: this.state.frequency_penalty,
      presence_penalty: this.state.presence_penalty,
      tokens_limit: this.state.tokens_limit,
      model_name: this.state.model,
    };
    try {
      this.state.Current_response = "Analyzing...";
      let temmp_arr = this.state.chatlog;
      temmp_arr.push("assistant: Analyzing...");
      this.setState({ chatlog: temmp_arr });

      //console.log(temmp_arr)
      //console.log(this.state.messages)
      const resp = await fetch(appConfigData.API_ENDPOINT + "/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: this.state.messages,
          input:
            this.state.input[0] +
            " |userprofile: username:" +
            username +
            ", country:" +
            country +
            ", ip:" +
            ip +
            ", email:" +
            email,
          temperature: this.state.temprature,
          topic: this.state.topic,
          top_p: this.state.top_p,
          frequency_penalty: this.state.frequency_penalty,
          presence_penalty: this.state.presence_penalty,
          tokens_limit: this.state.tokens_limit,
          model_name: this.state.model,
        }),
      });
      var output = "";
      const reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
      this.state.Current_response = "";
      //this.state.chatlog.push("assistant: Analyzing..." );
      while (true) {
        const { value, done } = await reader.read();
        //console.log(value)
        if (value.includes("[DONE]")) {
          //console.log("output");
          console.log(value);
          if (output != "") {
            //console.log(value)
            var completion_x = "";
            if (value.includes("Source:")) {
              completion_x = value.split("Source:")[0];
              //console.log(completion_x);
              output = output + value;
              console.log(completion_x);
            } else {
              completion_x = output;
            }
            this.state.messages.push({
              role: "assistant",
              content: completion_x,
            });
            break;
          }
        }
        // console.log(value)
        else {
          this.state.Current_response = this.state.Current_response + value;
          output = output + value;
          console.log(output);
        }
        this.setState({ response_received: true });
        //this.state.chatlog.push("assistant: Analyzing..." );
      }

      console.log(output);

      this.state.chatlog.pop();
      this.state.Current_response = output;
      let temmp_arr2 = this.state.chatlog;
      temmp_arr2.push("assistant: " + output);
      this.setState({ chatlog: temmp_arr2 });
      // console.log(this.state.chatlog);
    } catch (err) {
      // Handle Error Here
      console.error(err);
      //remove the Analyzing message
      this.state.chatlog.pop();
      this.state.chatlog.push("assistant:" + err);
      this.setState({ response_received: true });
    }
    if (window.innerWidth <= 768) {
      this.myRef.current.scrollIntoView({ behavior: "smooth" });
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
    if (currentAccount) {
      username = currentAccount.name;
      country = currentAccount.idTokenClaims["tenant_ctry"];
      ip = currentAccount.idTokenClaims["ipaddr"];
      email = currentAccount.username;
      this.username = username;
    }

    try {
      this.state.Current_response = "Analyzing...";
      let temmp_arr = this.state.chatlog;
      temmp_arr.push("assistant: Analyzing...");
      this.setState({ chatlog: temmp_arr });
      console.log(temmp_arr);
      console.log(this.state.messages);
      // console.log(this.state.input[0] + " |userprofile: username:" + username +
      // ", country:" + country + ", ip:" + ip + ", email:" + email);
      const resp = await fetch(appConfigData.API_ENDPOINT + "/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: this.state.messages,
          input:
            y +
            " |userprofile: username:" +
            username +
            ", country:" +
            country +
            ", ip:" +
            ip +
            ", email:" +
            email,
          temperature: this.state.temprature,
          topic: this.state.topic,
          top_p: this.state.top_p,
          frequency_penalty: this.state.frequency_penalty,
          presence_penalty: this.state.presence_penalty,
          tokens_limit: this.state.tokens_limit,
          model_name: this.state.model,
        }),
      });
      var output = "";
      this.state.Current_response = "";
      const reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
      var count = 0;

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
      let completion_x_audio = "";
      while (true) {
        const { value, done } = await reader.read();
        if (value.includes("[DONE]")) {
          //console.log("output");

          user_lang = value.split("lang:")[1];
          //console.log(user_lang)
          //console.log(value)
          if (output != "") {
            var completion_x = "";
            if (value.includes("Source:")) {
              completion_x = value.split("Source:")[0];
              //console.log(completion_x);
              output = output + value;
              completion_x_audio = completion_x_audio + completion_x;
              console.log(completion_x);
            } else {
              completion_x = output;
            }
            //this.audio_msg.text = completion_x;

            // this.audio_msg.text = "";
            this.state.messages.push({
              role: "assistant",
              content: completion_x,
            });
            // let audio = new SpeechSynthesisUtterance(completion_x);

            //window.speechSynthesis.speak(audio);

            break;
          }
        } else {
          this.state.Current_response = this.state.Current_response + value;
          output = output + value;
          completion_x_audio = completion_x_audio + value;
          this.state.mute = false;
          this.setState({ response_received: true });
        }
      }
      this.state.chatlog.pop();
      this.state.Current_response = output;
      let temmp_arr2 = this.state.chatlog;
      temmp_arr2.push("assistant: " + output);
      this.setState({ chatlog: temmp_arr2 });
      //console.log(this.state.chatlog);
      //console.log("user lang:"+user_lang.toLowerCase())
      const voices = window.speechSynthesis.getVoices();
      for (var i = 0; i < voices.length; i++) {
        if (voices[i].name.toLowerCase().includes(user_lang.toLowerCase())) {
          //set the voice to hindi
          this.audio_msg.voice = voices[i];
        }
        // console.log(voices[i].name);
      }

      // if(!output.includes('Source:'))
      this.audio_msg.text = completion_x_audio;
      //console.log("audo:"+this.audio_msg.text)
      //console.log(this.chat.log);
      window.speechSynthesis.speak(this.audio_msg);
    } catch (err) {
      // Handle Error Here
      console.error(err);

      this.state.chatlog.push("assistant:" + err);
      this.setState({ response_received: true });
    }
  };
  setIsSelected = (value) => {
    this.setState({ isFilePicked: value });
  };
  setSelectedFile = (value) => {
    this.setState({ selectedFile: value });
  };

  FileUploadPage() {
    const changeHandler = (event) => {
      this.setState({ fileName: event.target.files[0].name });
      this.setSelectedFile(event.target.files[0]);
      this.setIsSelected(true);
    };
    let username = "";
    let country = "";
    let ip = "";
    let email = "";

    const currentAccount = this.state.msalInstance.getActiveAccount();
    if (currentAccount) {
      username = currentAccount.name;
      country = currentAccount.idTokenClaims["tenant_ctry"];
      ip = currentAccount.idTokenClaims["ipaddr"];
      this.username = username;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const handleSubmission = () => {
      const formData = new FormData();
      formData.append("file", this.state.selectedFile);

      console.log(this.state.selectedFile);
      if (
        this.state.selectedFile.name != null &&
        this.state.selectedFile.name != undefined
      ) {
        if (
          this.state.selectedFile.name.includes(".txt") ||
          this.state.selectedFile.name.includes(".pdf") ||
          this.state.selectedFile.name.includes(".py") ||
          this.state.selectedFile.name.includes(".java") ||
          this.state.selectedFile.name.includes(".js") ||
          this.state.selectedFile.name.includes(".html") ||
          this.state.selectedFile.name.includes(".cs") ||
          this.state.selectedFile.name.includes(".csv") ||
          this.state.selectedFile.name.includes(".xlsx") ||
          this.state.selectedFile.name.includes(".pptx") ||
          this.state.selectedFile.name.includes(".docx")
        ) {
          this.setState({
            result_msg:
              "<font color='blue' size='8px' ><b> Please wait - updating knowledge...</b></font>",
          });
          fetch(
            appConfigData.API_ENDPOINT + "/upload?username=" + this.username,
            { method: "POST", body: formData }
          )
            .then((response) => response.json())
            .then((result) => {
              this.GetVectorsCount();
              this.setState({
                result_msg:
                  "<font color='green' size='8px'><b> Success - you can me questions now! </b></font>",
              });
              //console.log('Success:', result);
              sleep(2000).then(() => {
                this.setState({ result_msg: "" });
              });

              this.setSelectedFile("");
              this.setIsSelected(false);
            })
            .catch((error) => {
              this.setSelectedFile("");
              this.setIsSelected(false);

              this.setState({
                result_msg:
                  "<font color='red' size='8px' > <b>Sorry - failed to update. Please try again! </b></font>",
              });
              console.error("Error:", error);
            });
        } else {
          this.setState({
            result_msg:
              "<font color='red' size='8px' >Supported File Types:<font color='red' size='5px' ><br><b>.txt,.pdf,.docx,.pptx,xlsx,.py,.java,.js,.html,.cs,.csv </b></font>.<br> Any other file types will be ignored in this version.</font>",
          });
          this.setSelectedFile("");
          this.setIsSelected(false);
          sleep(5000).then(() => {
            this.setState({ result_msg: "" });
          });
        }
      } else {
        this.setState({
          result_msg:
            "<font color='red' size='8px' ><b>Sorry - please select a file!</b></font>",
        });
        this.setSelectedFile("");
        this.setIsSelected(false);
        sleep(2000).then(() => {
          this.setState({ result_msg: "" });
        });
      }
    };
    // }
    // else
    // {

    //}
    return (
      <>
        <div>
          <label
            style={{ wordBreak: "break-all" }}
            htmlFor="file"
            className="mr-2 custom-file-label"
          >
            <Link45deg size={20} /> {this.state.fileName || "Choose file"}
            {/* {this.state.fileName || "Choose file"} */}
          </label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={changeHandler}
            className="custom-file-input"
            style={{ display: "none" }}
          />{" "}
          <Button
            style={{ marginTop: "0px" }}
            className="customButton"
            onClick={handleSubmission}
          >
            <PlusLg
              size={14}
              style={{ marginRight: "2px", marginTop: "-2px" }}
            />
            Add
          </Button>
        </div>

        <div className="messageText">
          {htmlToReactParser.parse(this.state.result_msg)}
        </div>
      </>
    );
  }

  GetVectorsInfo() {
    const handleSubmission = () => {
      let username = "";
      this.setState({ isVectorLoading: true });
      const currentAccount = this.state.msalInstance.getActiveAccount();
      if (currentAccount) {
        username = currentAccount.name;
        this.username = username;
      }

      fetch(appConfigData.API_ENDPOINT + "/vectors?username=" + this.username, {
        method: "Get",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.error) {
            console.error("Error:", result.error);
            this.setState({ isVectorLoading: false });
            this.setState({ vector_count_error: "Error" });
          } else {
            this.setState({
              vector_count: result,
              isVectorLoading: false,
              vector_count_error: "",
            });
          }
        })
        .catch((error) => {
          this.setState({ isVectorLoading: false });
          this.setState({ vector_count_error: "Error" });
          console.error("Error:", error);
        });
    };

    return (
      <Button className="refreshBtn" onClick={handleSubmission}>
        <ArrowClockwise className="whiteIcon" size="36" />
      </Button>
    );
  }

  GetVectorsCount() {
    let username = "";
    const currentAccount = this.state.msalInstance.getActiveAccount();
    if (currentAccount) {
      username = currentAccount.name;
      this.username = username;
    }

    fetch(appConfigData.API_ENDPOINT + "/vectors?username=" + this.username, {
      method: "Get",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          console.error("Error:", result.error);
          this.setState({ isVectorLoading: false });
          this.setState({ vector_count_error: "Error" });
        } else {
          this.setState({
            vector_count: result,
            isVectorLoading: false,
            vector_count_error: "",
          });
        }
      })
      .catch((error) => {
        this.setState({ isVectorLoading: false });
        this.setState({ vector_count_error: "Error" });
        console.error("Error:", error);
      });
  }

  ClearMemory() {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let username = "";
    const currentAccount = this.state.msalInstance.getActiveAccount();
    if (currentAccount) {
      username = currentAccount.name;
      this.username = username;
    }

    const handleSubmission = () => {
      const formData = new FormData();

      this.setState({
        memory_result_msg:
          "<font color='blue'><b>Please wait - erasing  memory...</b></font>",
      });
      fetch(
        appConfigData.API_ENDPOINT + "/clearmemory?username=" + this.username,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((result) => {
          this.GetVectorsCount();
          this.setState({
            memory_result_msg:
              "<font color='green'><b>Knowledge erased succefully!</b></font>",
          });
          //console.log('Success:', result);

          sleep(2000).then(() => {
            this.setState({ memory_result_msg: "" });
          });
        })
        .catch((error) => {
          this.setState({
            memory_result_msg:
              "<font color='red'><b>Failed to erase knowledege!</b></font>",
          });
          console.error("Error:", error);
        });
    };

    return (
      <Fragment>
        <div>
          <Button className="customButton" onClick={handleSubmission}>
            <Trash3 /> Delete Knowledge
          </Button>{" "}
          <div>{htmlToReactParser.parse(this.state.memory_result_msg)}</div>
        </div>
      </Fragment>
    );
  }

  record = async () => {
    try {
      this.setState({ isLoading: true });
      let y = "";
      if (this.state.isRecording) {
        const blob = await this.recorder.stopRecording();
        console.log("finished recording... ");
        const url = appConfigData.API_ENDPOINT + "/whisper";
        const formData = new FormData();
        formData.append("file", blob, "audio.mp3");
        const x = await axios.post(url, formData, {}).then((res) => {
          // then print response status
          y = res.data.text;
          this.setState({ recordbuttonstyle: "recordstartbutton" });
        });
        this.setState({
          isLoading: false,
          isRecording: false,
          recording: URL.createObjectURL(blob),
          input: y,
        });

        this.state.messages.push({ role: "user", content: y });
        this.state.chatlog.push("user: " + y + "");
        //this.state.chatlog.push("assistant: Analyzing..." );
        this.audio_msg.text = "Analyzing...";
        this.setState({ input: "" });
        await this.sendWhisperPostRequest(y);
      } else {
        try {
          await this.recorder.initAudio();
          await this.recorder.initWorker();
          this.recorder.startRecording();
          this.setState({ recordbuttonstyle: "recordstopbutton" });
          this.setState({ isLoading: false, isRecording: true });
        } catch (e) {
          console.error(e);
          this.setState({ isLoading: false });
        }
      }
    } catch (err) {
      console.log(err);
      //remove the Analyzing message
      this.state.chatlog.pop();
      this.state.chatlog.push("assistant:" + err);
      this.setState({ response_received: true });
      this.setState({ isLoading: false, isRecording: false });
    }
  };

  play = async (para) => {
    var i = 0;
    var sentences = para.split("\n");

    for (i = 0; i < sentences.length; i++) {
      await this.getNextAudio(sentences[i]);
    }
  };

  getNextAudio = async (sentence) => {
    console.log(sentence);
    let audio = new SpeechSynthesisUtterance(sentence);
    window.speechSynthesis.speak(audio);

    return new Promise((resolve) => {
      audio.onend = resolve;
    });
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
}
export default App;
