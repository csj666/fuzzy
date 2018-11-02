var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("gulp-webserver");
var fs = require("fs");
var path = require("path");
var url = require("url");
var list = require("./src/json/data.json");
var swiper = require("./src/json/swiper.json");
//起服务
gulp.task("devser", function() {
    //先return出去
    return gulp.src("src")
        .pipe(server({
            port: 8989,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === "/api/list") {
                    res.end(JSON.stringify({ cod: 0, msg: list }));
                } else if (pathname === "/api/swi") {
                    res.end(JSON.stringify({ cod: 0, msg: swiper }));
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
//编译sass
gulp.task("devScss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"));
});
//监听
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("devScss"));
});
//串连起来
gulp.task("dev", gulp.series("devScss", "devser", "watch"));