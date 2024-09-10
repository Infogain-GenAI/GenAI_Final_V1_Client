import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Image,
} from "react-bootstrap";
import configData from "./whitelabel.json";
import { MsalProvider } from "@azure/msal-react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from "@azure/msal-react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Clock from "react-live-clock";

class Support extends React.Component {
  constructor(props) {
    super(props);

    this.logincheck = this.logincheck.bind(this);
  }
  render() {
    return (
      <MsalProvider instance={this.props.msalInstance}>
        <>
          <this.logincheck />
          <Container>
            <div className="page-wrapper">
              <div className="page-title">
                <h1 className="h2">Support for GenAI Assistants</h1>
              </div>
              <div className="contentContainer">
                <p>
                  GenAI Assistants are designed to help you with a wide range of
                  tasks. We are versatile, adaptable, and capable of learning
                  from experience.
                </p>
                <p>Here are some things you can ask your GenAI Assistant:</p>
                <ul>
                  <li>Perform mathematical calculations</li>
                  <li>Sort data in various ways</li>
                  <li>Help with customer service inquiries</li>
                  <li>
                    Provide information about products on an ecommerce platform
                  </li>
                  <li>
                    Help you understand complex concepts by providing clear and
                    concise explanations
                  </li>
                </ul>
                <p>
                  If you have any questions or need further assistance, please
                  don't hesitate to ask your GenAI Assistant.
                </p>
                <p>
                  <Link
                    className="btn btn-primary customColor customButton"
                    to="#"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </Link>
                </p>
              </div>
            </div>
          </Container>
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
              <Nav.Link href="/Support">About Us</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md="auto" className="small">
          © {new Date().getFullYear()} All rights reserved.
        </Col>
      </Row>
    );
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

export default Support;
