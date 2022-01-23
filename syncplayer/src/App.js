import React, { useState, useRef, useEffect } from "react";
import { findDOMNode } from "react-dom";

import ReactPlayer from "react-player";
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import { controlURL, useStyles } from "./constants";

function App() {
  const classes = useStyles();
  const [playing, setPlayingState] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  // const [isSeeking, setIsSeeking] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [videoFilePath, setVideoFilePath] = useState(null);

  const controlClientRef = useRef(null);
  const chatClientRef = useRef(null);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    if (!controlClientRef.current && isConnected) {
      controlClientRef.current = new WebSocket(controlURL + roomName + "/");

      controlClientRef.current.onopen = () => {
        console.log("WebSocket Control Client Connected");
      };

      controlClientRef.current.onmessage = (message) => {
        handleControlReceived(message);
      };
      controlClientRef.current.onclose = (message) => {
        console.log("WebSocket Control Client Disconnected");
        controlClientRef.current = null;
        setIsConnected(false);
      };
      // chatClientRef.current = new WebSocket(constants.chatURL + roomName + "/");

      // chatClientRef.current.onopen = () => {
      //   // handleChatClientConnect();
      // };

      // chatClientRef.current.onmessage = (message) => {
      //   // handleChatReceived(message);
      // };
    }
  }, [isConnected]);

  const handleConnect = (e) => {
    e.preventDefault();
    var tempRoomName = document.getElementById("roomName").value;
    if (tempRoomName != "") {
      setRoomName(tempRoomName);
      setIsConnected(true);
    }
  };

  const handleControlReceived = (message) => {
    var controls = JSON.parse(message.data);

    console.log("received: ", controls);

    if (controls.newjoin) {
      setPlayingState(controls.playing);
    } else {
      playerRef.current.seekTo(controls.played, "seconds");
      setPlayingState(controls.playing);
    }
  };

  const handleSendControl = () => {
    if (controlClientRef.current) {
      var controls = {
        playing: playerRef.current.player.isPlaying,
        played: playerRef.current.getCurrentTime(),
      };
      console.log("sending:", controls);

      controlClientRef.current.send(JSON.stringify(controls));
    }
  };

  // const handleChatClientConnect = () => {
  //   console.log("WebSocket Chat Client Connected");
  // };
  // const handleChatReceived = (message) => {
  //   console.log(message.data);
  // };

  const handleVideoUpload = (event) => {
    setVideoFilePath(URL.createObjectURL(event.target.files[0]));
  };

  const handlePlay = () => {
    if (playing) return;
    console.log("Playing");
    handleSendControl();
  };

  const handlePause = () => {
    if (!playing) return;
    console.log("Pause");
    handleSendControl();
  };

  return (
    <>
      <AppBar position="fixed" style={{ background: "#263238" }}>
        <Toolbar>
          <Typography variant={"h5"} style={{ color: "#cfd8dc" }}>
            React Sync Player
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div class={classes.container}>
        <div class={classes.leftpane}>
          <Box textAlign="center">
            <Typography variant={"h5"} style={{ color: "#263238" }}>
              Connect to Room
            </Typography>

            <TextField
              label="Enter Room Name"
              style={{ color: "#263238" }}
              id="roomName"
              fullWidth
            />
            <br />
            <br />
            <Button
              variant="contained"
              style={{ color: "#263238", background: "#cfd8dc" }}
              component="span"
              onClick={handleConnect}
            >
              Connect
            </Button>
          </Box>
        </div>
        <div class={classes.middlepane}>
          <Box textAlign="center">
            <Container maxWidth="md">
              <div ref={playerContainerRef} className={classes.playerWrapper}>
                <ReactPlayer
                  ref={playerRef}
                  width="100%"
                  height="100%"
                  url={videoFilePath}
                  pip={false}
                  playing={playing}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  controls={true}
                  light={false}
                  loop={true}
                  playbackRate={playbackRate}
                  volume={0.1}
                  muted={false}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: "true",
                      },
                      // tracks: [
                      //   {
                      //     kind: "subtitles",
                      //     src: "sub.vtt",
                      //     srcLang: "en",
                      //     default: true,
                      //   },
                      // ],
                    },
                  }}
                />
              </div>
            </Container>

            <br />
            <Button
              variant="contained"
              component="label"
              style={{ color: "#263238", background: "#cfd8dc" }}
            >
              Upload Video
              <input type="file" hidden onChange={handleVideoUpload} />
            </Button>
          </Box>
        </div>
        <div class={classes.rightpane}>
          <h1>Chat here</h1>
        </div>
      </div>
    </>
  );
}

export default App;
