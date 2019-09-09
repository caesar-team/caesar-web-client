// eslint-disable-next-line
self.window = self;

const openpgp = require('openpgp');

let randomQueue = [];
const MAX_SIZE_RANDOM_BUFFER = 60000;

function randomCallback() {
  if (!randomQueue.length) {
    window.postMessage({
      event: 'request-seed',
      amount: MAX_SIZE_RANDOM_BUFFER,
    });
  }

  return new Promise(resolve => {
    randomQueue.push(resolve);
  });
}

openpgp.crypto.random.randomBuffer.init(MAX_SIZE_RANDOM_BUFFER, randomCallback);

function seedRandom(buffer) {
  let uintBuffer = buffer;

  if (!(buffer instanceof Uint8Array)) {
    uintBuffer = new Uint8Array(buffer);
  }
  openpgp.crypto.random.randomBuffer.set(uintBuffer);
}

function configure(config) {
  Object.keys(config).forEach(key => {
    openpgp.config[key] = config[key];
  });
}

function response(event) {
  window.postMessage(event, openpgp.util.getTransferables(event.data));
}

function delegate(id, method, options) {
  if (typeof openpgp[method] !== 'function') {
    response({ id, event: 'method-return', err: 'Unknown Worker Event' });
    return;
  }

  // eslint-disable-next-line
  options = openpgp.packet.clone.parseClonedPackets(options, method);

  openpgp.util.restoreStreams(options);
  openpgp[method](options)
    .then(data => {
      response({
        id,
        event: 'method-return',
        data: openpgp.packet.clone.clonePackets(data),
      });
    })
    .catch(e => {
      openpgp.util.print_debug_error(e);
      response({
        id,
        event: 'method-return',
        err: e.message,
        stack: e.stack,
      });
    });
}

window.onmessage = event => {
  const msg = event.data || {};

  switch (msg.event) {
    case 'configure':
      configure(msg.config);
      break;

    case 'seed-random':
      seedRandom(msg.buf);

      // eslint-disable-next-line
      const queueCopy = randomQueue;

      randomQueue = [];
      for (let i = 0; i < queueCopy.length; i++) {
        queueCopy[i]();
      }

      break;

    default:
      delegate(msg.id, msg.event, msg.options || {});
  }
};

postMessage({ event: 'loaded' });
