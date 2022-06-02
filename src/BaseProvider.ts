import { EventEmitter } from "events";
import { 
  EthereumProvider, 
  RequestArguments,
  JsonRpcRequest,
  JsonRpcResponse,
  ProviderConfig,
  RpcCallback,
} from './types';

export class JsonRpcError extends Error {
  code: number;
  data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class BaseProvider extends EventEmitter implements EthereumProvider {
  url: string;
  timeout: number;
  retry: number;
  
  constructor(options: ProviderConfig) {
    super();
    this.url = options.url;
    this.timeout = options.timeout || 30000; // 30 seconds
    this.retry = options.retry || 1; // 1 retry
  }

  _transport(data: any): Promise<JsonRpcResponse | JsonRpcResponse[]> {
    throw new Error('_transport not implemented');
  }

  id(): number {
    return Date.now();
  }

  buildRpcPayload(req: RequestArguments): JsonRpcRequest {
    return {
      jsonrpc: '2.0',
      method: req.method,
      params: req.params,
      id: this.id(),
    };
  }

  async request(req: RequestArguments): Promise<unknown> {
    const data = await this._transport(this.buildRpcPayload(req));
    const { result, error } = data as JsonRpcResponse;
    if (error) throw new JsonRpcError(error.message, error.code, error.data);
    return result;
  }

  send(method: string, params: any[]): Promise<unknown> {
    return this.request({method, params});
  }

  sendAsync(payload: JsonRpcRequest, callback: RpcCallback): void {
    this._transport(payload)
      .then(data => callback(null, data as JsonRpcResponse))
      .catch(err => callback(err));
  }

  call(method: string, ...args: any[]): Promise<unknown> {
    return this.request({method, params: args});
  }

  async sendBatch(batch: RequestArguments[]): Promise<JsonRpcResponse[]> {
    const data = await this._transport(batch.map(this.buildRpcPayload));
    return data as JsonRpcResponse[];
  }
}