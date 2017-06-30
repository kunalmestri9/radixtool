var gulp = require('gulp');
var argv = require('yargs').argv;
if(argv.radixpro){
	require("./radixpro-build.js");
}else{
	require("./radix-build.js");
}





