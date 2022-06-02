import { BaseProvider } from "./BaseProvider";
import { ProviderConfig, JsonRpcResponse } from './types';

export class WebSocketProvider extends BaseProvider {
  url: string;

  constructor(options: ProviderConfig) {
    super(options);
    this.url = options.url;
  }

  async _transport(data: any): Promise<JsonRpcResponse> {
    throw new Error("_transport not implemented");
  }
}