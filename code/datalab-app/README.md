# datalab-app

## Create local development environment 
### Install node.js and npm
Install `node.js` and `npm` package manager. The instructions shown below are for CentOS 7.

`sudo yum install nodejs npm`

By default globally installed npm packages are stored within a `/usr` sub-folder. In 
CentOS, globally installation requires elevated privileges (sudo). The folder can to be
modified to a folder within the local user's home directory. Instructions followed from 
[here](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```
The following line will need to be added to the users `.profile` file.
`export PATH=~/.npm-global/bin:$PATH`

### Globally install yarn
`yarn` is an replacement package manager which is significantly faster than `npm` and
includes some additional functionality.

`npm install -g yarn`

### Install required modules.
The following instruction will install the required modules for both production and
development.

`yarn install`

### Start local development environment
The following line will build and serve `datalab-app`. The application will rebuild if
the files are modified.

`yarn start`

### Run unit tests locally
The following instruction will start an interactive console to run the unit tests.

`yarn test`
