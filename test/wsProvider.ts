import { assert } from "chai";
import { WebSocketProvider } from "../src/WebSocketProvider";

const provider = new WebSocketProvider({
  url: "wss://test.confluxrpc.com/ws"
});

describe("Basic features", function() {
  it("Request", async function() {
    const req = {
      method: 'cfx_getStatus',
    };
    const data = await provider.request(req);
    // @ts-ignore
    assert.equal(data.chainId, "0x1");
  });
});