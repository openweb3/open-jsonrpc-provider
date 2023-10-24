"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProvider = void 0;
const BaseProvider_1 = require("./BaseProvider");
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./helper");
class HttpProvider extends BaseProvider_1.BaseProvider {
    constructor(options) {
        super(options);
    }
    /**
     * @param data
     * @returns
     */
    async _transport(data) {
        let leftTries = this.retry;
        let error = null;
        while (leftTries > 0) {
            try {
                const response = await (0, axios_1.default)({
                    url: this.url,
                    method: 'post',
                    data,
                    timeout: this.timeout,
                });
                return response.data;
            }
            catch (_error) {
                error = _error;
            }
            await (0, helper_1.sleep)(1000); // sleep 1 second
            leftTries--;
        }
        throw error;
    }
    _transportBatch(data) {
        // @ts-ignore
        return this._transport(data);
    }
}
exports.HttpProvider = HttpProvider;
