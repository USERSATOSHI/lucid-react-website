import "./index.css";
import "../default/index.css";
// import deterministic linear progress from material
import Slider from "@mui/material/Slider";
import PlayerControl from "./playerControl/index.js";
import { useState } from "react";
import QueueControl from "./queueControl/index.js";
import theme from "../default/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import player from "../default/player.js";
export default function Master() {
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState("00:00");
    const updateProgress = (val) => {
        setProgress(val);
    };
    const updateDuration = (val) => {
        setDuration(val);
    };
    function up(p) {
        updateProgress(p);
    }
    player.on("progressChange", up);

    const secToDigital = (s) => {
        if (isNaN(s)) return "00:00";

        s = Math.floor(s);
        const min = Math.floor(s / 60);
        const sec = s % 60;
        const minStr = min < 10 ? "0" + min : min;
        const secStr = sec < 10 ? "0" + sec : sec;
        return minStr + ":" + secStr;
    };

    player.audio.addEventListener("timeupdate", () => {
        updateDuration(secToDigital(player.audio.currentTime));
    });

    return (
        <ThemeProvider theme={theme}>
            <div className="master">
                <PlayerControl />
                <div className="center">
                    <Slider
                        track="normal"
                        color="input"
                        size="small"
                        variant="determinate"
                        valueLabelDisplay="off"
                        value={progress}
                        className="slider"
                        onChange={ ( _, val ) =>
                        {
                            updateProgress( val );
                            // player.removeListener( "progressChange", up );
                        }
                        }
                        onChangeCommitted={(_, val) => {
                            player.seekTo(val);
                            // player.on("progressChange", up);
                        }}
                    />
                    <div className="time">
                        <span className="current">{duration}</span>
                        <span className="divider">/</span>
                        <span className="total">
                            {secToDigital(player.audio.duration)}
                        </span>
                    </div>
                </div>
                <QueueControl />
            </div>
        </ThemeProvider>
    );
}
