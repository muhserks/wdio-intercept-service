/* eslint-disable wdio/no-pause */
'use strict';

describe('webdriverajax', function testSuite() {
  this.timeout(process.env.CI ? 100000 : 10000);

  this.afterEach(async function () {
    if (this.currentTest.isFailed()) {
      const logs = await browser.getLogs?.('browser');
      if (logs) {
        console.log('Browser Logs', logs);
      }
    }
  });

  const wait = process.env.CI ? 10000 : 1000;

  // Helper method to avoid waiting for the full timeout in order to have tests pass locally
  // and on CI platforms in a reasonable time. Assumes the given selector can be clicked, and
  // that the request initiated upon clicking will update the page text when it is done.
  const completedRequest = async function (sel) {
    const elem = await browser.$('#response');
    const initial = await elem.getText();
    browser.$(sel).click();
    return elem.waitUntil(
      async function () {
        return (await this.getText()) !== initial;
      },
      { timeout: wait, interval: 5 },
    );
  };

  describe('XHR API', async function () {
    it('can intercept a simple GET request', async function () {
      await browser.url('/get.html');
      await browser.setupInterceptor();
      await completedRequest('#button');
      console.log('getRequests().length', (await browser.getRequests({ includePending: true })).length);
      await browser.setupInterceptor();
      await completedRequest('#button');
      console.log('getRequests().length', (await browser.getRequests({ includePending: true })).length);
      await browser.setupInterceptor();
      await completedRequest('#button');
      console.log('getRequests().length', (await browser.getRequests({ includePending: true })).length);
      for (const r of await browser.getRequests({ includePending: true })) {
        console.log(r)
      }
    });
  });
});
