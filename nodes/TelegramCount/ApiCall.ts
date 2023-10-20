import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { OptionsWithUri } from 'request';

export async function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
    method: string,
    endpoint: string,
    body: IDataObject,
    query?: IDataObject,
    option: IDataObject = {}): Promise<any> {
        
        const credentials = await this.getCredentials('telegramApi');

        query = query || {};

        const options: OptionsWithUri = {
            headers: {},
            method,
            body,
            uri: `https://api.telegram.org/bot${credentials.accessToken}/${endpoint}`,
            qs: query,
            json: true,
        };

        if(Object.keys(option).length > 0){
            Object.assign(options, option);
        }

        if(Object.keys(body).length === 0){
            delete options.body;
        }

        if(Object.keys(query).length === 0){
            delete options.qs;
        }

        try{
            return await this.helpers.request(options);
        } catch(error) {
            throw new NodeApiError(this.getNode(), error as JsonObject);
        }
    }