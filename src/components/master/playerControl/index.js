import "./index.css";
import "../../default/index.css";
import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import player from "../../default/player.js";
export default function PlayerControl ()
{ 
    const [ play, setPlay ] = useState( false );
    
    const playPause = () =>
    {
        setPlay( !play );
    }

    player.on( "statusChange", ( status ) =>
    {
        if ( status !== "play" )
        {
            setPlay( false );
        } else
        {
            setPlay( true );
        }
    })

    return (
        <div className="playerControl">
            <div className="prev">
                <SkipPreviousIcon />
            </div>
            <div className="play" onClick={ e =>
            {
                playPause();
                if ( play )
                {
                    player.pause();
                } else
                {
                    player.resume();
                }
            }
            }>
                { play ? <PauseIcon /> : <PlayArrowIcon /> }
            </div>
            <div className="next">
                <SkipNextIcon />
            </div>
        </div>
    )
}