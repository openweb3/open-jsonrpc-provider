"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketProvider = void 0;
const websocket_1 = require("websocket");
const BaseProvider_js_1 = require("./BaseProvider.js");
const helper_js_1 = require("./helper.js");
class WebSocketProvider extends BaseProvider_js_1.BaseProvider {
    constructor(options) {
        super(options);
        this.url = options.url;
        this.websocketOptions = options;
        this.client = null;
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
        return (await (0, helper_js_1.awaitTimeout)(this._awaitId(data.id), this.timeout) || {});
    }
    async _transportBatch(dataArray) {
        await this._send(JSON.stringify(dataArray));
        return Promise.all(dataArray.map(async (data) => {
            return (await (0, helper_js_1.awaitTimeout)(this._awaitId(data.id), this.timeout));
        }));
    }
    _awaitId(id) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            const onClose = (code, message) => {
                this.removeAllListeners(id);
                reject(new Error(message));
            };
            // @ts-ignore
            const onData = data => {
                this.removeListener('close', onClose);
                resolve(data);
            };
            this.once('close', onClose);
            this.once(id, onData);
        });
    }
    _connect({ url, protocols, origin, headers, requestOptions, clientConfig }) {
        return new Promise((resolve, reject) => {
            const client = new websocket_1.w3cwebsocket(url, protocols, origin, headers, requestOptions, clientConfig);
            client.onopen = () => resolve(client);
            client.onerror = e => {
                this.emit('error', e);
                reject(new Error(`connect to "${url}" failed`));
            };
            client.onmessage = ({ data }) => this.emit('message', data);
            client.onclose = ({ code, reason }) => this.emit('close', code, reason);
        });
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
    }
    async _send(data) {
        if (this.client === null) { // init
            this.client = false;
            try {
                this.client = await this._connect(this.websocketOptions);
            }
            catch (e) {
                this.client = null;
                throw e;
            }
        }
        while (this.client === false) { // connecting
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        const client = this.client;
        return client.send(data);
    }
    /* async _request(data: object) {
      await this._send(JSON.stringify(data));
  
      return await awaitTimeout(this._awaitId(data.id), this.timeout) || {};
    } */
    async close() {
        super.close();
        if (this.client === null) { // init
            return;
        }
        while (this.client === false) { // connecting
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        const client = this.client;
        client.close();
        await new Promise(resolve => this.once('close', resolve));
        this.client = null;
    }
}
exports.WebSocketProvider = WebSocketProvider;
