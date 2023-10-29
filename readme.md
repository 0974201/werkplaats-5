![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-telegramcount

This n8n community node is an expansion on the already existing Telegram node. It contains a few API calls the orginal node doesn't have.


## Prerequisites

You need the following to run this node:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 16. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
	```
	npm install n8n -g
	```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).


## Installing this node

To use this node, you need to do the following:

1. Clone this repo:
    ```
    git clone https://github.com/Rac-Software-Development/werkplaats-5-cloudshift-n8n-kolibrie.git
    ```
2. Open a terminal and change directory to the folder where you cloned this repo. Run `npm i` to install dependencies.
3. Run `npm ruin build` to build the node.
4. Change directory to the n8n folder on your machine. E.g. `cd C:\Users\<Username>\.n8n`
5. Run `n8n-nodes-telegramcount` to install this node.



## Usage

To use this node, you will need to create a Telegram Bot first, or use the API key from an existing one. 

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
