# n8n-nodes-telegramcount

![Example workflow with Telegram Counter](assets/exampleworkflow.png)

This is an n8n community node. It lets you use the [Telegram API](https://core.telegram.org/api) to communicate with Telegram in your n8n workflows.

Telegram Counter counts how many members are present in a group chat and can be paired with the Telegram node to forward the result to your chat.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

*   [Get chat member count](https://core.telegram.org/bots/api#getchatmembercount/)

| Operation | Method | Credentials required | Description | |-----------|:-----------:|:---------------------:|-----------| | Count Group Members | `POST` | `true` | Get the number of members in a group chat |

## Credentials

This node requires a [Telegram Access Token](https://docs.n8n.io/integrations/builtin/credentials/telegram/) in order to authenticate the Telegram Counter node.

Follow the pictures below to create a new credential.

![Select and create Telegram credentials](assets/telegramcredentials0.png)

![Create Telegram credentials](assets/telegramcredentials.png)

## Compatibility

n8n@1.11.1

## Usage

1.  Add the Telegram Counter node to your workflow without selecting a trigger.
    
2.  Select the Telegram credentials you have created earlier.
    
3.  Enter the [Chat ID](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/#get-the-chat-id). I recommend using @RawDataBot or @raw\_data\_bot.  
    ![Telegram Counter node configuration](assets/configuration.png)
    
4.  Press the `Execute node` button to test the node and to output data. The integer in the result column is the number of members in the group chat your inserted Chat ID corresponds with.  
    ![Telegram Counter example output data](assets/outputdemo.png)
    

## Logging

Basic logging is implemented in the node code. Logs are printed in the same terminal as your active n8n session.

### Possibilities

* Get parameters when all input is valid;
* Get log when `operation` does not equal `'countMembers'`;

### Limitations

It seems impossible to undermine the built-in error handling of n8n. We were limited to JavaScript's `console.debug`. 

* No log when "Chat ID" is empty or has not enough characters;
* No log when `resource` does not equal `'chat'`;
* No log with the caught error.

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
*   [Telegram homepage](https://telegram.org/)
*   [Telegram API docs](https://core.telegram.org/api/)