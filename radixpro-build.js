var gulp = require('gulp');
var async = require('async');
var fs = require('fs');
var util = require("gulp-util");
var execSync=require("child_process").execSync;
var argv = require('yargs').argv;
const zip = require('gulp-zip');
const unzip = require('gulp-unzip');
var del = require('del');
var vinylPaths = require('vinyl-paths');
const path = require('path');

var metafile   		= JSON.parse(fs.readFileSync('projects'+path.sep + argv.project +".json", 'utf8'));
var BUILD_PATH 		= "."+path.sep+"dist";
var PSEUDOCAT_PATH  = BUILD_PATH +path.sep+argv.dir;

gulp.task('checkout',['clean'] ,function(callback){
    util.log("Started the process to checkout " + metafile.name );
    fs.mkdirSync(BUILD_PATH);
    async.eachSeries( metafile.metaRepoArray ,function(majorName,nt){
        util.log("Reading array "+majorName );
        async.eachSeries( metafile[majorName] ,function(repo,next){
            util.log("Checkout : " + repo.name +":"+ repo.url);
            var args=BUILD_PATH+path.sep+argv.dir+path.sep+majorName+path.sep+repo.name;
            execSync("git clone "+ repo.url +" "+ args );
            if(repo.type=="release"){
                //execSync("cd " + args);
                //execSync("pwd ");
                execSync("git fetch",{cwd:args});
                execSync("git checkout tags/"+repo.tag,{cwd:args});
                //execSync("cd " + BUILD_PATH+ path.sep +"..");
            }
            gulp.src(args+'/**')
            .pipe(zip(repo.name+'.zip'))
            .pipe(gulp.dest(args))
            util.log(repo.url + " = > Repo Fetch successfully");
            next();

        },
        function(){
            util.log("Next Repo Array");
            nt();
        });
    },function(){
        callback();
    });
    
});
gulp.task('clean', function () {
    return del([
        BUILD_PATH
    ],{force: true});
});

