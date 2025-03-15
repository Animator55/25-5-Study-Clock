import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

class Body extends React.Component {
  constructor(props) {
    super(props);

    this.audioRef = React.createRef();
    this.state = {
      isBreak: false,
      timeLeft: this.props.sessionLength * 60
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.sessionLength !== prevProps.sessionLength ||
      this.props.breakLength !== prevProps.breakLength
    ) {
      this.setState({
        timeLeft: this.props.sessionLength * 60
      });
    }
  }

  decreaseTimeLeft = () => {
    const { isPaused } = this.props;
    const { timeLeft } = this.state;

    if (!isPaused) {
      if (timeLeft > 0) {
        this.setState(() => ({
          timeLeft: this.state.timeLeft - 1
        }));
      } else if (timeLeft === 0) {
        if (this.state.isBreak) {
          this.setState(() => ({
            timeLeft: this.props.sessionLength * 60,
            isBreak: false
          }));
        } else {
          this.setState(() => ({
            timeLeft: this.props.breakLength * 60,
            isBreak: true
          }));
        }

        this.props.click("timerFinished");
      }

      if (timeLeft === 1) {
        const audioElement = this.audioRef.current;
        audioElement.play();
      }
    }
  };

  componentDidMount() {
    this.timerInterval = setInterval(this.decreaseTimeLeft, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    const Play = (
      <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M 384 256 C 384 239.2 39.6 29.6 24.5 38.1 C 9.4 46.6 9.4 465.4 24.5 473.9 C 39.6 482.4 384 272.8 384 256 Z" />
      </svg>
    );

    const Pause = (
      <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="194.044"
          y="64.673"
          width="125.726"
          height="383.7"
          stroke="#000000"
          fillRule="nonzero"
        />
        <rect
          x="0.968"
          y="64.081"
          width="125.726"
          height="383.7"
          stroke="#000000"
          fillRule="nonzero"
        />
      </svg>
    );

    const Reset = (
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M 105.1 202.6 C 112.8 180.8 125.3 160.3 142.9 142.8 C 205.4 80.3 306.7 80.3 369.2 142.8 L 386.3 160 C 387.633 161.333 310.825 181.125 304 192 C 297.175 202.875 463.5 224 463.5 224 L 463.9 224 C 481.6 224 472.975 32 463.9 32 C 454.825 32 434.47 115.2 431.9 115.2 L 414.4 97.6 C 326.9 10.1 185.1 10.1 97.6 97.6 C 73.2 122 55.6 150.7 44.8 181.4 C 38.9 198.1 99.2 219.3 105.1 202.7 L 105.1 202.6 Z M 208 320 C 209.916 308.049 29.2 293.5 25.3 297.5 C 21.3 301.5 38.087 480 48 480 C 57.913 480 76.17 396.9 80 396.9 L 97.6 414.4 C 185.1 501.8 326.9 501.8 414.3 414.4 C 438.7 390 456.4 361.3 467.2 330.7 C 473.1 314 412.8 292.8 406.9 309.4 C 399.2 331.2 386.7 351.7 369.1 369.2 C 306.6 431.7 205.3 431.7 142.8 369.2 L 142.7 369.1 L 125.6 352 C 124.601 349.003 206.084 331.951 208 320 Z" />
      </svg>
    );

    return (
      <div style={{ textAlign: "center" }}>
        <audio
          ref={this.audioRef}
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
        <label id="timer-label">
          {this.state.isBreak ? "Break" : "Session"}
        </label>
        <div
          id="time-left"
          className={
            this.state.timeLeft <= 10 && !this.props.isPaused
              ? "time-warning"
              : this.state.timeLeft <= 60 && !this.props.isPaused
              ? "red-text"
              : ""
          }
        >
          {formatTime(this.state.timeLeft)}
        </div>
        <div className="action-buttons">
          <button
            id="start_stop"
            onClick={() => this.props.click("togglePause")}
            title={this.props.isPaused ? "Play" : "Pause"}
          >
            {this.props.isPaused ? Play : Pause}
          </button>
          <button
            id="reset"
            title="Reset to default settings"
            onClick={() => {
              this.setState(() => ({
                timeLeft: this.props.sessionLength * 60,
                isBreak: false
              }));

              const audioElement = this.audioRef.current;
              audioElement.pause();
              audioElement.currentTime = 0;

              this.props.click("reset");
            }}
          >
            {Reset}
          </button>
        </div>
      </div>
    );
  }
}

const TimerElement = (props) => {
  const Angle = (
    <svg
      viewBox="109 82 228 202"
      height="15px"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsBx="https://boxy-svg.com"
    >
      <path
        style={{ stroke: "rgb(0, 0, 0)" }}
        d="M 113 255 C 113 255 188.242 83 223.242 83 C 248.825 83 333 255 333 255 C 343 280 326 287 326 280 C 321 250 249.242 154.943 223.242 154.943 C 201.043 154.943 125 250 120 280 C 120 287 103 280 113 255 Z"
        bxOrigin="0.5 0.577778"
      />
    </svg>
  );

  const { label, currentLength } = props;
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div>
      <label id={label + "-label"}>{capitalizedLabel} Length:</label>
      <div className="amount-section">
        <div className="buttons-amount">
          <button
            id={label + "-increment"}
            onClick={() => {
              // not be able to set a session or break > 60
              if (currentLength < 60) {
                console.log(currentLength);
                props.click("increment" + capitalizedLabel);
              }
            }}
          >
            {Angle}
          </button>
          <button
            id={label + "-decrement"}
            onClick={() => {
              // not be able to set a session or break <= 0
              if (currentLength > 1) {
                props.click("decrement" + capitalizedLabel);
              }
            }}
          >
            {Angle}
          </button>
        </div>
        <p id={label + "-length"} className="current-value">
          {currentLength}
        </p>
      </div>
    </div>
  );
};

const TimerReducer = (state, value) => {
  const result = {
    togglePause: {
      ...state,
      isPaused: !state.isPaused
    },
    incrementBreak: {
      ...state,
      breakLength: state.breakLength + 1,
      isPaused: true
    },
    decrementBreak: {
      ...state,
      breakLength: state.breakLength - 1,
      isPaused: true
    },
    incrementSession: {
      ...state,
      sessionLength: state.sessionLength + 1,
      isPaused: true
    },
    decrementSession: {
      ...state,
      sessionLength: state.sessionLength - 1,
      isPaused: true
    },
    reset: {
      sessionLength: 25,
      breakLength: 5,
      isPaused: true
    }
  };

  return result[value];
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      // set the states in seconds
      sessionLength: 25,
      breakLength: 5,
      isPaused: true
    };
  }

  handleClick(value) {
    this.setState(() => {
      return TimerReducer(this.state, value);
    });
  }

  render() {
    return (
      <div id="timer">
        <Body
          sessionLength={this.state.sessionLength}
          breakLength={this.state.breakLength}
          click={this.handleClick}
          isPaused={this.state.isPaused}
        />
        <div className="timer-elements">
          <TimerElement
            label="session"
            click={this.handleClick}
            currentLength={this.state.sessionLength}
          />
          <TimerElement
            label="break"
            click={this.handleClick}
            currentLength={this.state.breakLength}
          />
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Timer />
  </StrictMode>,
)
