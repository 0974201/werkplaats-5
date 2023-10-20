import { IExecuteFunctions } from 'n8n-core';

import { 
	IDataObject, 
	INodeExecutionData, 
	INodeType, 
	INodeTypeDescription, 
	NodeOperationError} from 'n8n-workflow';

import { apiRequest } from './ApiCall';

export class TelegramCount implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TelegramCount',
		name: 'TelegramCount',
		icon: 'file:telegram.svg',
		group: ['output'],
		version: 1,
		description: 'TelegramCount',
		defaults: {
			name: 'TelegramCount',
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
							'chat',
						],
					},
				},
				options: [
					{
						name: 'Count Group Members',
						value: 'countMembers',
						action: 'Count members in chat',
						description: 'Count members',
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
							'countMembers'
						],
						resource: ['chat'],
					},
				},
				required: true,
				description: 'aaaaa'
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
		
		let responseData;
		let body: IDataObject;
		//let qs: IDataObject;

		let requestMethod: string;
		let endpoint: string;

		// For each item, make an API call to create a contact
		for (let i = 0; i < items.length; i++) {
			try{
				//Reset all values
				requestMethod = 'POST'
				endpoint = '';
				body =  {};
				//qs = {};
				
				if (resource === 'chat') {
					if (operation === 'countMembers') {
						(endpoint as string) = 'getChatMemberCount';
						body.chat_id = this.getNodeParameter('chatid', i) as string
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

				} catch(error) {
					if(this.continueOnFail()){
						returnData.push({json: {}, error: error.message});
					}
				}
			}
			// Map data to n8n data structure
			return Promise.resolve([returnData]);
	}
}
