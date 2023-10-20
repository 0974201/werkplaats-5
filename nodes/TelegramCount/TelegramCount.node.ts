// import type { Readable } from 'stream';

import type {
    IExecuteFunctions,
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from "n8n-workflow";

// import { BINARY_ENCODING } from "n8n-core";
import {NodeOperationError} from "n8n-workflow";
// import {apiRequest} from "./GenericFunctions";

import {
//     addAdditionalFields,
    apiRequest,
//     getPropertyName,
} from "./GenericFunctions";


export class TelegramCount implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Telegram Counter',
        name: 'TelegramCount',
        icon: 'file:telegramlogo.svg',
        group: ['output'],
        version: [1, 1.1],
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Get the number of members in a group chat',
        defaults: {
            name: 'Telegram Counter',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'telegramApi',
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
            {
                displayName: 'Reply Keyboard',
                name: 'replyKeyboard',
                placeholder: 'Add Reply Keyboard Row',
                description: 'Adds an inline keyboard that appears right next to the message it belongs to',
                type: 'fixedCollection',
                typeOptions: {
                    // Hopelijk betekent dit dat je maar 1 rij kan toevoegen, anders veranderen naar true
                    multipleValues: false,
                },
                displayOptions: {
                    show: {
                        replyMarkup: ['replyKeyboard'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Rows',
                        name: 'rows',
                        values: [
                            {
                                displayName: 'Row',
                                name: 'row',
                                type: 'fixedCollection',
                                description: 'The value to set',
                                placeholder: 'Add Button',
                                typeOptions: {
                                    // Hopelijk betekent dit dat je maar 1 rij kan toevoegen, anders veranderen naar true
                                    multipleValues: false,
                                },
                                default: {},
                                options: [
                                    {
                                        displayName: 'Buttons',
                                        name: 'buttons',
                                        values: [
                                            {
                                                displayName: 'Text',
                                                name: 'text',
                                                type: 'string',
                                                default: 'Count group members',
                                                description:
                                                    'Text of the button. If none of the optional fields are used, this text will be sent as a message when the button is pressed.',
                                            },
                                            {
                                                displayName: 'Additional Fields',
                                                name: 'additionalFields',
                                                type: 'collection',
                                                placeholder: 'Add Field',
                                                default: {},
                                                options: [
                                                    {
                                                        displayName: 'Count Group Members',
                                                        name: 'count_group_members',
                                                        type: 'boolean',
                                                        default: true,
                                                        description: 'Whether the number of people in the group chat will be counted and shared in the chat'
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Reply Keyboard Options',
                name: 'replyKeyboardOptions',
                type: 'collection',
                placeholder: 'Add Option',
                displayOptions: {
                    show: {
                        replyMarkup: ['replyKeyboard']
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Resize Keyboard',
                        name: 'resize_keyboard',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to request clients to resize the keyboard vertically for optimal fit',
                    },
                    {
                        displayName: 'One Time Keyboard',
                        name: 'one_time_keyboard',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to request clients to hide the keyboard as soon as it has been used',
                    },
                    {
                        displayName: 'Selective',
                        name: 'selective',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to show the keyboard to specific users only',
                    },
                ],
            },
            {
                displayName: 'Reply Keyboard Remove',
                name: 'replyKeyboardRemove',
                type: 'collection',
                placeholder: 'Add Field',
                displayOptions: {
                    show: {
                        replyMarkup: ['replyKeyboardRemove'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Remove Keyboard',
                        name: 'remove_keyboard',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to request clients to remove the custom keyboard',
                    },
                    {
                        displayName: 'Selective',
                        name: 'selective',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to force reply from specific users only',
                    },
                ],
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
