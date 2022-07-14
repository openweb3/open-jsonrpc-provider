import { assert } from "chai";
import { ReconnectingWSProvider } from "../src/ReconnectingWSProvider";

const provider = new ReconnectingWSProvider({
  url: "wss://test.confluxrpc.com/ws"
});

describe("Rws Basic features", function() {
  it("Request", async function() {
    const req = {
      method: 'cfx_getStatus',
    };
    const data = await provider.request(req);
    // @ts-ignore
    assert.equal(data.chainId, "0x1");
  });
});