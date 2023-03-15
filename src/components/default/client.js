import { Innertube, UniversalCache } from "youtubei.js";
/* {@InnerTube} */

let client = Innertube.create({
    fetch: async (input, init) => {
        // url
        input.duplex = "half";
        const url =
            typeof input === "string"
                ? new URL(input)
                : input instanceof URL
                ? input
                : new URL(input.url);

        // transform the url for use with our proxy
        url.searchParams.set("__host", url.host);
        url.host = "lucid-proxyserver.deno.dev";
        url.protocol = "https";

        const headers = init?.headers
            ? new Headers(init.headers)
            : input instanceof Request
            ? input.headers
            : new Headers();

        // now serialize the headers
        url.searchParams.set("__headers", JSON.stringify([...headers]));

        // copy over the request
        const request = new Request(
            url,
            input instanceof Request ? input : undefined,
        );

        headers.delete("user-agent");

        // fetch the url
        return fetch(
            request,
            init
                ? {
                      ...init,
                      headers,
                  }
                : {
                      headers,
                  },
        );
    },
    cache: new UniversalCache(),
});
export default client;
