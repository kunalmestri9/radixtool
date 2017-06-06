
# radixtool
This will help you to fetch code from the radix framework. It will also important for the deployment for Radix Framework
You must project.json file per project in the projects folder to use it. 
 
Usage:
------
Just go to any folder where you want to checkout the RadixTool. Add your project.json file to projects folder. 

You can install this module using npm : 
`git clone https://github.com/kunalmestri9/radixtool.git`

Project JSON format:
```json

{
	"name":"Project Name",
	"workspace":"/home/try/project",
	"repos":[
		{	
			"name":"subproject1",
			"url":"https://github.com/kunalmestri/repo1.git",
			"type":"webapp"
		},
		{	
			"name":"subproject2",
			"url":"https://github.com/kunalmestri/repo2.git",
			"type":"webapp"
		}

	]
}
```




Commmands Available :

Checkout Command:

`gulp checkout --dev=true --project=NAME_OF_PROJECT_JSON_FILE`


Build Command : 

`gulp build --project=NAME_OF_PROJECT_JSON_FILE` --env=ENVIRONMENT`


## License
MIT
 
