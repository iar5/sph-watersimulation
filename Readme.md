# Execute 
Install a local server if needed with

`npm install http-server -g`

and run with

`http-server .`


# Test
Simple test scripts (for own purpose) are located in the `./test` directory. To run a file, type e.g.

`node test.js`

Node must know that it should interpret the JavaScript files as modules. Therefore I had to create a `package.json` in the root level with the appropriate reule. (https://stackoverflow.com/questions/58384179/syntaxerror-cannot-use-import-statement-outside-a-module)


