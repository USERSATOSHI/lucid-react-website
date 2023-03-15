import "./queueItem.css";
import "../../default/index.css";

import { Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../default/theme.js";

export default function QueueItem ( props ) {
    return (
        <ThemeProvider theme={theme}>
            <Paper
                id="queueItem"
                elevation={3}
                onClick={(e) => {
                    props.onClick(e);
                } }
                sx={ {
                    height: "128px",
                }}
            >
                <div className="queueItemTitle">{props.song.title}</div>
                <div className="queueItemArtist">{props.song.author.name}</div>
            </Paper>
        </ThemeProvider>
    );
}