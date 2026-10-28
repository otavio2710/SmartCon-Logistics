const serverless = require('serverless-http');
const app = require('../../backend/src/index');
const invoke = serverless(app);
exports.handler = async (event, context) => {
  // Garante que as rotas Express /api/... sejam preservadas após o redirect.
  const original = event.path || '';
  const prefix = '/.netlify/functions/api';
  if (original.startsWith(prefix)) {
    event = { ...event, path: '/api' + original.slice(prefix.length) };
  }
  return invoke(event, context);
};
