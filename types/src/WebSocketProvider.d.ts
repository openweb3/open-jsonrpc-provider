import { w3cwebsocket as Websocket } from 'websocket';
import { BaseProvider } from "./BaseProvider";
import { JsonRpcRequest, JsonRpcResponse, WSProviderConfig } from './types';
export declare class WebSocketProvider extends BaseProvider {
    url: string;
    client: Websocket | null | boolean;
    websocketOptions: WSProviderConfig;
    constructor(options: WSProviderConfig);
    _transport(data: JsonRpcRequest): Promise<JsonRpcResponse>;
    _transportBatch(dataArray: JsonRpcRequest[]): Promise<JsonRpcResponse[]>;
    _awaitId(id: number | string): Promise<unknown>;
    _connect({ url, protocols, origin, headers, requestOptions, clientConfig }: WSProviderConfig): Promise<Websocket>;
    _onData(data?: {}): void;
    _send(data: string): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=WebSocketProvider.d.ts.map