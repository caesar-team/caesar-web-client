/* eslint-disable */
// https://github.com/joaonuno/tree-model-js

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
    g.TreeModel = f();
  }
})(() => {
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
            r => {
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
          let mergeSort;
          let findInsertIndex;
          mergeSort = require('mergesort');
          findInsertIndex = require('find-insert-index');

          module.exports = (function() {
            let walkStrategies;

            walkStrategies = {};

            function k(result) {
              return function() {
                return result;
              };
            }

            function TreeModel(config) {
              config = config || {};
              this.config = config;
              this.config.childrenPropertyName =
                config.childrenPropertyName || 'children';
              this.config.modelComparatorFn = config.modelComparatorFn;
            }

            function addChildToNode(node, child) {
              child.parent = node;
              node.children.push(child);
              return child;
            }

            function Node(config, model) {
              this.config = config;
              this.model = model;
              this.children = [];
            }

            TreeModel.prototype.parse = function(model) {
              let i;
              let childCount;
              let node;

              if (!(model instanceof Object)) {
                throw new TypeError('Model must be of type object.');
              }

              node = new Node(this.config, model);
              if (model[this.config.childrenPropertyName] instanceof Array) {
                if (this.config.modelComparatorFn) {
                  model[this.config.childrenPropertyName] = mergeSort(
                    this.config.modelComparatorFn,
                    model[this.config.childrenPropertyName],
                  );
                }
                for (
                  i = 0,
                    childCount = model[this.config.childrenPropertyName].length;
                  i < childCount;
                  i++
                ) {
                  addChildToNode(
                    node,
                    this.parse(model[this.config.childrenPropertyName][i]),
                  );
                }
              }
              return node;
            };

            function hasComparatorFunction(node) {
              return typeof node.config.modelComparatorFn === 'function';
            }

            Node.prototype.isRoot = function() {
              return this.parent === undefined;
            };

            Node.prototype.hasChildren = function() {
              return this.children.length > 0;
            };

            function addChild(self, child, insertIndex) {
              let index;

              if (!(child instanceof Node)) {
                throw new TypeError('Child must be of type Node.');
              }

              child.parent = self;
              if (
                !(self.model[self.config.childrenPropertyName] instanceof Array)
              ) {
                self.model[self.config.childrenPropertyName] = [];
              }

              if (hasComparatorFunction(self)) {
                // Find the index to insert the child
                index = findInsertIndex(
                  self.config.modelComparatorFn,
                  self.model[self.config.childrenPropertyName],
                  child.model,
                );

                // Add to the model children
                self.model[self.config.childrenPropertyName].splice(
                  index,
                  0,
                  child.model,
                );

                // Add to the node children
                self.children.splice(index, 0, child);
              } else if (insertIndex === undefined) {
                self.model[self.config.childrenPropertyName].push(child.model);
                self.children.push(child);
              } else {
                if (insertIndex < 0 || insertIndex > self.children.length) {
                  throw new Error('Invalid index.');
                }
                self.model[self.config.childrenPropertyName].splice(
                  insertIndex,
                  0,
                  child.model,
                );
                self.children.splice(insertIndex, 0, child);
              }
              return child;
            }

            Node.prototype.addChild = function(child) {
              return addChild(this, child);
            };

            Node.prototype.addChildAtIndex = function(child, index) {
              if (hasComparatorFunction(this)) {
                throw new Error(
                  'Cannot add child at index when using a comparator function.',
                );
              }

              return addChild(this, child, index);
            };

            Node.prototype.setIndex = function(index) {
              if (hasComparatorFunction(this)) {
                throw new Error(
                  'Cannot set node index when using a comparator function.',
                );
              }

              if (this.isRoot()) {
                if (index === 0) {
                  return this;
                }
                throw new Error('Invalid index.');
              }

              if (index < 0 || index >= this.parent.children.length) {
                throw new Error('Invalid index.');
              }

              const oldIndex = this.parent.children.indexOf(this);

              this.parent.children.splice(
                index,
                0,
                this.parent.children.splice(oldIndex, 1)[0],
              );

              this.parent.model[this.parent.config.childrenPropertyName].splice(
                index,
                0,
                this.parent.model[
                  this.parent.config.childrenPropertyName
                ].splice(oldIndex, 1)[0],
              );

              return this;
            };

            Node.prototype.getPath = function() {
              const path = [];
              (function addToPath(node) {
                path.unshift(node);
                if (!node.isRoot()) {
                  addToPath(node.parent);
                }
              })(this);
              return path;
            };

            Node.prototype.getIndex = function() {
              if (this.isRoot()) {
                return 0;
              }
              return this.parent.children.indexOf(this);
            };

            /**
             * Parse the arguments of traversal functions. These functions can take one optional
             * first argument which is an options object. If present, this object will be stored
             * in args.options. The only mandatory argument is the callback function which can
             * appear in the first or second position (if an options object is given). This
             * function will be saved to args.fn. The last optional argument is the context on
             * which the callback function will be called. It will be available in args.ctx.
             *
             * @returns Parsed arguments.
             */
            function parseArgs() {
              const args = {};
              if (arguments.length === 1) {
                if (typeof arguments[0] === 'function') {
                  args.fn = arguments[0];
                } else {
                  args.options = arguments[0];
                }
              } else if (arguments.length === 2) {
                if (typeof arguments[0] === 'function') {
                  args.fn = arguments[0];
                  args.ctx = arguments[1];
                } else {
                  args.options = arguments[0];
                  args.fn = arguments[1];
                }
              } else {
                args.options = arguments[0];
                args.fn = arguments[1];
                args.ctx = arguments[2];
              }
              args.options = args.options || {};
              if (!args.options.strategy) {
                args.options.strategy = 'pre';
              }
              if (!walkStrategies[args.options.strategy]) {
                throw new Error(
                  "Unknown tree walk strategy. Valid strategies are 'pre' [default], 'post' and 'breadth'.",
                );
              }
              return args;
            }

            Node.prototype.walk = function() {
              let args;
              args = parseArgs.apply(this, arguments);
              walkStrategies[args.options.strategy].call(
                this,
                args.fn,
                args.ctx,
              );
            };

            walkStrategies.pre = function depthFirstPreOrder(
              callback,
              context,
            ) {
              let i;
              let childCount;
              let keepGoing;
              keepGoing = callback.call(context, this);
              for (
                i = 0, childCount = this.children.length;
                i < childCount;
                i++
              ) {
                if (keepGoing === false) {
                  return false;
                }
                keepGoing = depthFirstPreOrder.call(
                  this.children[i],
                  callback,
                  context,
                );
              }
              return keepGoing;
            };

            walkStrategies.post = function depthFirstPostOrder(
              callback,
              context,
            ) {
              let i;
              let childCount;
              let keepGoing;
              for (
                i = 0, childCount = this.children.length;
                i < childCount;
                i++
              ) {
                keepGoing = depthFirstPostOrder.call(
                  this.children[i],
                  callback,
                  context,
                );
                if (keepGoing === false) {
                  return false;
                }
              }
              keepGoing = callback.call(context, this);
              return keepGoing;
            };

            walkStrategies.breadth = function breadthFirst(callback, context) {
              const queue = [this];
              (function processQueue() {
                let i;
                let childCount;
                let node;
                if (queue.length === 0) {
                  return;
                }
                node = queue.shift();
                for (
                  i = 0, childCount = node.children.length;
                  i < childCount;
                  i++
                ) {
                  queue.push(node.children[i]);
                }
                if (callback.call(context, node) !== false) {
                  processQueue();
                }
              })();
            };

            Node.prototype.all = function() {
              let args;

              const all = [];
              args = parseArgs.apply(this, arguments);
              args.fn = args.fn || k(true);
              walkStrategies[args.options.strategy].call(
                this,
                node => {
                  if (args.fn.call(args.ctx, node)) {
                    all.push(node);
                  }
                },
                args.ctx,
              );
              return all;
            };

            Node.prototype.first = function() {
              let args;
              let first;
              args = parseArgs.apply(this, arguments);
              args.fn = args.fn || k(true);
              walkStrategies[args.options.strategy].call(
                this,
                node => {
                  if (args.fn.call(args.ctx, node)) {
                    first = node;
                    return false;
                  }
                },
                args.ctx,
              );
              return first;
            };

            Node.prototype.drop = function() {
              let indexOfChild;
              if (!this.isRoot()) {
                indexOfChild = this.parent.children.indexOf(this);
                this.parent.children.splice(indexOfChild, 1);
                this.parent.model[this.config.childrenPropertyName].splice(
                  indexOfChild,
                  1,
                );
                this.parent = undefined;
                delete this.parent;
              }
              return this;
            };

            return TreeModel;
          })();
        },
        { 'find-insert-index': 2, mergesort: 3 },
      ],
      2: [
        function(require, module, exports) {
          module.exports = (function() {
            /**
             * Find the index to insert an element in array keeping the sort order.
             *
             * @param {function} comparatorFn The comparator function which sorted the array.
             * @param {array} arr The sorted array.
             * @param {object} el The element to insert.
             */
            function findInsertIndex(comparatorFn, arr, el) {
              let i;
              let len;
              for (i = 0, len = arr.length; i < len; i++) {
                if (comparatorFn(arr[i], el) > 0) {
                  break;
                }
              }
              return i;
            }

            return findInsertIndex;
          })();
        },
        {},
      ],
      3: [
        function(require, module, exports) {
          module.exports = (function() {
            /**
             * Sort an array using the merge sort algorithm.
             *
             * @param {function} comparatorFn The comparator function.
             * @param {array} arr The array to sort.
             * @returns {array} The sorted array.
             */
            function mergeSort(comparatorFn, arr) {
              const len = arr.length;
              let firstHalf;
              let secondHalf;
              if (len >= 2) {
                firstHalf = arr.slice(0, len / 2);
                secondHalf = arr.slice(len / 2, len);
                return merge(
                  comparatorFn,
                  mergeSort(comparatorFn, firstHalf),
                  mergeSort(comparatorFn, secondHalf),
                );
              }
              return arr.slice();
            }

            /**
             * The merge part of the merge sort algorithm.
             *
             * @param {function} comparatorFn The comparator function.
             * @param {array} arr1 The first sorted array.
             * @param {array} arr2 The second sorted array.
             * @returns {array} The merged and sorted array.
             */
            function merge(comparatorFn, arr1, arr2) {
              const result = [];
              let left1 = arr1.length;
              let left2 = arr2.length;
              while (left1 > 0 && left2 > 0) {
                if (comparatorFn(arr1[0], arr2[0]) <= 0) {
                  result.push(arr1.shift());
                  left1--;
                } else {
                  result.push(arr2.shift());
                  left2--;
                }
              }
              if (left1 > 0) {
                result.push(...arr1);
              } else {
                result.push(...arr2);
              }
              return result;
            }

            return mergeSort;
          })();
        },
        {},
      ],
    },
    {},
    [1],
  )(1);
});
