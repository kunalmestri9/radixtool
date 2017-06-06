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

if(argv.project){
	if(fs.existsSync("project/"+argv.project+".json")){
		throw "Project File missing : " + 	argv.project ; 
	}
}else{
	throw "--project parameter must be present" ; 
}
var metafile   		= JSON.parse(fs.readFileSync('projects/' + argv.project +".json", 'utf8'));
var TMP_PATH   		= "./tempBuilds";
var DEV_PATH   		= metafile.workspace ;
var BUILD_PATH 		= "./dist";
var PSEUDOCAT_PATH  = BUILD_PATH +"/psedocat";


gulp.task("create-psedocat",['checkout'],function(callback){
	//This task is to create psedocat
	fs.mkdirSync(BUILD_PATH);
	fs.mkdirSync(PSEUDOCAT_PATH);
	var psedocatFolder=["_pseudobin","app","chunk","classes","filer","lib","manager","pear","thirdparties"];
	for (var i = 0; i < psedocatFolder.length; i++) {
		fs.mkdirSync(PSEUDOCAT_PATH+"/"+psedocatFolder[i]); 
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
			execSync("sudo chmod -R 777 "+TMP_PATH);
			var args=TMP_PATH+"/repos/"+repo.name;
			//del([args+"/env"]);
			if (fs.existsSync(args+"/prod")){
				gulp.src([args+'/prod/**'],{dot: true})
				.pipe(gulp.dest(args+'/env'))
				.on('end', function () {
					var command1="php  phpfiles/envreplacer.php "+ TMP_PATH +"/repos/ " + repo.name + " "+enviornm;
					var command2="php  phpfiles/envgenerator.php "+ TMP_PATH +"/repos/ " + repo.name + " "+enviornm;
					execSync(command1,{stdio:[0,1,2]});
					util.log(command1);
					execSync(command2,{stdio:[0,1,2]});
					util.log(command2);
					gulp.src([args+'/env/**'],{dot: true})
					.pipe(gulp.dest(args))
					.on("end",function(){
						del.sync([args+"/env"]);
						gulp.src([args+'/**'],{dot: true})
						.pipe(gulp.dest(PSEUDOCAT_PATH + "/app/"+repo.name))
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
		fs.mkdirSync(TMP_PATH+"/tmpb");
		util.log("tempBuild has been created");
	}	

	async.eachSeries( metafile.repos ,function(repo,next){
		util.log("Checkout : " + repo.name +":"+ repo.url);
		var args=TMP_PATH+"/repos/"+repo.name;
		if(argv.dev=="true"){
			args=TMP_PATH+"/"+repo.name;
		}
		execSync("git clone "+ repo.url +" "+ args );
		next();
	},
	function(){
		callback();
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
			var args=TMP_PATH+"/repos/"+repo.name;
			util.log("Deleting to "+args + "/.git");
			del([args+"/.git"],{force: true});
			//execSync("cd "+ TMP_PATH+"/repos/" );
			util.log("Zipping "  + args + "/" );
			gulp.src(args+'/**')
			.pipe(gulp.dest(PSEUDOCAT_PATH+"/_pseudobin"))
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
		execSync("git clone "+ metafile.thirdparties +" "+ PSEUDOCAT_PATH + "/thirdparties" );
		gulp.src(["phpfiles/pear/**"],{"dot":true})
		.pipe(gulp.dest( PSEUDOCAT_PATH +"/pear"))
		.on("end",function(){
			callback();
		});
	});
});



// build -> update-envoironment -> create-psedocat -> checkout





