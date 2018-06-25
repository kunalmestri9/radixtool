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

if(argv.project){
    if(fs.existsSync("project"+path.sep+argv.project+".json")){
        throw "Project File missing : " + 	argv.project ; 
    }
}else{
    throw "--project parameter must be present" ; 
}
var metafile   		= JSON.parse(fs.readFileSync('projects'+path.sep + argv.project +".json", 'utf8'));
var TMP_PATH   		= "."+path.sep+"tempBuilds";
var DEV_PATH   		= metafile.workspace ;
var BUILD_PATH 		= "."+path.sep+"dist";
var PSEUDOCAT_PATH  = BUILD_PATH +path.sep+"psedocat";


gulp.task("create-psedocat",['checkout'],function(callback){
    //This task is to create psedocat
    fs.mkdirSync(BUILD_PATH);
    fs.mkdirSync(PSEUDOCAT_PATH);
    var psedocatFolder=["_pseudobin","app","chunk","classes","filer","lib","manager","pear","thirdparties"];
    for (var i = 0; i < psedocatFolder.length; i++) {
        fs.mkdirSync(PSEUDOCAT_PATH+path.sep+psedocatFolder[i]); 
    }
    callback();
    //Give permissions to folder
    //execSync("sudo chown -R www-data:www-data "+ PSEUDOCAT_PATH);
})

gulp.task("update-envoironment",["create-psedocat"],function(callback){
    async.eachSeries( metafile.repos ,function(repo,next){
        util.log("Starting build for : " + repo.name +":"+ repo.url);

        var enviornm=(argv.env)?argv.env:"local";
        if(repo.type=="phpobject"){
            util.log("Skipping it as it is a phpobject");
            next();
        }else{
            util.log("its a webapp");
            //check if project contains prod folder
            //execSync("sudo chmod -R 777 "+TMP_PATH);
            var args=TMP_PATH+path.sep+"repos"+path.sep+repo.name;
            //del([args+"/env"]);
            if (fs.existsSync(args+"/prod")){
                gulp.src([args+'/prod/**'],{dot: true})
                .pipe(gulp.dest(args+'/env'))
                .on('end', function () {
                    var command1="php  phpfiles"+path.sep+"envreplacer.php "+ TMP_PATH + path.sep +"repos"+ path.sep+" " + repo.name + " "+enviornm;
                    var command2="php  phpfiles"+path.sep+"envgenerator.php "+ TMP_PATH + path.sep +"repos"+ path.sep+" " + repo.name + " "+enviornm;
                    execSync(command1,{stdio:[0,1,2]});
                    util.log(command1);
                    execSync(command2,{stdio:[0,1,2]});
                    util.log(command2);
                    gulp.src([args+ path.sep +'env'+ path.sep +'**'],{dot: true})
                    .pipe(gulp.dest(args))
                    .on("end",function(){
                        del.sync([args+path.sep+ "env"]);
                        gulp.src([args+path.sep+'**'],{dot: true})
                        .pipe(gulp.dest(PSEUDOCAT_PATH + path.sep+ "app"+ path.sep+repo.name))
                        .on("end",function(){
                            next();
                        })
                    });
                });
            }else{
                util.log("prod folder should be present in the project type webapp");
                next();
            }	
        }
        
    },
    function(){
        util.log("Update enviornment of "+ metafile.name + " is done");	
        callback();
    });
});






gulp.task('checkout',['clean'] ,function(callback){
    if(argv.dev=="true"){
        TMP_PATH=metafile.workspace;
    }
    util.log("Started the process to checkout " + metafile.name );
    fs.mkdirSync(TMP_PATH);
    if(argv.dev!="true"){
        fs.mkdirSync(TMP_PATH+path.sep+"tmpb");
        util.log("tempBuild has been created");
    }	
    
    async.eachSeries( metafile.repos ,function(repo,next){
        util.log("Checkout : " + repo.name +":"+ repo.url);
        var args=TMP_PATH+path.sep+"repos"+path.sep+repo.name;
        if(argv.dev=="true"){
            args=TMP_PATH+path.sep+repo.name;
        }
        execSync("git clone "+ repo.url +" "+ args );
		if(typeof(repo.tag)!="undefined"){
			//execSync("cd " + args);
			//execSync("pwd ");
			execSync("git fetch",{cwd:args});
			execSync("git checkout tags/"+repo.tag,{cwd:args});
			//execSync("cd " + BUILD_PATH+ path.sep +"..");
		}else if(typeof(repo.branch)!="undefined"){
			//execSync("cd " + args);
			//execSync("pwd ");
			execSync("git fetch",{cwd:args});
			execSync("git checkout "+repo.branch,{cwd:args});
			//execSync("cd " + BUILD_PATH+ path.sep +"..");
		}
        next();
    },
    function(){
        if(argv.dev=="true"){
            execSync("git clone "+ metafile.thirdparties +" "+ DEV_PATH +path.sep+ "thirdparties" );
            gulp.src(["phpfiles"+path.sep+"pear"+path.sep+"**"],{"dot":true})
            .pipe(gulp.dest( DEV_PATH +path.sep+"pear"))
            .on("end",function(){
                callback();
            });
        }else{
            callback();
        }
        

    });
});

gulp.task('clean', function () {
return del([
    TMP_PATH,
    BUILD_PATH,
    DEV_PATH
],{force: true});
});


gulp.task('build',['update-envoironment'], function(callback){
    util.log("Started the process to build " + metafile.name );
    if (!fs.existsSync(TMP_PATH)){
        throw "Build path absent";
    }	
    util.log("tempBuild has been created");
    async.eachSeries( metafile.repos ,function(repo,next){
        util.log("Starting build for : " + repo.name +":"+ repo.url);
        if(repo.type=="phpobject"){
            var args=TMP_PATH+path.sep+"repos"+path.sep+repo.name;
            util.log("Deleting to "+args + path.sep+ ".git");
            del([args+path.sep+".git"],{force: true});
            //execSync("cd "+ TMP_PATH+"/repos/" );
            util.log("Zipping "  + args + path.sep );
            gulp.src(args+path.sep+'**')
            .pipe(gulp.dest(PSEUDOCAT_PATH+path.sep+"_pseudobin"))
            .on("end",function(){
                next();
            });
        }else{
            util.log("Skipping it based on type");
            next();
        }
        
    },
    function(){
        util.log("Checkout of "+ metafile.name + " is done");
        //Last thing is checkout thirdparties folder.
        execSync("git clone "+ metafile.thirdparties +" "+ PSEUDOCAT_PATH +path.sep+"thirdparties" );
        gulp.src(["phpfiles"+path.sep+"pear"+path.sep+"**"],{"dot":true})
        .pipe(gulp.dest( PSEUDOCAT_PATH +path.sep+"pear"))
        .on("end",function(){
            callback();
        });
    });
});

gulp.task('pull', function(callback){
    util.log("Started the process of bulk pull " + metafile.name );
    async.eachSeries( metafile.repos ,function(repo,next){
        util.log("Starting pull for : " + repo.name +":"+ repo.url);
		var args=DEV_PATH+repo.name;
		util.log("Pulling "  + args );
		execSync("git pull",{
			cwd: args,
			stdio:'inherit'
		});
		next();
    },
    function(){
		callback();
        util.log("Pulling is done.All projects are updated");
        //Last thing is checkout thirdparties folder.
    });
});