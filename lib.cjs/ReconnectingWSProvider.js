"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectingWSProvider = void 0;
const BaseProvider_1 = require("./BaseProvider");
const ws_1 = __importDefault(require("ws"));
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const helper_1 = require("./helper");
class ReconnectingWSProvider extends BaseProvider_1.BaseProvider {
    constructor(options) {
        super(options);
        this.url = options.url;
        this.client = null;
        this._connect({ url: this.url });
        this.on('message', json => {
            const data = JSON.parse(json);
            if (Array.isArray(data)) {
                data.forEach(each => this._onData(each));
            }
            else {
                this._onData(data);
            }
        });
    }
    async _transport(data) {
        await this._send(JSON.stringify(data));
        return (await (0, helper_1.awaitTimeout)(this._awaitId(data.id), this.timeout) || {});
    }
    async _transportBatch(dataArray) {
        await this._send(JSON.stringify(dataArray));
        return Promise.all(dataArray.map(async (data) => {
            return (await (0, helper_1.awaitTimeout)(this._awaitId(data.id), this.timeout));
        }));
    }
    _awaitId(id) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const onClose = (code, message) => {
                this.removeAllListeners(id);
                this.removeListener('close', onClose);
                reject(new Error(message));
            };
            // @ts-ignore
            const onData = data => {
                this.removeListener('close', onClose);
                this.removeAllListeners(id);
                resolve(data);
            };
            this.once('close', onClose);
            this.once(id, onData);
        });
    }
    _connect({ url }) {
        const rws = new reconnecting_websocket_1.default(url, [], { WebSocket: ws_1.default });
        rws.addEventListener('open', () => console.log('WS connection opened'));
        rws.addEventListener('error', (err) => { this.emit('error', err); });
        rws.addEventListener('close', ({ code, reason }) => { this.emit('close', code, reason); });
        rws.addEventListener('message', ({ data }) => { this.emit('message', data); });
        this.client = rws;
    }
    _onData(data = {}) {
        // @ts-ignore
        const { id, params: { subscription, result } = {} } = data;
        if (id) {
            this.emit(id, data);
        }
        else if (subscription) {
            this.emit(subscription, result);
        }
        else {
            console.log('Unrecognized data', data);
        }
    }
    async _send(data) {
        if (this.client === null) {
            this._connect({ url: this.url });
        }
        const client = this.client;
        return client.send(data);
    }
    async close() {
        super.close();
        if (this.client === null) { // init
            return;
        }
        const client = this.client;
        client.close();
        await new Promise(resolve => this.once('close', resolve));
        this.client = null;
    }
}
exports.ReconnectingWSProvider = ReconnectingWSProvider;
