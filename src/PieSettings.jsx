import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Container,
  Row,
  Col,
  Alert,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Clock from "react-live-clock";
import appConfigdata from "./appconfig.json";
import configData from "./whitelabel.json";
import { MsalProvider } from "@azure/msal-react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import Accordion from "react-bootstrap/Accordion";
const HtmlToReactParser = require("html-to-react").Parser;
const htmlToReactParser = new HtmlToReactParser();

const validationSchemaPersonality = Yup.object().shape({
  personality: Yup.string()
    .required("Personality is required")
    .test(
      "is-personality-empty",
      "Personality is required",
      (value) => value.trim() !== ""
    ),
});
const validationSchemaIE = Yup.object().shape({
  instructions_examples: Yup.string()
    .required("Instructions are required")
    .test(
      "is-instructions-empty",
      "Instructions are required",
      (value) => value.trim() !== ""
    ),
});
//const [jsonData, setJsonData] = useState(null);
class PieSettings extends React.Component {
  dataFetched = false;
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      jsonPieData: null,
      message: "",
    };
    this.handlePersonalitySubmit = this.handlePersonalitySubmit.bind(this);
    this.handleInstructionsSubmit = this.handleInstructionsSubmit.bind(this);
    this.logincheck = this.logincheck.bind(this);
    this.getPersonalityInstructionsData =
      this.getPersonalityInstructionsData.bind(this);
    //this.state = JSON.stringify(jsonData);
  }

  // componentDidMount() {
  //   // if (!this.dataFetched) {
  //   //   console.log('componentDidMount: data not fetched yet. Fetching now...');
  //   //   this.getConfigData();
  //   //   this.dataFetched = true;
  //   // }
  //   //this.setState(Json.stringify(jsonData));
  //   //console.log('Configuration Data: '+ JSON.stringify(this.state)); // Logs the content of the JSON file
  // }
  handlePersonalitySubmit = (values) => {
    return new Promise((resolve, reject) => {
      this.setState({ message: "" });
      let username = "unknown";
      const currentAccount = this.props.msalInstance.getActiveAccount();
      if (currentAccount) {
        username = currentAccount.username;
      }
      let jsonData = {
        user: username,
        personality: values.personality,
      };

      fetch(appConfigdata.API_ENDPOINT + "/savePersonality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Success:", response);
            this.setState({ message: "Data saved successfully!" });
            resolve();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            message: "An error occurred while saving the data.",
          });
          reject(error);
        });
    });
  };

  handleInstructionsSubmit = (values) => {
    return new Promise((resolve, reject) => {
      this.setState({ message: "" });
      let username = "unknown";
      const currentAccount = this.props.msalInstance.getActiveAccount();
      if (currentAccount) {
        username = currentAccount.username;
      }
      let jsonData = {
        user: username,
        instructions_examples: values.instructions_examples,
      };

      fetch(appConfigdata.API_ENDPOINT + "/saveInstructionExamples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((result) => {
          console.log("Success:", result);
          this.setState({ message: "Data saved successfully!" });
          resolve();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.setState({
            message: "An error occurred while saving the data.",
          });
          reject(error);
        });
    });
  };
  render() {
    const jsonPieData = JSON.parse(this.state.jsonPieData);
    console.log("Configuration Data: " + JSON.stringify(jsonPieData)); // Logs the content of the JSON file

    return (
      <MsalProvider instance={this.props.msalInstance}>
        <>
          <this.logincheck />

          <Container>
            <AuthenticatedTemplate>
              <Container>
                <div className="page-wrapper">
                  <div className="page-title">
                    <h1 className="h2">PIE Settings</h1>
                  </div>
                  <div className="contentContainer">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>System Personality</Accordion.Header>
                        <Accordion.Body>
                          <Formik
                            initialValues={{
                              personality: jsonPieData
                                ? jsonPieData.personality
                                : "",
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchemaPersonality}
                            onSubmit={(values, { setSubmitting }) => {
                              this.handlePersonalitySubmit(values)
                                .then(() => {
                                  setSubmitting(false);
                                })
                                .catch((error) => {
                                  console.error("Error:", error);
                                  setSubmitting(false);
                                });
                            }}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <FormGroup className="mb-3">
                                  {/* <FormLabel className="form-label">System Personality:</FormLabel> */}
                                  <Field
                                    type="text"
                                    name="personality"
                                    as="textarea"
                                    className="form-control"
                                    style={{ minHeight: "300px" }}
                                    placeholder="YOUR NAME: 
                                    &&&&
                                        GenAI Assistant  
                                    &&&&
                                    YOUR ROLE:
                                    &&&&
                                    -  You are an expert in Math calculations, sorting oprations, LOGICAL LESS THAN, GREATER THAN type of Operations.
                                    -  You are also an expert in customer service and ecommerce platform and expert in CONVERSATIONAL Skills
                                    -  MOST IMPORTANTLY YOU ARE A VERY PASSIONATE AND ENTHUSIASTIC GENERAL SOLUTIONS CONSULTANT AND LOVE TO HELP CUSTOMERS.
                                    -  ALSO, IMPORTANT - YOU UNDERSTAND THE NUANCES OF HUMAN PSYCHOLOGY AND CAN READ PEOPLE'S MIND AND UNDERSTAND THEIR INTENT.
                                    &&&&
                                    YOUR ORGANIZATION:
                                    &&&&
                                        Infogain
                                    &&&&"
                                  />
                                  <div className="d-flex align-items-center">
                                    <ErrorMessage
                                      name="personality"
                                      component={FormText}
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-3 mr-3 customColor customButton"
                                  >
                                    Save
                                  </Button>
                                </FormGroup>
                              </Form>
                            )}
                          </Formik>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>
                          System Instructions Examples
                        </Accordion.Header>
                        <Accordion.Body>
                          <Formik
                            initialValues={{
                              instructions_examples: jsonPieData
                                ? jsonPieData.instructions_examples
                                : "",
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchemaIE}
                            onSubmit={(values, { setSubmitting }) => {
                              this.handleInstructionsSubmit(values)
                                .then(() => {
                                  setSubmitting(false);
                                })
                                .catch((error) => {
                                  console.error("Error:", error);
                                  setSubmitting(false);
                                });
                            }}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <FormGroup className="mb-3">
                                  {/* <FormLabel className="form-label">System Instructions Examples:</FormLabel> */}
                                  <Field
                                    type="text"
                                    name="instructions_examples"
                                    as="textarea"
                                    style={{ minHeight: "300px" }}
                                    placeholder="INSTRUCTIONS:
                                    YOUR KNOWLEDGE BOUNDRY:
                                    &&&&
                                    - YOUR KNOWLEDGE BOUNDRY is the KNOWLEDGE BASE CONTENT provided to you and the conversation history ONLY.
                                    - always VERIFY if the KNOWLEDGE BASE CONTENT  is RELEVANT to USER'S REQUEST. 
                                    - don't provide any GENERAL SUGGESTIONS. if required,you can GUIDE user to ask question differently.
                                    - DON'T FABRICATE your response - always make sure your response is STRICTLY based of the KNOWLEDGE BASE CONTENT and accurate.
                                    - DO NOT USE any EXTERNAL KNOWLEDGE.
                                    &&&&
                                   "
                                    className="form-control"
                                  />
                                  <div className="d-flex align-items-center">
                                    <ErrorMessage
                                      name="instructions_examples"
                                      component={FormText}
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-3 mr-3 customButton customColor"
                                  >
                                    Save
                                  </Button>
                                </FormGroup>
                              </Form>
                            )}
                          </Formik>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to="/"
                        className="btn mt-3 ml-4 btn-secondary customColor"
                      >
                        Back
                      </Link>
                      {this.state.message && (
                        <span
                          style={{ marginLeft: "10px", paddingTop: "16px" }}
                        >
                          {this.state.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* <Link to="/" class="btn btn-primary">Back</Link> */}
              </Container>
            </AuthenticatedTemplate>
          </Container>
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
  getPersonalityInstructionsData(username) {
    // const currentAccount = this.props.msalInstance.getActiveAccount();
    // if (currentAccount) {
    //this.setState({username:username});
    fetch(appConfigdata.API_ENDPOINT + "/getPersonalityInstructions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: username,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          this.setState({ jsonPieData: JSON.stringify(data) });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // } else {
    //   this.props.msalInstance.loginRedirect({
    //     scopes: ["User.Read"]
    //   });
    //}
  }
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
        this.getPersonalityInstructionsData(currentAccount.username);
        //this.GetVectorsCount();
        //window.addEventListener('scroll', this.handleScroll);
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
}

export default PieSettings;
