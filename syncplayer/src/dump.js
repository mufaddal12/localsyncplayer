import React, { useState, useRef, useEffect } from "react";
import { findDOMNode } from "react-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import FullScreen from "@material-ui/icons/Fullscreen";
import Popover from "@material-ui/core/Popover";
import screenful from "screenfull";
import Controls from "./components/Controls";
import * as constants from "./constants";

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",

    position: "relative",
    // "&:hover": {
    //   "& $controlsWrapper": {
    //     visibility: "visible",
    //   },
    // },
  },
}));

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function App() {
  const classes = useStyles();
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,

    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const [isConnected, setIsConnected] = useState(false);
  const [roomName, setRoomName] = useState("");

  const controlClientRef = useRef(null);
  const chatClientRef = useRef(null);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    playing,
    light,

    muted,
    loop,
    playbackRate,
    pip,
    played,
    volume,
  } = state;

  useEffect(() => {
    // if (!controlClientRef.current && isConnected) {
    //   controlClientRef.current = new WebSocket(
    //     constants.controlURL + roomName + "/"
    //   );
    //   controlClientRef.current.onopen = () => {
    //     // handleControlClientConnect();
    //   };
    //   controlClientRef.current.onmessage = (message) => {
    //     // handleControlReceived(message);
    //   };
    //   chatClientRef.current = new WebSocket(constants.chatURL + roomName + "/");
    //   chatClientRef.current.onopen = () => {
    //     // handleChatClientConnect();
    //   };
    //   chatClientRef.current.onmessage = (message) => {
    //     // handleChatReceived(message);
    //   };
    // }
  }, [isConnected]);

  const handleControlClientConnect = () => {
    console.log("WebSocket Control Client Connected");
  };
  const handleControlReceived = (message) => {
    var controls = message.data;
    console.log(controls);
    if (controls.newjoin) {
      console.log("newjoin");
      setState({ ...state, playing: controls.playing });
    } else {
      setState({ ...state, playing: controls.playing });
      setState({ ...state, playbackRate: controls.playbackRate });
      playerRef.current.seekTo(controls.currentTime);
    }
    // console.log(message.data);
  };

  // const handleChatClientConnect = () => {
  //   console.log("WebSocket Chat Client Connected");
  // };
  // const handleChatReceived = (message) => {
  //   console.log(message.data);
  // };
  const handleSendControl = () => {
    // if (controlClientRef.current) {
    //   var controls = {
    //     playing: !playing,
    //     playbackRate: playbackRate,
    //     currentTime: playerRef.current.getCurrentTime(),
    //   };
    //   controlClientRef.current.send(JSON.stringify(controls));
    // }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    var tempRoomName = document.getElementById("roomName").value;
    if (tempRoomName != "") {
      setRoomName(tempRoomName);
      setIsConnected(true);
    }
  };
  const sendStates = () => {
    // control_client.send(JSON.stringify(temp));
  };

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
    handleSendControl();
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    handleSendControl();
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    handleSendControl();
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    console.log({ newValue });
    setState({ ...state, played: parseFloat(newValue / 100) });
    handleSendControl();
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, "fraction");
    handleSendControl();
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    // console.log(newValue);
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    console.log(controlsRef.current);
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat == "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
    handleSendControl();
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVideoUpload = (event) => {
    setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  };
  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
  const elapsedTime =
    timeDisplayFormat == "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  const [videoFilePath, setVideoFilePath] = useState(null);

  const handlePlay = () => {
    console.log("Playing");
  };

  const handlePause = () => {
    console.log("Pause");
  };

  const handleSeek = (e) => {
    console.log("Seeking");
  };
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant={"h5"}>React Sync Player</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div>
        <div>
          <input type="text" id="roomName"></input>
          <button onClick={handleConnect}>connect</button>
        </div>
      </div>
      <Toolbar />
      <input
        type="file"
        style={{ display: "none" }}
        id="contained-button-file"
        onChange={handleVideoUpload}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload Video
        </Button>
      </label>
      <Container maxWidth="md">
        <div
          // onMouseMove={handleMouseMove}
          // onMouseLeave={hanldeMouseLeave}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url={videoFilePath}
            pip={pip}
            playing={playing}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            controls={true}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            config={{
              file: {
                attributes: {
                  crossorigin: "anonymous",
                },
              },
            }}
          />
          {/* 
          <Controls
            ref={controlsRef}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            onDuration={handleDuration}
            onRewind={handleRewind}
            onPlayPause={handlePlayPause}
            onFastForward={handleFastForward}
            playing={playing}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onMute={handleMute}
            muted={muted}
            onVolumeChange={handleVolumeChange}
            onVolumeSeekDown={handleVolumeSeekDown}
            onChangeDispayFormat={handleDisplayFormat}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRate}
            onToggleFullScreen={toggleFullScreen}
            volume={volume}
          /> */}
        </div>
        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default App;
