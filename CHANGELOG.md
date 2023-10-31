# Changelog

## v0.2.1

- Provider is not extends EventEmitter anymore, because `events` is not available in browser environment. But it should be fix in the future

## v0.2.0

- Provide both commonjs and esm modules
- Temp remove `WebSocketProvider` and `ReconnectingWSProvider`