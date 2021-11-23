import { rest } from 'msw';

const BASE_URL = 'https://opinvoimala-api.stage.geniem.io';

export const handlers = [
  rest.get(`${BASE_URL}/auth/local`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(require('./mock-data/login.json')));
  }),
  rest.get(`${BASE_URL}/front-page`, (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(
      ctx.status(200),
      ctx.json(require('./mock-data/front-page.json'))
    );
  }),
  rest.get(`${BASE_URL}/navigation`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(require('./mock-data/navigation.json'))
    );
  }),
];
