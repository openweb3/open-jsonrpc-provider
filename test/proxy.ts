import { assert } from "chai";
import { HttpProvider } from "../src/HttpProvider";
import { createProxyWrapper } from '../src/proxyWrapper';

const provider = new HttpProvider({
  url: "https://test.confluxrpc.com"
});

const providerProxy = createProxyWrapper(provider);

describe("Proxy function", function() {
  it("Proxy", async function() {
    // @ts-ignore
    const data = await providerProxy.cfx_getStatus();
    // @ts-ignore
    assert.equal(data.chainId, "0x1");
  });
});