import { Selector, RequestHook, RequestLogger } from 'testcafe';

const logger = RequestLogger(
  /.*zpkj-app.*/,
  { logRequestHeaders: true }
);

class UpdateZpkjAppHeaders extends RequestHook {
  constructor () {
    super();
  }

  async onRequest (event) {
    // e.requestOptions.headers['Authorization'] = 'generate token here';
    if (event.requestOptions.url.match('zpkj-app')) {
      console.log(event.requestOptions.headers);
      console.log(event.requestOptions);
      event.requestOptions.headers = Object.assign({}, event.requestOptions.headers, {
        "sec-ch-ua": null,
        "sec-ch-ua-mobile": null,
        "sec-Fetch-Site": null,
        "sec-Fetch-Mode": null,
        "sec-Fetch-Dest": null
      })
      event.requestOptions.headers['MY-CYSTOM-HEADER'] = 'secret';
      console.log(event.requestOptions.headers);
    }
  }

  async onResponse (e) {
  }
}

fixture `Packhelp login`
  // .page `https://app.stagingqa.dev.packhelp.com/sign_in`
  // .page(`https://stagingqa.dev.packhelp.com`)
  .httpAuth({ username: 'testcafe', password: '**************REDACTED**************' })
  // .requestHooks(new UpdateZpkjAppHeaders());

test('Login sample test', async t => {
  await t
    .addRequestHooks([new UpdateZpkjAppHeaders(), logger])
    .navigateTo('https://app.stagingqa.dev.packhelp.com/sign_in');
  await t
    .debug()
    .expect(Selector(`[e2e-target-name="confirm"]`).innerText)
    .eql('Sign in')

  console.log(logger.requests);
  console.log(logger.requests[0].request.headers);
});
