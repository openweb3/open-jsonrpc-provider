import ReconnectingWebSocket from 'reconnecting-websocket';
import { BaseProvider } from "./BaseProvider.js";
import { ProviderConfig, JsonRpcRequest, JsonRpcResponse, WSProviderConfig } from "./types/index.js";
export declare class ReconnectingWSProvider extends BaseProvider {
    url: string;
    client: ReconnectingWebSocket | null;
    constructor(options: ProviderConfig);
    _transport(data: JsonRpcRequest): Promise<JsonRpcResponse>;
    _transportBatch(dataArray: JsonRpcRequest[]): Promise<JsonRpcResponse[]>;
    _awaitId(id: number | string): Promise<unknown>;
    _connect({ url }: WSProviderConfig): void;
    _onData(data?: {}): void;
    _send(data: string): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=ReconnectingWSProvider.d.ts.map