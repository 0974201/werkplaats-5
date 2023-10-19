// Copied from https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Telegram/IEvent.ts

interface EventBody {
	photo?: [
		{
			file_id: string;
		},
	];
	document?: {
		file_id: string;
	};
}

export interface IEvent {
	message?: EventBody;
	channel_post?: EventBody;
	download_link?: string;
}
