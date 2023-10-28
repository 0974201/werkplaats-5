// Code is based on https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Telegram/Telegram.node.ts

import type {
    IExecuteFunctions,
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from "n8n-workflow";

import { NodeOperationError } from "n8n-workflow";

import { apiRequest } from "./ApiRequest";


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
                description: 'Unique identifier for the target chat or username of the target channel (in the format @channel-username)',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Handles data coming from previous nodes
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // For Post
        let body: IDataObject;

				// Defines a string type for the API request method and the endpoint
        let requestMethod: string;
        let endpoint: string;

				// Gets the operation and resource the user selects
        const operation = this.getNodeParameter('operation', 0);
        const resource = this.getNodeParameter('resource', 0);

        // For each item, make an API call (to count group members)
        for (let i = 0; i < items.length; i++) {
            try {
                // Resets all values
                requestMethod = 'POST';
                endpoint = '';
                body = {};

                if (resource === 'chat') {
                    if (operation === 'countMembers') {
                        // --------------------
                        //  chat:countMembers
                        // --------------------

                        // Endpoint from: https://core.telegram.org/bots/api#getchatmembercount
                        (endpoint as string) = 'getChatMemberCount';

                        // Get chat ID input
                        body.chat_id = this.getNodeParameter('chatId', i) as string;
												// Log/Debug does not get executed due to n8n's built in error handling
												if (!body.chat_id) {
													console.debug('Enter valid Chat ID');
													throw new NodeOperationError(this.getNode(), `Chat ID is missing.`, {
														itemIndex: i,
													});
												}

												// Log/Debug gets returned in terminal when node is executed (both in workflow as node itself)
												console.debug(`========================`)
												console.debug(`[${Date()}] \n	API REQUEST:`)
												console.debug(`	Request Method: "${requestMethod}"`)
												console.debug(`	Endpoint: "${endpoint}"`)
												console.debug(`	Resource: "${resource}"`)
												console.debug(`	Operation: "${operation}"`)
												console.debug(`	Chat ID: "${body.chat_id}"`)
												console.debug(`========================`)

                    } else if (operation !== 'countMembers') {
												// Log/Debug gets returned in terminal when node is executed (both in workflow as node itself)
												console.debug(`========================`)
												console.debug(`[${Date()}]`)
												console.debug(`Invalid operation "${operation}" selected.`)
												console.debug(`========================`)
												// Left in code for possible future development; does not interfere with the logging above
												throw new NodeOperationError(this.getNode(), `The operation "${operation}" is unknown.`, {
													itemIndex: i,});
										}
								} else {
										// Log/Debug does not get executed due to n8n's built in error handling
										if (resource !== 'chat') {
											console.debug(`========================`)
											console.debug(`[${Date()}]`)
											console.debug(`Invalid resource "${resource}" selected.`)
											console.debug(`========================`)
											// Left in code for possible future development; does not interfere with the logging above
											throw new NodeOperationError(this.getNode(), `The resource "${resource}" is unknown.`, {
												itemIndex: i,
											});
										}
								}
								// Handles API request, returns data as JSON
								const responseData = await apiRequest.call(this, requestMethod, endpoint, body);
								returnData.push({
										json: responseData
								});
            } catch (error) {
							// Log/Debug does not get executed due to n8n's built in error handling
                if (this.continueOnFail()) {
										console.debug({ json: {}, error: error.message });
                    returnData.push({json: {}, error: error.message});
                }
            }
        }
        return Promise.resolve([returnData]);
    }
}
