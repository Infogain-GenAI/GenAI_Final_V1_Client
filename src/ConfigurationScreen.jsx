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
import Card from "react-bootstrap/Card";
//import jsonData from './ConfigurationScreenData.json';
const HtmlToReactParser = require("html-to-react").Parser;
const htmlToReactParser = new HtmlToReactParser();

const validationSchema = Yup.object().shape({
  // leftImg: Yup.string().test('imageURL', 'Image URL is required', function(value, context) {
  //   const { PrimaryLogofile } = this.parent;
  //   return PrimaryLogofile || value;
  // }),
  // PrimaryLogofile: Yup.mixed().test('PrimaryLogofile', 'A file is required', function(value, context) {
  //   const { leftImg } = this.parent;
  //   return leftImg || value;
  // }),

  headerText: Yup.string()
    .required("Header Text is required")
    .test(
      "is-headerText-empty",
      "Header Text is required",
      (value) => value !== ""
    ),
  // subHeaderText: Yup.string().required('Subheader Text is required'),
});
//const [jsonData, setJsonData] = useState(null);
class ConfigurationScreen extends React.Component {
  dataFetched = false;
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      jsonConfData: this.props.jsonConfData,
      isSubmitted: false,
      isLeftFileInputVisible: false,
      isRightFileInputVisible: false,
      showAlert: false, // Show alert to setup app settings for new user doesn't have app settings
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logincheck = this.logincheck.bind(this);
    this.getConfigData = this.getConfigData.bind(this);
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
  handleSubmit = (values) => {
    let username = "unknown";
    const currentAccount = this.props.msalInstance.getActiveAccount();
    if (currentAccount) {
      username = currentAccount.username;
    }
    //const username = this.getUsername()||"unknown";
    let jsonData = {
      user: username,
      leftImg: values.leftImg,
      headingTxt: values.headerText,
      subheadingTxt: values.subHeaderText,
      //"rightImg": values.rightImg
    };

    const formData = new FormData();
    if (document.querySelector('input[type="file"][name="PrimaryLogofile"]')) {
      const leftImg = document.querySelector(
        'input[type="file"][name="PrimaryLogofile"]'
      ).files[0];
      formData.append("leftImg", leftImg);
      jsonData.leftImg = null;
    }
    // if(document.querySelector('input[type="file"][name="SecondaryLogofile"]')){
    // const rightImg = document.querySelector('input[type="file"][name="SecondaryLogofile"]').files[0];
    // formData.append('rightImg', rightImg);
    // jsonData.rightImg = null;
    // }
    formData.append("jsonData", JSON.stringify(jsonData));
    fetch(appConfigdata.API_ENDPOINT + "/saveConfigData", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        console.log("Success:", result);
        //this.setState({isSubmitted:true});
        //setTimeout(() => {
        this.props.history.push("/");
        //}, 2000); // Redirect after 2 seconds
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    const jsonConfData = JSON.parse(this.state.jsonConfData);
    console.log("Configuration Data: " + JSON.stringify(jsonConfData)); // Logs the content of the JSON file
    return (
      <MsalProvider instance={this.props.msalInstance}>
        <>
          <this.logincheck />
          <Container>
            <AuthenticatedTemplate>
              <Container>
                {/* <Link to="/" class="btn btn-primary">Back</Link> */}
                <div className="page-wrapper">
                  <div className="page-title">
                    <h1 className="h2">App. Settings</h1>
                  </div>
                  <div className="contentContainer">
                    <Row className="">
                      <Col md="5">
                        {this.state.showAlert && (
                          <Alert
                            style={{ marginBottom: 0 }}
                            variant="success"
                            onClose={() => this.setState({ showAlert: false })}
                            dismissible
                          >
                            Please setup your app settings to proceed for GenAI
                            assistant.
                          </Alert>
                        )}
                        <Formik
                          initialValues={{
                            PrimaryLogofile: "",
                            SecondaryLogofile: "",
                            leftImg: jsonConfData.leftImg.replace(
                              "{baseURL}",
                              appConfigdata.API_ENDPOINT
                            ),
                            headerText: jsonConfData.headingTxt,
                            subHeaderText: jsonConfData.subheadingTxt,
                            additional_instructions:
                              jsonConfData.additional_instructions,
                            rightImg: jsonConfData.rightImg,
                          }}
                          validationSchema={validationSchema}
                          enableReinitialize={true}
                          context={{
                            isLeftFileInputVisible:
                              this.state.isLeftFileInputVisible,
                          }}
                          onSubmit={this.handleSubmit}
                        >
                          {({ isSubmitting, setFieldValue }) => (
                            <Form>
                              {!this.state.isLeftFileInputVisible ? (
                                <FormGroup className="mb-3">
                                  <FormLabel className="form-label">
                                    Logo Image URL:
                                  </FormLabel>
                                  <Field
                                    type="text"
                                    name="leftImg"
                                    as={FormControl}
                                    className="form-control"
                                  />
                                  <div className="d-flex align-items-center">
                                    <button
                                      className="btn btn-primary customButton"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          isLeftFileInputVisible: true,
                                        });
                                        setFieldValue("leftImg", "");
                                      }}
                                    >
                                      Upload Image
                                    </button>
                                    &nbsp;&nbsp;
                                    <ErrorMessage
                                      name="leftImg"
                                      component={FormText}
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </FormGroup>
                              ) : (
                                <FormGroup className="mb-3">
                                  <FormLabel className="form-label">
                                    Logo File:
                                  </FormLabel>
                                  <FormControl
                                    type="file"
                                    name="PrimaryLogofile"
                                    className="form-control"
                                    onChange={(event) => {
                                      setFieldValue(
                                        "PrimaryLogofile",
                                        event.currentTarget.files[0]
                                      );
                                    }}
                                  />
                                  <div className="d-flex align-items-center">
                                    <button
                                      className="btn btn-primary customButton "
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({
                                          isLeftFileInputVisible: false,
                                        });
                                        setFieldValue("PrimaryLogofile", "");
                                      }}
                                    >
                                      Use Image URL
                                    </button>
                                    &nbsp;&nbsp;
                                    <ErrorMessage
                                      name="PrimaryLogofile"
                                      component={FormText}
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </FormGroup>
                              )}
                              {/* {!this.state.isRightFileInputVisible ? (
                                <FormGroup>
                                    <FormLabel>Secondary Image URL:</FormLabel>
                                    <Field type="text" name="rightImg" as={FormControl} />
                                    <ErrorMessage name="rightImg" component={FormText} />
                                    <a href="#" onClick={(e) => {e.preventDefault(); this.setState({isRightFileInputVisible: true})}}>Upload Image</a>
                                </FormGroup>
                                ):(

                                <FormGroup>
                                    <FormLabel>File:</FormLabel>
                                    <FormControl type="file" name="SecondaryLogofile" onChange={(event) => {
                                        setFieldValue("SecondaryLogofile", event.currentTarget.files[0]);
                                    }} />
                                    <ErrorMessage name="SecondaryLogofile" component={FormText} />
                                    <a href="#" onClick={(e) => {e.preventDefault(); this.setState({isRightFileInputVisible: false})}}>Use Image URL</a>
                                </FormGroup>
                                )} */}
                              <FormGroup className="mb-3">
                                <FormLabel className="form-label">
                                  Title: <span style={{ color: "red" }}>*</span>
                                </FormLabel>
                                <Field
                                  type="text"
                                  name="headerText"
                                  as={FormControl}
                                  className="form-control"
                                />
                                <div
                                  className="d-flex align-items-center"
                                  style={{ height: "10px" }}
                                >
                                  <ErrorMessage
                                    name="headerText"
                                    component={FormText}
                                    style={{ color: "red" }}
                                  />
                                </div>
                              </FormGroup>

                              <FormGroup className="mb-3">
                                <FormLabel className="form-label">
                                  Tagline:
                                </FormLabel>
                                <Field
                                  type="text"
                                  name="subHeaderText"
                                  as={FormControl}
                                  className="form-control"
                                />
                                <div
                                  className="d-flex align-items-center"
                                  style={{ height: "10px" }}
                                >
                                  <ErrorMessage
                                    name="subHeaderText"
                                    component={FormText}
                                    style={{ color: "red" }}
                                  />
                                </div>
                              </FormGroup>

                              <div className="d-flex align-items-center">
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="mt-3 mr-3 customColor customButton "
                                >
                                  Save
                                </Button>
                                {jsonConfData.headingTxt && (
                                  <Link
                                    to="/"
                                    className="btn mt-3 ml-4 btn-secondary customColor"
                                    style={{
                                      borderColor: "darkgrey",
                                      marginLeft: "10px",
                                      textDecoration: "none",
                                    }}
                                  >
                                    Back
                                  </Link>
                                )}
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                    {this.state.isSubmitted && (
                      <p style={{ color: "green" }}>
                        Data saved successfully! ..Redirecting to home page
                      </p>
                    )}
                  </div>
                </div>
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
  getConfigData(username) {
    // const currentAccount = this.props.msalInstance.getActiveAccount();
    // if (currentAccount) {
    //this.setState({username:username});
    fetch(appConfigdata.API_ENDPOINT + "/getConfigData", {
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
              this.setState({ showAlert: true });
            } else {
              throw new Error(text);
            }
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          const jsonData = {
            leftImg: data.configData.leftImg,
            headingTxt: data.configData.headingTxt,
            subheadingTxt: data.configData.subheadingTxt,
            additional_instructions: data.additional_instructions,
          };
          this.setState({ jsonConfData: JSON.stringify(jsonData) });
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
        this.getConfigData(currentAccount.username);
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
                          {this.state.jsonConfData.headingTxt !== "" && (
                            <Dropdown.Item as={Link} to="/">
                              Home
                            </Dropdown.Item>
                          )}
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

export default ConfigurationScreen;
