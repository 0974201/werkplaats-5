// Copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/credentials/TelegramApi.credentials.ts

import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class TelegramApi implements ICredentialType {
	name = 'telegramApi';

	displayName = 'Telegram API';

	documentationUrl = 'telegram';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Chat with the <a href="https://telegram.me/botfather">bot father</a> to obtain the access token',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://api.telegram.org/bot{{$credentials.accessToken}}',
			url: '/getMe',
		},
	};
}
