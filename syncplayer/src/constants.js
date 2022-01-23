import { makeStyles } from "@material-ui/core/styles";

export const URL = "wss://localsyncplayer-back.herokuapp.com/";
export const chatURL = URL + "chat/";
export const controlURL = URL + "control/";

export const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",

    position: "relative",
  },
  leftpane: {
    width: "16%",
    height: "100%",
    float: "left",
  },
  middlepane: {
    width: "59%",
    height: "100%",
    float: "left",
  },
  rightPane: {
    width: "25%",
    height: "100%",
    float: "right",
  },
  container: {
    width: "100%",
    height: "100%",
  },
}));
