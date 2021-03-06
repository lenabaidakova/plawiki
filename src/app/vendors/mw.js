/* eslint-disable */

function isCompatible(ua) {
  return !!((function() {
    'use strict';
    return !this && Function.prototype.bind && window.JSON;
  }()) && 'querySelector'in document && 'localStorage'in window && 'addEventListener'in window && !ua.match(/MSIE 10|NetFront|Opera Mini|S40OviBrowser|MeeGo|Android.+Glass|^Mozilla\/5\.0 .+ Gecko\/$|googleweblight|PLAYSTATION|PlayStation/));
}
if (!isCompatible(navigator.userAgent)) {
  document.documentElement.className = document.documentElement.className.replace(/(^|\s)client-js(\s|$)/, '$1client-nojs$2');
  while (window.NORLQ && NORLQ[0]) {
    NORLQ.shift()();
  }
  NORLQ = {
    push: function(fn) {
      fn();
    }
  };
  RLQ = {
    push: function() {}
  };
} else {
  if (window.performance && performance.mark) {
    performance.mark('mwStartup');
  }
  (function() {
    'use strict';
    var mw, StringSet, log, isES6Supported, hasOwn = Object.hasOwnProperty, console = window.console;
    function fnv132(str) {
      var hash = 0x811C9DC5
        , i = 0;
      for (; i < str.length; i++) {
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        hash ^= str.charCodeAt(i);
      }
      hash = (hash >>> 0).toString(36).slice(0, 5);
      while (hash.length < 5) {
        hash = '0' + hash;
      }
      return hash;
    }
    function defineFallbacks() {
      StringSet = window.Set || function() {
        var set = Object.create(null);
        return {
          add: function(value) {
            set[value] = !0;
          },
          has: function(value) {
            return value in set;
          }
        };
      }
      ;
    }
    function setGlobalMapValue(map, key, value) {
      map.values[key] = value;
      log.deprecate(window, key, value, map === mw.config && 'Use mw.config instead.');
    }
    function logError(topic, data) {
      var msg, e = data.exception;
      if (console && console.log) {
        msg = (e ? 'Exception' : 'Error') + ' in ' + data.source + (data.module ? ' in module ' + data.module : '') + (e ? ':' : '.');
        console.log(msg);
        if (e && console.warn) {
          console.warn(e);
        }
      }
    }
    function Map(global) {
      this.values = Object.create(null);
      if (global === !0) {
        this.set = function(selection, value) {
          var s;
          if (arguments.length > 1) {
            if (typeof selection === 'string') {
              setGlobalMapValue(this, selection, value);
              return !0;
            }
          } else if (typeof selection === 'object') {
            for (s in selection) {
              setGlobalMapValue(this, s, selection[s]);
            }
            return !0;
          }
          return !1;
        }
        ;
      }
    }
    Map.prototype = {
      constructor: Map,
      get: function(selection, fallback) {
        var results, i;
        fallback = arguments.length > 1 ? fallback : null;
        if (Array.isArray(selection)) {
          results = {};
          for (i = 0; i < selection.length; i++) {
            if (typeof selection[i] === 'string') {
              results[selection[i]] = selection[i]in this.values ? this.values[selection[i]] : fallback;
            }
          }
          return results;
        }
        if (typeof selection === 'string') {
          return selection in this.values ? this.values[selection] : fallback;
        }
        if (selection === undefined) {
          results = {};
          for (i in this.values) {
            results[i] = this.values[i];
          }
          return results;
        }
        return fallback;
      },
      set: function(selection, value) {
        var s;
        if (arguments.length > 1) {
          if (typeof selection === 'string') {
            this.values[selection] = value;
            return !0;
          }
        } else if (typeof selection === 'object') {
          for (s in selection) {
            this.values[s] = selection[s];
          }
          return !0;
        }
        return !1;
      },
      exists: function(selection) {
        return typeof selection === 'string' && selection in this.values;
      }
    };
    defineFallbacks();
    log = function() {}
    ;
    log.warn = console && console.warn ? Function.prototype.bind.call(console.warn, console) : function() {}
    ;
    log.error = console && console.error ? Function.prototype.bind.call(console.error, console) : function() {}
    ;
    log.deprecate = function(obj, key, val, msg, logName) {
      var stacks;
      function maybeLog() {
        var name = logName || key
          , trace = new Error().stack;
        if (!stacks) {
          stacks = new StringSet();
        }
        if (!stacks.has(trace)) {
          stacks.add(trace);
          if (logName || obj === window) {
            mw.track('mw.deprecate', name);
          }
          mw.log.warn('Use of "' + name + '" is deprecated.' + (msg ? ' ' + msg : ''));
        }
      }
      try {
        Object.defineProperty(obj, key, {
          configurable: !0,
          enumerable: !0,
          get: function() {
            maybeLog();
            return val;
          },
          set: function(newVal) {
            maybeLog();
            val = newVal;
          }
        });
      } catch (err) {
        obj[key] = val;
      }
    }
    ;
    isES6Supported = typeof Promise === 'function' && Promise.prototype.finally && /./g.flags === 'g' && (function() {
      try {
        new Function('var \ud800\udec0;');
        return !0;
      } catch (e) {
        return !1;
      }
    }());
    mw = {
      redefineFallbacksForTest: window.QUnit && defineFallbacks,
      now: function() {
        var perf = window.performance
          , navStart = perf && perf.timing && perf.timing.navigationStart;
        mw.now = navStart && perf.now ? function() {
            return navStart + perf.now();
          }
          : Date.now;
        return mw.now();
      },
      trackQueue: [],
      track: function(topic, data) {
        mw.trackQueue.push({
          topic: topic,
          data: data
        });
      },
      trackError: function(topic, data) {
        mw.track(topic, data);
        logError(topic, data);
      },
      Map: Map,
      config: new Map(!0),
      messages: new Map(),
      templates: new Map(),
      log: log,
      loader: (function() {
        var registry = Object.create(null), sources = Object.create(null), handlingPendingRequests = !1, pendingRequests = [], queue = [], jobs = [], willPropagate = !1, errorModules = [], baseModules = ["jquery", "mediawiki.base"], marker = document.querySelector('meta[name="ResourceLoaderDynamicStyles"]'), lastCssBuffer, rAF = window.requestAnimationFrame || setTimeout;
        function newStyleTag(text, nextNode) {
          var el = document.createElement('style');
          el.appendChild(document.createTextNode(text));
          if (nextNode && nextNode.parentNode) {
            nextNode.parentNode.insertBefore(el, nextNode);
          } else {
            document.head.appendChild(el);
          }
          return el;
        }
        function flushCssBuffer(cssBuffer) {
          var i;
          if (cssBuffer === lastCssBuffer) {
            lastCssBuffer = null;
          }
          newStyleTag(cssBuffer.cssText, marker);
          for (i = 0; i < cssBuffer.callbacks.length; i++) {
            cssBuffer.callbacks[i]();
          }
        }
        function addEmbeddedCSS(cssText, callback) {
          if (!lastCssBuffer || cssText.slice(0, '@import'.length) === '@import') {
            lastCssBuffer = {
              cssText: '',
              callbacks: []
            };
            rAF(flushCssBuffer.bind(null, lastCssBuffer));
          }
          lastCssBuffer.cssText += '\n' + cssText;
          lastCssBuffer.callbacks.push(callback);
        }
        function getCombinedVersion(modules) {
          var hashes = modules.reduce(function(result, module) {
            return result + registry[module].version;
          }, '');
          return fnv132(hashes);
        }
        function allReady(modules) {
          var i = 0;
          for (; i < modules.length; i++) {
            if (mw.loader.getState(modules[i]) !== 'ready') {
              return !1;
            }
          }
          return !0;
        }
        function allWithImplicitReady(module) {
          return allReady(registry[module].dependencies) && (baseModules.indexOf(module) !== -1 || allReady(baseModules));
        }
        function anyFailed(modules) {
          var state, i = 0;
          for (; i < modules.length; i++) {
            state = mw.loader.getState(modules[i]);
            if (state === 'error' || state === 'missing') {
              return modules[i];
            }
          }
          return !1;
        }
        function doPropagation() {
          var errorModule, baseModuleError, module, i, failed, job, didPropagate = !0;
          do {
            didPropagate = !1;
            while (errorModules.length) {
              errorModule = errorModules.shift();
              baseModuleError = baseModules.indexOf(errorModule) !== -1;
              for (module in registry) {
                if (registry[module].state !== 'error' && registry[module].state !== 'missing') {
                  if (baseModuleError && baseModules.indexOf(module) === -1) {
                    registry[module].state = 'error';
                    didPropagate = !0;
                  } else if (registry[module].dependencies.indexOf(errorModule) !== -1) {
                    registry[module].state = 'error';
                    errorModules.push(module);
                    didPropagate = !0;
                  }
                }
              }
            }
            for (module in registry) {
              if (registry[module].state === 'loaded' && allWithImplicitReady(module)) {
                execute(module);
                didPropagate = !0;
              }
            }
            for (i = 0; i < jobs.length; i++) {
              job = jobs[i];
              failed = anyFailed(job.dependencies);
              if (failed !== !1 || allReady(job.dependencies)) {
                jobs.splice(i, 1);
                i -= 1;
                try {
                  if (failed !== !1 && job.error) {
                    job.error(new Error('Failed dependency: ' + failed), job.dependencies);
                  } else if (failed === !1 && job.ready) {
                    job.ready();
                  }
                } catch (e) {
                  mw.trackError('resourceloader.exception', {
                    exception: e,
                    source: 'load-callback'
                  });
                }
                didPropagate = !0;
              }
            }
          } while (didPropagate);
          willPropagate = !1;
        }
        function requestPropagation() {
          if (willPropagate) {
            return;
          }
          willPropagate = !0;
          mw.requestIdleCallback(doPropagation, {
            timeout: 1
          });
        }
        function setAndPropagate(module, state) {
          registry[module].state = state;
          if (state === 'loaded' || state === 'ready' || state === 'error' || state === 'missing') {
            if (state === 'ready') {
              mw.loader.store.add(module);
            } else if (state === 'error' || state === 'missing') {
              errorModules.push(module);
            }
            requestPropagation();
          }
        }
        function sortDependencies(module, resolved, unresolved) {
          var e, i, skip, deps;
          if (!(module in registry)) {
            e = new Error('Unknown module: ' + module);
            e.name = 'DependencyError';
            throw e;
          }
          if (!isES6Supported && registry[module].requiresES6) {
            e = new Error('Module requires ES6 but ES6 is not supported: ' + module);
            e.name = 'ES6Error';
            throw e;
          }
          if (typeof registry[module].skip === 'string') {
            skip = (new Function(registry[module].skip)());
            registry[module].skip = !!skip;
            if (skip) {
              registry[module].dependencies = [];
              setAndPropagate(module, 'ready');
              return;
            }
          }
          if (!unresolved) {
            unresolved = new StringSet();
          }
          deps = registry[module].dependencies;
          unresolved.add(module);
          for (i = 0; i < deps.length; i++) {
            if (resolved.indexOf(deps[i]) === -1) {
              if (unresolved.has(deps[i])) {
                e = new Error('Circular reference detected: ' + module + ' -> ' + deps[i]);
                e.name = 'DependencyError';
                throw e;
              }
              sortDependencies(deps[i], resolved, unresolved);
            }
          }
          resolved.push(module);
        }
        function resolve(modules) {
          var resolved = baseModules.slice()
            , i = 0;
          for (; i < modules.length; i++) {
            sortDependencies(modules[i], resolved);
          }
          return resolved;
        }
        function resolveStubbornly(modules) {
          var saved, resolved = baseModules.slice(), i = 0;
          for (; i < modules.length; i++) {
            saved = resolved.slice();
            try {
              sortDependencies(modules[i], resolved);
            } catch (err) {
              resolved = saved;
              if (err.name === 'ES6Error') {
                mw.log.warn('Skipped ES6-only module ' + modules[i]);
              } else {
                mw.log.warn('Skipped unresolvable module ' + modules[i]);
                if (modules[i]in registry) {
                  mw.trackError('resourceloader.exception', {
                    exception: err,
                    source: 'resolve'
                  });
                }
              }
            }
          }
          return resolved;
        }
        function resolveRelativePath(relativePath, basePath) {
          var prefixes, prefix, baseDirParts, relParts = relativePath.match(/^((?:\.\.?\/)+)(.*)$/);
          if (!relParts) {
            return null;
          }
          baseDirParts = basePath.split('/');
          baseDirParts.pop();
          prefixes = relParts[1].split('/');
          prefixes.pop();
          while ((prefix = prefixes.pop()) !== undefined) {
            if (prefix === '..') {
              baseDirParts.pop();
            }
          }
          return (baseDirParts.length ? baseDirParts.join('/') + '/' : '') + relParts[2];
        }
        function makeRequireFunction(moduleObj, basePath) {
          return function require(moduleName) {
            var fileName, fileContent, result, moduleParam, scriptFiles = moduleObj.script.files;
            fileName = resolveRelativePath(moduleName, basePath);
            if (fileName === null) {
              return mw.loader.require(moduleName);
            }
            if (!hasOwn.call(scriptFiles, fileName)) {
              throw new Error('Cannot require undefined file ' + fileName);
            }
            if (hasOwn.call(moduleObj.packageExports, fileName)) {
              return moduleObj.packageExports[fileName];
            }
            fileContent = scriptFiles[fileName];
            if (typeof fileContent === 'function') {
              moduleParam = {
                exports: {}
              };
              fileContent(makeRequireFunction(moduleObj, fileName), moduleParam);
              result = moduleParam.exports;
            } else {
              result = fileContent;
            }
            moduleObj.packageExports[fileName] = result;
            return result;
          }
            ;
        }
        function addScript(src, callback) {
          var script = document.createElement('script');
          script.src = src;
          script.onload = script.onerror = function() {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
            if (callback) {
              callback();
              callback = null;
            }
          }
          ;
          document.head.appendChild(script);
        }
        function queueModuleScript(src, moduleName, callback) {
          pendingRequests.push(function() {
            if (moduleName !== 'jquery') {
              window.require = mw.loader.require;
              window.module = registry[moduleName].module;
            }
            addScript(src, function() {
              delete window.module;
              callback();
              if (pendingRequests[0]) {
                pendingRequests.shift()();
              } else {
                handlingPendingRequests = !1;
              }
            });
          });
          if (!handlingPendingRequests && pendingRequests[0]) {
            handlingPendingRequests = !0;
            pendingRequests.shift()();
          }
        }
        function addLink(url, media, nextNode) {
          var el = document.createElement('link');
          el.rel = 'stylesheet';
          if (media) {
            el.media = media;
          }
          el.href = url;
          if (nextNode && nextNode.parentNode) {
            nextNode.parentNode.insertBefore(el, nextNode);
          } else {
            document.head.appendChild(el);
          }
        }
        function domEval(code) {
          var script = document.createElement('script');
          if (mw.config.get('wgCSPNonce') !== !1) {
            script.nonce = mw.config.get('wgCSPNonce');
          }
          script.text = code;
          document.head.appendChild(script);
          script.parentNode.removeChild(script);
        }
        function enqueue(dependencies, ready, error) {
          var failed;
          if (allReady(dependencies)) {
            if (ready !== undefined) {
              ready();
            }
            return;
          }
          failed = anyFailed(dependencies);
          if (failed !== !1) {
            if (error !== undefined) {
              error(new Error('Dependency ' + failed + ' failed to load'), dependencies);
            }
            return;
          }
          if (ready !== undefined || error !== undefined) {
            jobs.push({
              dependencies: dependencies.filter(function(module) {
                var state = registry[module].state;
                return state === 'registered' || state === 'loaded' || state === 'loading' || state === 'executing';
              }),
              ready: ready,
              error: error
            });
          }
          dependencies.forEach(function(module) {
            if (registry[module].state === 'registered' && queue.indexOf(module) === -1) {
              queue.push(module);
            }
          });
          mw.loader.work();
        }
        function execute(module) {
          var key, value, media, i, urls, cssHandle, siteDeps, siteDepErr, runScript, cssPending = 0;
          if (registry[module].state !== 'loaded') {
            throw new Error('Module in state "' + registry[module].state + '" may not execute: ' + module);
          }
          registry[module].state = 'executing';
          runScript = function() {
            var script, markModuleReady, nestedAddScript, mainScript;
            script = registry[module].script;
            markModuleReady = function() {
              setAndPropagate(module, 'ready');
            }
            ;
            nestedAddScript = function(arr, callback, j) {
              if (j >= arr.length) {
                callback();
                return;
              }
              queueModuleScript(arr[j], module, function() {
                nestedAddScript(arr, callback, j + 1);
              });
            }
            ;
            try {
              if (Array.isArray(script)) {
                nestedAddScript(script, markModuleReady, 0);
              } else if (typeof script === 'function' || (typeof script === 'object' && script !== null)) {
                if (typeof script === 'function') {
                  if (module === 'jquery') {
                    script();
                  } else {
                    script(window.$, window.$, mw.loader.require, registry[module].module);
                  }
                } else {
                  mainScript = script.files[script.main];
                  if (typeof mainScript !== 'function') {
                    throw new Error('Main file in module ' + module + ' must be a function');
                  }
                  mainScript(makeRequireFunction(registry[module], script.main), registry[module].module);
                }
                markModuleReady();
              } else if (typeof script === 'string') {
                domEval(script);
                markModuleReady();
              } else {
                markModuleReady();
              }
            } catch (e) {
              setAndPropagate(module, 'error');
              mw.trackError('resourceloader.exception', {
                exception: e,
                module: module,
                source: 'module-execute'
              });
            }
          }
          ;
          if (registry[module].messages) {
            mw.messages.set(registry[module].messages);
          }
          if (registry[module].templates) {
            mw.templates.set(module, registry[module].templates);
          }
          cssHandle = function() {
            cssPending++;
            return function() {
              var runScriptCopy;
              cssPending--;
              if (cssPending === 0) {
                runScriptCopy = runScript;
                runScript = undefined;
                runScriptCopy();
              }
            }
              ;
          }
          ;
          if (registry[module].style) {
            for (key in registry[module].style) {
              value = registry[module].style[key];
              media = undefined;
              if (key !== 'url' && key !== 'css') {
                if (typeof value === 'string') {
                  addEmbeddedCSS(value, cssHandle());
                } else {
                  media = key;
                  key = 'bc-url';
                }
              }
              if (Array.isArray(value)) {
                for (i = 0; i < value.length; i++) {
                  if (key === 'bc-url') {
                    addLink(value[i], media, marker);
                  } else if (key === 'css') {
                    addEmbeddedCSS(value[i], cssHandle());
                  }
                }
              } else if (typeof value === 'object') {
                for (media in value) {
                  urls = value[media];
                  for (i = 0; i < urls.length; i++) {
                    addLink(urls[i], media, marker);
                  }
                }
              }
            }
          }
          if (module === 'user') {
            try {
              siteDeps = resolve(['site']);
            } catch (e) {
              siteDepErr = e;
              runScript();
            }
            if (siteDepErr === undefined) {
              enqueue(siteDeps, runScript, runScript);
            }
          } else if (cssPending === 0) {
            runScript();
          }
        }
        function sortQuery(o) {
          var key, sorted = {}, a = [];
          for (key in o) {
            a.push(key);
          }
          a.sort();
          for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
          }
          return sorted;
        }
        function buildModulesString(moduleMap) {
          var p, prefix, str = [], list = [];
          function restore(suffix) {
            return p + suffix;
          }
          for (prefix in moduleMap) {
            p = prefix === '' ? '' : prefix + '.';
            str.push(p + moduleMap[prefix].join(','));
            list.push.apply(list, moduleMap[prefix].map(restore));
          }
          return {
            str: str.join('|'),
            list: list
          };
        }
        function resolveIndexedDependencies(modules) {
          var i, j, deps;
          function resolveIndex(dep) {
            return typeof dep === 'number' ? modules[dep][0] : dep;
          }
          for (i = 0; i < modules.length; i++) {
            deps = modules[i][2];
            if (deps) {
              for (j = 0; j < deps.length; j++) {
                deps[j] = resolveIndex(deps[j]);
              }
            }
          }
        }
        function makeQueryString(params) {
          return Object.keys(params).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
          }).join('&');
        }
        function batchRequest(batch) {
          var reqBase, splits, b, bSource, bGroup, source, group, i, modules, sourceLoadScript, currReqBase, currReqBaseLength, moduleMap, currReqModules, l, lastDotIndex, prefix, suffix, bytesAdded;
          function doRequest() {
            var query = Object.create(currReqBase)
              , packed = buildModulesString(moduleMap);
            query.modules = packed.str;
            query.version = getCombinedVersion(packed.list);
            query = sortQuery(query);
            addScript(sourceLoadScript + '?' + makeQueryString(query));
          }
          if (!batch.length) {
            return;
          }
          batch.sort();
          reqBase = {
            "lang": "en",
            "skin": "vector"
          };
          splits = Object.create(null);
          for (b = 0; b < batch.length; b++) {
            bSource = registry[batch[b]].source;
            bGroup = registry[batch[b]].group;
            if (!splits[bSource]) {
              splits[bSource] = Object.create(null);
            }
            if (!splits[bSource][bGroup]) {
              splits[bSource][bGroup] = [];
            }
            splits[bSource][bGroup].push(batch[b]);
          }
          for (source in splits) {
            sourceLoadScript = sources[source];
            for (group in splits[source]) {
              modules = splits[source][group];
              currReqBase = Object.create(reqBase);
              if (group === 0 && mw.config.get('wgUserName') !== null) {
                currReqBase.user = mw.config.get('wgUserName');
              }
              currReqBaseLength = makeQueryString(currReqBase).length + 23;
              l = currReqBaseLength;
              moduleMap = Object.create(null);
              currReqModules = [];
              for (i = 0; i < modules.length; i++) {
                lastDotIndex = modules[i].lastIndexOf('.');
                prefix = modules[i].substr(0, lastDotIndex);
                suffix = modules[i].slice(lastDotIndex + 1);
                bytesAdded = moduleMap[prefix] ? suffix.length + 3 : modules[i].length + 3;
                if (currReqModules.length && l + bytesAdded > mw.loader.maxQueryLength) {
                  doRequest();
                  l = currReqBaseLength;
                  moduleMap = Object.create(null);
                  currReqModules = [];
                  mw.track('resourceloader.splitRequest', {
                    maxQueryLength: mw.loader.maxQueryLength
                  });
                }
                if (!moduleMap[prefix]) {
                  moduleMap[prefix] = [];
                }
                l += bytesAdded;
                moduleMap[prefix].push(suffix);
                currReqModules.push(modules[i]);
              }
              if (currReqModules.length) {
                doRequest();
              }
            }
          }
        }
        function asyncEval(implementations, cb) {
          if (!implementations.length) {
            return;
          }
          mw.requestIdleCallback(function() {
            try {
              domEval(implementations.join(';'));
            } catch (err) {
              cb(err);
            }
          });
        }
        function getModuleKey(module) {
          return module in registry ? (module + '@' + registry[module].version) : null;
        }
        function splitModuleKey(key) {
          var index = key.indexOf('@');
          if (index === -1) {
            return {
              name: key,
              version: ''
            };
          }
          return {
            name: key.slice(0, index),
            version: key.slice(index + 1)
          };
        }
        function registerOne(module, version, dependencies, group, source, skip) {
          var requiresES6 = !1;
          if (module in registry) {
            throw new Error('module already registered: ' + module);
          }
          version = String(version || '');
          if (version.slice(-1) === '!') {
            version = version.slice(0, -1);
            requiresES6 = !0;
          }
          registry[module] = {
            module: {
              exports: {}
            },
            packageExports: {},
            version: version,
            requiresES6: requiresES6,
            dependencies: dependencies || [],
            group: typeof group === 'undefined' ? null : group,
            source: typeof source === 'string' ? source : 'local',
            state: 'registered',
            skip: typeof skip === 'string' ? skip : null
          };
        }
        return {
          moduleRegistry: registry,
          maxQueryLength: 5000,
          addStyleTag: newStyleTag,
          enqueue: enqueue,
          resolve: resolve,
          work: function() {
            var q, module, implementation, storedImplementations = [], storedNames = [], requestNames = [], batch = new StringSet();
            mw.loader.store.init();
            q = queue.length;
            while (q--) {
              module = queue[q];
              if (module in registry && registry[module].state === 'registered') {
                if (!batch.has(module)) {
                  registry[module].state = 'loading';
                  batch.add(module);
                  implementation = mw.loader.store.get(module);
                  if (implementation) {
                    storedImplementations.push(implementation);
                    storedNames.push(module);
                  } else {
                    requestNames.push(module);
                  }
                }
              }
            }
            queue = [];
            asyncEval(storedImplementations, function(err) {
              var failed;
              mw.loader.store.stats.failed++;
              mw.loader.store.clear();
              mw.trackError('resourceloader.exception', {
                exception: err,
                source: 'store-eval'
              });
              failed = storedNames.filter(function(name) {
                return registry[name].state === 'loading';
              });
              batchRequest(failed);
            });
            batchRequest(requestNames);
          },
          addSource: function(ids) {
            var id;
            for (id in ids) {
              if (id in sources) {
                throw new Error('source already registered: ' + id);
              }
              sources[id] = ids[id];
            }
          },
          register: function(modules) {
            var i;
            if (typeof modules === 'object') {
              resolveIndexedDependencies(modules);
              for (i = 0; i < modules.length; i++) {
                registerOne.apply(null, modules[i]);
              }
            } else {
              registerOne.apply(null, arguments);
            }
          },
          implement: function(module, script, style, messages, templates) {
            var split = splitModuleKey(module)
              , name = split.name
              , version = split.version;
            if (!(name in registry)) {
              mw.loader.register(name);
            }
            if (registry[name].script !== undefined) {
              throw new Error('module already implemented: ' + name);
            }
            if (version) {
              registry[name].version = version;
            }
            registry[name].script = script || null;
            registry[name].style = style || null;
            registry[name].messages = messages || null;
            registry[name].templates = templates || null;
            if (registry[name].state !== 'error' && registry[name].state !== 'missing') {
              setAndPropagate(name, 'loaded');
            }
          },
          load: function(modules, type) {
            if (typeof modules === 'string' && /^(https?:)?\/?\//.test(modules)) {
              if (type === 'text/css') {
                addLink(modules);
              } else if (type === 'text/javascript' || type === undefined) {
                addScript(modules);
              } else {
                throw new Error('Invalid type ' + type);
              }
            } else {
              modules = typeof modules === 'string' ? [modules] : modules;
              enqueue(resolveStubbornly(modules), undefined, undefined);
            }
          },
          state: function(states) {
            var module, state;
            for (module in states) {
              state = states[module];
              if (!(module in registry)) {
                mw.loader.register(module);
              }
              setAndPropagate(module, state);
            }
          },
          getState: function(module) {
            return module in registry ? registry[module].state : null;
          },
          getModuleNames: function() {
            return Object.keys(registry);
          },
          require: function(moduleName) {
            var state = mw.loader.getState(moduleName);
            if (state !== 'ready') {
              throw new Error('Module "' + moduleName + '" is not loaded');
            }
            return registry[moduleName].module.exports;
          },
          store: {
            enabled: null,
            MODULE_SIZE_MAX: 1e5,
            items: {},
            queue: [],
            stats: {
              hits: 0,
              misses: 0,
              expired: 0,
              failed: 0
            },
            toJSON: function() {
              return {
                items: mw.loader.store.items,
                vary: mw.loader.store.vary,
                asOf: Math.ceil(Date.now() / 1e7)
              };
            },
            key: "MediaWikiModuleStore:enwiki",
            vary: "vector:1-3:en",
            init: function() {
              var raw, data;
              if (this.enabled !== null) {
                return;
              }
              if (!!0 || /Firefox/.test(navigator.userAgent)) {
                this.clear();
                this.enabled = !1;
                return;
              }
              try {
                raw = localStorage.getItem(this.key);
                this.enabled = !0;
                data = JSON.parse(raw);
                if (data && typeof data.items === 'object' && data.vary === this.vary && Date.now() < (data.asOf * 1e7) + 259e7) {
                  this.items = data.items;
                  return;
                }
              } catch (e) {}
              if (raw === undefined) {
                this.enabled = !1;
              }
            },
            get: function(module) {
              var key;
              if (this.enabled) {
                key = getModuleKey(module);
                if (key in this.items) {
                  this.stats.hits++;
                  return this.items[key];
                }
                this.stats.misses++;
              }
              return !1;
            },
            add: function(module) {
              if (this.enabled) {
                this.queue.push(module);
                this.requestUpdate();
              }
            },
            set: function(module) {
              var key, args, src, encodedScript, descriptor = mw.loader.moduleRegistry[module];
              key = getModuleKey(module);
              if (key in this.items || !descriptor || descriptor.state !== 'ready' || !descriptor.version || descriptor.group === 1 || descriptor.group === 0 || [descriptor.script, descriptor.style, descriptor.messages, descriptor.templates].indexOf(undefined) !== -1) {
                return;
              }
              try {
                if (typeof descriptor.script === 'function') {
                  encodedScript = String(descriptor.script);
                } else if (typeof descriptor.script === 'object' && descriptor.script && !Array.isArray(descriptor.script)) {
                  encodedScript = '{' + 'main:' + JSON.stringify(descriptor.script.main) + ',' + 'files:{' + Object.keys(descriptor.script.files).map(function(file) {
                    var value = descriptor.script.files[file];
                    return JSON.stringify(file) + ':' + (typeof value === 'function' ? value : JSON.stringify(value));
                  }).join(',') + '}}';
                } else {
                  encodedScript = JSON.stringify(descriptor.script);
                }
                args = [JSON.stringify(key), encodedScript, JSON.stringify(descriptor.style), JSON.stringify(descriptor.messages), JSON.stringify(descriptor.templates)];
              } catch (e) {
                mw.trackError('resourceloader.exception', {
                  exception: e,
                  source: 'store-localstorage-json'
                });
                return;
              }
              src = 'mw.loader.implement(' + args.join(',') + ');';
              if (src.length > this.MODULE_SIZE_MAX) {
                return;
              }
              this.items[key] = src;
            },
            prune: function() {
              var key, module;
              for (key in this.items) {
                module = key.slice(0, key.indexOf('@'));
                if (getModuleKey(module) !== key) {
                  this.stats.expired++;
                  delete this.items[key];
                } else if (this.items[key].length > this.MODULE_SIZE_MAX) {
                  delete this.items[key];
                }
              }
            },
            clear: function() {
              this.items = {};
              try {
                localStorage.removeItem(this.key);
              } catch (e) {}
            },
            requestUpdate: (function() {
              var hasPendingWrites = !1;
              function flushWrites() {
                var data, key;
                mw.loader.store.prune();
                while (mw.loader.store.queue.length) {
                  mw.loader.store.set(mw.loader.store.queue.shift());
                }
                key = mw.loader.store.key;
                try {
                  localStorage.removeItem(key);
                  data = JSON.stringify(mw.loader.store);
                  localStorage.setItem(key, data);
                } catch (e) {
                  mw.trackError('resourceloader.exception', {
                    exception: e,
                    source: 'store-localstorage-update'
                  });
                }
                hasPendingWrites = !1;
              }
              function onTimeout() {
                mw.requestIdleCallback(flushWrites);
              }
              return function() {
                if (!hasPendingWrites) {
                  hasPendingWrites = !0;
                  setTimeout(onTimeout, 2000);
                }
              }
                ;
            }())
          }
        };
      }())
    };
    window.mw = window.mediaWiki = mw;
  }());
  mw.requestIdleCallbackInternal = function(callback) {
    setTimeout(function() {
      var start = mw.now();
      callback({
        didTimeout: !1,
        timeRemaining: function() {
          return Math.max(0, 50 - (mw.now() - start));
        }
      });
    }, 1);
  }
  ;
  mw.requestIdleCallback = window.requestIdleCallback ? window.requestIdleCallback.bind(window) : mw.requestIdleCallbackInternal;
  (function() {
    var queue;
    mw.loader.addSource({
      "local": "https://en.wikipedia.org/w/load.php",
      "metawiki": "https://meta.wikimedia.org/w/load.php"
    });
    mw.loader.register([["site", "usyc8", [1]], ["site.styles", "ctk45", [], 2], ["noscript", "r22l1", [], 3], ["filepage", "spr0c"], ["user", "k1cuu", [], 0], ["user.styles", "8fimp", [], 0], ["user.defaults", "mndxr"], ["1hzgi", [6], 1], ["mediawiki.skinning.elements", "114co"], ["mediawiki.skinning.content", "l3yl1"], ["mediawiki.skinning.interface", "u9763"], ["jquery.makeCollapsible.styles", "3x9mx"], ["mediawiki.skinning.content.parsoid", "10qcg"], ["mediawiki.skinning.content.externallinks", "1tau0"], ["jquery", "yntai"], ["es6-promise", "1eg94", [], null, null, "return typeof Promise==='function'\u0026\u0026Promise.prototype.finally;"], ["mediawiki.base", "1gj2x", [14]], ["jquery.chosen", "oqs2c"], ["jquery.client", "fn93f"], ["jquery.color", "dcjsx"], ["jquery.confirmable", "11aay", [111]], ["jquery.cookie", "1smd3"], ["jquery.form", "1wtf2"], ["jquery.fullscreen", "1xq4o"], ["jquery.highlightText", "1tsxs", [85]], ["jquery.hoverIntent", "1aklr"], ["jquery.i18n", "29w1w", [110]], ["jquery.lengthLimit", "1llrz", [68]], ["jquery.makeCollapsible", "4pi6s", [11]], ["jquery.mw-jump", "r425l"], ["jquery.spinner", "16kkr", [31]], ["jquery.spinner.styles", "o62ui"], ["jquery.jStorage", "1ccp7"], ["jquery.suggestions", "9e98z", [24]], ["jquery.tablesorter", "qji78", [35, 112, 85]], ["jquery.tablesorter.styles", "1wkr8"], ["jquery.textSelection", "152er", [18]], ["OO.ui.throttle/debounce", "xl0tk"], ["jquery.tipsy", "x724n"], ["jquery.ui", "1dv91"], ["moment", "d6rz2", [108, 85]], ["vue", "fegcm"], ["vuex", "c4upc", [15, 41]], ["wvui", "138e9", [41]], ["mediawiki.template", "xae8l"], ["mediawiki.template.mustache", "nyt38", [44]], ["mediawiki.apipretty", "1cr6m"], ["mediawiki.api", "1ufrw", [73, 111]], ["mediawiki.content.json", "1c5v6"], ["mediawiki.confirmCloseWindow", "1khkw"], ["mediawiki.debug", "19rux", [201]], ["mediawiki.diff.styles", "1g4pf"], ["mediawiki.feedback", "qgk9z", [969, 209]], ["mediawiki.feedlink", "szobh"], ["mediawiki.filewarning", "13k5t", [201, 213]], ["mediawiki.ForeignApi", "191mv", [350]], ["mediawiki.ForeignApi.core", "bd8b3", [82, 47, 197]], ["mediawiki.helplink", "12yue"], ["mediawiki.hlist", "1egi4"], ["mediawiki.htmlform", "db2r3", [27, 85]], ["mediawiki.htmlform.ooui", "14rir", [201]], ["mediawiki.htmlform.styles", "1bkvk"], ["mediawiki.htmlform.ooui.styles", "1dwm7"], ["mediawiki.icon", "j5ayk"], ["mediawiki.inspect", "tfpyz", [68, 85]], ["mediawiki.notification", "19798", [85, 92]], ["mediawiki.notification.convertmessagebox", "3la3s", [65]], ["mediawiki.notification.convertmessagebox.styles", "wj24b"], ["mediawiki.String", "15280"], ["mediawiki.pager.tablePager", "u9adc"], ["mediawiki.pulsatingdot", "tj1mg"], ["mediawiki.searchSuggest", "puyq0", [33, 47]], ["mediawiki.storage", "187em"], ["mediawiki.Title", "1rych", [68, 85]], ["mediawiki.Upload", "1sdt0", [47]], ["mediawiki.ForeignUpload", "r1cfg", [55, 74]], ["mediawiki.ForeignStructuredUpload", "mi56z", [75]], ["mediawiki.Upload.Dialog", "issxg", [78]], ["mediawiki.Upload.BookletLayout", "16te3", [74, 83, 194, 40, 204, 209, 214, 215]], ["mediawiki.ForeignStructuredUpload.BookletLayout", "cpmmk", [76, 78, 115, 180, 174]], ["mediawiki.toc", "ckf9m", [89]], ["mediawiki.toc.styles", "11vtw"], ["mediawiki.Uri", "sqmr8", [85]], ["mediawiki.user", "vgae7", [47, 89]], ["mediawiki.userSuggest", "18k7y", [33, 47]], ["mediawiki.util", "gjr0j", [18]], ["mediawiki.viewport", "1vq57"], ["mediawiki.checkboxtoggle", "2yuhf"], ["mediawiki.checkboxtoggle.styles", "15kl9"], ["mediawiki.cookie", "4wtg3", [21]], ["mediawiki.experiments", "hufn5"], ["mediawiki.editfont.styles", "1n9wd"], ["mediawiki.visibleTimeout", "119wq"], ["mediawiki.action.delete", "1dgz0", [27, 201]], ["mediawiki.action.edit", "1o9b5", [36, 95, 47, 91, 176]], ["mediawiki.action.edit.styles", "1y8mk"], ["mediawiki.action.edit.collapsibleFooter", "mu8ur", [28, 63, 72]], ["mediawiki.action.edit.preview", "folxd", [30, 36, 51, 83, 201]], ["mediawiki.action.history", "vgbiv", [28]], ["mediawiki.action.history.styles", "59vff"], ["mediawiki.action.protect", "l4iij", [27, 201]], ["mediawiki.action.view.metadata", "1h3zt", [107]], ["mediawiki.action.view.categoryPage.styles", "ykb5p"], ["mediawiki.action.view.postEdit", "1yma7", [111, 65]], ["mediawiki.action.view.redirect", "19xk3", [18]], ["mediawiki.action.view.redirectPage", "1ghvh"], ["mediawiki.action.edit.editWarning", "1gdkg", [36, 49, 111]], ["mediawiki.action.view.filepage", "bemh7"], ["mediawiki.language", "xbgr9", [109]], ["mediawiki.cldr", "erqtv", [110]], ["mediawiki.libs.pluralruleparser", "pvwvv"], ["mediawiki.jqueryMsg", "1i1zt", [108, 85, 7]], ["mediawiki.language.months", "1mcng", [108]], ["mediawiki.language.names", "b183q", [108]], ["mediawiki.language.specialCharacters", "qaysy", [108]], ["mediawiki.libs.jpegmeta", "c4xwo"], ["mediawiki.page.gallery", "18lwp", [37, 117]], ["mediawiki.page.gallery.styles", "jhck1"], ["mediawiki.page.gallery.slideshow", "164d3", [47, 204, 223, 225]], ["mediawiki.page.ready", "11t8f", [47]], ["mediawiki.page.watch.ajax", "9lm46", [47]], ["mediawiki.page.image.pagination", "1hhs1", [30, 85]], ["mediawiki.rcfilters.filters.base.styles", "1mn7f"], ["mediawiki.rcfilters.highlightCircles.seenunseen.styles", "kjktu"], ["mediawiki.rcfilters.filters.dm", "15f3c", [82, 83, 197]], ["mediawiki.rcfilters.filters.ui", "12fmm", [28, 124, 171, 210, 217, 219, 220, 221, 223, 224]], ["mediawiki.interface.helpers.styles", "1nsvz"], ["mediawiki.special", "2m5i3"], ["mediawiki.special.apisandbox", "66n8z", [28, 82, 190, 177, 200, 215, 220]], ["mediawiki.special.block", "bbzkl", [59, 174, 189, 181, 190, 187, 215, 217]], ["mediawiki.misc-authed-ooui", "hbxyk", [60, 171, 176]], ["mediawiki.misc-authed-pref", "r18bc", [7]], ["mediawiki.misc-authed-curate", "18ydi", [20, 30, 47]], ["mediawiki.special.changeslist", "zjt4l"], ["mediawiki.special.changeslist.watchlistexpiry", "1jn93", [127]], ["mediawiki.special.changeslist.enhanced", "19caq"], ["mediawiki.special.changeslist.legend", "1w3ma"], ["mediawiki.special.changeslist.legend.js", "ntrpi", [28, 89]], ["mediawiki.special.contributions", "wcllz", [28, 111, 174, 200]], ["mediawiki.special.edittags", "1x1ih", [17, 27]], ["mediawiki.special.import", "k6r2i", [171]], ["mediawiki.special.import.styles.ooui", "15en9"], ["mediawiki.special.preferences.ooui", "1pcv5", [49, 91, 66, 72, 181, 176]], ["mediawiki.special.preferences.styles.ooui", "1p5nj"], ["mediawiki.special.recentchanges", "13ytr", [171]], ["mediawiki.special.revisionDelete", "1a7mj", [27]], ["mediawiki.special.search", "1cmha", [192]], ["mediawiki.special.search.commonsInterwikiWidget", "1s9x8", [82, 47]], ["mediawiki.special.search.interwikiwidget.styles", "yu8u9"], ["mediawiki.special.search.styles", "v73l4"], ["mediawiki.special.undelete", "yfxca", [130]], ["mediawiki.special.unwatchedPages", "urar8", [47]], ["mediawiki.special.upload", "1nr6j", [30, 47, 49, 115, 127, 44]], ["mediawiki.special.userlogin.common.styles", "12rgj"], ["mediawiki.special.userlogin.login.styles", "lttkh"], ["mediawiki.special.createaccount", "132c3", [47]], ["mediawiki.special.userlogin.signup.styles", "13dmu"], ["mediawiki.special.userrights", "15936", [27, 66]], ["mediawiki.special.watchlist", "1brbr", [47, 201, 220]], ["mediawiki.special.version", "1qu9b"], ["mediawiki.legacy.config", "1dih0"], ["mediawiki.legacy.commonPrint", "dx92y"], ["mediawiki.legacy.protect", "pa56c", [27]], ["mediawiki.legacy.shared", "1eagt"], ["mediawiki.ui", "ji8eg"], ["mediawiki.ui.checkbox", "zq0lg"], ["mediawiki.ui.radio", "1ld1g"], ["mediawiki.ui.anchor", "197z2"], ["mediawiki.ui.button", "1x21g"], ["mediawiki.ui.input", "25wbs"], ["mediawiki.ui.icon", "1tj1t"], ["mediawiki.widgets", "41z81", [47, 172, 204, 214]], ["mediawiki.widgets.styles", "rqacs"], ["mediawiki.widgets.AbandonEditDialog", "1n79q", [209]], ["mediawiki.widgets.DateInputWidget", "yv6k2", [175, 40, 204, 225]], ["mediawiki.widgets.DateInputWidget.styles", "nf6xt"], ["mediawiki.widgets.visibleLengthLimit", "1wyjs", [27, 201]], ["mediawiki.widgets.datetime", "10vht", [85, 201, 224, 225]], ["mediawiki.widgets.expiry", "19dtp", [177, 40, 204]], ["mediawiki.widgets.CheckMatrixWidget", "12na7", [201]], ["mediawiki.widgets.CategoryMultiselectWidget", "slkpi", [55, 204]], ["mediawiki.widgets.SelectWithInputWidget", "oe83m", [182, 204]], ["mediawiki.widgets.SelectWithInputWidget.styles", "1fufa"], ["mediawiki.widgets.SizeFilterWidget", "sawvf", [184, 204]], ["mediawiki.widgets.SizeFilterWidget.styles", "15b9u"], ["mediawiki.widgets.MediaSearch", "12uet", [55, 204]], ["mediawiki.widgets.Table", "1gmb8", [204]], ["mediawiki.widgets.UserInputWidget", "1oqp3", [47, 204]], ["mediawiki.widgets.UsersMultiselectWidget", "1iec8", [47, 204]], ["mediawiki.widgets.NamespacesMultiselectWidget", "1nuht", [204]], ["mediawiki.widgets.TitlesMultiselectWidget", "2tq85", [171]], ["mediawiki.widgets.TagMultiselectWidget.styles", "1vzh9"], ["mediawiki.widgets.SearchInputWidget", "1ri9j", [71, 171, 220]], ["mediawiki.widgets.SearchInputWidget.styles", "68its"], ["mediawiki.widgets.StashedFileWidget", "zhtco", [47, 201]], ["mediawiki.watchstar.widgets", "1ya1g", [200]], ["mediawiki.deflate", "gu4pi"], ["oojs", "1fhbo"], ["mediawiki.router", "1f8qs", [199]], ["oojs-router", "1xhla", [197]], ["oojs-ui", "yfxca", [207, 204, 209]], ["oojs-ui-core", "1u7r5", [108, 197, 203, 202, 211]], ["oojs-ui-core.styles", "gyrbe"], ["oojs-ui-core.icons", "e6dfp"], ["oojs-ui-widgets", "1ixsg", [201, 206]], ["oojs-ui-widgets.styles", "7iunh"], ["oojs-ui-widgets.icons", "19un4"], ["oojs-ui-toolbars", "1avni", [201, 208]], ["oojs-ui-toolbars.icons", "11wt6"], ["oojs-ui-windows", "1l2in", [201, 210]], ["oojs-ui-windows.icons", "1r1lr"], ["oojs-ui.styles.indicators", "gqta0"], ["oojs-ui.styles.icons-accessibility", "19nwq"], ["oojs-ui.styles.icons-alerts", "mrr7u"], ["oojs-ui.styles.icons-content", "1ubqn"], ["oojs-ui.styles.icons-editing-advanced", "6ovh9"], ["oojs-ui.styles.icons-editing-citation", "p5r85"], ["oojs-ui.styles.icons-editing-core", "oyw0t"], ["oojs-ui.styles.icons-editing-list", "du44y"], ["oojs-ui.styles.icons-editing-styling", "1ah7b"], ["oojs-ui.styles.icons-interactions", "19dwu"], ["oojs-ui.styles.icons-layout", "hl1p0"], ["oojs-ui.styles.icons-location", "1rhw5"], ["oojs-ui.styles.icons-media", "15m7j"], ["oojs-ui.styles.icons-moderation", "1nkn7"], ["oojs-ui.styles.icons-movement", "19os8"], ["oojs-ui.styles.icons-user", "185o8"], ["oojs-ui.styles.icons-wikimedia", "1cf4h"], ["skins.vector.search", "1e4r5", [82, 43]], ["skins.vector.styles.legacy", "1u33v"], ["skins.vector.styles", "1kk59"], ["skins.vector.icons", "xh0u8"], ["skins.vector.js", "11ven", [119]], ["skins.vector.legacy.js", "1ynhz", [119]], ["skins.monobook.styles", "1h2vv"], ["skins.monobook.responsive", "1xddt"], ["skins.monobook.mobile.uls", "18u9r"], ["skins.monobook.mobile.echohack", "12ty6", [85, 213]], ["skins.monobook.mobile", "2jiz2", [85]], ["skins.modern", "1uwm6"], ["skins.cologneblue.i18n", "92jji"], ["skins.cologneblue", "sd914"], ["skins.timeless", "97gjx"], ["skins.timeless.js", "tvvtt"], ["ext.timeline.styles", "xg0ao"], ["ext.wikihiero", "1llrs"], ["ext.wikihiero.special", "uy106", [245, 30, 201]], ["ext.wikihiero.visualEditor", "137xp", [467]], ["ext.charinsert", "19mp5", [36]], ["ext.charinsert.styles", "1mhyc"], ["ext.cite.styles", "wf816"], ["ext.cite.style", "uqkn4"], ["ext.cite.visualEditor.core", "16zrx", [475]], ["ext.cite.visualEditor.data", "1watq", [457]], ["ext.cite.visualEditor", "bn5fo", [251, 250, 252, 253, 213, 216, 220]], ["ext.cite.ux-enhancements", "rb95f"], ["ext.citeThisPage", "1ygkn"], ["ext.inputBox.styles", "1abiw"], ["ext.inputBox", "ae2hh", [37]], ["ext.pygments", "r8x6l"], ["ext.pygments.linenumbers", "1axgq"], ["ext.geshi.visualEditor", "1uo6z", [467]], ["ext.flaggedRevs.basic", "q87vz"], ["ext.flaggedRevs.advanced", "tivqc", [85]], ["ext.flaggedRevs.review", "118io", [83]], ["ext.flaggedRevs.review.styles", "amlp5"], ["ext.flaggedRevs.icons", "8q53v"], ["ext.categoryTree", "142sc", [47]], ["ext.categoryTree.styles", "1jrrm"], ["ext.spamBlacklist.visualEditor", "v2zpq"], ["mediawiki.api.titleblacklist", "wyv4b", [47]], ["ext.titleblacklist.visualEditor", "emzm0"], ["mw.PopUpMediaTransform", "1k9md", [289, 73, 292, 273]], ["mw.PopUpMediaTransform.styles", "1ceg6"], ["mw.TMHGalleryHook.js", "1g8ta"], ["ext.tmh.embedPlayerIframe", "31nih", [307, 292]], ["mw.MediaWikiPlayerSupport", "122kf", [306, 292]], ["mw.MediaWikiPlayer.loader", "1kyjg", [308, 323]], ["ext.tmh.video-js", "dpzp3"], ["ext.tmh.videojs-ogvjs", "1b59b", [290, 278]], ["ext.tmh.videojs-resolution-switcher", "f3bue", [278]], ["ext.tmh.mw-info-button", "1vsjj", [278, 73]], ["ext.tmh.player", "19goh", [289, 73]], ["ext.tmh.player.dialog", "1baso", [284, 286, 209]], ["ext.tmh.player.inline", "1bp6e", [281, 280]], ["ext.tmh.player.styles", "1srib"], ["ext.tmh.player.inline.styles", "zuann"], ["ext.tmh.thumbnail.styles", "2j0x5"], ["ext.tmh.transcodetable", "l3wgg", [47, 200]], ["ext.tmh.OgvJsSupport", "ul8bm"], ["ext.tmh.OgvJs", "p1nsp", [289]], ["embedPlayerIframeStyle", "lkkli"], ["mw.MwEmbedSupport", "1grjc", [293, 295, 304, 303, 296]], ["Spinner", "1913m", [85]], ["iScroll", "1tnmd"], ["jquery.loadingSpinner", "scnci"], ["mw.MwEmbedSupport.style", "1n6fe"], ["mediawiki.UtilitiesTime", "o55id"], ["mediawiki.client", "1ahv3"], ["mediawiki.absoluteUrl", "17zfv", [82]], ["mw.ajaxProxy", "ulh0j"], ["fullScreenApi", "4y6d4"], ["jquery.embedMenu", "123nf"], ["jquery.triggerQueueCallback", "dt3pe"], ["jquery.mwEmbedUtil", "16pz2"], ["jquery.debouncedresize", "rz9ui"], ["mw.Api", "1ari9"], ["jquery.embedPlayer", "xxx6c"], ["mw.EmbedPlayer.loader", "1vehf", [307]], ["mw.MediaElement", "d4qk2", [289]], ["mw.MediaPlayer", "qwb7t"], ["mw.MediaPlayers", "1uolz", [310]], ["mw.MediaSource", "ubhxj", [292]], ["mw.EmbedTypes", "yid87", [82, 311]], ["mw.EmbedPlayer", "dx54v", [301, 21, 305, 302, 25, 39, 297, 299, 298, 111, 317, 313, 309, 312]], ["mw.EmbedPlayerKplayer", "f4wup"], ["mw.EmbedPlayerGeneric", "rdm0a"], ["mw.EmbedPlayerNative", "1msii"], ["mw.EmbedPlayerVLCApp", "c3ijc", [82]], ["mw.EmbedPlayerIEWebMPrompt", "yt5k5"], ["mw.EmbedPlayerOgvJs", "1prdv", [289, 30]], ["mw.EmbedPlayerImageOverlay", "tslgl"], ["mw.EmbedPlayerVlc", "1oc1c"], ["mw.TimedText.loader", "19pg5"], ["mw.TimedText", "113o3", [113, 314, 325]], ["mw.TextSource", "3lvxc", [297, 300]], ["ext.urlShortener.special", "8y5rz", [82, 60, 171, 200]], ["ext.urlShortener.toolbar", "sz22o", [47]], ["ext.securepoll.htmlform", "iwh4n", [30, 187]], ["ext.securepoll", "1s2qe"], ["ext.securepoll.special", "1bicw"], ["ext.score.visualEditor", "11t6a", [332, 467]], ["ext.score.visualEditor.icons", "1ncc0"], ["ext.score.popup", "wf9bo", [47]], ["ext.score.errors", "1ag06"], ["ext.cirrus.serp", "1y78h", [82, 198]], ["ext.cirrus.explore-similar", "104fd", [47, 45]], ["ext.nuke.confirm", "qvw09", [111]], ["ext.confirmEdit.editPreview.ipwhitelist.styles", "snao4"], ["ext.confirmEdit.visualEditor", "1o5d1", [964]], ["ext.confirmEdit.simpleCaptcha", "13yvy"], ["ext.confirmEdit.fancyCaptcha.styles", "nyngk"], ["ext.confirmEdit.fancyCaptcha", "1yib6", [47]], ["ext.confirmEdit.fancyCaptchaMobile", "1yib6", [529]], ["ext.centralauth", "zvjxm", [30, 85]], ["ext.centralauth.centralautologin", "is4i1", [111]], ["ext.centralauth.centralautologin.clearcookie", "1cv2l"], ["ext.centralauth.misc.styles", "ckz4t"], ["ext.centralauth.globaluserautocomplete", "i1ejb", [33, 47]], ["ext.centralauth.globalrenameuser", "xg635", [85]], ["ext.centralauth.ForeignApi", "18nb7", [56]], ["ext.widgets.GlobalUserInputWidget", "manwk", [47, 204]], ["ext.GlobalUserPage", "1jr7i"], ["ext.apifeatureusage", "1uio2"], ["ext.dismissableSiteNotice", "ylim6", [21, 85]], ["ext.dismissableSiteNotice.styles", "grnip"], ["ext.centralNotice.startUp", "eh9im", [358]], ["ext.centralNotice.geoIP", "pyo3i", [21]], ["ext.centralNotice.choiceData", "f38d6", [361, 362, 363, 364]], ["ext.centralNotice.display", "rh0iv", [357, 360, 645, 82, 72]], ["ext.centralNotice.kvStore", "1phlw"], ["ext.centralNotice.bannerHistoryLogger", "1tbmj", [359]], ["ext.centralNotice.impressionDiet", "sars6", [359]], ["ext.centralNotice.largeBannerLimit", "1ni9e", [359]], ["ext.centralNotice.legacySupport", "1u2eu", [359]], ["ext.centralNotice.bannerSequence", "1ffw8", [359]], ["ext.centralNotice.freegeoipLookup", "v1vef", [357]], ["ext.centralNotice.impressionEventsSampleRate", "1ig8o", [359]], ["ext.centralNotice.cspViolationAlert", "szici"], ["ext.wikimediamessages.contactpage.affcomusergroup", "gj1hn"], ["mediawiki.special.block.feedback.request", "1eini"], ["ext.collection", "3xtlh", [373, 39, 108]], ["ext.collection.bookcreator.styles", "rv537"], ["ext.collection.bookcreator", "1crce", [372, 32, 85]], ["ext.collection.checkLoadFromLocalStorage", "1qpuo", [371]], ["ext.collection.suggest", "16bak", [373]], ["ext.collection.offline", "1qq3w"], ["ext.collection.bookcreator.messageBox", "yfxca", [379, 378, 58]], ["ext.collection.bookcreator.messageBox.styles", "1flvl"], ["ext.collection.bookcreator.messageBox.icons", "nx7ay"], ["ext.ElectronPdfService.print.styles", "1868z"], ["ext.ElectronPdfService.special.styles", "1jjgx"], ["ext.ElectronPdfService.special.selectionImages", "1cver"], ["ext.advancedSearch.initialstyles", "dv7x5"], ["ext.advancedSearch.styles", "1h7va"], ["ext.advancedSearch.searchtoken", "1v7b7", [], 1], ["ext.advancedSearch.elements", "1xi6b", [384, 82, 83, 204, 220, 221]], ["ext.advancedSearch.init", "9yq1c", [386, 385]], ["ext.advancedSearch.SearchFieldUI", "olx6i", [73, 204]], ["ext.abuseFilter", "1iiv2"], ["ext.abuseFilter.edit", "1mi01", [30, 36, 47, 49, 204]], ["ext.abuseFilter.tools", "12z2a", [30, 47]], ["ext.abuseFilter.examine", "11l4r", [30, 47]], ["ext.abuseFilter.ace", "11te7", [614]], ["ext.abuseFilter.visualEditor", "1b19z"], ["ext.wikiEditor", "14yks", [33, 36, 37, 39, 114, 83, 204, 214, 215, 216, 217, 218, 219, 223, 44], 4], ["ext.wikiEditor.styles", "6r04s", [], 4], ["ext.CodeMirror", "b2kp6", [398, 36, 39, 83, 219]], ["ext.CodeMirror.data", "8gk26"], ["ext.CodeMirror.lib", "14yw8"], ["ext.CodeMirror.addons", "5a9iv", [399]], ["ext.CodeMirror.mode.mediawiki", "1gmm7", [399]], ["ext.CodeMirror.lib.mode.css", "1934i", [399]], ["ext.CodeMirror.lib.mode.javascript", "fl4m2", [399]], ["ext.CodeMirror.lib.mode.xml", "1aj3q", [399]], ["ext.CodeMirror.lib.mode.htmlmixed", "1j6tv", [402, 403, 404]], ["ext.CodeMirror.lib.mode.clike", "1wjfq", [399]], ["ext.CodeMirror.lib.mode.php", "1iw8b", [406, 405]], ["ext.CodeMirror.visualEditor.init", "jyekl"], ["ext.CodeMirror.visualEditor", "1qmae", [467]], ["ext.acw.eventlogging", "18ylz"], ["ext.acw.landingPageStyles", "2d8i3"], ["ext.MassMessage.styles", "1kc29"], ["ext.MassMessage.special.js", "bs70l", [27, 37, 39, 111]], ["ext.MassMessage.content.js", "1loyf", [20, 39, 47]], ["ext.MassMessage.create", "rnvl9", [39, 60, 111]], ["ext.MassMessage.edit", "1ekku", [176, 200]], ["ext.betaFeatures", "rqm7i", [18, 201]], ["ext.betaFeatures.styles", "1lf43"], ["mmv", "1dy2w", [19, 23, 37, 38, 82, 424]], ["mmv.ui.ondemandshareddependencies", "cz4jt", [419, 200]], ["mmv.ui.download.pane", "v67r2", [164, 171, 420]], ["mmv.ui.reuse.shareembed", "1okiq", [171, 420]], ["mmv.ui.tipsyDialog", "1qnjs", [419]], ["mmv.bootstrap", "1doho", [168, 170, 426, 199]], ["mmv.bootstrap.autostart", "nvgyi", [424]], ["mmv.head", "1vvtn", [72, 83]], ["ext.popups.icons", "1vker"], ["ext.popups.images", "1kb6z"], ["ext.popups", "1iq42"], ["ext.popups.main", "ww6y7", [427, 428, 82, 90, 72, 168, 170, 83]], ["ext.linter.edit", "1ekuz", [36]], ["socket.io", "is39l"], ["dompurify", "1q6qs"], ["color-picker", "1qvmf"], ["unicodejs", "7llp9"], ["papaparse", "17t4y"], ["rangefix", "f32vh"], ["spark-md5", "11tzz"], ["ext.visualEditor.supportCheck", "13m8w", [], 5], ["ext.visualEditor.sanitize", "jrkg8", [433, 456], 5], ["ext.visualEditor.progressBarWidget", "qevve", [], 5], ["ext.visualEditor.tempWikitextEditorWidget", "1ess5", [91, 83], 5], ["ext.visualEditor.desktopArticleTarget.init", "1t7ti", [441, 439, 442, 453, 36, 82, 119, 72], 5], ["ext.visualEditor.desktopArticleTarget.noscript", "11b6q"], ["ext.visualEditor.targetLoader", "kqvi2", [455, 453, 36, 82, 72, 83], 5], ["ext.visualEditor.desktopTarget", "1stbc", [], 5], ["ext.visualEditor.desktopArticleTarget", "1bwn0", [459, 464, 446, 469], 5], ["ext.visualEditor.collabTarget", "1r80y", [457, 463, 91, 171, 220, 221], 5], ["ext.visualEditor.collabTarget.desktop", "v8kds", [448, 464, 446, 469], 5], ["ext.visualEditor.collabTarget.init", "e5yvb", [439, 171, 200], 5], ["ext.visualEditor.collabTarget.init.styles", "xc7ez"], ["ext.visualEditor.ve", "1hhk9", [], 5], ["ext.visualEditor.track", "1gi8o", [452], 5], ["ext.visualEditor.core.utils", "1jz50", [453, 200], 5], ["ext.visualEditor.core.utils.parsing", "1ltep", [452], 5], ["ext.visualEditor.base", "fgddb", [454, 455, 435], 5], ["ext.visualEditor.mediawiki", "87lms", [456, 445, 34, 672], 5], ["ext.visualEditor.mwsave", "1h6wt", [467, 27, 51, 220], 5], ["ext.visualEditor.articleTarget", "66hn5", [468, 458, 173], 5], ["ext.visualEditor.data", "1cr4a", [457]], ["ext.visualEditor.core", "80c2g", [440, 439, 18, 436, 437, 438], 5], ["ext.visualEditor.commentAnnotation", "ufndb", [461], 5], ["ext.visualEditor.rebase", "w3bpk", [434, 478, 462, 226, 432], 5], ["ext.visualEditor.core.desktop", "4hsf8", [461], 5], ["ext.visualEditor.welcome", "dkuyg", [200], 5], ["ext.visualEditor.switching", "u0d9j", [47, 200, 212, 215, 217], 5], ["ext.visualEditor.mwcore", "6z7qp", [479, 457, 466, 465, 126, 70, 12, 171], 5], ["ext.visualEditor.mwextensions", "yfxca", [460, 490, 483, 485, 470, 487, 472, 484, 473, 475], 5], ["ext.visualEditor.mwextensions.desktop", "yfxca", [468, 474, 79], 5], ["ext.visualEditor.mwformatting", "9wsr9", [467], 5], ["ext.visualEditor.mwimage.core", "dzr5a", [467], 5], ["ext.visualEditor.mwimage", "1wrjm", [471, 185, 40, 223, 227], 5], ["ext.visualEditor.mwlink", "6w1tp", [467], 5], ["ext.visualEditor.mwmeta", "11gpz", [473, 105], 5], ["ext.visualEditor.mwtransclusion", "60j2r", [467, 187], 5], ["treeDiffer", "1c337"], ["diffMatchPatch", "clg0b"], ["ext.visualEditor.checkList", "106gn", [461], 5], ["ext.visualEditor.diffing", "za876", [477, 461, 476], 5], ["ext.visualEditor.diffPage.init.styles", "150jb"], ["ext.visualEditor.diffLoader", "ok7co", [445], 5], ["ext.visualEditor.diffPage.init", "r6mao", [481, 200, 212, 215], 5], ["ext.visualEditor.language", "1onk1", [461, 672, 113], 5], ["ext.visualEditor.mwlanguage", "1msvw", [461], 5], ["ext.visualEditor.mwalienextension", "1e5q0", [467], 5], ["ext.visualEditor.mwwikitext", "196hf", [473, 91], 5], ["ext.visualEditor.mwgallery", "1iqd2", [467, 117, 185, 223], 5], ["ext.visualEditor.mwsignature", "1hvr8", [475], 5], ["ext.visualEditor.experimental", "yfxca", [], 5], ["ext.visualEditor.icons", "yfxca", [491, 492, 213, 214, 215, 217, 218, 219, 220, 221, 224, 225, 226, 211], 5], ["ext.visualEditor.moduleIcons", "13b0l"], ["ext.visualEditor.moduleIndicators", "bz3aq"], ["ext.citoid.visualEditor", "hiv82", [254, 494]], ["ext.citoid.visualEditor.data", "1883r", [457]], ["ext.citoid.wikibase.init", "sypgy"], ["ext.citoid.wikibase", "2yehr", [495, 39, 200]], ["ext.templateData", "1988i"], ["ext.templateDataGenerator.editPage", "7lemg"], ["ext.templateDataGenerator.data", "rrbzo", [197]], ["ext.templateDataGenerator.editTemplatePage", "z6rmh", [497, 501, 499, 36, 672, 47, 204, 209, 220, 221, 224]], ["ext.templateData.images", "1nsuo"], ["ext.TemplateWizard", "6lg8z", [36, 171, 174, 187, 207, 209, 220]], ["ext.wikiLove.icon", "1shsu"], ["ext.wikiLove.startup", "4wr34", [39, 47, 168]], ["ext.wikiLove.local", "th34b"], ["ext.wikiLove.init", "11puo", [504]], ["mediawiki.libs.guiders", "1wkvo"], ["ext.guidedTour.styles", "lx5zf", [507, 168]], ["ext.guidedTour.lib.internal", "1f1ga", [85]], ["ext.guidedTour.lib", "wpjyv", [645, 509, 508]], ["ext.guidedTour.launcher", "k3952"], ["ext.guidedTour", "5neux", [510]], ["ext.guidedTour.tour.firstedit", "1sony", [512]], ["ext.guidedTour.tour.test", "f32jv", [512]], ["ext.guidedTour.tour.onshow", "ut3ub", [512]], ["ext.guidedTour.tour.uprightdownleft", "1ity1", [512]], ["mobile.app", "e6qg3"], ["mobile.app.parsoid", "14q2a"], ["mobile.pagelist.styles", "ava4o"], ["mobile.pagesummary.styles", "1egc1"], ["mobile.messageBox.styles", "mii78"], ["mobile.placeholder.images", "1y9f6"], ["mobile.userpage.styles", "1boam"], ["mobile.startup.images", "1wo5e"], ["mobile.init.styles", "gebdr"], ["mobile.init", "h4toz", [82, 529]], ["mobile.ooui.icons", "11jmh"], ["mobile.user.icons", "8rxfv"], ["mobile.startup", "jlgvt", [37, 120, 198, 72, 45, 168, 170, 83, 86, 521, 527, 519, 520, 522, 524]], ["mobile.editor.overlay", "6cx1j", [49, 91, 65, 169, 173, 531, 529, 528, 200, 217]], ["mobile.editor.images", "4bdbu"], ["mobile.talk.overlays", "e3kwk", [167, 530]], ["mobile.mediaViewer", "1a2ew", [529]], ["mobile.categories.overlays", "19ngu", [530, 220]], ["mobile.languages.structured", "1vo1d", [529]], ["mobile.special.mobileoptions.styles", "vz6fe"], ["mobile.special.mobileoptions.scripts", "1ubf5", [529]], ["mobile.special.nearby.styles", "1it52"], ["mobile.special.userlogin.scripts", "131g5"], ["mobile.special.nearby.scripts", "1vs6p", [82, 538, 529]], ["mobile.special.mobilediff.images", "k05sa"], ["skins.minerva.base.styles", "kghhv"], ["skins.minerva.content.styles", "cvnsb"], ["skins.minerva.content.styles.images", "1yizv"], ["skins.minerva.icons.loggedin", "r6596"], ["skins.minerva.amc.styles", "1tmdg"], ["skins.minerva.overflow.icons", "1kdsm"], ["skins.minerva.icons.wikimedia", "f6apm"], ["skins.minerva.icons.images.scripts", "yfxca", [550, 552, 553, 551]], ["skins.minerva.icons.images.scripts.misc", "lh51t"], ["skins.minerva.icons.page.issues.uncolored", "1j7mx"], ["skins.minerva.icons.page.issues.default.color", "cc30n"], ["skins.minerva.icons.page.issues.medium.color", "4vgn1"], ["skins.minerva.mainPage.styles", "xx9o8"], ["skins.minerva.userpage.styles", "3ugw6"], ["skins.minerva.talk.styles", "1e3g4"], ["skins.minerva.personalMenu.icons", "fx575"], ["skins.minerva.mainMenu.advanced.icons", "15zfs"], ["skins.minerva.mainMenu.icons", "1iruq"], ["skins.minerva.mainMenu.styles", "ffrq9"], ["skins.minerva.loggedin.styles", "1otki"], ["skins.minerva.scripts", "vg4a8", [82, 90, 167, 529, 549, 559, 560]], ["skins.minerva.options", "1pw3i", [562]], ["ext.math.styles", "19kfl"], ["ext.math.scripts", "10354"], ["mw.widgets.MathWbEntitySelector", "190iy", [55, 171, 845, 209]], ["ext.math.visualEditor", "1lao9", [564, 467]], ["ext.math.visualEditor.mathSymbolsData", "ltjso", [567]], ["ext.math.visualEditor.mathSymbols", "1a66r", [568]], ["ext.math.visualEditor.chemSymbolsData", "ar9ku", [567]], ["ext.math.visualEditor.chemSymbols", "1rg9e", [570]], ["ext.babel", "1ordw"], ["ext.vipsscaler", "1b8ex", [574]], ["jquery.ucompare", "1fqic"], ["mediawiki.template.underscore", "i9pgt", [576, 44]], ["ext.pageTriage.external", "1dx4b"], ["ext.pageTriage.init", "tyfw6", [576]], ["ext.pageTriage.util", "bemn8", [577, 82, 83]], ["ext.pageTriage.views.list", "1bfg7", [578, 30, 39, 575]], ["ext.pageTriage.defaultTagsOptions", "gjzeg"], ["ext.pageTriage.externalTagsOptions", "16r2g", [580, 582]], ["ext.pageTriage.defaultDeletionTagsOptions", "1n92c", [73]], ["ext.pageTriage.toolbarStartup", "1v26q", [577]], ["ext.pageTriage.article", "10ott", [577, 82, 47]], ["ext.PageTriage.enqueue", "p9bzi", [85]], ["ext.interwiki.specialpage", "xk4er"], ["ext.echo.logger", "12wz2", [83, 197]], ["ext.echo.ui.desktop", "19uez", [594, 589]], ["ext.echo.ui", "4cvkt", [590, 587, 958, 204, 213, 214, 220, 224, 225, 226]], ["ext.echo.dm", "occy4", [593, 40]], ["ext.echo.api", "xc75x", [55]], ["ext.echo.mobile", "18h9h", [589, 198, 45]], ["ext.echo.init", "1wbsm", [591]], ["ext.echo.styles.badge", "1ionq"], ["ext.echo.styles.notifications", "12hak"], ["ext.echo.styles.alert", "1jdxe"], ["ext.echo.special", "1ft2h", [598, 589]], ["ext.echo.styles.special", "tjyvs"], ["ext.thanks.images", "5q47r"], ["ext.thanks", "1rf02", [47, 89]], ["ext.thanks.corethank", "cy9fg", [600, 20, 209]], ["ext.thanks.mobilediff", "uj81m", [599, 529]], ["ext.thanks.flowthank", "27pp1", [600, 209]], ["ext.disambiguator.visualEditor", "i70is", [474]], ["ext.discussionTools.init.styles", "at4ti"], ["ext.discussionTools.init", "1i0r9", [455, 82, 103, 47, 89, 72, 40, 209, 437]], ["ext.discussionTools.debug", "raoao", [606]], ["ext.discussionTools.ReplyWidget", "qdtwa", [964, 606, 173, 176, 204]], ["ext.discussionTools.ReplyWidgetPlain", "nn5pn", [608, 91, 83]], ["ext.discussionTools.ReplyWidgetVisual", "1y8es", [608, 464, 446, 469, 488, 486]], ["ext.codeEditor", "otfyp", [612], 4], ["jquery.codeEditor", "1qpmv", [614, 613, 395, 209], 4], ["ext.codeEditor.icons", "ty2ed"], ["ext.codeEditor.ace", "rgxsv", [], 6], ["ext.codeEditor.ace.modes", "126r1", [614], 6], ["ext.scribunto.errors", "l25w2", [39]], ["ext.scribunto.logs", "1pp6c"], ["ext.scribunto.edit", "18zsh", [30, 47]], ["ext.guidedTour.tour.gettingstartedtasktoolbar", "1vvji", [620, 512, 82]], ["ext.gettingstarted.logging", "13uer", [103, 83]], ["ext.gettingstarted.api", "28cgd", [47]], ["ext.gettingstarted.taskToolbar", "ai9yu", [621, 620, 510, 37]], ["ext.gettingstarted.return", "1kpnf", [621, 620, 510, 82]], ["ext.relatedArticles.cards", "5fyk2", [625, 85, 197]], ["ext.relatedArticles.lib", "1hqfc"], ["ext.relatedArticles.readMore.gateway", "pz3on", [197]], ["ext.relatedArticles.readMore.bootstrap", "uqvo5", [626, 82, 90, 83, 86]], ["ext.relatedArticles.readMore", "1cohh", [85]], ["ext.RevisionSlider.lazyCss", "2ft4x"], ["ext.RevisionSlider.lazyJs", "8ah63", [633, 225]], ["ext.RevisionSlider.init", "1lcc9", [636, 633, 635, 224]], ["ext.RevisionSlider.noscript", "1jaz7"], ["ext.RevisionSlider.Settings", "1ibe0", [72, 83]], ["ext.RevisionSlider.Pointer", "lks7m"], ["ext.RevisionSlider.Slider", "q35fc", [637, 634, 39, 82, 225]], ["ext.RevisionSlider.RevisionList", "13xys", [40, 200]], ["ext.RevisionSlider.HelpDialog", "y42gj", [638, 200, 220]], ["ext.RevisionSlider.dialogImages", "10r26"], ["ext.TwoColConflict.SplitJs", "zva9r", [642, 643]], ["ext.TwoColConflict.SplitCss", "1qwpr"], ["ext.TwoColConflict.Split.TourImages", "1yvdf"], ["ext.TwoColConflict.Split.Tour", "rsxef", [641, 70, 72, 83, 200, 220]], ["ext.TwoColConflict.Util", "9felx"], ["ext.TwoColConflict.JSCheck", "srrl2"], ["ext.eventLogging", "u2948", [83]], ["ext.eventLogging.debug", "8tfir"], ["ext.eventLogging.jsonSchema", "1d66w"], ["ext.eventLogging.jsonSchema.styles", "1b8ci"], ["ext.wikimediaEvents", "15442", [645, 82, 90, 72]], ["ext.wikimediaEvents.wikibase", "1iz8b", [645, 90]], ["ext.navigationTiming", "pc01o", [645]], ["ext.navigationTiming.rumSpeedIndex", "hbh0o"], ["ext.uls.common", "x1vfc", [672, 72, 83]], ["ext.uls.compactlinks", "50bjp", [653, 168]], ["ext.uls.displaysettings", "1iosv", [961, 661, 165, 166]], ["ext.uls.geoclient", "vzi6q", [89]], ["ext.uls.i18n", "148k0", [26, 85]], ["ext.uls.interface", "udr5p", [667]], ["ext.uls.interlanguage", "jmk7r"], ["ext.uls.languagenames", "wdf41"], ["ext.uls.languagesettings", "gf13w", [663, 664, 673, 168]], ["ext.uls.mediawiki", "105u5", [653, 660, 663, 667, 671]], ["ext.uls.messages", "dudyy", [657]], ["ext.uls.preferences", "7bdcm", [72, 83]], ["ext.uls.preferencespage", "ej2j1"], ["ext.uls.pt", "8jacp"], ["ext.uls.webfonts", "ba535", [664]], ["ext.uls.webfonts.fonts", "yfxca", [669, 674]], ["ext.uls.webfonts.repository", "va8oi"], ["jquery.ime", "1hvt5"], ["jquery.uls", "1ut7p", [26, 672, 673]], ["jquery.uls.data", "1mbcz"], ["jquery.uls.grid", "1mcjl"], ["jquery.webfonts", "1bzjx"], ["rangy.core", "177e2"], ["ext.cx.contributions", "1hjz6", [85, 201, 214, 215]], ["ext.cx.model", "1hxxp"], ["ext.cx.feedback", "88nrq", [677]], ["ext.cx.dashboard", "kmvta", [678, 715, 686, 702, 742, 745, 223]], ["sx.publishing.followup", "fkf74", [684, 682, 41]], ["ext.cx.util", "11e1j", [677]], ["mw.cx.util", "1bmk0", [677, 83]], ["ext.cx.util.selection", "m2jbs", [677]], ["mw.cx.SiteMapper", "1xhwo", [677, 55, 83]], ["ext.cx.source", "nv35y", [681, 713, 672, 82, 12, 83]], ["mw.cx.SourcePageSelector", "1qobm", [687, 766]], ["mw.cx.SelectedSourcePage", "yr3g1", [711, 33, 688, 215]], ["mw.cx.ui.LanguageFilter", "1nh2f", [662, 168, 721, 682, 220]], ["ext.cx.translation", "18bi6", [711, 690, 683, 672, 201]], ["ext.cx.translation.progress", "1c31v", [681]], ["ext.cx.tools.manager", "1k1p0"], ["ext.cx.tools", "1vayu", [678, 693, 691, 681, 683, 712, 713, 672, 72, 684, 762]], ["ext.cx.progressbar", "14h1s", [111]], ["ext.cx.translation.loader", "10zha", [677, 83]], ["ext.cx.translation.storage", "5fdb6", [47, 196, 201]], ["ext.cx.publish", "74uyd", [698, 711, 196]], ["ext.cx.wikibase.link", "4nhqv"], ["ext.cx.publish.dialog", "1b4cm", [684]], ["ext.cx.eventlogging.campaigns", "1b43b", [83]], ["ext.cx.interlanguagelink.init", "19har", [653]], ["ext.cx.interlanguagelink", "q2nrx", [681, 653, 684, 204, 220]], ["mw.cx.dashboard.lists", "tbeqp", [693, 681, 713, 171, 40, 688, 217, 224]], ["ext.cx.translation.conflict", "1v2f0", [111]], ["ext.cx.stats", "p4dsv", [705, 681, 714, 713, 672, 40, 684]], ["chart.js", "hr823"], ["ext.cx.entrypoints.newarticle", "13uqq", [714, 168, 85, 201]], ["ext.cx.entrypoints.newarticle.veloader", "lrbq7"], ["ext.cx.entrypoints.newbytranslation", "14m2q", [684, 682, 204, 214, 220]], ["ext.cx.betafeature.init", "10gyo"], ["ext.cx.entrypoints.contributionsmenu", "1hgck", [714, 111]], ["ext.cx.tools.validator", "1gqqx", [684]], ["ext.cx.widgets.overlay", "ydx19", [677]], ["ext.cx.widgets.spinner", "xoc2r", [677]], ["ext.cx.widgets.callout", "1sksh"], ["ext.cx.widgets.translator", "a5pkr", [677, 47]], ["mw.cx.dm", "1wmye", [677, 197]], ["mw.cx.dm.Translation", "3ditv", [716]], ["mw.cx.dm.WikiPage", "17pnl", [672, 716]], ["mw.cx.dm.TranslationIssue", "1myvi", [716]], ["mw.cx.dm.PageTitleModel", "2scqv", [730]], ["mw.cx.ui", "4mfh7", [677, 200]], ["mw.cx.visualEditor", "yfxca", [727, 726, 725, 724, 728, 723]], ["mw.cx.visualEditor.sentence", "1caoh", [731]], ["mw.cx.visualEditor.publishSettings", "efem8", [461]], ["mw.cx.visualEditor.mt", "10bo3", [731]], ["mw.cx.visualEditor.link", "1lo8u", [731]], ["mw.cx.visualEditor.content", "1n2dc", [254, 731]], ["mw.cx.visualEditor.section", "d8ojc", [731, 729, 730]], ["ve.ce.CXLintableNode", "1gbl4", [461]], ["ve.dm.CXLintableNode", "mnuhz", [461, 719]], ["mw.cx.visualEditor.base", "1hbs4", [464, 446, 469]], ["mw.cx.init", "lksky", [735, 734, 718, 733]], ["mw.cx.init.Translation", "11uvx", [196, 751, 737, 736]], ["mw.cx.MwApiRequestManager", "n3rx7", [736]], ["mw.cx.MachineTranslation", "iii2v", [677, 72]], ["ve.init.mw.CXTarget", "que6k", [681, 684, 717, 754, 682, 739, 738]], ["mw.cx.ui.TranslationView", "mk3e8", [713, 684, 720, 756, 742, 745, 763]], ["ve.ui.CXSurface", "7szje", [464]], ["ve.ui.CXDesktopContext", "19kl7", [464]], ["mw.cx.ui.TranslationView.legacy", "13adm", [681, 684, 746, 743, 764]], ["mw.cx.init.legacy", "1a2aw", [740]], ["mw.cx.ui.Header", "1hppj", [767, 226, 227]], ["mw.cx.ui.Header.legacy", "42s8j", [745, 767, 226, 227]], ["mw.cx.ui.Header.skin", "1rm0p"], ["mw.cx.ui.Infobar", "lg5ho", [765, 682]], ["mw.cx.ui.Columns.legacy", "tpos6", [747, 749, 748]], ["mw.cx.ui.SourceColumn.legacy", "3l1cv", [713, 721]], ["mw.cx.ui.TranslationColumn.legacy", "1tcco", [713, 721]], ["mw.cx.ui.ToolsColumn.legacy", "1hacr", [721]], ["mw.cx.ui.CategoryMultiselectWidget", "15a6l", [474, 721]], ["mw.cx.ui.Categories", "1c4nf", [717, 750]], ["mw.cx.ui.CaptchaDialog", "n3jl4", [963, 721]], ["mw.cx.ui.LoginDialog", "1l0pg", [85, 721]], ["mw.cx.tools.TranslationToolFactory", "1o2sd", [721]], ["mw.cx.tools", "yfxca", [759, 758, 757]], ["mw.cx.tools.IssueTrackingTool", "44bft", [760]], ["mw.cx.tools.TemplateTool", "529jb", [760]], ["mw.cx.tools.SearchTool", "1bgdu", [760]], ["mw.cx.tools.InstructionsTool", "8r41u", [111, 760, 45]], ["mw.cx.tools.TranslationTool", "5a0mf", [761]], ["mw.cx.ui.TranslationToolWidget", "lkteh", [721]], ["mw.cx.widgets.TemplateParamOptionWidget", "1y62v", [721]], ["mw.cx.ui.PageTitleWidget", "gaa0r", [721, 682, 729]], ["mw.cx.ui.PublishSettingsWidget", "1trx9", [721, 220]], ["mw.cx.ui.MessageWidget", "xolyf", [721, 213, 220]], ["mw.cx.ui.PageSelectorWidget", "1tex1", [672, 171, 684, 721, 220]], ["mw.cx.ui.PersonalMenuWidget", "1jl3y", [83, 171, 721]], ["mw.cx.ui.FeatureDiscoveryWidget", "e4w95", [70, 721]], ["mw.cx.skin", "j801g"], ["mw.externalguidance.init", "13824", [82]], ["mw.externalguidance", "y2f5c", [55, 529, 772, 217]], ["mw.externalguidance.icons", "xa2tn"], ["mw.externalguidance.special", "18n4f", [672, 55, 166, 529, 772]], ["wikibase.client.init", "lnemg"], ["wikibase.client.miscStyles", "78ef6"], ["wikibase.client.linkitem.init", "1jnmb", [30]], ["jquery.wikibase.linkitem", "1muq6", [30, 38, 39, 55, 845, 844, 968]], ["wikibase.client.action.edit.collapsibleFooter", "154an", [28, 63, 72]], ["ext.wikimediaBadges", "h9x7n"], ["ext.TemplateSandbox.top", "1y9qm"], ["ext.TemplateSandbox", "54oct", [780]], ["ext.pageassessments.special", "1gk8u", [33, 201]], ["ext.jsonConfig", "oeyr7"], ["ext.jsonConfig.edit", "1xjp4", [36, 186, 209]], ["ext.graph.styles", "wh50x"], ["ext.graph.data", "lnpu6"], ["ext.graph.loader", "htqnv", [47]], ["ext.graph.vega1", "1gmql", [786, 82]], ["ext.graph.vega2", "55a5t", [786, 82]], ["ext.graph.sandbox", "14wa6", [611, 789, 49]], ["ext.graph.visualEditor", "b6yln", [786, 471, 186]], ["ext.MWOAuth.styles", "fns5c"], ["ext.MWOAuth.AuthorizeDialog", "mglmv", [39]], ["ext.oath.totp.showqrcode", "1cqri"], ["ext.oath.totp.showqrcode.styles", "12n03"], ["ext.webauthn.ui.base", "1yb87", [111, 200]], ["ext.webauthn.register", "zo5hv", [796, 47]], ["ext.webauthn.login", "t59zw", [796]], ["ext.webauthn.manage", "joowb", [796, 47]], ["ext.webauthn.disable", "1fsj5", [796]], ["ext.ores.highlighter", "1w2wg"], ["ext.ores.styles", "lcxxv"], ["ext.ores.api", "l9d3n"], ["ext.checkUser", "12me9", [34, 82, 72, 171, 215, 217, 220, 222, 224, 226]], ["ext.checkUser.styles", "1pa3h"], ["ext.guidedTour.tour.checkuserinvestigateform", "1r7uv", [512]], ["ext.guidedTour.tour.checkuserinvestigate", "1aysm", [804, 512]], ["ext.quicksurveys.lib", "52275", [645, 82, 90, 72, 86, 204]], ["ext.quicksurveys.init", "1ggqp"], ["ext.kartographer", "xr7un"], ["ext.kartographer.style", "1t6e8"], ["ext.kartographer.site", "1jxyp"], ["mapbox", "pfzud"], ["leaflet.draw", "15217", [813]], ["ext.kartographer.link", "w48bu", [817, 198]], ["ext.kartographer.box", "nzgfm", [818, 829, 812, 811, 821, 82, 47, 223]], ["ext.kartographer.linkbox", "19jya", [821]], ["ext.kartographer.data", "1lw6k"], ["ext.kartographer.dialog", "1ap5u", [813, 198, 204, 209, 220]], ["ext.kartographer.dialog.sidebar", "11gi8", [72, 220, 225]], ["ext.kartographer.util", "2hxgp", [810]], ["ext.kartographer.frame", "zrgfa", [816, 198]], ["ext.kartographer.staticframe", "xrggf", [817, 198, 223]], ["ext.kartographer.preview", "6l39b"], ["ext.kartographer.editing", "qvghu", [47]], ["ext.kartographer.editor", "yfxca", [816, 814]], ["ext.kartographer.visualEditor", "1efeq", [821, 467, 222]], ["ext.kartographer.lib.prunecluster", "7wzxn", [813]], ["ext.kartographer.lib.topojson", "d8h09", [813]], ["ext.kartographer.wv", "mdxg3", [828, 217]], ["ext.kartographer.specialMap", "gqd57"], ["ext.pageviewinfo", "h3trn", [789, 200]], ["three.js", "1uoe7"], ["ext.3d", "1efrb", [30]], ["ext.3d.styles", "1rrwr"], ["mmv.3d", "1okh4", [834, 419, 833]], ["mmv.3d.head", "1gb1d", [834, 201, 212, 214]], ["ext.3d.special.upload", "l1rr1", [839, 152]], ["ext.3d.special.upload.styles", "tsx5r"], ["ext.GlobalPreferences.global", "11pcu", [171, 179, 188]], ["ext.GlobalPreferences.global-nojs", "1ivhq"], ["ext.GlobalPreferences.local", "3dqkc", [179]], ["ext.GlobalPreferences.local-nojs", "qbqct"], ["mw.config.values.wbSiteDetails", "117wi"], ["mw.config.values.wbRepo", "18viq"], ["ext.centralauth.globalrenamequeue", "13dot"], ["ext.centralauth.globalrenamequeue.styles", "19ks0"], ["ext.gadget.modrollback", "m8kr7", [], 2], ["ext.gadget.confirmationRollback-mobile", "zn9v3", [85], 2], ["ext.gadget.removeAccessKeys", "flxv8", [4, 85], 2], ["ext.gadget.searchFocus", "1kcxw", [], 2], ["ext.gadget.GoogleTrans", "i9xpb", [], 2], ["ext.gadget.ImageAnnotator", "2l1dy", [], 2], ["ext.gadget.imagelinks", "kqsvu", [85], 2], ["ext.gadget.Navigation_popups", "1jut1", [83], 2], ["ext.gadget.exlinks", "1yffr", [85], 2], ["ext.gadget.search-new-tab", "125v5", [], 2], ["ext.gadget.PrintOptions", "v4oe9", [], 2], ["ext.gadget.revisionjumper", "13grk", [], 2], ["ext.gadget.Twinkle", "7jrtc", [861, 863], 2], ["ext.gadget.morebits", "vxcxu", [83, 39], 2], ["ext.gadget.Twinkle-pagestyles", "1k85c", [], 2], ["ext.gadget.select2", "1cqa0", [], 2], ["ext.gadget.HideFundraisingNotice", "1nofe", [], 2], ["ext.gadget.HideCentralNotice", "gz251", [], 2], ["ext.gadget.ReferenceTooltips", "1o6rc", [89, 18], 2], ["ext.gadget.formWizard", "17lv5", [], 2], ["ext.gadget.formWizard-core", "sb9bm", [164, 83, 17, 39], 2], ["ext.gadget.responsiveContentBase", "1rtdx", [], 2], ["ext.gadget.responsiveContentBaseTimeless", "18tpu", [], 2], ["ext.gadget.Prosesize", "1nssl", [47], 2], ["ext.gadget.find-archived-section", "197t0", [], 2], ["ext.gadget.geonotice", "1qoax", [], 2], ["ext.gadget.geonotice-core", "11l5s", [85, 72], 2], ["ext.gadget.watchlist-notice", "fams1", [], 2], ["ext.gadget.watchlist-notice-core", "1vpku", [72], 2], ["ext.gadget.WatchlistBase", "nprfs", [], 2], ["ext.gadget.WatchlistGreenIndicators", "uzix8", [], 2], ["ext.gadget.WatchlistGreenIndicatorsMono", "1vcwo", [], 2], ["ext.gadget.WatchlistChangesBold", "x4gb0", [], 2], ["ext.gadget.SubtleUpdatemarker", "szsh3", [], 2], ["ext.gadget.defaultsummaries", "1t9q2", [201], 2], ["ext.gadget.citations", "vcyr2", [85], 2], ["ext.gadget.DotsSyntaxHighlighter", "1h0h4", [], 2], ["ext.gadget.HotCat", "1algn", [], 2], ["ext.gadget.wikEdDiff", "zpf2j", [], 2], ["ext.gadget.ProveIt", "1lcna", [], 2], ["ext.gadget.ProveIt-classic", "rkfnt", [39, 36, 85], 2], ["ext.gadget.Shortdesc-helper", "1e8d3", [47, 891], 2], ["ext.gadget.Shortdesc-helper-pagestyles-vector", "ptc7r", [], 2], ["ext.gadget.libSettings", "10w9o", [7], 2], ["ext.gadget.wikEd", "1ehfq", [36, 7], 2], ["ext.gadget.afchelper", "15z2t", [83, 17, 30, 39], 2], ["ext.gadget.charinsert", "1vxzq", [], 2], ["ext.gadget.charinsert-core", "1cvgw", [36, 4, 72], 2], ["ext.gadget.legacyToolbar", "180rf", [], 2], ["ext.gadget.extra-toolbar-buttons", "1rdtw", [], 2], ["ext.gadget.extra-toolbar-buttons-core", "cpsse", [], 2], ["ext.gadget.refToolbar", "1hiau", [7, 85], 2], ["ext.gadget.refToolbarBase", "15bvu", [], 2], ["ext.gadget.script-installer", "1rz9u", [], 2], ["ext.gadget.edittop", "pj7hm", [7, 85], 2], ["ext.gadget.UTCLiveClock", "lfyjd", [47], 2], ["ext.gadget.UTCLiveClock-pagestyles", "1ch76", [], 2], ["ext.gadget.purgetab", "edjiv", [47], 2], ["ext.gadget.ExternalSearch", "nf3zp", [], 2], ["ext.gadget.CollapsibleNav", "19ziu", [21], 2], ["ext.gadget.MenuTabsToggle", "kicd7", [89], 2], ["ext.gadget.dropdown-menus", "1edag", [47], 2], ["ext.gadget.dropdown-menus-pagestyles", "755tc", [], 2], ["ext.gadget.CategoryAboveAll", "k0g79", [], 2], ["ext.gadget.addsection-plus", "11kgg", [], 2], ["ext.gadget.CommentsInLocalTime", "2t3l2", [], 2], ["ext.gadget.OldDiff", "1x32c", [], 2], ["ext.gadget.NoAnimations", "y4mrp", [], 2], ["ext.gadget.disablesuggestions", "1b1l2", [], 2], ["ext.gadget.NoSmallFonts", "1vxdn", [], 2], ["ext.gadget.topalert", "1a54z", [], 2], ["ext.gadget.metadata", "1ptth", [85], 2], ["ext.gadget.JustifyParagraphs", "ryzph", [], 2], ["ext.gadget.righteditlinks", "z7u80", [], 2], ["ext.gadget.PrettyLog", "fyswo", [85], 2], ["ext.gadget.switcher", "oc1uw", [], 2], ["ext.gadget.SidebarTranslate", "zc5rm", [], 2], ["ext.gadget.Blackskin", "1ra1b", [], 2], ["ext.gadget.VectorClassic", "16fzl", [], 2], ["ext.gadget.widensearch", "1bwkh", [], 2], ["ext.gadget.DisambiguationLinks", "iu5kl", [], 2], ["ext.gadget.markblocked", "bb4aq", [119], 2], ["ext.gadget.responsiveContent", "1a6ay", [], 2], ["ext.gadget.responsiveContentTimeless", "kihss", [], 2], ["ext.gadget.HideInterwikiSearchResults", "3xbpc", [], 2], ["ext.gadget.XTools-ArticleInfo", "1ht5x", [], 2], ["ext.gadget.RegexMenuFramework", "xtf8z", [], 2], ["ext.gadget.ShowMessageNames", "lxtkz", [85], 2], ["ext.gadget.DebugMode", "pa6gq", [85], 2], ["ext.gadget.contribsrange", "uqldp", [85, 30], 2], ["ext.gadget.BugStatusUpdate", "6ajpj", [], 2], ["ext.gadget.RTRC", "r3h5z", [], 2], ["ext.gadget.XFDcloser", "cce0g", [83], 2], ["ext.gadget.XFDcloser-core", "198yy", [47, 204, 209, 220, 214, 224, 213], 2], ["ext.gadget.XFDcloser-core-beta", "mro0x", [47, 204, 209, 220, 214, 224, 213], 2], ["ext.gadget.libExtraUtil", "1ig7s", [], 2], ["ext.gadget.mobile-sidebar", "13aud", [], 2], ["ext.gadget.addMe", "1frrt", [], 2], ["ext.gadget.NewImageThumb", "1olyr", [], 2], ["ext.gadget.StickyTableHeaders", "147fz", [], 2], ["ext.gadget.ShowJavascriptErrors", "l317n", [], 2], ["ext.gadget.PageDescriptions", "3s3iv", [47], 2], ["ext.gadget.libLua", "1yyjo", [47], 2], ["ext.gadget.libSensitiveIPs", "1l2zu", [950], 2], ["ext.globalCssJs.user", "qvuzj", [], 0, "metawiki"], ["ext.globalCssJs.user.styles", "qvuzj", [], 0, "metawiki"], ["pdfhandler.messages", "1p1tq"], ["ext.guidedTour.tour.firsteditve", "142cg", [512]], ["ext.pageTriage.views.toolbar", "1at8k", [581, 578, 506, 30, 969, 213, 575]], ["ext.echo.emailicons", "vd2yb"], ["ext.echo.secondaryicons", "vlxw3"], ["ext.guidedTour.tour.gettingstartedtasktoolbarve", "1v4ec", [620, 512]], ["ext.wikimediaEvents.visualEditor", "1pioh", [445]], ["ext.uls.ime", "ofse5", [662, 670]], ["ext.uls.setlang", "1p7o7", [82, 47, 168]], ["mw.cx.externalmessages", "1ym2z"], ["ext.confirmEdit.CaptchaInputWidget", "um7ki", [201]], ["ext.guidedTour.tour.RcFiltersIntro", "qr9ss", [512]], ["ext.guidedTour.tour.WlFiltersIntro", "deakl", [512]], ["ext.guidedTour.tour.RcFiltersHighlight", "y8ymp", [512]], ["wikibase.Site", "9d40m", [662]], ["mediawiki.messagePoster", "1wtgm", [55]]]);
    mw.config.set(window.RLCONF || {});
    mw.loader.state(window.RLSTATE || {});
    mw.loader.load(window.RLPAGEMODULES || []);
    queue = window.RLQ || [];
    RLQ = [];
    RLQ.push = function(fn) {
      if (typeof fn === 'function') {
        fn();
      } else {
        RLQ[RLQ.length] = fn;
      }
    }
    ;
    while (queue[0]) {
      RLQ.push(queue.shift());
    }
    NORLQ = {
      push: function() {}
    };
  }());
}
