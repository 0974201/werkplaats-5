# n8n-nodes-telegramcount

[](assets/exampleworkflow.png)

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

| Operation | Method | Credentials required | Description |
|-----------|:-----------:|-----------|-----------|
| Count Group Members | `POST` | `true` | Get the number of members in a group chat |

## Credentials

This node requires a [Telegram Access Token](https://docs.n8n.io/integrations/builtin/credentials/telegram/) in order to authenticate the Telegram Counter node.

Follow the pictures below to create a new credential.

[](assets/telegramcredentials0.png)

[](assets/telegramcredentials.png)

## Compatibility

n8n@1.11.1

## Usage

1.  Add the Telegram Counter node to your workflow without selecting a trigger.
    
2.  Select the Telegram credentials you have created earlier.
    
3.  Enter the [Chat ID](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/#get-the-chat-id). I recommend using @RawDataBot or @raw\_data\_bot.  
    !\[\](assets/configuration.png)
    
4.  Press the `Execute node` button to test the node and to output data. The integer in the result column is the number of members in the group chat your inserted Chat ID corresponds with.  
    !\[\](assets/outputdemo.png)
    
## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
*   [Telegram homepage](https://telegram.org/)
*   [Telegram API docs](https://core.telegram.org/api/)