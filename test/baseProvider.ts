import { assert } from "chai";
import { HttpProvider } from "../src/HttpProvider";

const provider = new HttpProvider({
  url: "https://test.confluxrpc.com"
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