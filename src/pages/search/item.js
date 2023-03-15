import "./item.css";
import "../../components/default/index.css"
import player from "../../components/default/player.js"

function PlayButton(props) {
    return (
        <div id={props.id} className="playButton" onClick={props.onClick}>
            <i className="fas fa-play icon"></i>
        </div>
    );
}
export default function Item ( props )
{
    async function play(song) {
        const client = await (
            await import("../../components/default/client.js")
        ).default;
        const info = await client.getBasicInfo(song.id);
        const dataid = player.getDataId();
        if (dataid === song.id + "_button") {
            if (player.status === "playing") player.pause();
            else {
                player.resume();
            }
            return false;
        }
        const url = info.streaming_data?.formats[0].decipher(
            client.session.player,
        );
        console.log({ url });

        player.forcePlay({
            src: url,
            ...song,
        });
        player.queue = props.wholeList.slice( props.wholeList.indexOf( song ) );
    }

    return (
        <div className="item">
            <div className="song-logo">
                <img src={props.song.thumbnail} alt="song-logo" />
            </div>
            <PlayButton
                id={props.song.id + "_button"}
                onClick={(e) => play(props.song, e)}
            />
            <div className="song-info">
                <div className="song-title" onClick={props.onClick}>
                    {props.song.title}
                </div>
                <div className="song-views">{props.song.views}</div>
                <div className="song-duration">
                    length: {props.song.duration}
                </div>
                <div className="song-author">
                    <div className="author-logo">
                        <img
                            src={
                                props.song.author.thumbnail ??
                                "../../assets/unknown_user.png"
                            }
                            alt="author-logo"
                        />
                    </div>
                    <div className="author-name">{props.song.author.name}</div>
                </div>
            </div>
        </div>
    );
}
