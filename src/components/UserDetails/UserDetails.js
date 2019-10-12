import React from "react";
import "./UserDetails.css";

export class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: false
    };
    this.trigger = this.trigger.bind(this);
    this.showtext = this.showtext.bind(this);
    this.displayUserDetails = this.displayUserDetails.bind(this);
  }

  showtext() {
    if (this.state.test) {
      return (
        <div className="dropdown">
          <li className="dropdown-text" onClick={this.props.changeLogin}>
            Change User
          </li>
        </div>
      );
    } else {
      return;
    }
  }

  trigger() {
    if (this.state.test) {
      this.setState({
        test: false
      });
    } else {
      this.setState({
        test: true
      });
    }
  }

  displayUserDetails() {
    if (this.props.userName) {
      return (
        <div>
          <h2 className="text-large">
            {this.props.userName}
            <a ref={this.setWrapperRef}>
              <i onClick={this.trigger} className="down"></i>
            </a>
          </h2>
          {this.showtext()}
        </div>
      );
    }
  }

  render() {
    return <div className="container">{this.displayUserDetails()}</div>;
  }
}

export default UserDetails;
