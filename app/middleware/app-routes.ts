
let paths = "<ul>";
export const print = (path: any, layer: any) => {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
    } else if (layer.name === "router" && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
    } else if (layer.method) {
        const route = path.concat(split(layer.regexp)).filter(Boolean).join("/");
        paths += `<li>${layer.method.toUpperCase()}: <a href="http://localhost:${process.env.PORT || 3000}/${route}" target="_blank">/${route}</a></li>`;
    }
};

const split = (thing: any) => {
    if (typeof thing === "string") {
        return thing.split("/");
    } else if (thing.fast_slash) {
        return "";
    } else {
        const match = thing.toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
        return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">";
    }
};

export let getPaths = () => {
    return paths;
};
