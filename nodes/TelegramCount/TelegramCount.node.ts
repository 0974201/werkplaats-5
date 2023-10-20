import type {
    IExecuteFunctions,
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from "n8n-workflow";

import {NodeOperationError} from "n8n-workflow";
import {apiRequest} from "./GenericFunctions";


export class TelegramCount implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Telegram Counter',
        name: 'TelegramCount',
        icon: 'file:telegramlogo.svg',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Get the number of members in a group chat',
        defaults: {
            name: 'Telegram Counter',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'TelegramApi',
                required: true,
            },
        ],

        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Chat',
                        value: 'chat',
                    },
                ],
                default: 'chat',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'chat'
                        ],
                    },
                },
                options: [
                    {
                        name: 'Count Group Members',
                        value: 'countMembers',
                        action: 'Count members in chat',
                        description: 'Counts the number of members in a group chat',
                    },
                ],
                default: 'countMembers',
            },
            {
                displayName: 'Chat ID',
                name: 'chatId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: [
                            'countMembers',
                        ],
                        resource: ['chat'],
                    },
                },
                required: true,
                description: 'Unique identifier for the target chat or username of the target channel (in the format @channelusername)',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Handle data coming from previous nodes
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // For Post
        let body: IDataObject;
        // For Query string
        // let qs: IDataObject;

        let requestMethod: string;
        let endpoint: string;

        const operation = this.getNodeParameter('operation', 0);
        const resource = this.getNodeParameter('resource', 0);
        // const binaryData = this.getNodeParameter('binaryData', 0, false);

        // const nodeVersion = this.getNode().typeVersion;
        // const instanceId = await this.getInstanceId();

        // For each item, make an API call (to count group members)
        for (let i = 0; i < items.length; i++) {
            try {
                // Reset all values
                requestMethod = 'POST';
                endpoint = '';
                body = {};
                // qs = {};

                if (resource === 'chat') {
                    if (operation === 'countMembers') {
                        // --------------------
                        //  chat:countMembers
                        // --------------------

                        // Endpoint based on: https://core.telegram.org/bots/api#getchatmembercount
                        (endpoint as string) = 'getChatMemberCount';
                        // Get chat ID input
                        body.chat_id = this.getNodeParameter('chatId', i) as string;
                    }
                } else {
                    throw new NodeOperationError(this.getNode(), `The resource "${resource}" is unknown.`, {
                        itemIndex: i,
                    });
                }
								const responseData = await apiRequest.call(this, requestMethod, endpoint, body);
								returnData.push({
										json: responseData
								});
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({json: {}, error: error.message});
                }
            }
        }
        return Promise.resolve([returnData]);
    }
}
