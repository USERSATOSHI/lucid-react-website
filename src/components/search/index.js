import "../default/index.css";
import "./index.css";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

export default function Search ()
{
        const navigate = useNavigate();
    const usePressEnter = (e) => {
        if (e.key === "Enter" || e.key === "NumpadEnter") {
            submit();
        }
    };
    const submit = async (e) => {
        // e.preventDefault();
        console.log(search);
        const client = await (await import("../default/client.js")).default;
        console.log( { client } );
        console.log( { search } );
        const res = await client.search( search, { type: "video" } );
        console.log(res.videos[0])
        const parsed = res.videos.map( ( video, index ) =>
        {
            console.log( video.short_view_count );
            return {
                id: video.id,
                title: video.title.text,
                views: video.short_view_count?.text,
                duration: video.duration?.text ?? "0 seconds",
                thumbnail: video.thumbnails[0].url,
                author: {
                    name: video.author?.name ?? "Unknown", 
                    thumbnail: video.author?.thumbnails[0].url ?? "",
                },
            };
        })
        console.log({ res:parsed[0] });
        // redirect to search page
        navigate( "/search", {
            'state': {
                'search': parsed, 
                },
            });
    };
    const [search, setSearch] = useState("");
    const updateSearch = (e) => {
        setSearch(e.target.value);
    };
    return (
        <div className="search">
            <input
                className="searchbar"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={ e => updateSearch( e ) }
                onKeyDown={usePressEnter}
            />
            <div className="searchicon" onClick={submit}>
                <SendIcon />
            </div>
        </div>
    );
}
