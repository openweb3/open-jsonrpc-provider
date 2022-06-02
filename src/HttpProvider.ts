import { BaseProvider } from "./BaseProvider";
import { ProviderConfig, JsonRpcResponse } from './types';
import axios from 'axios';

export class HttpProvider extends BaseProvider {
  url: string;

  constructor(options: ProviderConfig) {
    super(options);
    this.url = options.url;
  }

  /**
   * TODO: 1. timeout  2. retry  3. error
   * @param data 
   * @returns 
   */
  async _transport(data: any): Promise<JsonRpcResponse> {
    const response = await axios.post(this.url, data);
    return response.data;
  }
}