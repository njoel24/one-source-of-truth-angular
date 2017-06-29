const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "app",
    output: "build/$name.js",
});
fuse.bundle("app").watch()
    .instructions(`>main.ts`);

fuse.run();