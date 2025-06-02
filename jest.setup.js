const { TextEncoder, TextDecoder } = require('util');
const { Response, Request, Headers, fetch } = require('undici');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;
