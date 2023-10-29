import { IExecuteFunctions } from 'n8n-core';

import { 
	IDataObject, 
	INodeExecutionData, 
	INodeType, 
	INodeTypeDescription, 
	NodeOperationError} from 'n8n-workflow';

import { apiRequest } from './ApiCall';
import { Logger, ILogObj } from "tslog";

export class TelegramExpansion implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TelegramExpansion',
		name: 'TelegramExpansion',
		icon: 'file:telegram.svg',
		group: ['output'], //changed to output
		version: 1,
		description: 'TelegramExpansion',
		defaults: {
			name: 'TelegramExpansion',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'TelegramApi', //had hoofdletter nodig omdat hij het anders niet pakte
				required: true,
			},
		],

		properties: [ //adapted from original Telegram node
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
							'chat',
						],
					},
				},
				options: [
					{
						name: 'Get Group Members',
						value: 'getMembers',
						action: 'Count members in chat',
						description: 'Gets current amount of members in chat.',
					},
                    {
                        name: 'Roll Dice',
                        value: 'dice',
                        action: 'Roll a dice',
                        description: 'Rolls a dice with a random value.',
                    },
					{
                        name: 'Create Invite Link ',
                        value: 'createLink',
                        action: 'Create an invite link',
                        description: 'Creates an invite link for the chat.',
                    },
					{
                        name: 'Export Invite Link ',
                        value: 'exportLink',
                        action: 'Create a new invite link',
                        description: 'Creates a new invite link for the chat.',
                    }
                ],
                default: 'getMembers',
            },
            {
                displayName: 'Chat ID',
                name: 'chatId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        operation: [
                            'getMembers',
							'dice',
							'createLink',
							'exportLink'
                        ],
                        resource: ['chat'],
                    },
                },
                required: true,
                description: 'Unique identifier for the target chat or username of the target channel (in the format @channelusername)',
            },
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const returnData = [];
		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);
		
		//const timestamp = `[${new Date().toUTCString()}]`; //timestamp for console.log, uncomment this if tslog doesn't work.
		const log: Logger<ILogObj> = new Logger(); //we'll use a store bought logger if the n8n one doesn't work.
		
		let responseData;
		let body: IDataObject;

		let requestMethod: string;
		let endpoint: string;

		log.info("Starting process...");
		//console.info(timestamp, "Starting process..."); //uncomment this if tslog doesn't work.

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try{
				//Reset all values, everything here is also adapted from the original Telegram node
				requestMethod = 'POST'
				endpoint = '';
				body =  {};

				log.info("Sending API request to Telegram");
				//console.info(timestamp, "Sending API request to Telegram"); //uncomment this if tslog doesn't work.

				if (resource === 'chat') {
					if (operation === 'getMembers') {
						(endpoint as string) = 'getChatMemberCount';
						body.chat_id = this.getNodeParameter('chatId', i) as string;
						log.info("Executing ", operation);
						//console.info(timestamp, "Executing ", operation); //uncomment this if tslog doesn't work.
					} 
					else if(operation === 'dice'){
						(endpoint as string) = 'sendDice';
						body.chat_id = this.getNodeParameter('chatId', i) as string;
						log.info("Executing ", operation);
						//console.info(timestamp, "Executing ", operation); //uncomment this if tslog doesn't work.
					}
					else if(operation === 'createLink'){
						(endpoint as string) = 'exportChatInviteLink';
						body.chat_id = this.getNodeParameter('chatId', i) as string;
						log.info("Executing ", operation);
						//console.info(timestamp, "Executing ", operation); //uncomment this if tslog doesn't work.
					}
					else if(operation === 'exportLink'){
						(endpoint as string) = 'exportChatInviteLink';
						body.chat_id = this.getNodeParameter('chatId', i) as string;
						log.info("Executing ", operation);
						//console.info(timestamp, "Executing ", operation); //uncomment this if tslog doesn't work.
					}
				} else {
					throw new NodeOperationError(this.getNode(), 'The resource "${resource}" is unknown.', {
						itemIndex: i,
					});
				}

				responseData = await apiRequest.call(this, requestMethod, endpoint, body);
				returnData.push({
					json: responseData
				});
				log.trace("Response data: ", responseData); // logging responseData
				//log.trace(returnData); //logging returnData - not needed, it returns the same as above
				//console.debug(timestamp, "Response data: ", responseData); //uncomment this if tslog doesn't work.

				} catch(error) {
					if(this.continueOnFail()){
						returnData.push({json: {}, error: error.message});
						log.error("Something went wrong: ", error.message);
						//console.error("Something went wrong: ", error.message); //uncomment this if tslog doesn't work.
					}
				}
			}
			// Map data to n8n data structure
			return Promise.resolve([returnData]);
	}
}