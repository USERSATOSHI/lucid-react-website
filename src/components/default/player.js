import EventEmitter from "events";
import client from "./client.js";
class Player extends EventEmitter
{
    constructor ()
    {
        super();
        this.queue = [];
        this.currentIndex = 0;
        this.loop = "none";
        this.shuffle = false;
        this.audio = new Audio();
        this.status = "idle";
        this.currentTrackProgress = 0;

        this.audio.addEventListener("ended", () => {
            const itemId = this.audio.getAttribute("data-id");
            const itemButton = document.getElementById(itemId);
            if (!itemButton) return;
            itemButton.innerHTML = `<i class="fas fa-play icon"></i>`;
            this.emit( "statusChange", "ended" );
            this.currentTrackProgress = 0;
            this.next();
        });

        this.audio.addEventListener( "error", () =>
        {
             const itemId = this.audio.getAttribute("data-id");
             const itemButton = document.getElementById(itemId);
             if (!itemButton) return;
             itemButton.innerHTML = `<i class="fas fa-play icon"></i>`;
            this.status = "error";
            this.emit( "statusChange", "error" );
            this.next();
        });

        this.audio.addEventListener("canplay", () => {
            this.audio.play();
        });

        this.audio.addEventListener("pause", () => {
            console.log("pause");
            const masterId = this.audio.getAttribute("data-master-id");
            const masterButton = document.getElementById(masterId);
            masterButton?.classList.remove("playing");
            masterButton?.classList.add("paused");

            const itemId = this.audio.getAttribute("data-id");
            const itemButton = document.getElementById(itemId);
            if (!itemButton) return;
            itemButton.innerHTML = `<i class="fas fa-play icon"></i>`;
            console.log("pause updated");
            this.status = "paused";
            this.emit( "statusChange", "paused" );
        });

        this.audio.addEventListener("play", () => {
            const masterId = this.audio.getAttribute("data-master-id");
            const masterButton = document.getElementById(masterId);
            masterButton?.classList.remove("paused");
            masterButton?.classList.add("playing");

            const itemId = this.audio.getAttribute("data-id");
            const itemButton = document.getElementById(itemId);
            itemButton.innerHTML = `<i class="fas fa-pause icon"></i>`;
            this.status = "playing";
            this.emit( "statusChange", "play" );
        });

        this.audio.addEventListener("stop", (e) => {
            console.log(e);
            const dataId = e.detail.id;
            const masterId = e.detail.masterId;

            const masterButton = document.getElementById(masterId);
            masterButton?.classList.remove("playing");
            masterButton?.classList.remove("paused");

            const itemButton = document.getElementById(dataId);
            if (!itemButton) return;
            itemButton.innerHTML = `<i class="fas fa-play icon"></i>`;
            this.status = "idle";
            this.emit( "statusChange", "stop" );
        } );
        
        this.audio.addEventListener( "timeupdate", () =>
        { 
            this.currentTrackProgress = Math.round(( this.audio.currentTime / this.audio.duration ) * 100);
            this.emit( "progressChange", this.currentTrackProgress );
        })
    }

    async forcePlay(data) {
        console.log("stop");
        this.stop();
        this.audio.setAttribute("src", data.src);
        this.audio.setAttribute("data-id", data.id + "_button");
        console.log("updated data");
        this.audio.setAttribute("data-master-id", "master_button");
        const itemButton = document.getElementById(data.id + "_button");
        itemButton.innerHTML = ` <i class="fas fa-spinner "></i>`;
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0.0;
        this.audio.dispatchEvent(
            new CustomEvent("stop", {
                detail: {
                    id: this.getDataId(),
                    masterId: this.audio.getAttribute("data-master-id"),
                },
            }),
        );
    }

    pause() {
        this.audio.pause();
        this.status = "paused";
        this.emit( "statusChange", "paused" );
    }

    async next ()
    {
        this.currentTrackProgress = 0;
        if (this.queue.length > 0) {
            if (this.shuffle) {
                this.currentIndex = Math.floor(
                    Math.random() * this.queue.length,
                );
            } else if (this.loop === "single") {
                this.currentIndex += 0;
            } else if (this.loop === "all") {
                this.currentIndex = (this.currentIndex + 1) % this.queue.length;
            } else {
                if (this.currentIndex + 1 === this.queue.length) {
                    this.stop();
                    this.currentIndex = 0;
                    this.status = "idle";
                    return false;
                } else {
                    this.currentIndex++;
                }
            }

            const item = this.queue[ this.currentIndex ];
            if ( !item.src ) await this.play();
            else
            {
                this.audio.setAttribute( "src", item.src );
                this.audio.setAttribute( "data-id", item.id + "_button" );
                this.audio.setAttribute( "data-master-id", "master_button" );
                this.audio.load();
                this.audio.play();
            }
        }
    }

    skipTo(index) {
        if (index >= 0 && index < this.queue.length) {
            this.currentIndex = index - 1;
            this.next();
        }
    }

    loop(type) {
        this.loop = type;
    }

    shuffle(state) {
        this.shuffle = state;
        if (this.shuffle) {
            const queue = this.queue;
            for (let i = queue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [queue[i], queue[j]] = [queue[j], queue[i]];
            }
            this.queue = queue;
        }
    }
    add(item) {
        this.queue.push({ ...item, pos: this.queue.length });
    }
    addDataId(id) {
        this.audio.setAttribute("data-id", id);
    }
    getDataId() {
        return this.audio.getAttribute("data-id");
    }
    resume() {
        this.audio.play();
        this.status = "playing";
        this.emit( "statusChange", "play" );
    }
    get duration() {
        return this.audio.duration * 1000;
    }
    get currentTime() {
        return this.audio.currentTime * 1000;
    }
    seek ( time )
    { 
        this.audio.currentTime = time / 1000;
    }
    seekTo ( percent )
    {
        this.audio.currentTime = ( percent / 100 ) * this.audio.duration;
    }
    async play ()
    {
        const c = await client;
        const d = await c.getBasicInfo( this.queue[ this.currentIndex ].id );
        const url = d.streaming_data?.adaptive_formats.filter(x => x.mime_type.startsWith("audio"))[0].decipher(
            c.session.player,
        );
        this.audio.setAttribute("src", url);
        this.audio.setAttribute("data-id", this.queue[ this.currentIndex ].id + "_button");
        this.audio.play();
    }
}

const player = new Player();

export default player;
