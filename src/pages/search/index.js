import React from 'react'
import { useLocation } from 'react-router-dom'
import Item from './item.js';
import "./index.css";
export default function Search (props)
{
    const location = useLocation();
    console.log( { location } );

    return (
        <div className='itemList'>
            {
                location.state.search.map( ( song, index ) => {
                    return (
                        <Item
                            key={song.id}
                            song={song}
                            wholeList={location.state.search}
                            onClick={(e) => {
                                console.log({ song });
                            }}
                        />
                    );
                }
                )
            }
        </div>
    )
    
}