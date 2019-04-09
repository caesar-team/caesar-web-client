/* eslint-disable */

(function(f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    let g;
    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }
    g.threadify = f();
  }
})(function() {
  let define;
  let module;
  let exports;
  return (function() {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            const c = typeof require === 'function' && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            const a = new Error(`Cannot find module '${i}'`);
            throw ((a.code = 'MODULE_NOT_FOUND'), a);
          }
          const p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function(r) {
              const n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t,
          );
        }
        return n[i].exports;
      }
      for (
        var u = typeof require === 'function' && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function(require, module, exports) {
          module.exports = {
            serializeArgs(args) {
              const typedArray = [
                'Int8Array',
                'Uint8Array',
                'Uint8ClampedArray',
                'Int16Array',
                'Uint16Array',
                'Int32Array',
                'Uint32Array',
                'Float32Array',
                'Float64Array',
              ];
              const serializedArgs = [];
              const transferable = [];

              for (let i = 0; i < args.length; i++) {
                if (args[i] instanceof Error) {
                  const obj = {
                    type: 'Error',
                    value: { name: args[i].name },
                  };
                  const keys = Object.getOwnPropertyNames(args[i]);
                  for (let k = 0; k < keys.length; k++) {
                    obj.value[keys[k]] = args[i][keys[k]];
                  }
                  serializedArgs.push(obj);
                } else if (args[i] instanceof DataView) {
                  transferable.push(args[i].buffer);
                  serializedArgs.push({
                    type: 'DataView',
                    value: args[i].buffer,
                  });
                } else {
                  // transferable: ArrayBuffer
                  if (args[i] instanceof ArrayBuffer) {
                    transferable.push(args[i]);

                    // tranferable: ImageData
                  } else if (
                    'ImageData' in window &&
                    args[i] instanceof ImageData
                  ) {
                    transferable.push(args[i].data.buffer);

                    // tranferable: TypedArray
                  } else {
                    for (let t = 0; t < typedArray.length; t++) {
                      if (args[i] instanceof window[typedArray[t]]) {
                        transferable.push(args[i].buffer);
                        break;
                      }
                    }
                  }

                  serializedArgs.push({
                    type: 'arg',
                    value: args[i],
                  });
                }
              }

              return {
                args: serializedArgs,
                transferable,
              };
            },

            unserializeArgs(serializedArgs) {
              const args = [];

              for (let i = 0; i < serializedArgs.length; i++) {
                switch (serializedArgs[i].type) {
                  case 'arg':
                    args.push(serializedArgs[i].value);
                    break;
                  case 'Error':
                    var obj = new Error();
                    for (const key in serializedArgs[i].value) {
                      obj[key] = serializedArgs[i].value[key];
                    }
                    args.push(obj);
                    break;
                  case 'DataView':
                    args.push(new DataView(serializedArgs[i].value));
                }
              }

              return args;
            },
          };
        },
        {},
      ],
      2: [
        function(require, module, exports) {
          const helpers = require('./helpers.js');

          function Job(workerUrl, args) {
            const _this = this;
            const _worker = new Worker(workerUrl);

            const callbacks = {
              done: null,
              failed: null,
              terminated: null,
            };

            const results = {
              done: null,
              failed: null,
              terminated: null,
            };

            function _postMessage(name, args) {
              const serialized = helpers.serializeArgs(args || []);

              const data = {
                name,
                args: serialized.args,
              };

              _worker.postMessage(data, serialized.transferable);
            }

            function _callCallbacks() {
              for (const cb in callbacks) {
                if (callbacks[cb] && results[cb]) {
                  callbacks[cb].apply(_this, results[cb]);
                  results[cb] = null;
                }
              }
            }

            function _onMessage(event) {
              const data = event.data || {};
              const args = helpers.unserializeArgs(data.args || []);

              switch (data.name) {
                case 'threadify-emit':
                  results.emit = args;
                  break;
                case 'threadify-return':
                  results.done = args;
                  break;
                case 'threadify-error':
                  results.failed = args;
                  break;
                case 'threadify-terminated':
                  results.terminated = [];
              }
              _callCallbacks();
            }

            function terminate() {
              _worker.terminate();
              results.terminated = [];
              _callCallbacks();
            }

            function _onError(error) {
              results.failed = [error];
              _callCallbacks();
              terminate();
            }

            Object.defineProperty(this, 'done', {
              get() {
                return callbacks.done;
              },
              set(fn) {
                callbacks.done = fn;
                _callCallbacks();
              },
              enumerable: true,
              configurable: false,
            });

            Object.defineProperty(this, 'emit', {
              get() {
                return callbacks.emit;
              },
              set(fn) {
                callbacks.emit = fn;
                _callCallbacks();
              },
              enumerable: true,
              configurable: false,
            });

            Object.defineProperty(this, 'failed', {
              get() {
                return callbacks.failed;
              },
              set(fn) {
                callbacks.failed = fn;
                _callCallbacks();
              },
              enumerable: true,
              configurable: false,
            });

            Object.defineProperty(this, 'terminated', {
              get() {
                return callbacks.terminated;
              },
              set(fn) {
                callbacks.terminated = fn;
                _callCallbacks();
              },
              enumerable: true,
              configurable: false,
            });

            this.terminate = terminate;

            _worker.addEventListener('message', _onMessage.bind(this), false);
            _worker.addEventListener('error', _onError.bind(this), false);

            _postMessage('threadify-start', args);
          }

          module.exports = Job;
        },
        { './helpers.js': 1 },
      ],
      3: [
        function(require, module, exports) {
          const helpers = require('./helpers.js');
          const Job = require('./job.js');
          const workerCode = require('./workercode.js');

          function factory(workerFunction) {
            const workerBlob = new Blob(
              [
                'var window=this;var global=this;(',
                workerCode.toString(),
                ')(',
                workerFunction.toString(),
                ',',
                helpers.serializeArgs.toString(),
                ',',
                helpers.unserializeArgs.toString(),
                ');',
              ],
              {
                type: 'application/javascript',
              },
            );
            const workerUrl = URL.createObjectURL(workerBlob);

            return function() {
              const args = [];
              for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
              }
              return new Job(workerUrl, args);
            };
          }

          module.exports = factory;
        },
        { './helpers.js': 1, './job.js': 2, './workercode.js': 4 },
      ],
      4: [
        function(require, module, exports) {
          //
          // This file contains the code that will be injected inside the web worker
          //

          module.exports = function(
            workerFunction,
            serializeArgs,
            unserializeArgs,
          ) {
            function _postMessage(name, args) {
              const serialized = serializeArgs(args || []);

              const data = {
                name,
                args: serialized.args,
              };

              postMessage(data, serialized.transferable);
            }

            var thread = {
              terminate() {
                _postMessage('threadify-terminated', []);
                close();
              },

              error() {
                _postMessage('threadify-error', arguments);
              },

              emit() {
                _postMessage('threadify-emit', arguments);
              },

              return() {
                _postMessage('threadify-return', arguments);
                thread.terminate();
              },
            };

            function _onMessage(event) {
              const data = event.data || {};
              const args = unserializeArgs(data.args || []);

              switch (data.name) {
                case 'threadify-start':
                  var result;
                  try {
                    result = workerFunction.apply(thread, args);
                  } catch (error) {
                    thread.error(error);
                    thread.terminate();
                  }
                  if (result !== undefined) {
                    _postMessage('threadify-return', [result]);
                    thread.terminate();
                  }
              }
            }

            addEventListener('message', _onMessage, false);
          };
        },
        {},
      ],
    },
    {},
    [3],
  )(3);
});
