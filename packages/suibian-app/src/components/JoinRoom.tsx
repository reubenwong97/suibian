//app components
import React, { Component, FormEvent, ChangeEvent } from "react";
import NavBar from "./NavBar";

//css
import "../css/JoinRoom.css";
import { withRouter } from "react-router-dom";

// Sockets and Redux
import * as SocketTypes from "../types/SocketState";
import { connect } from "react-redux";
import ReduxState from "../types/ReduxState";

// Types
type OwnProps = {
  history: any;
  location: any;
  match: any;
};

type StateProps = {
  socketState: SocketTypes.SocketState;
};

type DispatchProps = {
  updateSocketState: (
    key: string,
    value: string | number | SocketTypes.SuibianSocket
  ) => void;
};

type Props = StateProps & DispatchProps & OwnProps;

class JoinRoom extends Component<Props> {
  // Methods
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.updateSocketState(e.target.id, e.target.value);
  };

  // Function to handle joining room after submission of details
  joinRoom = (e: FormEvent) => {
    e.preventDefault();
    console.log("Joining room...");
    if (this.props.socketState.socket) {
      this.props.socketState.socket.emit("joinRoom", {
        username: this.props.socketState.username,
        roomCode: this.props.socketState.roomCode
      });

      // Redirect to room lobby
      this.props.history.push("/roomlobby");
    }
  };

  render() {
    return (
      <>
        <NavBar />
        <div className="join-room">
          <div className="app-content flex-container flex-col flex-center-h flex-center-v">
            <h1 className="title">Join room</h1>
            <form className="join-room-form" onSubmit={this.joinRoom}>
              <input
                type="text"
                onChange={this.handleChange}
                id="roomCode"
                placeholder="Room code"
                className="username-input"
                autoComplete="off"
                required
              />
              <br></br>
              <input
                type="text"
                onChange={this.handleChange}
                id="username"
                placeholder="Username"
                className="username-input"
                autoComplete="off"
                required
              />
              <br></br>
              <button>JOIN ROOM</button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

// Redux functions
const mapStateToProps = (state: ReduxState): StateProps => {
  return {
    socketState: state.socketState
  };
};

// Links a dispatch function to a prop
const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    updateSocketState: (key, value) => {
      dispatch({
        type: "UPDATE_SOCKET_STATE",
        key: key,
        value: value
      });
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(JoinRoom)
);
