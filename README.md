# DynamoDictionary

Dynamo Dictionary development repo

Live version here: http://dictionary.dynamobim.com

## Installation
- In root directory, type ```npm install``` into the command line.

## Run in Development Mode
- In root directory, type ```npm run start``` into the command line.

## Update or add example files
- In `data/EXAMPLES`, add example files to their respective category folder.
- In `data`, update (or add) the example file's entry in `Dynamo_Nodes_Documentation.json` to reflect its name, image file name, Dynamo file name, description, and folder path. For Revit nodes, use `Dynamo_Nodes_Revit.json`.

#### Toggle AVP / Example images.
- In `src/config/index.js`,  change `IMAGE_FALSE_AVP_TRUE` to `true` for AVP sample (experimental) and `false` for Dynamo example images (default).

## Deploy to Autodesk

- confirm that `homepage` in `package.json` is set to `http://dictionary.dynamobim.com/`. The developer may change this address depending on the staging environment.

- In root directory: ```npm run build```

- Copy files from `build` folder and place into the root directory of the [Autodesk Dynamo Dictionary repo](https://github.com/DynamoDS/DynamoDictionary), in the appropriate `branch`.
