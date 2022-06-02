import {
  EthereumProvider
} from './types'

export function createProxyWrapper(hardhatProvider: EthereumProvider): EthereumProvider {
  
  const handers = {
    get(target: any, prop: any, receiver: EthereumProvider) {
      if (target[prop]) return target[prop];

      return function(...args: any[]) {
        return hardhatProvider.request({
          method: prop,
          params: args
        });
      };
    }
  };

  const proxy = new Proxy(hardhatProvider, handers);
  return proxy as EthereumProvider;
}