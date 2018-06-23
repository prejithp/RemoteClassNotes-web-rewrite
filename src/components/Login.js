import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import "./Login.css";
import { Card, CardContent, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import CardInput from "./CardTextInput";
import { Redirect, withRouter } from "react-router-dom";
import firebase from "./Firebase";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: {
        value: "",
        isError: false,
        errorText: ""
      },
      password: {
        value: "",
        isError: false,
        errorText: ""
      },
      progressControls: {
        isLoading: false
      }
    };
  }

  mailFieldHandler = event => {
    this.setState({
      mail: {
        ...this.state.mail,
        value: event.target.value
      }
    });
  };

  passwordFieldHandler = event => {
    this.setState({
      password: {
        ...this.state.password,
        value: event.target.value
      }
    });
  };

  setEmailError = () => {
    this.setState({
      mail: {
        ...this.state.mail,
        isError: true,
        errorText: "Badly formatted email"
      }
    });
  };

  removeEmailError = () => {
    this.setState({
      mail: {
        ...this.state.mail,
        isError: false,
        errorText: ""
      }
    });
  };

  setPasswordError = () => {
    this.setState({
      password: {
        ...this.state.password,
        isError: true,
        errorText: "Incorrect email or password"
      }
    });
  };

  keyPressHandler = event => {
    if (event.keyCode === 13) {
      this.loginHandler();
      console.log("Enter button logged");
    }
  };

  loginHandler = () => {
    this.setState({
      ...this.state,
      progressControls: {
        isLoading: true
      }
    });

    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.mail.value,
        this.state.password.value
      )
      .then(() => {
        console.log("Redirecting to subject after auth");

        this.setState({
          ...this.state,
          progressControls: {
            isLoading: true
          }
        });

        localStorage.setItem("isLoggedIn", "true");
        this.props.history.push("/subjects");
      })
      .catch(error => {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
          case "auth/argument-error":
            this.setEmailError();
            break;
          case "auth/wrong-password":
            this.setPasswordError();
            this.removeEmailError();
            break;
          default:
            break;
        }
        this.setState({
          ...this.state,
          progressControls: {
            isLoading: true
          }
        });
        console.log(error);
      });
  };

  render() {
    if (localStorage.getItem("isLoggedIn") === "true") {
      console.log("Redirecting to subjects");
      return <Redirect to="/subjects" />;
    }

    return (
      <div className="container" onKeyDown={this.keyPressHandler}>
        <Typography variant="title" className="card-item" color="primary">
          Remote Class Notes
        </Typography>
        <Card className="card-container">
          <CardContent>
            <Typography
              variant="headline"
              color="primary"
              className="card-item"
            >
              Login
            </Typography>
            <CardInput
              name="login-email"
              placeholder="Email ID"
              type="email"
              autoFocus={true}
              onChange={this.mailFieldHandler}
              value={this.state.mail.value}
              error={this.state.mail.isError}
              helperText={this.state.mail.errorText}
              icon="AccountCircle"
            />
            <CardInput
              name="login-password"
              placeholder="Password"
              type="password"
              onChange={this.passwordFieldHandler}
              value={this.state.password.value}
              error={this.state.password.isError}
              helperText={this.state.password.errorText}
              icon="Lock"
            />
            <div className="progress-circle">
              {this.state.progressControls.isLoading && <CircularProgress />}
            </div>
            <div className="card-item">
              <Button
                variant="raised"
                color="primary"
                onClick={this.loginHandler}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withRouter(Login);
