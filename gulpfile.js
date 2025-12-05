const { src, dest, watch, series, parallel } = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const htmlmin = require("gulp-htmlmin");

// Compile Nunjucks → dist
function views() {
  console.log("Compiling Nunjucks…");
  return src("src/pages/**/*.njk")
    .pipe(
      nunjucksRender({
        path: ["src"],
      }).on("error", function (err) {
        console.error("Nunjucks error:", err.message);
        this.emit("end");
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: false,
      })
    )
    .pipe(dest("dist"));
}

// Copy /assets → dist/assets
function assets() {
  return src("assets/**/*")
    .pipe(dest("dist/assets"));
}

// Watch
function watcher() {
  watch("src/**/*.njk", views);
  watch("src/assets/**/*", assets);
}

// Commands
exports.default = series(parallel(views, assets), watcher);
exports.build = series(parallel(views, assets));