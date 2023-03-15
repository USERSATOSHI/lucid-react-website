import "./index.css";
import "../../default/index.css";
import { Drawer } from "@mui/material";
import { useState } from "react";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import Button from "@mui/material/Button";
import theme from "../../default/theme.js";
import { ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import player from "../../default/player.js";
import QueueItem from "./queueItem.js";
export default function QueueControl() {
    const [open, setOpen] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setOpen(open);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="queueControl">
                <Button color="input" className="otherOptBtn">
                    <KeyboardArrowUpIcon />
                </Button>
                <Button
                    color="input"
                    onClick={toggleDrawer(true)}
                    className="queueButton"
                >
                    <QueueMusicIcon />
                </Button>
                <Drawer anchor="right" open={open} sx={{overflowX:"hidden",msOverflowX:"hidden"}}>
                    <div className="closeBtn" onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </div>
                    <div className="drawer">
                        {
                            player.queue.map( ( song, index ) =>
                            {
                                return (
                                    <QueueItem
                                        key={song.id}
                                        song={song}
                                        wholeList={player.queue}
                                        onClick={(e) => {
                                            player.skipTo(index)
                                        }}
                                    />
                                );
                            })
                        }
                    </div>
                </Drawer>
            </div>
        </ThemeProvider>
    );
}
