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

var metafile   		= (typeof(argv.project)!=="undefined")?JSON.parse(fs.readFileSync('projects'+path.sep + argv.project +".json", 'utf8')): [];
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

gulp.task('updatewebapp',[],function(){
    util.log("its a webapp");
    //check if project contains prod folder
    var enviornm=(argv.env)?argv.env:"local";
    var args=argv.path;
    //del([args+"/env"]);
    if (fs.existsSync(args+"/prod")){
        gulp.src([args+'/prod/**'],{dot: true})
        .pipe(gulp.dest(args+'/env'))
        .on('end', function () {
            var command1="php  phpfiles" + path.sep + "envreplacer.php "  + args  + " \"\" " + enviornm;
            var command2="php  phpfiles" + path.sep + "envgenerator.php " + args  + " \"\" " + enviornm;
            execSync(command1,{stdio:[0,1,2]});
            util.log(command1);
            execSync(command2,{stdio:[0,1,2]});
            util.log(command2);
            gulp.src([args+ path.sep +'env'+ path.sep +'**'],{dot: true})
            .pipe(gulp.dest(args))
            .on("end",function(){
                del.sync([args+path.sep+ "env"]);
            });
        });
    }else{
        util.log("No prod folder!! ohh mission failed");
    }
});



gulp.task('clean', function () {
    return del([
        BUILD_PATH
    ],{force: true});
});

