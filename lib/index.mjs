var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var _a2, _b;
import require$$0$1, { createContext, memo, useMemo, useEffect, useContext } from "react";
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["ERROR"] = "error";
  LogLevel2["WARN"] = "warn";
  LogLevel2["INFO"] = "info";
  LogLevel2["DEBUG"] = "debug";
  return LogLevel2;
})(LogLevel || {});
class Logger {
  static setLevel(level) {
    this.level = level;
  }
  static log(level, message, meta) {
    if (this.shouldLog(level)) {
      const logMessage = meta ? `${message} ${JSON.stringify(meta)}` : message;
      console[level](logMessage);
    }
  }
  static shouldLog(level) {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) <= levels.indexOf(this.level);
  }
  static error(message, meta) {
    this.log("error", message, meta);
  }
  static warn(message, meta) {
    this.log("warn", message, meta);
  }
  static info(message, meta) {
    this.log("info", message, meta);
  }
  static debug(message, meta) {
    this.log("debug", message, meta);
  }
}
__publicField(Logger, "level", "info");
const CONFIG_API_GATEWAY = "https://config.ton.solutions/v1/client/config";
const API_GATEWAY_REQUEST_TIMEOUT = 1e4;
const defaultConfig = {
  apiGateway: CONFIG_API_GATEWAY,
  requestTimeout: API_GATEWAY_REQUEST_TIMEOUT,
  defaultSystemEventPrefix: "[TS]",
  defaultSystemEventDataSeparator: " | "
};
let config = __spreadValues({}, defaultConfig);
const getConfig = () => config;
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2["Click"] = "Click";
  EventType2["PageView"] = "Pageview";
  EventType2["Wallet"] = "Wallet";
  EventType2["Closed"] = "Closed";
  EventType2["MainButtonPressed"] = "MainButtonPressed";
  EventType2["SettingsButtonPressed"] = "SettingsButtonPressed";
  EventType2["InvoiceClosed"] = "InvoiceClosed";
  EventType2["PopupClosed"] = "PopupClosed";
  EventType2["ClipboardTextReceived"] = "ClipboardTextReceived";
  EventType2["WriteAccessRequested"] = "WriteAccessRequested";
  EventType2["QRTextReceived"] = "QRTextReceived";
  EventType2["PhoneRequested"] = "PhoneRequested";
  EventType2["BackButtonPressed"] = "BackButtonPressed";
  EventType2["SecondaryButtonPressed"] = "SeconadaryButtonPressed";
  EventType2["PreparedMessageSent"] = "PreparedMessageSent";
  EventType2["FullScreenChanged"] = "FullScreenChanged";
  EventType2["HomeScreenAdded"] = "HomeScreenAdded";
  EventType2["HomeScreenChecked"] = "HomeScreenChecked";
  EventType2["EmojiStatusSet"] = "EmojiStatusSet";
  EventType2["LocationChecked"] = "LocationChecked";
  EventType2["LocationRequested"] = "LocationRequested";
  EventType2["AccelerometerStarted"] = "AccelerometerStarted";
  EventType2["AccelerometerStopped"] = "AccelerometerStopped";
  EventType2["AccelerometerChanged"] = "AccelerometerChanged";
  EventType2["DeviceOrientationStarted"] = "DeviceOrientationStarted";
  EventType2["DeviceOrientationStopped"] = "DeviceOrientationStopped";
  EventType2["DeviceOrientationChanged"] = "DeviceOrientationChanged";
  EventType2["DeviceOrientationFailed"] = "DeviceOrientationFailed";
  EventType2["GyroscropeStarted"] = "GyroscropeStarted";
  EventType2["GyroscropeStopped"] = "GyroscropeStopped";
  EventType2["GyroscropeChanged"] = "GyroscropeChanged";
  EventType2["GyroscropeFailed"] = "GyroscropeFailed";
  return EventType2;
})(EventType || {});
class EventPushHandler {
  constructor(client) {
    __publicField(this, "eventsQueue", []);
    __publicField(this, "isProcessing", false);
    this.client = client;
  }
  push(event) {
    this.eventsQueue.push(event);
    this.processQueue();
  }
  processQueue() {
    if (this.isProcessing === true || this.client.getConfig() === null) {
      return;
    }
    this.isProcessing = true;
    this.flush().then(() => {
      this.isProcessing = false;
      if (this.eventsQueue.length > 0) {
        this.processQueue();
      }
    });
  }
  flush() {
    return __async(this, null, function* () {
      const events = this.eventsQueue;
      this.eventsQueue = [];
      if (events.length === 0) {
        return;
      }
      const executeEvents = events.map(
        (event) => this.client.processEvent.bind(this.client)(event)
      );
      yield Promise.all(executeEvents);
    });
  }
}
const getCurrentUTCTimestamp = () => {
  return Math.floor(Date.now() / 1e3).toString();
};
const getCurrentUTCTimestampMilliseconds = () => {
  return Date.now().toString();
};
class HTTPTransport {
  constructor(_options) {
    this._options = _options;
    if (!("fetch" in window)) {
      throw new Error("Fetch is not available in this browser.");
    }
    if (!this._options.headers) {
      this._options.headers = {};
    }
  }
  setOptions(options) {
    this._options = options;
  }
  send(apiGateway, method, payload) {
    const options = {
      method,
      headers: this._options.headers,
      mode: "cors",
      redirect: "follow"
    };
    if (method === "POST" && payload) {
      options.body = payload;
    }
    return new Promise((resolve, reject) => {
      window.fetch(apiGateway, options).then((response) => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
class TransportFactory {
  static getTransport(name, options) {
    if (!this.transports[name]) {
      return new HTTPTransport(options);
    }
    return new this.transports[name](options);
  }
}
__publicField(TransportFactory, "transports", {
  http: HTTPTransport
});
const createEvent = (appName, eventName, userDetails, eventDetails, telegramID, language, device, referrerType, referrer, timestamp, isAutocapture, wallet, sessionIdentifier, eventSource = "telemetree_twa") => {
  return {
    eventType: eventName,
    userDetails,
    app: appName,
    eventDetails,
    telegramID,
    language,
    device,
    referrerType,
    referrer,
    timestamp,
    isAutocapture,
    wallet,
    sessionIdentifier,
    eventSource
  };
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var cryptoJs = { exports: {} };
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var core = { exports: {} };
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasRequiredCore;
function requireCore() {
  if (hasRequiredCore) return core.exports;
  hasRequiredCore = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function() {
      var CryptoJS2 = CryptoJS2 || function(Math2, undefined$1) {
        var crypto;
        if (typeof window !== "undefined" && window.crypto) {
          crypto = window.crypto;
        }
        if (typeof self !== "undefined" && self.crypto) {
          crypto = self.crypto;
        }
        if (typeof globalThis !== "undefined" && globalThis.crypto) {
          crypto = globalThis.crypto;
        }
        if (!crypto && typeof window !== "undefined" && window.msCrypto) {
          crypto = window.msCrypto;
        }
        if (!crypto && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
          crypto = commonjsGlobal.crypto;
        }
        if (!crypto && typeof commonjsRequire === "function") {
          try {
            crypto = require$$0;
          } catch (err) {
          }
        }
        var cryptoSecureRandomInt = function() {
          if (crypto) {
            if (typeof crypto.getRandomValues === "function") {
              try {
                return crypto.getRandomValues(new Uint32Array(1))[0];
              } catch (err) {
              }
            }
            if (typeof crypto.randomBytes === "function") {
              try {
                return crypto.randomBytes(4).readInt32LE();
              } catch (err) {
              }
            }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        };
        var create = Object.create || /* @__PURE__ */ function() {
          function F() {
          }
          return function(obj) {
            var subtype;
            F.prototype = obj;
            subtype = new F();
            F.prototype = null;
            return subtype;
          };
        }();
        var C = {};
        var C_lib = C.lib = {};
        var Base = C_lib.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(overrides) {
              var subtype = create(this);
              if (overrides) {
                subtype.mixIn(overrides);
              }
              if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                subtype.init = function() {
                  subtype.$super.init.apply(this, arguments);
                };
              }
              subtype.init.prototype = subtype;
              subtype.$super = this;
              return subtype;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var instance = this.extend();
              instance.init.apply(instance, arguments);
              return instance;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              }
              if (properties.hasOwnProperty("toString")) {
                this.toString = properties.toString;
              }
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }();
        var WordArray = C_lib.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(encoder) {
            return (encoder || Hex2).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();
            if (thisSigBytes % 4) {
              for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
              }
            } else {
              for (var j = 0; j < thatSigBytes; j += 4) {
                thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
              }
            }
            this.sigBytes += thatSigBytes;
            return this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
            words.length = Math2.ceil(sigBytes / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
              words.push(cryptoSecureRandomInt());
            }
            return new WordArray.init(words, nBytes);
          }
        });
        var C_enc = C.enc = {};
        var Hex2 = C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 15).toString(16));
            }
            return hexChars.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(hexStr) {
            var hexStrLength = hexStr.length;
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
              words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
            }
            return new WordArray.init(words, hexStrLength / 2);
          }
        };
        var Latin1 = C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(latin1Str) {
            var latin1StrLength = latin1Str.length;
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
              words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
            }
            return new WordArray.init(words, latin1StrLength);
          }
        };
        var Utf8 = C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          }
        };
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(data) {
            if (typeof data == "string") {
              data = Utf8.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(doFlush) {
            var processedWords;
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
              nBlocksReady = Math2.ceil(nBlocksReady);
            } else {
              nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            var nWordsReady = nBlocksReady * blockSize;
            var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                this._doProcessBlock(dataWords, offset);
              }
              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            }
            return new WordArray.init(processedWords, nBytesReady);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
          },
          _minBufferSize: 0
        });
        C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(messageUpdate) {
            if (messageUpdate) {
              this._append(messageUpdate);
            }
            var hash = this._doFinalize();
            return hash;
          },
          blockSize: 512 / 32,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(hasher) {
            return function(message, cfg) {
              return new hasher.init(cfg).finalize(message);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(hasher) {
            return function(message, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
          }
        });
        var C_algo = C.algo = {};
        return C;
      }(Math);
      return CryptoJS2;
    });
  })(core);
  return core.exports;
}
var x64Core = { exports: {} };
var hasRequiredX64Core;
function requireX64Core() {
  if (hasRequiredX64Core) return x64Core.exports;
  hasRequiredX64Core = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function(undefined$1) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var X32WordArray = C_lib.WordArray;
        var C_x64 = C.x64 = {};
        C_x64.Word = Base.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(high, low) {
            this.high = high;
            this.low = low;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        });
        C_x64.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 8;
            }
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;
            var x32Words = [];
            for (var i = 0; i < x64WordsLength; i++) {
              var x64Word = x64Words[i];
              x32Words.push(x64Word.high);
              x32Words.push(x64Word.low);
            }
            return X32WordArray.create(x32Words, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            var clone = Base.clone.call(this);
            var words = clone.words = this.words.slice(0);
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
              words[i] = words[i].clone();
            }
            return clone;
          }
        });
      })();
      return CryptoJS2;
    });
  })(x64Core);
  return x64Core.exports;
}
var libTypedarrays = { exports: {} };
var hasRequiredLibTypedarrays;
function requireLibTypedarrays() {
  if (hasRequiredLibTypedarrays) return libTypedarrays.exports;
  hasRequiredLibTypedarrays = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        if (typeof ArrayBuffer != "function") {
          return;
        }
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var superInit = WordArray.init;
        var subInit = WordArray.init = function(typedArray) {
          if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
          }
          if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
          }
          if (typedArray instanceof Uint8Array) {
            var typedArrayByteLength = typedArray.byteLength;
            var words = [];
            for (var i = 0; i < typedArrayByteLength; i++) {
              words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
            }
            superInit.call(this, words, typedArrayByteLength);
          } else {
            superInit.apply(this, arguments);
          }
        };
        subInit.prototype = WordArray;
      })();
      return CryptoJS2.lib.WordArray;
    });
  })(libTypedarrays);
  return libTypedarrays.exports;
}
var encUtf16 = { exports: {} };
var hasRequiredEncUtf16;
function requireEncUtf16() {
  if (hasRequiredEncUtf16) return encUtf16.exports;
  hasRequiredEncUtf16 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Utf16 = C_enc.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
              utf16Chars.push(String.fromCharCode(codePoint));
            }
            return utf16Chars.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(utf16Str) {
            var utf16StrLength = utf16Str.length;
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
            }
            return WordArray.create(words, utf16StrLength * 2);
          }
        };
        C_enc.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var utf16Chars = [];
            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
              utf16Chars.push(String.fromCharCode(codePoint));
            }
            return utf16Chars.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(utf16Str) {
            var utf16StrLength = utf16Str.length;
            var words = [];
            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
            }
            return WordArray.create(words, utf16StrLength * 2);
          }
        };
        function swapEndian(word) {
          return word << 8 & 4278255360 | word >>> 8 & 16711935;
        }
      })();
      return CryptoJS2.enc.Utf16;
    });
  })(encUtf16);
  return encUtf16.exports;
}
var encBase64 = { exports: {} };
var hasRequiredEncBase64;
function requireEncBase64() {
  if (hasRequiredEncBase64) return encBase64.exports;
  hasRequiredEncBase64 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;
            wordArray.clamp();
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
              var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;
              for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }
            return base64Chars.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(base64Str) {
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;
            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }
            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      })();
      return CryptoJS2.enc.Base64;
    });
  })(encBase64);
  return encBase64.exports;
}
var encBase64url = { exports: {} };
var hasRequiredEncBase64url;
function requireEncBase64url() {
  if (hasRequiredEncBase64url) return encBase64url.exports;
  hasRequiredEncBase64url = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        C_enc.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(wordArray, urlSafe) {
            if (urlSafe === void 0) {
              urlSafe = true;
            }
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = urlSafe ? this._safe_map : this._map;
            wordArray.clamp();
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
              var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;
              for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }
            return base64Chars.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(base64Str, urlSafe) {
            if (urlSafe === void 0) {
              urlSafe = true;
            }
            var base64StrLength = base64Str.length;
            var map = urlSafe ? this._safe_map : this._map;
            var reverseMap = this._reverseMap;
            if (!reverseMap) {
              reverseMap = this._reverseMap = [];
              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            }
            var paddingChar = map.charAt(64);
            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);
              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            }
            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;
          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }
          return WordArray.create(words, nBytes);
        }
      })();
      return CryptoJS2.enc.Base64url;
    });
  })(encBase64url);
  return encBase64url.exports;
}
var md5 = { exports: {} };
var hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5.exports;
  hasRequiredMd5 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function(Math2) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var T = [];
        (function() {
          for (var i = 0; i < 64; i++) {
            T[i] = Math2.abs(Math2.sin(i + 1)) * 4294967296 | 0;
          }
        })();
        var MD5 = C_algo.MD5 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(M, offset) {
            for (var i = 0; i < 16; i++) {
              var offset_i = offset + i;
              var M_offset_i = M[offset_i];
              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
            }
            var H = this._hash.words;
            var M_offset_0 = M[offset + 0];
            var M_offset_1 = M[offset + 1];
            var M_offset_2 = M[offset + 2];
            var M_offset_3 = M[offset + 3];
            var M_offset_4 = M[offset + 4];
            var M_offset_5 = M[offset + 5];
            var M_offset_6 = M[offset + 6];
            var M_offset_7 = M[offset + 7];
            var M_offset_8 = M[offset + 8];
            var M_offset_9 = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            a = FF(a, b, c, d, M_offset_0, 7, T[0]);
            d = FF(d, a, b, c, M_offset_1, 12, T[1]);
            c = FF(c, d, a, b, M_offset_2, 17, T[2]);
            b = FF(b, c, d, a, M_offset_3, 22, T[3]);
            a = FF(a, b, c, d, M_offset_4, 7, T[4]);
            d = FF(d, a, b, c, M_offset_5, 12, T[5]);
            c = FF(c, d, a, b, M_offset_6, 17, T[6]);
            b = FF(b, c, d, a, M_offset_7, 22, T[7]);
            a = FF(a, b, c, d, M_offset_8, 7, T[8]);
            d = FF(d, a, b, c, M_offset_9, 12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7, T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
            a = GG(a, b, c, d, M_offset_1, 5, T[16]);
            d = GG(d, a, b, c, M_offset_6, 9, T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0, 20, T[19]);
            a = GG(a, b, c, d, M_offset_5, 5, T[20]);
            d = GG(d, a, b, c, M_offset_10, 9, T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4, 20, T[23]);
            a = GG(a, b, c, d, M_offset_9, 5, T[24]);
            d = GG(d, a, b, c, M_offset_14, 9, T[25]);
            c = GG(c, d, a, b, M_offset_3, 14, T[26]);
            b = GG(b, c, d, a, M_offset_8, 20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5, T[28]);
            d = GG(d, a, b, c, M_offset_2, 9, T[29]);
            c = GG(c, d, a, b, M_offset_7, 14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
            a = HH(a, b, c, d, M_offset_5, 4, T[32]);
            d = HH(d, a, b, c, M_offset_8, 11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1, 4, T[36]);
            d = HH(d, a, b, c, M_offset_4, 11, T[37]);
            c = HH(c, d, a, b, M_offset_7, 16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4, T[40]);
            d = HH(d, a, b, c, M_offset_0, 11, T[41]);
            c = HH(c, d, a, b, M_offset_3, 16, T[42]);
            b = HH(b, c, d, a, M_offset_6, 23, T[43]);
            a = HH(a, b, c, d, M_offset_9, 4, T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2, 23, T[47]);
            a = II(a, b, c, d, M_offset_0, 6, T[48]);
            d = II(d, a, b, c, M_offset_7, 10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5, 21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6, T[52]);
            d = II(d, a, b, c, M_offset_3, 10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1, 21, T[55]);
            a = II(a, b, c, d, M_offset_8, 6, T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6, 15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4, 6, T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2, 15, T[62]);
            b = II(b, c, d, a, M_offset_9, 21, T[63]);
            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
            var nBitsTotalL = nBitsTotal;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
            data.sigBytes = (dataWords.length + 1) * 4;
            this._process();
            var hash = this._hash;
            var H = hash.words;
            for (var i = 0; i < 4; i++) {
              var H_i = H[i];
              H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
            }
            return hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        function FF(a, b, c, d, x, s, t) {
          var n = a + (b & c | ~b & d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function GG(a, b, c, d, x, s, t) {
          var n = a + (b & d | c & ~d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function HH(a, b, c, d, x, s, t) {
          var n = a + (b ^ c ^ d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        function II(a, b, c, d, x, s, t) {
          var n = a + (c ^ (b | ~d)) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        C.MD5 = Hasher._createHelper(MD5);
        C.HmacMD5 = Hasher._createHmacHelper(MD5);
      })(Math);
      return CryptoJS2.MD5;
    });
  })(md5);
  return md5.exports;
}
var sha1 = { exports: {} };
var hasRequiredSha1;
function requireSha1() {
  if (hasRequiredSha1) return sha1.exports;
  hasRequiredSha1 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var W = [];
        var SHA1 = C_algo.SHA1 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(M, offset) {
            var H = this._hash.words;
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            for (var i = 0; i < 80; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                W[i] = n << 1 | n >>> 31;
              }
              var t = (a << 5 | a >>> 27) + e + W[i];
              if (i < 20) {
                t += (b & c | ~b & d) + 1518500249;
              } else if (i < 40) {
                t += (b ^ c ^ d) + 1859775393;
              } else if (i < 60) {
                t += (b & c | b & d | c & d) - 1894007588;
              } else {
                t += (b ^ c ^ d) - 899497514;
              }
              e = d;
              d = c;
              c = b << 30 | b >>> 2;
              b = a;
              a = t;
            }
            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
            H[4] = H[4] + e | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            return this._hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        C.SHA1 = Hasher._createHelper(SHA1);
        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
      })();
      return CryptoJS2.SHA1;
    });
  })(sha1);
  return sha1.exports;
}
var sha256 = { exports: {} };
var hasRequiredSha256;
function requireSha256() {
  if (hasRequiredSha256) return sha256.exports;
  hasRequiredSha256 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function(Math2) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var H = [];
        var K = [];
        (function() {
          function isPrime(n2) {
            var sqrtN = Math2.sqrt(n2);
            for (var factor = 2; factor <= sqrtN; factor++) {
              if (!(n2 % factor)) {
                return false;
              }
            }
            return true;
          }
          function getFractionalBits(n2) {
            return (n2 - (n2 | 0)) * 4294967296 | 0;
          }
          var n = 2;
          var nPrime = 0;
          while (nPrime < 64) {
            if (isPrime(n)) {
              if (nPrime < 8) {
                H[nPrime] = getFractionalBits(Math2.pow(n, 1 / 2));
              }
              K[nPrime] = getFractionalBits(Math2.pow(n, 1 / 3));
              nPrime++;
            }
            n++;
          }
        })();
        var W = [];
        var SHA256 = C_algo.SHA256 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init(H.slice(0));
          },
          _doProcessBlock: function(M, offset) {
            var H2 = this._hash.words;
            var a = H2[0];
            var b = H2[1];
            var c = H2[2];
            var d = H2[3];
            var e = H2[4];
            var f = H2[5];
            var g = H2[6];
            var h = H2[7];
            for (var i = 0; i < 64; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var gamma0x = W[i - 15];
                var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                var gamma1x = W[i - 2];
                var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
              }
              var ch = e & f ^ ~e & g;
              var maj = a & b ^ a & c ^ b & c;
              var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
              var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
              var t1 = h + sigma1 + ch + K[i] + W[i];
              var t2 = sigma0 + maj;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            H2[0] = H2[0] + a | 0;
            H2[1] = H2[1] + b | 0;
            H2[2] = H2[2] + c | 0;
            H2[3] = H2[3] + d | 0;
            H2[4] = H2[4] + e | 0;
            H2[5] = H2[5] + f | 0;
            H2[6] = H2[6] + g | 0;
            H2[7] = H2[7] + h | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            return this._hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        C.SHA256 = Hasher._createHelper(SHA256);
        C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
      })(Math);
      return CryptoJS2.SHA256;
    });
  })(sha256);
  return sha256.exports;
}
var sha224 = { exports: {} };
var hasRequiredSha224;
function requireSha224() {
  if (hasRequiredSha224) return sha224.exports;
  hasRequiredSha224 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireSha256());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;
        var SHA224 = C_algo.SHA224 = SHA256.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var hash = SHA256._doFinalize.call(this);
            hash.sigBytes -= 4;
            return hash;
          }
        });
        C.SHA224 = SHA256._createHelper(SHA224);
        C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
      })();
      return CryptoJS2.SHA224;
    });
  })(sha224);
  return sha224.exports;
}
var sha512 = { exports: {} };
var hasRequiredSha512;
function requireSha512() {
  if (hasRequiredSha512) return sha512.exports;
  hasRequiredSha512 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        function X64Word_create() {
          return X64Word.create.apply(X64Word, arguments);
        }
        var K = [
          X64Word_create(1116352408, 3609767458),
          X64Word_create(1899447441, 602891725),
          X64Word_create(3049323471, 3964484399),
          X64Word_create(3921009573, 2173295548),
          X64Word_create(961987163, 4081628472),
          X64Word_create(1508970993, 3053834265),
          X64Word_create(2453635748, 2937671579),
          X64Word_create(2870763221, 3664609560),
          X64Word_create(3624381080, 2734883394),
          X64Word_create(310598401, 1164996542),
          X64Word_create(607225278, 1323610764),
          X64Word_create(1426881987, 3590304994),
          X64Word_create(1925078388, 4068182383),
          X64Word_create(2162078206, 991336113),
          X64Word_create(2614888103, 633803317),
          X64Word_create(3248222580, 3479774868),
          X64Word_create(3835390401, 2666613458),
          X64Word_create(4022224774, 944711139),
          X64Word_create(264347078, 2341262773),
          X64Word_create(604807628, 2007800933),
          X64Word_create(770255983, 1495990901),
          X64Word_create(1249150122, 1856431235),
          X64Word_create(1555081692, 3175218132),
          X64Word_create(1996064986, 2198950837),
          X64Word_create(2554220882, 3999719339),
          X64Word_create(2821834349, 766784016),
          X64Word_create(2952996808, 2566594879),
          X64Word_create(3210313671, 3203337956),
          X64Word_create(3336571891, 1034457026),
          X64Word_create(3584528711, 2466948901),
          X64Word_create(113926993, 3758326383),
          X64Word_create(338241895, 168717936),
          X64Word_create(666307205, 1188179964),
          X64Word_create(773529912, 1546045734),
          X64Word_create(1294757372, 1522805485),
          X64Word_create(1396182291, 2643833823),
          X64Word_create(1695183700, 2343527390),
          X64Word_create(1986661051, 1014477480),
          X64Word_create(2177026350, 1206759142),
          X64Word_create(2456956037, 344077627),
          X64Word_create(2730485921, 1290863460),
          X64Word_create(2820302411, 3158454273),
          X64Word_create(3259730800, 3505952657),
          X64Word_create(3345764771, 106217008),
          X64Word_create(3516065817, 3606008344),
          X64Word_create(3600352804, 1432725776),
          X64Word_create(4094571909, 1467031594),
          X64Word_create(275423344, 851169720),
          X64Word_create(430227734, 3100823752),
          X64Word_create(506948616, 1363258195),
          X64Word_create(659060556, 3750685593),
          X64Word_create(883997877, 3785050280),
          X64Word_create(958139571, 3318307427),
          X64Word_create(1322822218, 3812723403),
          X64Word_create(1537002063, 2003034995),
          X64Word_create(1747873779, 3602036899),
          X64Word_create(1955562222, 1575990012),
          X64Word_create(2024104815, 1125592928),
          X64Word_create(2227730452, 2716904306),
          X64Word_create(2361852424, 442776044),
          X64Word_create(2428436474, 593698344),
          X64Word_create(2756734187, 3733110249),
          X64Word_create(3204031479, 2999351573),
          X64Word_create(3329325298, 3815920427),
          X64Word_create(3391569614, 3928383900),
          X64Word_create(3515267271, 566280711),
          X64Word_create(3940187606, 3454069534),
          X64Word_create(4118630271, 4000239992),
          X64Word_create(116418474, 1914138554),
          X64Word_create(174292421, 2731055270),
          X64Word_create(289380356, 3203993006),
          X64Word_create(460393269, 320620315),
          X64Word_create(685471733, 587496836),
          X64Word_create(852142971, 1086792851),
          X64Word_create(1017036298, 365543100),
          X64Word_create(1126000580, 2618297676),
          X64Word_create(1288033470, 3409855158),
          X64Word_create(1501505948, 4234509866),
          X64Word_create(1607167915, 987167468),
          X64Word_create(1816402316, 1246189591)
        ];
        var W = [];
        (function() {
          for (var i = 0; i < 80; i++) {
            W[i] = X64Word_create();
          }
        })();
        var SHA512 = C_algo.SHA512 = Hasher.extend({
          _doReset: function() {
            this._hash = new X64WordArray.init([
              new X64Word.init(1779033703, 4089235720),
              new X64Word.init(3144134277, 2227873595),
              new X64Word.init(1013904242, 4271175723),
              new X64Word.init(2773480762, 1595750129),
              new X64Word.init(1359893119, 2917565137),
              new X64Word.init(2600822924, 725511199),
              new X64Word.init(528734635, 4215389547),
              new X64Word.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(M, offset) {
            var H = this._hash.words;
            var H0 = H[0];
            var H1 = H[1];
            var H2 = H[2];
            var H3 = H[3];
            var H4 = H[4];
            var H5 = H[5];
            var H6 = H[6];
            var H7 = H[7];
            var H0h = H0.high;
            var H0l = H0.low;
            var H1h = H1.high;
            var H1l = H1.low;
            var H2h = H2.high;
            var H2l = H2.low;
            var H3h = H3.high;
            var H3l = H3.low;
            var H4h = H4.high;
            var H4l = H4.low;
            var H5h = H5.high;
            var H5l = H5.low;
            var H6h = H6.high;
            var H6l = H6.low;
            var H7h = H7.high;
            var H7l = H7.low;
            var ah = H0h;
            var al = H0l;
            var bh = H1h;
            var bl = H1l;
            var ch = H2h;
            var cl = H2l;
            var dh = H3h;
            var dl = H3l;
            var eh = H4h;
            var el = H4l;
            var fh = H5h;
            var fl = H5l;
            var gh = H6h;
            var gl = H6l;
            var hh = H7h;
            var hl = H7l;
            for (var i = 0; i < 80; i++) {
              var Wil;
              var Wih;
              var Wi = W[i];
              if (i < 16) {
                Wih = Wi.high = M[offset + i * 2] | 0;
                Wil = Wi.low = M[offset + i * 2 + 1] | 0;
              } else {
                var gamma0x = W[i - 15];
                var gamma0xh = gamma0x.high;
                var gamma0xl = gamma0x.low;
                var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                var gamma1x = W[i - 2];
                var gamma1xh = gamma1x.high;
                var gamma1xl = gamma1x.low;
                var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                var Wi7 = W[i - 7];
                var Wi7h = Wi7.high;
                var Wi7l = Wi7.low;
                var Wi16 = W[i - 16];
                var Wi16h = Wi16.high;
                var Wi16l = Wi16.low;
                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                Wil = Wil + gamma1l;
                Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                Wil = Wil + Wi16l;
                Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                Wi.high = Wih;
                Wi.low = Wil;
              }
              var chh = eh & fh ^ ~eh & gh;
              var chl = el & fl ^ ~el & gl;
              var majh = ah & bh ^ ah & ch ^ bh & ch;
              var majl = al & bl ^ al & cl ^ bl & cl;
              var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
              var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
              var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
              var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
              var Ki = K[i];
              var Kih = Ki.high;
              var Kil = Ki.low;
              var t1l = hl + sigma1l;
              var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
              var t1l = t1l + chl;
              var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
              var t1l = t1l + Kil;
              var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
              var t1l = t1l + Wil;
              var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
              var t2l = sigma0l + majl;
              var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
              hh = gh;
              hl = gl;
              gh = fh;
              gl = fl;
              fh = eh;
              fl = el;
              el = dl + t1l | 0;
              eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
              dh = ch;
              dl = cl;
              ch = bh;
              cl = bl;
              bh = ah;
              bl = al;
              al = t1l + t2l | 0;
              ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
            }
            H0l = H0.low = H0l + al;
            H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
            H1l = H1.low = H1l + bl;
            H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
            H2l = H2.low = H2l + cl;
            H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
            H3l = H3.low = H3l + dl;
            H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
            H4l = H4.low = H4l + el;
            H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
            H5l = H5.low = H5l + fl;
            H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
            H6l = H6.low = H6l + gl;
            H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
            H7l = H7.low = H7l + hl;
            H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            var hash = this._hash.toX32();
            return hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          },
          blockSize: 1024 / 32
        });
        C.SHA512 = Hasher._createHelper(SHA512);
        C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
      })();
      return CryptoJS2.SHA512;
    });
  })(sha512);
  return sha512.exports;
}
var sha384 = { exports: {} };
var hasRequiredSha384;
function requireSha384() {
  if (hasRequiredSha384) return sha384.exports;
  hasRequiredSha384 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core(), requireSha512());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        var SHA512 = C_algo.SHA512;
        var SHA384 = C_algo.SHA384 = SHA512.extend({
          _doReset: function() {
            this._hash = new X64WordArray.init([
              new X64Word.init(3418070365, 3238371032),
              new X64Word.init(1654270250, 914150663),
              new X64Word.init(2438529370, 812702999),
              new X64Word.init(355462360, 4144912697),
              new X64Word.init(1731405415, 4290775857),
              new X64Word.init(2394180231, 1750603025),
              new X64Word.init(3675008525, 1694076839),
              new X64Word.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var hash = SHA512._doFinalize.call(this);
            hash.sigBytes -= 16;
            return hash;
          }
        });
        C.SHA384 = SHA512._createHelper(SHA384);
        C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
      })();
      return CryptoJS2.SHA384;
    });
  })(sha384);
  return sha384.exports;
}
var sha3 = { exports: {} };
var hasRequiredSha3;
function requireSha3() {
  if (hasRequiredSha3) return sha3.exports;
  hasRequiredSha3 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function(Math2) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var C_algo = C.algo;
        var RHO_OFFSETS = [];
        var PI_INDEXES = [];
        var ROUND_CONSTANTS = [];
        (function() {
          var x = 1, y = 0;
          for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
          }
          for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
              PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
            }
          }
          var LFSR = 1;
          for (var i = 0; i < 24; i++) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;
            for (var j = 0; j < 7; j++) {
              if (LFSR & 1) {
                var bitPosition = (1 << j) - 1;
                if (bitPosition < 32) {
                  roundConstantLsw ^= 1 << bitPosition;
                } else {
                  roundConstantMsw ^= 1 << bitPosition - 32;
                }
              }
              if (LFSR & 128) {
                LFSR = LFSR << 1 ^ 113;
              } else {
                LFSR <<= 1;
              }
            }
            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
          }
        })();
        var T = [];
        (function() {
          for (var i = 0; i < 25; i++) {
            T[i] = X64Word.create();
          }
        })();
        var SHA3 = C_algo.SHA3 = Hasher.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: Hasher.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            var state = this._state = [];
            for (var i = 0; i < 25; i++) {
              state[i] = new X64Word.init();
            }
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(M, offset) {
            var state = this._state;
            var nBlockSizeLanes = this.blockSize / 2;
            for (var i = 0; i < nBlockSizeLanes; i++) {
              var M2i = M[offset + 2 * i];
              var M2i1 = M[offset + 2 * i + 1];
              M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
              M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
              var lane = state[i];
              lane.high ^= M2i1;
              lane.low ^= M2i;
            }
            for (var round = 0; round < 24; round++) {
              for (var x = 0; x < 5; x++) {
                var tMsw = 0, tLsw = 0;
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  tMsw ^= lane.high;
                  tLsw ^= lane.low;
                }
                var Tx = T[x];
                Tx.high = tMsw;
                Tx.low = tLsw;
              }
              for (var x = 0; x < 5; x++) {
                var Tx4 = T[(x + 4) % 5];
                var Tx1 = T[(x + 1) % 5];
                var Tx1Msw = Tx1.high;
                var Tx1Lsw = Tx1.low;
                var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  lane.high ^= tMsw;
                  lane.low ^= tLsw;
                }
              }
              for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                var tMsw;
                var tLsw;
                var lane = state[laneIndex];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                var rhoOffset = RHO_OFFSETS[laneIndex];
                if (rhoOffset < 32) {
                  tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                  tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                } else {
                  tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                  tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                }
                var TPiLane = T[PI_INDEXES[laneIndex]];
                TPiLane.high = tMsw;
                TPiLane.low = tLsw;
              }
              var T0 = T[0];
              var state0 = state[0];
              T0.high = state0.high;
              T0.low = state0.low;
              for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 5; y++) {
                  var laneIndex = x + 5 * y;
                  var lane = state[laneIndex];
                  var TLane = T[laneIndex];
                  var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                  var Tx2Lane = T[(x + 2) % 5 + 5 * y];
                  lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                  lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                }
              }
              var lane = state[0];
              var roundConstant = ROUND_CONSTANTS[round];
              lane.high ^= roundConstant.high;
              lane.low ^= roundConstant.low;
            }
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;
            dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
            dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
            data.sigBytes = dataWords.length * 4;
            this._process();
            var state = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8;
            var hashWords = [];
            for (var i = 0; i < outputLengthLanes; i++) {
              var lane = state[i];
              var laneMsw = lane.high;
              var laneLsw = lane.low;
              laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
              laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
              hashWords.push(laneLsw);
              hashWords.push(laneMsw);
            }
            return new WordArray.init(hashWords, outputLengthBytes);
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            var state = clone._state = this._state.slice(0);
            for (var i = 0; i < 25; i++) {
              state[i] = state[i].clone();
            }
            return clone;
          }
        });
        C.SHA3 = Hasher._createHelper(SHA3);
        C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
      })(Math);
      return CryptoJS2.SHA3;
    });
  })(sha3);
  return sha3.exports;
}
var ripemd160 = { exports: {} };
var hasRequiredRipemd160;
function requireRipemd160() {
  if (hasRequiredRipemd160) return ripemd160.exports;
  hasRequiredRipemd160 = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      (function(Math2) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var _zl = WordArray.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]);
        var _zr = WordArray.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]);
        var _sl = WordArray.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]);
        var _sr = WordArray.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]);
        var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
        var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
        var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
          _doReset: function() {
            this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(M, offset) {
            for (var i = 0; i < 16; i++) {
              var offset_i = offset + i;
              var M_offset_i = M[offset_i];
              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
            }
            var H = this._hash.words;
            var hl = _hl.words;
            var hr = _hr.words;
            var zl = _zl.words;
            var zr = _zr.words;
            var sl = _sl.words;
            var sr = _sr.words;
            var al, bl, cl, dl, el;
            var ar, br, cr, dr, er;
            ar = al = H[0];
            br = bl = H[1];
            cr = cl = H[2];
            dr = dl = H[3];
            er = el = H[4];
            var t;
            for (var i = 0; i < 80; i += 1) {
              t = al + M[offset + zl[i]] | 0;
              if (i < 16) {
                t += f1(bl, cl, dl) + hl[0];
              } else if (i < 32) {
                t += f2(bl, cl, dl) + hl[1];
              } else if (i < 48) {
                t += f3(bl, cl, dl) + hl[2];
              } else if (i < 64) {
                t += f4(bl, cl, dl) + hl[3];
              } else {
                t += f5(bl, cl, dl) + hl[4];
              }
              t = t | 0;
              t = rotl(t, sl[i]);
              t = t + el | 0;
              al = el;
              el = dl;
              dl = rotl(cl, 10);
              cl = bl;
              bl = t;
              t = ar + M[offset + zr[i]] | 0;
              if (i < 16) {
                t += f5(br, cr, dr) + hr[0];
              } else if (i < 32) {
                t += f4(br, cr, dr) + hr[1];
              } else if (i < 48) {
                t += f3(br, cr, dr) + hr[2];
              } else if (i < 64) {
                t += f2(br, cr, dr) + hr[3];
              } else {
                t += f1(br, cr, dr) + hr[4];
              }
              t = t | 0;
              t = rotl(t, sr[i]);
              t = t + er | 0;
              ar = er;
              er = dr;
              dr = rotl(cr, 10);
              cr = br;
              br = t;
            }
            t = H[1] + cl + dr | 0;
            H[1] = H[2] + dl + er | 0;
            H[2] = H[3] + el + ar | 0;
            H[3] = H[4] + al + br | 0;
            H[4] = H[0] + bl + cr | 0;
            H[0] = t;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
            data.sigBytes = (dataWords.length + 1) * 4;
            this._process();
            var hash = this._hash;
            var H = hash.words;
            for (var i = 0; i < 5; i++) {
              var H_i = H[i];
              H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
            }
            return hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        function f1(x, y, z) {
          return x ^ y ^ z;
        }
        function f2(x, y, z) {
          return x & y | ~x & z;
        }
        function f3(x, y, z) {
          return (x | ~y) ^ z;
        }
        function f4(x, y, z) {
          return x & z | y & ~z;
        }
        function f5(x, y, z) {
          return x ^ (y | ~z);
        }
        function rotl(x, n) {
          return x << n | x >>> 32 - n;
        }
        C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
        C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
      })();
      return CryptoJS2.RIPEMD160;
    });
  })(ripemd160);
  return ripemd160.exports;
}
var hmac = { exports: {} };
var hasRequiredHmac;
function requireHmac() {
  if (hasRequiredHmac) return hmac.exports;
  hasRequiredHmac = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var C_enc = C.enc;
        var Utf8 = C_enc.Utf8;
        var C_algo = C.algo;
        C_algo.HMAC = Base.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(hasher, key) {
            hasher = this._hasher = new hasher.init();
            if (typeof key == "string") {
              key = Utf8.parse(key);
            }
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;
            if (key.sigBytes > hasherBlockSizeBytes) {
              key = hasher.finalize(key);
            }
            key.clamp();
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;
            for (var i = 0; i < hasherBlockSize; i++) {
              oKeyWords[i] ^= 1549556828;
              iKeyWords[i] ^= 909522486;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
            this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var hasher = this._hasher;
            hasher.reset();
            hasher.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(messageUpdate) {
            this._hasher.update(messageUpdate);
            return this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(messageUpdate) {
            var hasher = this._hasher;
            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac2 = hasher.finalize(this._oKey.clone().concat(innerHash));
            return hmac2;
          }
        });
      })();
    });
  })(hmac);
  return hmac.exports;
}
var pbkdf2 = { exports: {} };
var hasRequiredPbkdf2;
function requirePbkdf2() {
  if (hasRequiredPbkdf2) return pbkdf2.exports;
  hasRequiredPbkdf2 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireSha256(), requireHmac());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;
        var HMAC = C_algo.HMAC;
        var PBKDF2 = C_algo.PBKDF2 = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: SHA256,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(password, salt) {
            var cfg = this.cfg;
            var hmac2 = HMAC.create(cfg.hasher, password);
            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([1]);
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;
            while (derivedKeyWords.length < keySize) {
              var block = hmac2.update(salt).finalize(blockIndex);
              hmac2.reset();
              var blockWords = block.words;
              var blockWordsLength = blockWords.length;
              var intermediate = block;
              for (var i = 1; i < iterations; i++) {
                intermediate = hmac2.finalize(intermediate);
                hmac2.reset();
                var intermediateWords = intermediate.words;
                for (var j = 0; j < blockWordsLength; j++) {
                  blockWords[j] ^= intermediateWords[j];
                }
              }
              derivedKey.concat(block);
              blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        C.PBKDF2 = function(password, salt, cfg) {
          return PBKDF2.create(cfg).compute(password, salt);
        };
      })();
      return CryptoJS2.PBKDF2;
    });
  })(pbkdf2);
  return pbkdf2.exports;
}
var evpkdf = { exports: {} };
var hasRequiredEvpkdf;
function requireEvpkdf() {
  if (hasRequiredEvpkdf) return evpkdf.exports;
  hasRequiredEvpkdf = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireSha1(), requireHmac());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var MD5 = C_algo.MD5;
        var EvpKDF = C_algo.EvpKDF = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: MD5,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(password, salt) {
            var block;
            var cfg = this.cfg;
            var hasher = cfg.hasher.create();
            var derivedKey = WordArray.create();
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;
            while (derivedKeyWords.length < keySize) {
              if (block) {
                hasher.update(block);
              }
              block = hasher.update(password).finalize(salt);
              hasher.reset();
              for (var i = 1; i < iterations; i++) {
                block = hasher.finalize(block);
                hasher.reset();
              }
              derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        C.EvpKDF = function(password, salt, cfg) {
          return EvpKDF.create(cfg).compute(password, salt);
        };
      })();
      return CryptoJS2.EvpKDF;
    });
  })(evpkdf);
  return evpkdf.exports;
}
var cipherCore = { exports: {} };
var hasRequiredCipherCore;
function requireCipherCore() {
  if (hasRequiredCipherCore) return cipherCore.exports;
  hasRequiredCipherCore = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEvpkdf());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.lib.Cipher || function(undefined$1) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
        var C_enc = C.enc;
        C_enc.Utf8;
        var Base642 = C_enc.Base64;
        var C_algo = C.algo;
        var EvpKDF = C_algo.EvpKDF;
        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: Base.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(xformMode, key, cfg) {
            this.cfg = this.cfg.extend(cfg);
            this._xformMode = xformMode;
            this._key = key;
            this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(dataUpdate) {
            this._append(dataUpdate);
            return this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(dataUpdate) {
            if (dataUpdate) {
              this._append(dataUpdate);
            }
            var finalProcessedData = this._doFinalize();
            return finalProcessedData;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function selectCipherStrategy(key) {
              if (typeof key == "string") {
                return PasswordBasedCipher;
              } else {
                return SerializableCipher;
              }
            }
            return function(cipher) {
              return {
                encrypt: function(message, key, cfg) {
                  return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                },
                decrypt: function(ciphertext, key, cfg) {
                  return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                }
              };
            };
          }()
        });
        C_lib.StreamCipher = Cipher.extend({
          _doFinalize: function() {
            var finalProcessedBlocks = this._process(true);
            return finalProcessedBlocks;
          },
          blockSize: 1
        });
        var C_mode = C.mode = {};
        var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(cipher, iv) {
            return this.Encryptor.create(cipher, iv);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(cipher, iv) {
            return this.Decryptor.create(cipher, iv);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
          }
        });
        var CBC = C_mode.CBC = function() {
          var CBC2 = BlockCipherMode.extend();
          CBC2.Encryptor = CBC2.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              xorBlock.call(this, words, offset, blockSize);
              cipher.encryptBlock(words, offset);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CBC2.Decryptor = CBC2.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              cipher.decryptBlock(words, offset);
              xorBlock.call(this, words, offset, blockSize);
              this._prevBlock = thisBlock;
            }
          });
          function xorBlock(words, offset, blockSize) {
            var block;
            var iv = this._iv;
            if (iv) {
              block = iv;
              this._iv = undefined$1;
            } else {
              block = this._prevBlock;
            }
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= block[i];
            }
          }
          return CBC2;
        }();
        var C_pad = C.pad = {};
        var Pkcs7 = C_pad.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
              paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);
            data.concat(padding);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        C_lib.BlockCipher = Cipher.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
          }),
          reset: function() {
            var modeCreator;
            Cipher.reset.call(this);
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) {
              modeCreator = mode.createEncryptor;
            } else {
              modeCreator = mode.createDecryptor;
              this._minBufferSize = 1;
            }
            if (this._mode && this._mode.__creator == modeCreator) {
              this._mode.init(this, iv && iv.words);
            } else {
              this._mode = modeCreator.call(mode, this, iv && iv.words);
              this._mode.__creator = modeCreator;
            }
          },
          _doProcessBlock: function(words, offset) {
            this._mode.processBlock(words, offset);
          },
          _doFinalize: function() {
            var finalProcessedBlocks;
            var padding = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
              padding.pad(this._data, this.blockSize);
              finalProcessedBlocks = this._process(true);
            } else {
              finalProcessedBlocks = this._process(true);
              padding.unpad(finalProcessedBlocks);
            }
            return finalProcessedBlocks;
          },
          blockSize: 128 / 32
        });
        var CipherParams = C_lib.CipherParams = Base.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(cipherParams) {
            this.mixIn(cipherParams);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(formatter) {
            return (formatter || this.formatter).stringify(this);
          }
        });
        var C_format = C.format = {};
        var OpenSSLFormatter = C_format.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(cipherParams) {
            var wordArray;
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;
            if (salt) {
              wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
            } else {
              wordArray = ciphertext;
            }
            return wordArray.toString(Base642);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(openSSLStr) {
            var salt;
            var ciphertext = Base642.parse(openSSLStr);
            var ciphertextWords = ciphertext.words;
            if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
              salt = WordArray.create(ciphertextWords.slice(2, 4));
              ciphertextWords.splice(0, 4);
              ciphertext.sigBytes -= 16;
            }
            return CipherParams.create({ ciphertext, salt });
          }
        };
        var SerializableCipher = C_lib.SerializableCipher = Base.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: Base.extend({
            format: OpenSSLFormatter
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(cipher, message, key, cfg) {
            cfg = this.cfg.extend(cfg);
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);
            var cipherCfg = encryptor.cfg;
            return CipherParams.create({
              ciphertext,
              key,
              iv: cipherCfg.iv,
              algorithm: cipher,
              mode: cipherCfg.mode,
              padding: cipherCfg.padding,
              blockSize: cipher.blockSize,
              formatter: cfg.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(cipher, ciphertext, key, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
            return plaintext;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(ciphertext, format) {
            if (typeof ciphertext == "string") {
              return format.parse(ciphertext, this);
            } else {
              return ciphertext;
            }
          }
        });
        var C_kdf = C.kdf = {};
        var OpenSSLKdf = C_kdf.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(password, keySize, ivSize, salt, hasher) {
            if (!salt) {
              salt = WordArray.random(64 / 8);
            }
            if (!hasher) {
              var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
            } else {
              var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
            }
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;
            return CipherParams.create({ key, iv, salt });
          }
        };
        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(cipher, message, password, cfg) {
            cfg = this.cfg.extend(cfg);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
            cfg.iv = derivedParams.iv;
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
            ciphertext.mixIn(derivedParams);
            return ciphertext;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(cipher, ciphertext, password, cfg) {
            cfg = this.cfg.extend(cfg);
            ciphertext = this._parse(ciphertext, cfg.format);
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
            cfg.iv = derivedParams.iv;
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
            return plaintext;
          }
        });
      }();
    });
  })(cipherCore);
  return cipherCore.exports;
}
var modeCfb = { exports: {} };
var hasRequiredModeCfb;
function requireModeCfb() {
  if (hasRequiredModeCfb) return modeCfb.exports;
  hasRequiredModeCfb = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.mode.CFB = function() {
        var CFB = CryptoJS2.lib.BlockCipherMode.extend();
        CFB.Encryptor = CFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });
        CFB.Decryptor = CFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var thisBlock = words.slice(offset, offset + blockSize);
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
            this._prevBlock = thisBlock;
          }
        });
        function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
          var keystream;
          var iv = this._iv;
          if (iv) {
            keystream = iv.slice(0);
            this._iv = void 0;
          } else {
            keystream = this._prevBlock;
          }
          cipher.encryptBlock(keystream, 0);
          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }
        return CFB;
      }();
      return CryptoJS2.mode.CFB;
    });
  })(modeCfb);
  return modeCfb.exports;
}
var modeCtr = { exports: {} };
var hasRequiredModeCtr;
function requireModeCtr() {
  if (hasRequiredModeCtr) return modeCtr.exports;
  hasRequiredModeCtr = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.mode.CTR = function() {
        var CTR = CryptoJS2.lib.BlockCipherMode.extend();
        var Encryptor = CTR.Encryptor = CTR.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;
            if (iv) {
              counter = this._counter = iv.slice(0);
              this._iv = void 0;
            }
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);
            counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        CTR.Decryptor = Encryptor;
        return CTR;
      }();
      return CryptoJS2.mode.CTR;
    });
  })(modeCtr);
  return modeCtr.exports;
}
var modeCtrGladman = { exports: {} };
var hasRequiredModeCtrGladman;
function requireModeCtrGladman() {
  if (hasRequiredModeCtrGladman) return modeCtrGladman.exports;
  hasRequiredModeCtrGladman = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      CryptoJS2.mode.CTRGladman = function() {
        var CTRGladman = CryptoJS2.lib.BlockCipherMode.extend();
        function incWord(word) {
          if ((word >> 24 & 255) === 255) {
            var b1 = word >> 16 & 255;
            var b2 = word >> 8 & 255;
            var b3 = word & 255;
            if (b1 === 255) {
              b1 = 0;
              if (b2 === 255) {
                b2 = 0;
                if (b3 === 255) {
                  b3 = 0;
                } else {
                  ++b3;
                }
              } else {
                ++b2;
              }
            } else {
              ++b1;
            }
            word = 0;
            word += b1 << 16;
            word += b2 << 8;
            word += b3;
          } else {
            word += 1 << 24;
          }
          return word;
        }
        function incCounter(counter) {
          if ((counter[0] = incWord(counter[0])) === 0) {
            counter[1] = incWord(counter[1]);
          }
          return counter;
        }
        var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;
            if (iv) {
              counter = this._counter = iv.slice(0);
              this._iv = void 0;
            }
            incCounter(counter);
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        CTRGladman.Decryptor = Encryptor;
        return CTRGladman;
      }();
      return CryptoJS2.mode.CTRGladman;
    });
  })(modeCtrGladman);
  return modeCtrGladman.exports;
}
var modeOfb = { exports: {} };
var hasRequiredModeOfb;
function requireModeOfb() {
  if (hasRequiredModeOfb) return modeOfb.exports;
  hasRequiredModeOfb = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.mode.OFB = function() {
        var OFB = CryptoJS2.lib.BlockCipherMode.extend();
        var Encryptor = OFB.Encryptor = OFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;
            if (iv) {
              keystream = this._keystream = iv.slice(0);
              this._iv = void 0;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        OFB.Decryptor = Encryptor;
        return OFB;
      }();
      return CryptoJS2.mode.OFB;
    });
  })(modeOfb);
  return modeOfb.exports;
}
var modeEcb = { exports: {} };
var hasRequiredModeEcb;
function requireModeEcb() {
  if (hasRequiredModeEcb) return modeEcb.exports;
  hasRequiredModeEcb = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.mode.ECB = function() {
        var ECB = CryptoJS2.lib.BlockCipherMode.extend();
        ECB.Encryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.encryptBlock(words, offset);
          }
        });
        ECB.Decryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.decryptBlock(words, offset);
          }
        });
        return ECB;
      }();
      return CryptoJS2.mode.ECB;
    });
  })(modeEcb);
  return modeEcb.exports;
}
var padAnsix923 = { exports: {} };
var hasRequiredPadAnsix923;
function requirePadAnsix923() {
  if (hasRequiredPadAnsix923) return padAnsix923.exports;
  hasRequiredPadAnsix923 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.pad.AnsiX923 = {
        pad: function(data, blockSize) {
          var dataSigBytes = data.sigBytes;
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
          var lastBytePos = dataSigBytes + nPaddingBytes - 1;
          data.clamp();
          data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
          data.sigBytes += nPaddingBytes;
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      return CryptoJS2.pad.Ansix923;
    });
  })(padAnsix923);
  return padAnsix923.exports;
}
var padIso10126 = { exports: {} };
var hasRequiredPadIso10126;
function requirePadIso10126() {
  if (hasRequiredPadIso10126) return padIso10126.exports;
  hasRequiredPadIso10126 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.pad.Iso10126 = {
        pad: function(data, blockSize) {
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
          data.concat(CryptoJS2.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS2.lib.WordArray.create([nPaddingBytes << 24], 1));
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      return CryptoJS2.pad.Iso10126;
    });
  })(padIso10126);
  return padIso10126.exports;
}
var padIso97971 = { exports: {} };
var hasRequiredPadIso97971;
function requirePadIso97971() {
  if (hasRequiredPadIso97971) return padIso97971.exports;
  hasRequiredPadIso97971 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.pad.Iso97971 = {
        pad: function(data, blockSize) {
          data.concat(CryptoJS2.lib.WordArray.create([2147483648], 1));
          CryptoJS2.pad.ZeroPadding.pad(data, blockSize);
        },
        unpad: function(data) {
          CryptoJS2.pad.ZeroPadding.unpad(data);
          data.sigBytes--;
        }
      };
      return CryptoJS2.pad.Iso97971;
    });
  })(padIso97971);
  return padIso97971.exports;
}
var padZeropadding = { exports: {} };
var hasRequiredPadZeropadding;
function requirePadZeropadding() {
  if (hasRequiredPadZeropadding) return padZeropadding.exports;
  hasRequiredPadZeropadding = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.pad.ZeroPadding = {
        pad: function(data, blockSize) {
          var blockSizeBytes = blockSize * 4;
          data.clamp();
          data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
        },
        unpad: function(data) {
          var dataWords = data.words;
          var i = data.sigBytes - 1;
          for (var i = data.sigBytes - 1; i >= 0; i--) {
            if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
              data.sigBytes = i + 1;
              break;
            }
          }
        }
      };
      return CryptoJS2.pad.ZeroPadding;
    });
  })(padZeropadding);
  return padZeropadding.exports;
}
var padNopadding = { exports: {} };
var hasRequiredPadNopadding;
function requirePadNopadding() {
  if (hasRequiredPadNopadding) return padNopadding.exports;
  hasRequiredPadNopadding = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      CryptoJS2.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      };
      return CryptoJS2.pad.NoPadding;
    });
  })(padNopadding);
  return padNopadding.exports;
}
var formatHex = { exports: {} };
var hasRequiredFormatHex;
function requireFormatHex() {
  if (hasRequiredFormatHex) return formatHex.exports;
  hasRequiredFormatHex = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function(undefined$1) {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var CipherParams = C_lib.CipherParams;
        var C_enc = C.enc;
        var Hex2 = C_enc.Hex;
        var C_format = C.format;
        C_format.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(cipherParams) {
            return cipherParams.ciphertext.toString(Hex2);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(input) {
            var ciphertext = Hex2.parse(input);
            return CipherParams.create({ ciphertext });
          }
        };
      })();
      return CryptoJS2.format.Hex;
    });
  })(formatHex);
  return formatHex.exports;
}
var aes = { exports: {} };
var hasRequiredAes;
function requireAes() {
  if (hasRequiredAes) return aes.exports;
  hasRequiredAes = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        var SBOX = [];
        var INV_SBOX = [];
        var SUB_MIX_0 = [];
        var SUB_MIX_1 = [];
        var SUB_MIX_2 = [];
        var SUB_MIX_3 = [];
        var INV_SUB_MIX_0 = [];
        var INV_SUB_MIX_1 = [];
        var INV_SUB_MIX_2 = [];
        var INV_SUB_MIX_3 = [];
        (function() {
          var d = [];
          for (var i = 0; i < 256; i++) {
            if (i < 128) {
              d[i] = i << 1;
            } else {
              d[i] = i << 1 ^ 283;
            }
          }
          var x = 0;
          var xi = 0;
          for (var i = 0; i < 256; i++) {
            var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
            sx = sx >>> 8 ^ sx & 255 ^ 99;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];
            var t = d[sx] * 257 ^ sx * 16843008;
            SUB_MIX_0[x] = t << 24 | t >>> 8;
            SUB_MIX_1[x] = t << 16 | t >>> 16;
            SUB_MIX_2[x] = t << 8 | t >>> 24;
            SUB_MIX_3[x] = t;
            var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
            INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
            INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
            INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
            INV_SUB_MIX_3[sx] = t;
            if (!x) {
              x = xi = 1;
            } else {
              x = x2 ^ d[d[d[x8 ^ x2]]];
              xi ^= d[d[xi]];
            }
          }
        })();
        var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        var AES = C_algo.AES = BlockCipher.extend({
          _doReset: function() {
            var t;
            if (this._nRounds && this._keyPriorReset === this._key) {
              return;
            }
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;
            var nRounds = this._nRounds = keySize + 6;
            var ksRows = (nRounds + 1) * 4;
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
              if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
              } else {
                t = keySchedule[ksRow - 1];
                if (!(ksRow % keySize)) {
                  t = t << 8 | t >>> 24;
                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                  t ^= RCON[ksRow / keySize | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize == 4) {
                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                }
                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
              }
            }
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
              var ksRow = ksRows - invKsRow;
              if (invKsRow % 4) {
                var t = keySchedule[ksRow];
              } else {
                var t = keySchedule[ksRow - 4];
              }
              if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
              } else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
              }
            }
          },
          encryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
          },
          decryptBlock: function(M, offset) {
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
          },
          _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
            var nRounds = this._nRounds;
            var s0 = M[offset] ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];
            var ksRow = 4;
            for (var round = 1; round < nRounds; round++) {
              var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
              var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
              var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
              var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
              s0 = t0;
              s1 = t1;
              s2 = t2;
              s3 = t3;
            }
            var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
            var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
            var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
            var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
            M[offset] = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
          },
          keySize: 256 / 32
        });
        C.AES = BlockCipher._createHelper(AES);
      })();
      return CryptoJS2.AES;
    });
  })(aes);
  return aes.exports;
}
var tripledes = { exports: {} };
var hasRequiredTripledes;
function requireTripledes() {
  if (hasRequiredTripledes) return tripledes.exports;
  hasRequiredTripledes = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        var PC1 = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ];
        var PC2 = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ];
        var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
        var SBOX_P = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ];
        var SBOX_MASK = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ];
        var DES = C_algo.DES = BlockCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            var keyBits = [];
            for (var i = 0; i < 56; i++) {
              var keyBitPos = PC1[i] - 1;
              keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
            }
            var subKeys = this._subKeys = [];
            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
              var subKey = subKeys[nSubKey] = [];
              var bitShift = BIT_SHIFTS[nSubKey];
              for (var i = 0; i < 24; i++) {
                subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6;
                subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
              }
              subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
              for (var i = 1; i < 7; i++) {
                subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
              }
              subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
            }
            var invSubKeys = this._invSubKeys = [];
            for (var i = 0; i < 16; i++) {
              invSubKeys[i] = subKeys[15 - i];
            }
          },
          encryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._subKeys);
          },
          decryptBlock: function(M, offset) {
            this._doCryptBlock(M, offset, this._invSubKeys);
          },
          _doCryptBlock: function(M, offset, subKeys) {
            this._lBlock = M[offset];
            this._rBlock = M[offset + 1];
            exchangeLR.call(this, 4, 252645135);
            exchangeLR.call(this, 16, 65535);
            exchangeRL.call(this, 2, 858993459);
            exchangeRL.call(this, 8, 16711935);
            exchangeLR.call(this, 1, 1431655765);
            for (var round = 0; round < 16; round++) {
              var subKey = subKeys[round];
              var lBlock = this._lBlock;
              var rBlock = this._rBlock;
              var f = 0;
              for (var i = 0; i < 8; i++) {
                f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
              }
              this._lBlock = rBlock;
              this._rBlock = lBlock ^ f;
            }
            var t = this._lBlock;
            this._lBlock = this._rBlock;
            this._rBlock = t;
            exchangeLR.call(this, 1, 1431655765);
            exchangeRL.call(this, 8, 16711935);
            exchangeRL.call(this, 2, 858993459);
            exchangeLR.call(this, 16, 65535);
            exchangeLR.call(this, 4, 252645135);
            M[offset] = this._lBlock;
            M[offset + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function exchangeLR(offset, mask) {
          var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
          this._rBlock ^= t;
          this._lBlock ^= t << offset;
        }
        function exchangeRL(offset, mask) {
          var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
          this._lBlock ^= t;
          this._rBlock ^= t << offset;
        }
        C.DES = BlockCipher._createHelper(DES);
        var TripleDES = C_algo.TripleDES = BlockCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            }
            var key1 = keyWords.slice(0, 2);
            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
            this._des1 = DES.createEncryptor(WordArray.create(key1));
            this._des2 = DES.createEncryptor(WordArray.create(key2));
            this._des3 = DES.createEncryptor(WordArray.create(key3));
          },
          encryptBlock: function(M, offset) {
            this._des1.encryptBlock(M, offset);
            this._des2.decryptBlock(M, offset);
            this._des3.encryptBlock(M, offset);
          },
          decryptBlock: function(M, offset) {
            this._des3.decryptBlock(M, offset);
            this._des2.encryptBlock(M, offset);
            this._des1.decryptBlock(M, offset);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        C.TripleDES = BlockCipher._createHelper(TripleDES);
      })();
      return CryptoJS2.TripleDES;
    });
  })(tripledes);
  return tripledes.exports;
}
var rc4 = { exports: {} };
var hasRequiredRc4;
function requireRc4() {
  if (hasRequiredRc4) return rc4.exports;
  hasRequiredRc4 = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var RC4 = C_algo.RC4 = StreamCipher.extend({
          _doReset: function() {
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;
            var S = this._S = [];
            for (var i = 0; i < 256; i++) {
              S[i] = i;
            }
            for (var i = 0, j = 0; i < 256; i++) {
              var keyByteIndex = i % keySigBytes;
              var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
              j = (j + S[i] + keyByte) % 256;
              var t = S[i];
              S[i] = S[j];
              S[j] = t;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function generateKeystreamWord() {
          var S = this._S;
          var i = this._i;
          var j = this._j;
          var keystreamWord = 0;
          for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;
            var t = S[i];
            S[i] = S[j];
            S[j] = t;
            keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
          }
          this._i = i;
          this._j = j;
          return keystreamWord;
        }
        C.RC4 = StreamCipher._createHelper(RC4);
        var RC4Drop = C_algo.RC4Drop = RC4.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: RC4.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            RC4._doReset.call(this);
            for (var i = this.cfg.drop; i > 0; i--) {
              generateKeystreamWord.call(this);
            }
          }
        });
        C.RC4Drop = StreamCipher._createHelper(RC4Drop);
      })();
      return CryptoJS2.RC4;
    });
  })(rc4);
  return rc4.exports;
}
var rabbit = { exports: {} };
var hasRequiredRabbit;
function requireRabbit() {
  if (hasRequiredRabbit) return rabbit.exports;
  hasRequiredRabbit = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var S = [];
        var C_ = [];
        var G = [];
        var Rabbit = C_algo.Rabbit = StreamCipher.extend({
          _doReset: function() {
            var K = this._key.words;
            var iv = this.cfg.iv;
            for (var i = 0; i < 4; i++) {
              K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
            }
            var X = this._X = [
              K[0],
              K[3] << 16 | K[2] >>> 16,
              K[1],
              K[0] << 16 | K[3] >>> 16,
              K[2],
              K[1] << 16 | K[0] >>> 16,
              K[3],
              K[2] << 16 | K[1] >>> 16
            ];
            var C2 = this._C = [
              K[2] << 16 | K[2] >>> 16,
              K[0] & 4294901760 | K[1] & 65535,
              K[3] << 16 | K[3] >>> 16,
              K[1] & 4294901760 | K[2] & 65535,
              K[0] << 16 | K[0] >>> 16,
              K[2] & 4294901760 | K[3] & 65535,
              K[1] << 16 | K[1] >>> 16,
              K[3] & 4294901760 | K[0] & 65535
            ];
            this._b = 0;
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
            for (var i = 0; i < 8; i++) {
              C2[i] ^= X[i + 4 & 7];
            }
            if (iv) {
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];
              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
              var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
              var i1 = i0 >>> 16 | i2 & 4294901760;
              var i3 = i2 << 16 | i0 & 65535;
              C2[0] ^= i0;
              C2[1] ^= i1;
              C2[2] ^= i2;
              C2[3] ^= i3;
              C2[4] ^= i0;
              C2[5] ^= i1;
              C2[6] ^= i2;
              C2[7] ^= i3;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function(M, offset) {
            var X = this._X;
            nextState.call(this);
            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
            for (var i = 0; i < 4; i++) {
              S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
              M[offset + i] ^= S[i];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function nextState() {
          var X = this._X;
          var C2 = this._C;
          for (var i = 0; i < 8; i++) {
            C_[i] = C2[i];
          }
          C2[0] = C2[0] + 1295307597 + this._b | 0;
          C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C2[i];
            var ga = gx & 65535;
            var gb = gx >>> 16;
            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
            G[i] = gh ^ gl;
          }
          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        C.Rabbit = StreamCipher._createHelper(Rabbit);
      })();
      return CryptoJS2.Rabbit;
    });
  })(rabbit);
  return rabbit.exports;
}
var rabbitLegacy = { exports: {} };
var hasRequiredRabbitLegacy;
function requireRabbitLegacy() {
  if (hasRequiredRabbitLegacy) return rabbitLegacy.exports;
  hasRequiredRabbitLegacy = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        var S = [];
        var C_ = [];
        var G = [];
        var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
          _doReset: function() {
            var K = this._key.words;
            var iv = this.cfg.iv;
            var X = this._X = [
              K[0],
              K[3] << 16 | K[2] >>> 16,
              K[1],
              K[0] << 16 | K[3] >>> 16,
              K[2],
              K[1] << 16 | K[0] >>> 16,
              K[3],
              K[2] << 16 | K[1] >>> 16
            ];
            var C2 = this._C = [
              K[2] << 16 | K[2] >>> 16,
              K[0] & 4294901760 | K[1] & 65535,
              K[3] << 16 | K[3] >>> 16,
              K[1] & 4294901760 | K[2] & 65535,
              K[0] << 16 | K[0] >>> 16,
              K[2] & 4294901760 | K[3] & 65535,
              K[1] << 16 | K[1] >>> 16,
              K[3] & 4294901760 | K[0] & 65535
            ];
            this._b = 0;
            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            }
            for (var i = 0; i < 8; i++) {
              C2[i] ^= X[i + 4 & 7];
            }
            if (iv) {
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1];
              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
              var i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
              var i1 = i0 >>> 16 | i2 & 4294901760;
              var i3 = i2 << 16 | i0 & 65535;
              C2[0] ^= i0;
              C2[1] ^= i1;
              C2[2] ^= i2;
              C2[3] ^= i3;
              C2[4] ^= i0;
              C2[5] ^= i1;
              C2[6] ^= i2;
              C2[7] ^= i3;
              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function(M, offset) {
            var X = this._X;
            nextState.call(this);
            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
            for (var i = 0; i < 4; i++) {
              S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
              M[offset + i] ^= S[i];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function nextState() {
          var X = this._X;
          var C2 = this._C;
          for (var i = 0; i < 8; i++) {
            C_[i] = C2[i];
          }
          C2[0] = C2[0] + 1295307597 + this._b | 0;
          C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C2[i];
            var ga = gx & 65535;
            var gb = gx >>> 16;
            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
            G[i] = gh ^ gl;
          }
          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
      })();
      return CryptoJS2.RabbitLegacy;
    });
  })(rabbitLegacy);
  return rabbitLegacy.exports;
}
var blowfish = { exports: {} };
var hasRequiredBlowfish;
function requireBlowfish() {
  if (hasRequiredBlowfish) return blowfish.exports;
  hasRequiredBlowfish = 1;
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      (function() {
        var C = CryptoJS2;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo;
        const N = 16;
        const ORIG_P = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ];
        const ORIG_S = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var BLOWFISH_CTX = {
          pbox: [],
          sbox: []
        };
        function F(ctx, x) {
          let a = x >> 24 & 255;
          let b = x >> 16 & 255;
          let c = x >> 8 & 255;
          let d = x & 255;
          let y = ctx.sbox[0][a] + ctx.sbox[1][b];
          y = y ^ ctx.sbox[2][c];
          y = y + ctx.sbox[3][d];
          return y;
        }
        function BlowFish_Encrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;
          for (let i = 0; i < N; ++i) {
            Xl = Xl ^ ctx.pbox[i];
            Xr = F(ctx, Xl) ^ Xr;
            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }
          temp = Xl;
          Xl = Xr;
          Xr = temp;
          Xr = Xr ^ ctx.pbox[N];
          Xl = Xl ^ ctx.pbox[N + 1];
          return { left: Xl, right: Xr };
        }
        function BlowFish_Decrypt(ctx, left, right) {
          let Xl = left;
          let Xr = right;
          let temp;
          for (let i = N + 1; i > 1; --i) {
            Xl = Xl ^ ctx.pbox[i];
            Xr = F(ctx, Xl) ^ Xr;
            temp = Xl;
            Xl = Xr;
            Xr = temp;
          }
          temp = Xl;
          Xl = Xr;
          Xr = temp;
          Xr = Xr ^ ctx.pbox[1];
          Xl = Xl ^ ctx.pbox[0];
          return { left: Xl, right: Xr };
        }
        function BlowFishInit(ctx, key, keysize) {
          for (let Row = 0; Row < 4; Row++) {
            ctx.sbox[Row] = [];
            for (let Col = 0; Col < 256; Col++) {
              ctx.sbox[Row][Col] = ORIG_S[Row][Col];
            }
          }
          let keyIndex = 0;
          for (let index = 0; index < N + 2; index++) {
            ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
            keyIndex++;
            if (keyIndex >= keysize) {
              keyIndex = 0;
            }
          }
          let Data1 = 0;
          let Data2 = 0;
          let res = 0;
          for (let i = 0; i < N + 2; i += 2) {
            res = BlowFish_Encrypt(ctx, Data1, Data2);
            Data1 = res.left;
            Data2 = res.right;
            ctx.pbox[i] = Data1;
            ctx.pbox[i + 1] = Data2;
          }
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 256; j += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.sbox[i][j] = Data1;
              ctx.sbox[i][j + 1] = Data2;
            }
          }
          return true;
        }
        var Blowfish = C_algo.Blowfish = BlockCipher.extend({
          _doReset: function() {
            if (this._keyPriorReset === this._key) {
              return;
            }
            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;
            BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
          },
          encryptBlock: function(M, offset) {
            var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },
          decryptBlock: function(M, offset) {
            var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
            M[offset] = res.left;
            M[offset + 1] = res.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        C.Blowfish = BlockCipher._createHelper(Blowfish);
      })();
      return CryptoJS2.Blowfish;
    });
  })(blowfish);
  return blowfish.exports;
}
(function(module, exports) {
  (function(root, factory, undef) {
    {
      module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
    }
  })(commonjsGlobal, function(CryptoJS2) {
    return CryptoJS2;
  });
})(cryptoJs);
var cryptoJsExports = cryptoJs.exports;
const CryptoJS = /* @__PURE__ */ getDefaultExportFromCjs(cryptoJsExports);
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
function int2char(n) {
  return BI_RM.charAt(n);
}
function op_and(x, y) {
  return x & y;
}
function op_or(x, y) {
  return x | y;
}
function op_xor(x, y) {
  return x ^ y;
}
function op_andnot(x, y) {
  return x & ~y;
}
function lbit(x) {
  if (x == 0) {
    return -1;
  }
  var r = 0;
  if ((x & 65535) == 0) {
    x >>= 16;
    r += 16;
  }
  if ((x & 255) == 0) {
    x >>= 8;
    r += 8;
  }
  if ((x & 15) == 0) {
    x >>= 4;
    r += 4;
  }
  if ((x & 3) == 0) {
    x >>= 2;
    r += 2;
  }
  if ((x & 1) == 0) {
    ++r;
  }
  return r;
}
function cbit(x) {
  var r = 0;
  while (x != 0) {
    x &= x - 1;
    ++r;
  }
  return r;
}
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(h) {
  var i;
  var c;
  var ret = "";
  for (i = 0; i + 3 <= h.length; i += 3) {
    c = parseInt(h.substring(i, i + 3), 16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
  }
  if (i + 1 == h.length) {
    c = parseInt(h.substring(i, i + 1), 16);
    ret += b64map.charAt(c << 2);
  } else if (i + 2 == h.length) {
    c = parseInt(h.substring(i, i + 2), 16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
  }
  while ((ret.length & 3) > 0) {
    ret += b64pad;
  }
  return ret;
}
function b64tohex(s) {
  var ret = "";
  var i;
  var k = 0;
  var slop = 0;
  for (i = 0; i < s.length; ++i) {
    if (s.charAt(i) == b64pad) {
      break;
    }
    var v = b64map.indexOf(s.charAt(i));
    if (v < 0) {
      continue;
    }
    if (k == 0) {
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 1;
    } else if (k == 1) {
      ret += int2char(slop << 2 | v >> 4);
      slop = v & 15;
      k = 2;
    } else if (k == 2) {
      ret += int2char(slop);
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 3;
    } else {
      ret += int2char(slop << 2 | v >> 4);
      ret += int2char(v & 15);
      k = 0;
    }
  }
  if (k == 1) {
    ret += int2char(slop << 2);
  }
  return ret;
}
var decoder$1;
var Hex = {
  decode: function(a) {
    var i;
    if (decoder$1 === void 0) {
      var hex = "0123456789ABCDEF";
      var ignore = " \f\n\r	 \u2028\u2029";
      decoder$1 = {};
      for (i = 0; i < 16; ++i) {
        decoder$1[hex.charAt(i)] = i;
      }
      hex = hex.toLowerCase();
      for (i = 10; i < 16; ++i) {
        decoder$1[hex.charAt(i)] = i;
      }
      for (i = 0; i < ignore.length; ++i) {
        decoder$1[ignore.charAt(i)] = -1;
      }
    }
    var out = [];
    var bits = 0;
    var char_count = 0;
    for (i = 0; i < a.length; ++i) {
      var c = a.charAt(i);
      if (c == "=") {
        break;
      }
      c = decoder$1[c];
      if (c == -1) {
        continue;
      }
      if (c === void 0) {
        throw new Error("Illegal character at offset " + i);
      }
      bits |= c;
      if (++char_count >= 2) {
        out[out.length] = bits;
        bits = 0;
        char_count = 0;
      } else {
        bits <<= 4;
      }
    }
    if (char_count) {
      throw new Error("Hex encoding incomplete: 4 bits missing");
    }
    return out;
  }
};
var decoder;
var Base64 = {
  decode: function(a) {
    var i;
    if (decoder === void 0) {
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var ignore = "= \f\n\r	 \u2028\u2029";
      decoder = /* @__PURE__ */ Object.create(null);
      for (i = 0; i < 64; ++i) {
        decoder[b64.charAt(i)] = i;
      }
      decoder["-"] = 62;
      decoder["_"] = 63;
      for (i = 0; i < ignore.length; ++i) {
        decoder[ignore.charAt(i)] = -1;
      }
    }
    var out = [];
    var bits = 0;
    var char_count = 0;
    for (i = 0; i < a.length; ++i) {
      var c = a.charAt(i);
      if (c == "=") {
        break;
      }
      c = decoder[c];
      if (c == -1) {
        continue;
      }
      if (c === void 0) {
        throw new Error("Illegal character at offset " + i);
      }
      bits |= c;
      if (++char_count >= 4) {
        out[out.length] = bits >> 16;
        out[out.length] = bits >> 8 & 255;
        out[out.length] = bits & 255;
        bits = 0;
        char_count = 0;
      } else {
        bits <<= 6;
      }
    }
    switch (char_count) {
      case 1:
        throw new Error("Base64 encoding incomplete: at least 2 bits missing");
      case 2:
        out[out.length] = bits >> 10;
        break;
      case 3:
        out[out.length] = bits >> 16;
        out[out.length] = bits >> 8 & 255;
        break;
    }
    return out;
  },
  re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
  unarmor: function(a) {
    var m = Base64.re.exec(a);
    if (m) {
      if (m[1]) {
        a = m[1];
      } else if (m[2]) {
        a = m[2];
      } else {
        throw new Error("RegExp out of sync");
      }
    }
    return Base64.decode(a);
  }
};
var max = 1e13;
var Int10 = (
  /** @class */
  function() {
    function Int102(value) {
      this.buf = [+value || 0];
    }
    Int102.prototype.mulAdd = function(m, c) {
      var b = this.buf;
      var l = b.length;
      var i;
      var t;
      for (i = 0; i < l; ++i) {
        t = b[i] * m + c;
        if (t < max) {
          c = 0;
        } else {
          c = 0 | t / max;
          t -= c * max;
        }
        b[i] = t;
      }
      if (c > 0) {
        b[i] = c;
      }
    };
    Int102.prototype.sub = function(c) {
      var b = this.buf;
      var l = b.length;
      var i;
      var t;
      for (i = 0; i < l; ++i) {
        t = b[i] - c;
        if (t < 0) {
          t += max;
          c = 1;
        } else {
          c = 0;
        }
        b[i] = t;
      }
      while (b[b.length - 1] === 0) {
        b.pop();
      }
    };
    Int102.prototype.toString = function(base) {
      if ((base || 10) != 10) {
        throw new Error("only base 10 is supported");
      }
      var b = this.buf;
      var s = b[b.length - 1].toString();
      for (var i = b.length - 2; i >= 0; --i) {
        s += (max + b[i]).toString().substring(1);
      }
      return s;
    };
    Int102.prototype.valueOf = function() {
      var b = this.buf;
      var v = 0;
      for (var i = b.length - 1; i >= 0; --i) {
        v = v * max + b[i];
      }
      return v;
    };
    Int102.prototype.simplify = function() {
      var b = this.buf;
      return b.length == 1 ? b[0] : this;
    };
    return Int102;
  }()
);
var ellipsis = "…";
var reTimeS = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
var reTimeL = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
function stringCut(str, len) {
  if (str.length > len) {
    str = str.substring(0, len) + ellipsis;
  }
  return str;
}
var Stream = (
  /** @class */
  function() {
    function Stream2(enc, pos) {
      this.hexDigits = "0123456789ABCDEF";
      if (enc instanceof Stream2) {
        this.enc = enc.enc;
        this.pos = enc.pos;
      } else {
        this.enc = enc;
        this.pos = pos;
      }
    }
    Stream2.prototype.get = function(pos) {
      if (pos === void 0) {
        pos = this.pos++;
      }
      if (pos >= this.enc.length) {
        throw new Error("Requesting byte offset ".concat(pos, " on a stream of length ").concat(this.enc.length));
      }
      return "string" === typeof this.enc ? this.enc.charCodeAt(pos) : this.enc[pos];
    };
    Stream2.prototype.hexByte = function(b) {
      return this.hexDigits.charAt(b >> 4 & 15) + this.hexDigits.charAt(b & 15);
    };
    Stream2.prototype.hexDump = function(start, end, raw) {
      var s = "";
      for (var i = start; i < end; ++i) {
        s += this.hexByte(this.get(i));
        if (raw !== true) {
          switch (i & 15) {
            case 7:
              s += "  ";
              break;
            case 15:
              s += "\n";
              break;
            default:
              s += " ";
          }
        }
      }
      return s;
    };
    Stream2.prototype.isASCII = function(start, end) {
      for (var i = start; i < end; ++i) {
        var c = this.get(i);
        if (c < 32 || c > 176) {
          return false;
        }
      }
      return true;
    };
    Stream2.prototype.parseStringISO = function(start, end) {
      var s = "";
      for (var i = start; i < end; ++i) {
        s += String.fromCharCode(this.get(i));
      }
      return s;
    };
    Stream2.prototype.parseStringUTF = function(start, end) {
      var s = "";
      for (var i = start; i < end; ) {
        var c = this.get(i++);
        if (c < 128) {
          s += String.fromCharCode(c);
        } else if (c > 191 && c < 224) {
          s += String.fromCharCode((c & 31) << 6 | this.get(i++) & 63);
        } else {
          s += String.fromCharCode((c & 15) << 12 | (this.get(i++) & 63) << 6 | this.get(i++) & 63);
        }
      }
      return s;
    };
    Stream2.prototype.parseStringBMP = function(start, end) {
      var str = "";
      var hi;
      var lo;
      for (var i = start; i < end; ) {
        hi = this.get(i++);
        lo = this.get(i++);
        str += String.fromCharCode(hi << 8 | lo);
      }
      return str;
    };
    Stream2.prototype.parseTime = function(start, end, shortYear) {
      var s = this.parseStringISO(start, end);
      var m = (shortYear ? reTimeS : reTimeL).exec(s);
      if (!m) {
        return "Unrecognized time: " + s;
      }
      if (shortYear) {
        m[1] = +m[1];
        m[1] += +m[1] < 70 ? 2e3 : 1900;
      }
      s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
      if (m[5]) {
        s += ":" + m[5];
        if (m[6]) {
          s += ":" + m[6];
          if (m[7]) {
            s += "." + m[7];
          }
        }
      }
      if (m[8]) {
        s += " UTC";
        if (m[8] != "Z") {
          s += m[8];
          if (m[9]) {
            s += ":" + m[9];
          }
        }
      }
      return s;
    };
    Stream2.prototype.parseInteger = function(start, end) {
      var v = this.get(start);
      var neg = v > 127;
      var pad = neg ? 255 : 0;
      var len;
      var s = "";
      while (v == pad && ++start < end) {
        v = this.get(start);
      }
      len = end - start;
      if (len === 0) {
        return neg ? -1 : 0;
      }
      if (len > 4) {
        s = v;
        len <<= 3;
        while (((+s ^ pad) & 128) == 0) {
          s = +s << 1;
          --len;
        }
        s = "(" + len + " bit)\n";
      }
      if (neg) {
        v = v - 256;
      }
      var n = new Int10(v);
      for (var i = start + 1; i < end; ++i) {
        n.mulAdd(256, this.get(i));
      }
      return s + n.toString();
    };
    Stream2.prototype.parseBitString = function(start, end, maxLength) {
      var unusedBit = this.get(start);
      var lenBit = (end - start - 1 << 3) - unusedBit;
      var intro = "(" + lenBit + " bit)\n";
      var s = "";
      for (var i = start + 1; i < end; ++i) {
        var b = this.get(i);
        var skip = i == end - 1 ? unusedBit : 0;
        for (var j = 7; j >= skip; --j) {
          s += b >> j & 1 ? "1" : "0";
        }
        if (s.length > maxLength) {
          return intro + stringCut(s, maxLength);
        }
      }
      return intro + s;
    };
    Stream2.prototype.parseOctetString = function(start, end, maxLength) {
      if (this.isASCII(start, end)) {
        return stringCut(this.parseStringISO(start, end), maxLength);
      }
      var len = end - start;
      var s = "(" + len + " byte)\n";
      maxLength /= 2;
      if (len > maxLength) {
        end = start + maxLength;
      }
      for (var i = start; i < end; ++i) {
        s += this.hexByte(this.get(i));
      }
      if (len > maxLength) {
        s += ellipsis;
      }
      return s;
    };
    Stream2.prototype.parseOID = function(start, end, maxLength) {
      var s = "";
      var n = new Int10();
      var bits = 0;
      for (var i = start; i < end; ++i) {
        var v = this.get(i);
        n.mulAdd(128, v & 127);
        bits += 7;
        if (!(v & 128)) {
          if (s === "") {
            n = n.simplify();
            if (n instanceof Int10) {
              n.sub(80);
              s = "2." + n.toString();
            } else {
              var m = n < 80 ? n < 40 ? 0 : 1 : 2;
              s = m + "." + (n - m * 40);
            }
          } else {
            s += "." + n.toString();
          }
          if (s.length > maxLength) {
            return stringCut(s, maxLength);
          }
          n = new Int10();
          bits = 0;
        }
      }
      if (bits > 0) {
        s += ".incomplete";
      }
      return s;
    };
    return Stream2;
  }()
);
var ASN1 = (
  /** @class */
  function() {
    function ASN12(stream, header, length, tag, sub) {
      if (!(tag instanceof ASN1Tag)) {
        throw new Error("Invalid tag value.");
      }
      this.stream = stream;
      this.header = header;
      this.length = length;
      this.tag = tag;
      this.sub = sub;
    }
    ASN12.prototype.typeName = function() {
      switch (this.tag.tagClass) {
        case 0:
          switch (this.tag.tagNumber) {
            case 0:
              return "EOC";
            case 1:
              return "BOOLEAN";
            case 2:
              return "INTEGER";
            case 3:
              return "BIT_STRING";
            case 4:
              return "OCTET_STRING";
            case 5:
              return "NULL";
            case 6:
              return "OBJECT_IDENTIFIER";
            case 7:
              return "ObjectDescriptor";
            case 8:
              return "EXTERNAL";
            case 9:
              return "REAL";
            case 10:
              return "ENUMERATED";
            case 11:
              return "EMBEDDED_PDV";
            case 12:
              return "UTF8String";
            case 16:
              return "SEQUENCE";
            case 17:
              return "SET";
            case 18:
              return "NumericString";
            case 19:
              return "PrintableString";
            case 20:
              return "TeletexString";
            case 21:
              return "VideotexString";
            case 22:
              return "IA5String";
            case 23:
              return "UTCTime";
            case 24:
              return "GeneralizedTime";
            case 25:
              return "GraphicString";
            case 26:
              return "VisibleString";
            case 27:
              return "GeneralString";
            case 28:
              return "UniversalString";
            case 30:
              return "BMPString";
          }
          return "Universal_" + this.tag.tagNumber.toString();
        case 1:
          return "Application_" + this.tag.tagNumber.toString();
        case 2:
          return "[" + this.tag.tagNumber.toString() + "]";
        case 3:
          return "Private_" + this.tag.tagNumber.toString();
      }
    };
    ASN12.prototype.content = function(maxLength) {
      if (this.tag === void 0) {
        return null;
      }
      if (maxLength === void 0) {
        maxLength = Infinity;
      }
      var content = this.posContent();
      var len = Math.abs(this.length);
      if (!this.tag.isUniversal()) {
        if (this.sub !== null) {
          return "(" + this.sub.length + " elem)";
        }
        return this.stream.parseOctetString(content, content + len, maxLength);
      }
      switch (this.tag.tagNumber) {
        case 1:
          return this.stream.get(content) === 0 ? "false" : "true";
        case 2:
          return this.stream.parseInteger(content, content + len);
        case 3:
          return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(content, content + len, maxLength);
        case 4:
          return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(content, content + len, maxLength);
        case 6:
          return this.stream.parseOID(content, content + len, maxLength);
        case 16:
        case 17:
          if (this.sub !== null) {
            return "(" + this.sub.length + " elem)";
          } else {
            return "(no elem)";
          }
        case 12:
          return stringCut(this.stream.parseStringUTF(content, content + len), maxLength);
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 26:
          return stringCut(this.stream.parseStringISO(content, content + len), maxLength);
        case 30:
          return stringCut(this.stream.parseStringBMP(content, content + len), maxLength);
        case 23:
        case 24:
          return this.stream.parseTime(content, content + len, this.tag.tagNumber == 23);
      }
      return null;
    };
    ASN12.prototype.toString = function() {
      return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (this.sub === null ? "null" : this.sub.length) + "]";
    };
    ASN12.prototype.toPrettyString = function(indent) {
      if (indent === void 0) {
        indent = "";
      }
      var s = indent + this.typeName() + " @" + this.stream.pos;
      if (this.length >= 0) {
        s += "+";
      }
      s += this.length;
      if (this.tag.tagConstructed) {
        s += " (constructed)";
      } else if (this.tag.isUniversal() && (this.tag.tagNumber == 3 || this.tag.tagNumber == 4) && this.sub !== null) {
        s += " (encapsulates)";
      }
      s += "\n";
      if (this.sub !== null) {
        indent += "  ";
        for (var i = 0, max2 = this.sub.length; i < max2; ++i) {
          s += this.sub[i].toPrettyString(indent);
        }
      }
      return s;
    };
    ASN12.prototype.posStart = function() {
      return this.stream.pos;
    };
    ASN12.prototype.posContent = function() {
      return this.stream.pos + this.header;
    };
    ASN12.prototype.posEnd = function() {
      return this.stream.pos + this.header + Math.abs(this.length);
    };
    ASN12.prototype.toHexString = function() {
      return this.stream.hexDump(this.posStart(), this.posEnd(), true);
    };
    ASN12.decodeLength = function(stream) {
      var buf = stream.get();
      var len = buf & 127;
      if (len == buf) {
        return len;
      }
      if (len > 6) {
        throw new Error("Length over 48 bits not supported at position " + (stream.pos - 1));
      }
      if (len === 0) {
        return null;
      }
      buf = 0;
      for (var i = 0; i < len; ++i) {
        buf = buf * 256 + stream.get();
      }
      return buf;
    };
    ASN12.prototype.getHexStringValue = function() {
      var hexString = this.toHexString();
      var offset = this.header * 2;
      var length = this.length * 2;
      return hexString.substr(offset, length);
    };
    ASN12.decode = function(str) {
      var stream;
      if (!(str instanceof Stream)) {
        stream = new Stream(str, 0);
      } else {
        stream = str;
      }
      var streamStart = new Stream(stream);
      var tag = new ASN1Tag(stream);
      var len = ASN12.decodeLength(stream);
      var start = stream.pos;
      var header = start - streamStart.pos;
      var sub = null;
      var getSub = function() {
        var ret = [];
        if (len !== null) {
          var end = start + len;
          while (stream.pos < end) {
            ret[ret.length] = ASN12.decode(stream);
          }
          if (stream.pos != end) {
            throw new Error("Content size is not correct for container starting at offset " + start);
          }
        } else {
          try {
            for (; ; ) {
              var s = ASN12.decode(stream);
              if (s.tag.isEOC()) {
                break;
              }
              ret[ret.length] = s;
            }
            len = start - stream.pos;
          } catch (e) {
            throw new Error("Exception while decoding undefined length content: " + e);
          }
        }
        return ret;
      };
      if (tag.tagConstructed) {
        sub = getSub();
      } else if (tag.isUniversal() && (tag.tagNumber == 3 || tag.tagNumber == 4)) {
        try {
          if (tag.tagNumber == 3) {
            if (stream.get() != 0) {
              throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
            }
          }
          sub = getSub();
          for (var i = 0; i < sub.length; ++i) {
            if (sub[i].tag.isEOC()) {
              throw new Error("EOC is not supposed to be actual content.");
            }
          }
        } catch (e) {
          sub = null;
        }
      }
      if (sub === null) {
        if (len === null) {
          throw new Error("We can't skip over an invalid tag with undefined length at offset " + start);
        }
        stream.pos = start + Math.abs(len);
      }
      return new ASN12(streamStart, header, len, tag, sub);
    };
    return ASN12;
  }()
);
var ASN1Tag = (
  /** @class */
  function() {
    function ASN1Tag2(stream) {
      var buf = stream.get();
      this.tagClass = buf >> 6;
      this.tagConstructed = (buf & 32) !== 0;
      this.tagNumber = buf & 31;
      if (this.tagNumber == 31) {
        var n = new Int10();
        do {
          buf = stream.get();
          n.mulAdd(128, buf & 127);
        } while (buf & 128);
        this.tagNumber = n.simplify();
      }
    }
    ASN1Tag2.prototype.isUniversal = function() {
      return this.tagClass === 0;
    };
    ASN1Tag2.prototype.isEOC = function() {
      return this.tagClass === 0 && this.tagNumber === 0;
    };
    return ASN1Tag2;
  }()
);
var dbits;
var canary = 244837814094590;
var j_lm = (canary & 16777215) == 15715070;
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
var BigInteger = (
  /** @class */
  function() {
    function BigInteger2(a, b, c) {
      if (a != null) {
        if ("number" == typeof a) {
          this.fromNumber(a, b, c);
        } else if (b == null && "string" != typeof a) {
          this.fromString(a, 256);
        } else {
          this.fromString(a, b);
        }
      }
    }
    BigInteger2.prototype.toString = function(b) {
      if (this.s < 0) {
        return "-" + this.negate().toString(b);
      }
      var k;
      if (b == 16) {
        k = 4;
      } else if (b == 8) {
        k = 3;
      } else if (b == 2) {
        k = 1;
      } else if (b == 32) {
        k = 5;
      } else if (b == 4) {
        k = 2;
      } else {
        return this.toRadix(b);
      }
      var km = (1 << k) - 1;
      var d;
      var m = false;
      var r = "";
      var i = this.t;
      var p = this.DB - i * this.DB % k;
      if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
          m = true;
          r = int2char(d);
        }
        while (i >= 0) {
          if (p < k) {
            d = (this[i] & (1 << p) - 1) << k - p;
            d |= this[--i] >> (p += this.DB - k);
          } else {
            d = this[i] >> (p -= k) & km;
            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }
          if (d > 0) {
            m = true;
          }
          if (m) {
            r += int2char(d);
          }
        }
      }
      return m ? r : "0";
    };
    BigInteger2.prototype.negate = function() {
      var r = nbi();
      BigInteger2.ZERO.subTo(this, r);
      return r;
    };
    BigInteger2.prototype.abs = function() {
      return this.s < 0 ? this.negate() : this;
    };
    BigInteger2.prototype.compareTo = function(a) {
      var r = this.s - a.s;
      if (r != 0) {
        return r;
      }
      var i = this.t;
      r = i - a.t;
      if (r != 0) {
        return this.s < 0 ? -r : r;
      }
      while (--i >= 0) {
        if ((r = this[i] - a[i]) != 0) {
          return r;
        }
      }
      return 0;
    };
    BigInteger2.prototype.bitLength = function() {
      if (this.t <= 0) {
        return 0;
      }
      return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
    };
    BigInteger2.prototype.mod = function(a) {
      var r = nbi();
      this.abs().divRemTo(a, null, r);
      if (this.s < 0 && r.compareTo(BigInteger2.ZERO) > 0) {
        a.subTo(r, r);
      }
      return r;
    };
    BigInteger2.prototype.modPowInt = function(e, m) {
      var z;
      if (e < 256 || m.isEven()) {
        z = new Classic(m);
      } else {
        z = new Montgomery(m);
      }
      return this.exp(e, z);
    };
    BigInteger2.prototype.clone = function() {
      var r = nbi();
      this.copyTo(r);
      return r;
    };
    BigInteger2.prototype.intValue = function() {
      if (this.s < 0) {
        if (this.t == 1) {
          return this[0] - this.DV;
        } else if (this.t == 0) {
          return -1;
        }
      } else if (this.t == 1) {
        return this[0];
      } else if (this.t == 0) {
        return 0;
      }
      return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
    };
    BigInteger2.prototype.byteValue = function() {
      return this.t == 0 ? this.s : this[0] << 24 >> 24;
    };
    BigInteger2.prototype.shortValue = function() {
      return this.t == 0 ? this.s : this[0] << 16 >> 16;
    };
    BigInteger2.prototype.signum = function() {
      if (this.s < 0) {
        return -1;
      } else if (this.t <= 0 || this.t == 1 && this[0] <= 0) {
        return 0;
      } else {
        return 1;
      }
    };
    BigInteger2.prototype.toByteArray = function() {
      var i = this.t;
      var r = [];
      r[0] = this.s;
      var p = this.DB - i * this.DB % 8;
      var d;
      var k = 0;
      if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
          r[k++] = d | this.s << this.DB - p;
        }
        while (i >= 0) {
          if (p < 8) {
            d = (this[i] & (1 << p) - 1) << 8 - p;
            d |= this[--i] >> (p += this.DB - 8);
          } else {
            d = this[i] >> (p -= 8) & 255;
            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }
          if ((d & 128) != 0) {
            d |= -256;
          }
          if (k == 0 && (this.s & 128) != (d & 128)) {
            ++k;
          }
          if (k > 0 || d != this.s) {
            r[k++] = d;
          }
        }
      }
      return r;
    };
    BigInteger2.prototype.equals = function(a) {
      return this.compareTo(a) == 0;
    };
    BigInteger2.prototype.min = function(a) {
      return this.compareTo(a) < 0 ? this : a;
    };
    BigInteger2.prototype.max = function(a) {
      return this.compareTo(a) > 0 ? this : a;
    };
    BigInteger2.prototype.and = function(a) {
      var r = nbi();
      this.bitwiseTo(a, op_and, r);
      return r;
    };
    BigInteger2.prototype.or = function(a) {
      var r = nbi();
      this.bitwiseTo(a, op_or, r);
      return r;
    };
    BigInteger2.prototype.xor = function(a) {
      var r = nbi();
      this.bitwiseTo(a, op_xor, r);
      return r;
    };
    BigInteger2.prototype.andNot = function(a) {
      var r = nbi();
      this.bitwiseTo(a, op_andnot, r);
      return r;
    };
    BigInteger2.prototype.not = function() {
      var r = nbi();
      for (var i = 0; i < this.t; ++i) {
        r[i] = this.DM & ~this[i];
      }
      r.t = this.t;
      r.s = ~this.s;
      return r;
    };
    BigInteger2.prototype.shiftLeft = function(n) {
      var r = nbi();
      if (n < 0) {
        this.rShiftTo(-n, r);
      } else {
        this.lShiftTo(n, r);
      }
      return r;
    };
    BigInteger2.prototype.shiftRight = function(n) {
      var r = nbi();
      if (n < 0) {
        this.lShiftTo(-n, r);
      } else {
        this.rShiftTo(n, r);
      }
      return r;
    };
    BigInteger2.prototype.getLowestSetBit = function() {
      for (var i = 0; i < this.t; ++i) {
        if (this[i] != 0) {
          return i * this.DB + lbit(this[i]);
        }
      }
      if (this.s < 0) {
        return this.t * this.DB;
      }
      return -1;
    };
    BigInteger2.prototype.bitCount = function() {
      var r = 0;
      var x = this.s & this.DM;
      for (var i = 0; i < this.t; ++i) {
        r += cbit(this[i] ^ x);
      }
      return r;
    };
    BigInteger2.prototype.testBit = function(n) {
      var j = Math.floor(n / this.DB);
      if (j >= this.t) {
        return this.s != 0;
      }
      return (this[j] & 1 << n % this.DB) != 0;
    };
    BigInteger2.prototype.setBit = function(n) {
      return this.changeBit(n, op_or);
    };
    BigInteger2.prototype.clearBit = function(n) {
      return this.changeBit(n, op_andnot);
    };
    BigInteger2.prototype.flipBit = function(n) {
      return this.changeBit(n, op_xor);
    };
    BigInteger2.prototype.add = function(a) {
      var r = nbi();
      this.addTo(a, r);
      return r;
    };
    BigInteger2.prototype.subtract = function(a) {
      var r = nbi();
      this.subTo(a, r);
      return r;
    };
    BigInteger2.prototype.multiply = function(a) {
      var r = nbi();
      this.multiplyTo(a, r);
      return r;
    };
    BigInteger2.prototype.divide = function(a) {
      var r = nbi();
      this.divRemTo(a, r, null);
      return r;
    };
    BigInteger2.prototype.remainder = function(a) {
      var r = nbi();
      this.divRemTo(a, null, r);
      return r;
    };
    BigInteger2.prototype.divideAndRemainder = function(a) {
      var q = nbi();
      var r = nbi();
      this.divRemTo(a, q, r);
      return [q, r];
    };
    BigInteger2.prototype.modPow = function(e, m) {
      var i = e.bitLength();
      var k;
      var r = nbv(1);
      var z;
      if (i <= 0) {
        return r;
      } else if (i < 18) {
        k = 1;
      } else if (i < 48) {
        k = 3;
      } else if (i < 144) {
        k = 4;
      } else if (i < 768) {
        k = 5;
      } else {
        k = 6;
      }
      if (i < 8) {
        z = new Classic(m);
      } else if (m.isEven()) {
        z = new Barrett(m);
      } else {
        z = new Montgomery(m);
      }
      var g = [];
      var n = 3;
      var k1 = k - 1;
      var km = (1 << k) - 1;
      g[1] = z.convert(this);
      if (k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1], g2);
        while (n <= km) {
          g[n] = nbi();
          z.mulTo(g2, g[n - 2], g[n]);
          n += 2;
        }
      }
      var j = e.t - 1;
      var w;
      var is1 = true;
      var r2 = nbi();
      var t;
      i = nbits(e[j]) - 1;
      while (j >= 0) {
        if (i >= k1) {
          w = e[j] >> i - k1 & km;
        } else {
          w = (e[j] & (1 << i + 1) - 1) << k1 - i;
          if (j > 0) {
            w |= e[j - 1] >> this.DB + i - k1;
          }
        }
        n = k;
        while ((w & 1) == 0) {
          w >>= 1;
          --n;
        }
        if ((i -= n) < 0) {
          i += this.DB;
          --j;
        }
        if (is1) {
          g[w].copyTo(r);
          is1 = false;
        } else {
          while (n > 1) {
            z.sqrTo(r, r2);
            z.sqrTo(r2, r);
            n -= 2;
          }
          if (n > 0) {
            z.sqrTo(r, r2);
          } else {
            t = r;
            r = r2;
            r2 = t;
          }
          z.mulTo(r2, g[w], r);
        }
        while (j >= 0 && (e[j] & 1 << i) == 0) {
          z.sqrTo(r, r2);
          t = r;
          r = r2;
          r2 = t;
          if (--i < 0) {
            i = this.DB - 1;
            --j;
          }
        }
      }
      return z.revert(r);
    };
    BigInteger2.prototype.modInverse = function(m) {
      var ac = m.isEven();
      if (this.isEven() && ac || m.signum() == 0) {
        return BigInteger2.ZERO;
      }
      var u = m.clone();
      var v = this.clone();
      var a = nbv(1);
      var b = nbv(0);
      var c = nbv(0);
      var d = nbv(1);
      while (u.signum() != 0) {
        while (u.isEven()) {
          u.rShiftTo(1, u);
          if (ac) {
            if (!a.isEven() || !b.isEven()) {
              a.addTo(this, a);
              b.subTo(m, b);
            }
            a.rShiftTo(1, a);
          } else if (!b.isEven()) {
            b.subTo(m, b);
          }
          b.rShiftTo(1, b);
        }
        while (v.isEven()) {
          v.rShiftTo(1, v);
          if (ac) {
            if (!c.isEven() || !d.isEven()) {
              c.addTo(this, c);
              d.subTo(m, d);
            }
            c.rShiftTo(1, c);
          } else if (!d.isEven()) {
            d.subTo(m, d);
          }
          d.rShiftTo(1, d);
        }
        if (u.compareTo(v) >= 0) {
          u.subTo(v, u);
          if (ac) {
            a.subTo(c, a);
          }
          b.subTo(d, b);
        } else {
          v.subTo(u, v);
          if (ac) {
            c.subTo(a, c);
          }
          d.subTo(b, d);
        }
      }
      if (v.compareTo(BigInteger2.ONE) != 0) {
        return BigInteger2.ZERO;
      }
      if (d.compareTo(m) >= 0) {
        return d.subtract(m);
      }
      if (d.signum() < 0) {
        d.addTo(m, d);
      } else {
        return d;
      }
      if (d.signum() < 0) {
        return d.add(m);
      } else {
        return d;
      }
    };
    BigInteger2.prototype.pow = function(e) {
      return this.exp(e, new NullExp());
    };
    BigInteger2.prototype.gcd = function(a) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y = a.s < 0 ? a.negate() : a.clone();
      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }
      var i = x.getLowestSetBit();
      var g = y.getLowestSetBit();
      if (g < 0) {
        return x;
      }
      if (i < g) {
        g = i;
      }
      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      }
      while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0) {
          x.rShiftTo(i, x);
        }
        if ((i = y.getLowestSetBit()) > 0) {
          y.rShiftTo(i, y);
        }
        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }
      }
      if (g > 0) {
        y.lShiftTo(g, y);
      }
      return y;
    };
    BigInteger2.prototype.isProbablePrime = function(t) {
      var i;
      var x = this.abs();
      if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i) {
          if (x[0] == lowprimes[i]) {
            return true;
          }
        }
        return false;
      }
      if (x.isEven()) {
        return false;
      }
      i = 1;
      while (i < lowprimes.length) {
        var m = lowprimes[i];
        var j = i + 1;
        while (j < lowprimes.length && m < lplim) {
          m *= lowprimes[j++];
        }
        m = x.modInt(m);
        while (i < j) {
          if (m % lowprimes[i++] == 0) {
            return false;
          }
        }
      }
      return x.millerRabin(t);
    };
    BigInteger2.prototype.copyTo = function(r) {
      for (var i = this.t - 1; i >= 0; --i) {
        r[i] = this[i];
      }
      r.t = this.t;
      r.s = this.s;
    };
    BigInteger2.prototype.fromInt = function(x) {
      this.t = 1;
      this.s = x < 0 ? -1 : 0;
      if (x > 0) {
        this[0] = x;
      } else if (x < -1) {
        this[0] = x + this.DV;
      } else {
        this.t = 0;
      }
    };
    BigInteger2.prototype.fromString = function(s, b) {
      var k;
      if (b == 16) {
        k = 4;
      } else if (b == 8) {
        k = 3;
      } else if (b == 256) {
        k = 8;
      } else if (b == 2) {
        k = 1;
      } else if (b == 32) {
        k = 5;
      } else if (b == 4) {
        k = 2;
      } else {
        this.fromRadix(s, b);
        return;
      }
      this.t = 0;
      this.s = 0;
      var i = s.length;
      var mi = false;
      var sh = 0;
      while (--i >= 0) {
        var x = k == 8 ? +s[i] & 255 : intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-") {
            mi = true;
          }
          continue;
        }
        mi = false;
        if (sh == 0) {
          this[this.t++] = x;
        } else if (sh + k > this.DB) {
          this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
          this[this.t++] = x >> this.DB - sh;
        } else {
          this[this.t - 1] |= x << sh;
        }
        sh += k;
        if (sh >= this.DB) {
          sh -= this.DB;
        }
      }
      if (k == 8 && (+s[0] & 128) != 0) {
        this.s = -1;
        if (sh > 0) {
          this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
        }
      }
      this.clamp();
      if (mi) {
        BigInteger2.ZERO.subTo(this, this);
      }
    };
    BigInteger2.prototype.clamp = function() {
      var c = this.s & this.DM;
      while (this.t > 0 && this[this.t - 1] == c) {
        --this.t;
      }
    };
    BigInteger2.prototype.dlShiftTo = function(n, r) {
      var i;
      for (i = this.t - 1; i >= 0; --i) {
        r[i + n] = this[i];
      }
      for (i = n - 1; i >= 0; --i) {
        r[i] = 0;
      }
      r.t = this.t + n;
      r.s = this.s;
    };
    BigInteger2.prototype.drShiftTo = function(n, r) {
      for (var i = n; i < this.t; ++i) {
        r[i - n] = this[i];
      }
      r.t = Math.max(this.t - n, 0);
      r.s = this.s;
    };
    BigInteger2.prototype.lShiftTo = function(n, r) {
      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << cbs) - 1;
      var ds = Math.floor(n / this.DB);
      var c = this.s << bs & this.DM;
      for (var i = this.t - 1; i >= 0; --i) {
        r[i + ds + 1] = this[i] >> cbs | c;
        c = (this[i] & bm) << bs;
      }
      for (var i = ds - 1; i >= 0; --i) {
        r[i] = 0;
      }
      r[ds] = c;
      r.t = this.t + ds + 1;
      r.s = this.s;
      r.clamp();
    };
    BigInteger2.prototype.rShiftTo = function(n, r) {
      r.s = this.s;
      var ds = Math.floor(n / this.DB);
      if (ds >= this.t) {
        r.t = 0;
        return;
      }
      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << bs) - 1;
      r[0] = this[ds] >> bs;
      for (var i = ds + 1; i < this.t; ++i) {
        r[i - ds - 1] |= (this[i] & bm) << cbs;
        r[i - ds] = this[i] >> bs;
      }
      if (bs > 0) {
        r[this.t - ds - 1] |= (this.s & bm) << cbs;
      }
      r.t = this.t - ds;
      r.clamp();
    };
    BigInteger2.prototype.subTo = function(a, r) {
      var i = 0;
      var c = 0;
      var m = Math.min(a.t, this.t);
      while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
          c += this[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c -= a[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c < -1) {
        r[i++] = this.DV + c;
      } else if (c > 0) {
        r[i++] = c;
      }
      r.t = i;
      r.clamp();
    };
    BigInteger2.prototype.multiplyTo = function(a, r) {
      var x = this.abs();
      var y = a.abs();
      var i = x.t;
      r.t = i + y.t;
      while (--i >= 0) {
        r[i] = 0;
      }
      for (i = 0; i < y.t; ++i) {
        r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
      }
      r.s = 0;
      r.clamp();
      if (this.s != a.s) {
        BigInteger2.ZERO.subTo(r, r);
      }
    };
    BigInteger2.prototype.squareTo = function(r) {
      var x = this.abs();
      var i = r.t = 2 * x.t;
      while (--i >= 0) {
        r[i] = 0;
      }
      for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
          r[i + x.t] -= x.DV;
          r[i + x.t + 1] = 1;
        }
      }
      if (r.t > 0) {
        r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
      }
      r.s = 0;
      r.clamp();
    };
    BigInteger2.prototype.divRemTo = function(m, q, r) {
      var pm = m.abs();
      if (pm.t <= 0) {
        return;
      }
      var pt = this.abs();
      if (pt.t < pm.t) {
        if (q != null) {
          q.fromInt(0);
        }
        if (r != null) {
          this.copyTo(r);
        }
        return;
      }
      if (r == null) {
        r = nbi();
      }
      var y = nbi();
      var ts = this.s;
      var ms = m.s;
      var nsh = this.DB - nbits(pm[pm.t - 1]);
      if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
      } else {
        pm.copyTo(y);
        pt.copyTo(r);
      }
      var ys = y.t;
      var y0 = y[ys - 1];
      if (y0 == 0) {
        return;
      }
      var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
      var d1 = this.FV / yt;
      var d2 = (1 << this.F1) / yt;
      var e = 1 << this.F2;
      var i = r.t;
      var j = i - ys;
      var t = q == null ? nbi() : q;
      y.dlShiftTo(j, t);
      if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r);
      }
      BigInteger2.ONE.dlShiftTo(ys, t);
      t.subTo(y, y);
      while (y.t < ys) {
        y[y.t++] = 0;
      }
      while (--j >= 0) {
        var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
          y.dlShiftTo(j, t);
          r.subTo(t, r);
          while (r[i] < --qd) {
            r.subTo(t, r);
          }
        }
      }
      if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms) {
          BigInteger2.ZERO.subTo(q, q);
        }
      }
      r.t = ys;
      r.clamp();
      if (nsh > 0) {
        r.rShiftTo(nsh, r);
      }
      if (ts < 0) {
        BigInteger2.ZERO.subTo(r, r);
      }
    };
    BigInteger2.prototype.invDigit = function() {
      if (this.t < 1) {
        return 0;
      }
      var x = this[0];
      if ((x & 1) == 0) {
        return 0;
      }
      var y = x & 3;
      y = y * (2 - (x & 15) * y) & 15;
      y = y * (2 - (x & 255) * y) & 255;
      y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
      y = y * (2 - x * y % this.DV) % this.DV;
      return y > 0 ? this.DV - y : -y;
    };
    BigInteger2.prototype.isEven = function() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    };
    BigInteger2.prototype.exp = function(e, z) {
      if (e > 4294967295 || e < 1) {
        return BigInteger2.ONE;
      }
      var r = nbi();
      var r2 = nbi();
      var g = z.convert(this);
      var i = nbits(e) - 1;
      g.copyTo(r);
      while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & 1 << i) > 0) {
          z.mulTo(r2, g, r);
        } else {
          var t = r;
          r = r2;
          r2 = t;
        }
      }
      return z.revert(r);
    };
    BigInteger2.prototype.chunkSize = function(r) {
      return Math.floor(Math.LN2 * this.DB / Math.log(r));
    };
    BigInteger2.prototype.toRadix = function(b) {
      if (b == null) {
        b = 10;
      }
      if (this.signum() == 0 || b < 2 || b > 36) {
        return "0";
      }
      var cs = this.chunkSize(b);
      var a = Math.pow(b, cs);
      var d = nbv(a);
      var y = nbi();
      var z = nbi();
      var r = "";
      this.divRemTo(d, y, z);
      while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z);
      }
      return z.intValue().toString(b) + r;
    };
    BigInteger2.prototype.fromRadix = function(s, b) {
      this.fromInt(0);
      if (b == null) {
        b = 10;
      }
      var cs = this.chunkSize(b);
      var d = Math.pow(b, cs);
      var mi = false;
      var j = 0;
      var w = 0;
      for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-" && this.signum() == 0) {
            mi = true;
          }
          continue;
        }
        w = b * w + x;
        if (++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w, 0);
          j = 0;
          w = 0;
        }
      }
      if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0);
      }
      if (mi) {
        BigInteger2.ZERO.subTo(this, this);
      }
    };
    BigInteger2.prototype.fromNumber = function(a, b, c) {
      if ("number" == typeof b) {
        if (a < 2) {
          this.fromInt(1);
        } else {
          this.fromNumber(a, c);
          if (!this.testBit(a - 1)) {
            this.bitwiseTo(BigInteger2.ONE.shiftLeft(a - 1), op_or, this);
          }
          if (this.isEven()) {
            this.dAddOffset(1, 0);
          }
          while (!this.isProbablePrime(b)) {
            this.dAddOffset(2, 0);
            if (this.bitLength() > a) {
              this.subTo(BigInteger2.ONE.shiftLeft(a - 1), this);
            }
          }
        }
      } else {
        var x = [];
        var t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0) {
          x[0] &= (1 << t) - 1;
        } else {
          x[0] = 0;
        }
        this.fromString(x, 256);
      }
    };
    BigInteger2.prototype.bitwiseTo = function(a, op, r) {
      var i;
      var f;
      var m = Math.min(a.t, this.t);
      for (i = 0; i < m; ++i) {
        r[i] = op(this[i], a[i]);
      }
      if (a.t < this.t) {
        f = a.s & this.DM;
        for (i = m; i < this.t; ++i) {
          r[i] = op(this[i], f);
        }
        r.t = this.t;
      } else {
        f = this.s & this.DM;
        for (i = m; i < a.t; ++i) {
          r[i] = op(f, a[i]);
        }
        r.t = a.t;
      }
      r.s = op(this.s, a.s);
      r.clamp();
    };
    BigInteger2.prototype.changeBit = function(n, op) {
      var r = BigInteger2.ONE.shiftLeft(n);
      this.bitwiseTo(r, op, r);
      return r;
    };
    BigInteger2.prototype.addTo = function(a, r) {
      var i = 0;
      var c = 0;
      var m = Math.min(a.t, this.t);
      while (i < m) {
        c += this[i] + a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
          c += this[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c += a[i];
          r[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = c < 0 ? -1 : 0;
      if (c > 0) {
        r[i++] = c;
      } else if (c < -1) {
        r[i++] = this.DV + c;
      }
      r.t = i;
      r.clamp();
    };
    BigInteger2.prototype.dMultiply = function(n) {
      this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    };
    BigInteger2.prototype.dAddOffset = function(n, w) {
      if (n == 0) {
        return;
      }
      while (this.t <= w) {
        this[this.t++] = 0;
      }
      this[w] += n;
      while (this[w] >= this.DV) {
        this[w] -= this.DV;
        if (++w >= this.t) {
          this[this.t++] = 0;
        }
        ++this[w];
      }
    };
    BigInteger2.prototype.multiplyLowerTo = function(a, n, r) {
      var i = Math.min(this.t + a.t, n);
      r.s = 0;
      r.t = i;
      while (i > 0) {
        r[--i] = 0;
      }
      for (var j = r.t - this.t; i < j; ++i) {
        r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
      }
      for (var j = Math.min(a.t, n); i < j; ++i) {
        this.am(0, a[i], r, i, 0, n - i);
      }
      r.clamp();
    };
    BigInteger2.prototype.multiplyUpperTo = function(a, n, r) {
      --n;
      var i = r.t = this.t + a.t - n;
      r.s = 0;
      while (--i >= 0) {
        r[i] = 0;
      }
      for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
        r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
      }
      r.clamp();
      r.drShiftTo(1, r);
    };
    BigInteger2.prototype.modInt = function(n) {
      if (n <= 0) {
        return 0;
      }
      var d = this.DV % n;
      var r = this.s < 0 ? n - 1 : 0;
      if (this.t > 0) {
        if (d == 0) {
          r = this[0] % n;
        } else {
          for (var i = this.t - 1; i >= 0; --i) {
            r = (d * r + this[i]) % n;
          }
        }
      }
      return r;
    };
    BigInteger2.prototype.millerRabin = function(t) {
      var n1 = this.subtract(BigInteger2.ONE);
      var k = n1.getLowestSetBit();
      if (k <= 0) {
        return false;
      }
      var r = n1.shiftRight(k);
      t = t + 1 >> 1;
      if (t > lowprimes.length) {
        t = lowprimes.length;
      }
      var a = nbi();
      for (var i = 0; i < t; ++i) {
        a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger2.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while (j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2, this);
            if (y.compareTo(BigInteger2.ONE) == 0) {
              return false;
            }
          }
          if (y.compareTo(n1) != 0) {
            return false;
          }
        }
      }
      return true;
    };
    BigInteger2.prototype.square = function() {
      var r = nbi();
      this.squareTo(r);
      return r;
    };
    BigInteger2.prototype.gcda = function(a, callback) {
      var x = this.s < 0 ? this.negate() : this.clone();
      var y = a.s < 0 ? a.negate() : a.clone();
      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }
      var i = x.getLowestSetBit();
      var g = y.getLowestSetBit();
      if (g < 0) {
        callback(x);
        return;
      }
      if (i < g) {
        g = i;
      }
      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      }
      var gcda1 = function() {
        if ((i = x.getLowestSetBit()) > 0) {
          x.rShiftTo(i, x);
        }
        if ((i = y.getLowestSetBit()) > 0) {
          y.rShiftTo(i, y);
        }
        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }
        if (!(x.signum() > 0)) {
          if (g > 0) {
            y.lShiftTo(g, y);
          }
          setTimeout(function() {
            callback(y);
          }, 0);
        } else {
          setTimeout(gcda1, 0);
        }
      };
      setTimeout(gcda1, 10);
    };
    BigInteger2.prototype.fromNumberAsync = function(a, b, c, callback) {
      if ("number" == typeof b) {
        if (a < 2) {
          this.fromInt(1);
        } else {
          this.fromNumber(a, c);
          if (!this.testBit(a - 1)) {
            this.bitwiseTo(BigInteger2.ONE.shiftLeft(a - 1), op_or, this);
          }
          if (this.isEven()) {
            this.dAddOffset(1, 0);
          }
          var bnp_1 = this;
          var bnpfn1_1 = function() {
            bnp_1.dAddOffset(2, 0);
            if (bnp_1.bitLength() > a) {
              bnp_1.subTo(BigInteger2.ONE.shiftLeft(a - 1), bnp_1);
            }
            if (bnp_1.isProbablePrime(b)) {
              setTimeout(function() {
                callback();
              }, 0);
            } else {
              setTimeout(bnpfn1_1, 0);
            }
          };
          setTimeout(bnpfn1_1, 0);
        }
      } else {
        var x = [];
        var t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0) {
          x[0] &= (1 << t) - 1;
        } else {
          x[0] = 0;
        }
        this.fromString(x, 256);
      }
    };
    return BigInteger2;
  }()
);
var NullExp = (
  /** @class */
  function() {
    function NullExp2() {
    }
    NullExp2.prototype.convert = function(x) {
      return x;
    };
    NullExp2.prototype.revert = function(x) {
      return x;
    };
    NullExp2.prototype.mulTo = function(x, y, r) {
      x.multiplyTo(y, r);
    };
    NullExp2.prototype.sqrTo = function(x, r) {
      x.squareTo(r);
    };
    return NullExp2;
  }()
);
var Classic = (
  /** @class */
  function() {
    function Classic2(m) {
      this.m = m;
    }
    Classic2.prototype.convert = function(x) {
      if (x.s < 0 || x.compareTo(this.m) >= 0) {
        return x.mod(this.m);
      } else {
        return x;
      }
    };
    Classic2.prototype.revert = function(x) {
      return x;
    };
    Classic2.prototype.reduce = function(x) {
      x.divRemTo(this.m, null, x);
    };
    Classic2.prototype.mulTo = function(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    };
    Classic2.prototype.sqrTo = function(x, r) {
      x.squareTo(r);
      this.reduce(r);
    };
    return Classic2;
  }()
);
var Montgomery = (
  /** @class */
  function() {
    function Montgomery2(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp & 32767;
      this.mph = this.mp >> 15;
      this.um = (1 << m.DB - 15) - 1;
      this.mt2 = 2 * m.t;
    }
    Montgomery2.prototype.convert = function(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t, r);
      r.divRemTo(this.m, null, r);
      if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
        this.m.subTo(r, r);
      }
      return r;
    };
    Montgomery2.prototype.revert = function(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    };
    Montgomery2.prototype.reduce = function(x) {
      while (x.t <= this.mt2) {
        x[x.t++] = 0;
      }
      for (var i = 0; i < this.m.t; ++i) {
        var j = x[i] & 32767;
        var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
        j = i + this.m.t;
        x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x[j] >= x.DV) {
          x[j] -= x.DV;
          x[++j]++;
        }
      }
      x.clamp();
      x.drShiftTo(this.m.t, x);
      if (x.compareTo(this.m) >= 0) {
        x.subTo(this.m, x);
      }
    };
    Montgomery2.prototype.mulTo = function(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    };
    Montgomery2.prototype.sqrTo = function(x, r) {
      x.squareTo(r);
      this.reduce(r);
    };
    return Montgomery2;
  }()
);
var Barrett = (
  /** @class */
  function() {
    function Barrett2(m) {
      this.m = m;
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
      this.mu = this.r2.divide(m);
    }
    Barrett2.prototype.convert = function(x) {
      if (x.s < 0 || x.t > 2 * this.m.t) {
        return x.mod(this.m);
      } else if (x.compareTo(this.m) < 0) {
        return x;
      } else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
    };
    Barrett2.prototype.revert = function(x) {
      return x;
    };
    Barrett2.prototype.reduce = function(x) {
      x.drShiftTo(this.m.t - 1, this.r2);
      if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp();
      }
      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
      while (x.compareTo(this.r2) < 0) {
        x.dAddOffset(1, this.m.t + 1);
      }
      x.subTo(this.r2, x);
      while (x.compareTo(this.m) >= 0) {
        x.subTo(this.m, x);
      }
    };
    Barrett2.prototype.mulTo = function(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    };
    Barrett2.prototype.sqrTo = function(x, r) {
      x.squareTo(r);
      this.reduce(r);
    };
    return Barrett2;
  }()
);
function nbi() {
  return new BigInteger(null);
}
function parseBigInt(str, r) {
  return new BigInteger(str, r);
}
var inBrowser = typeof navigator !== "undefined";
if (inBrowser && j_lm && navigator.appName == "Microsoft Internet Explorer") {
  BigInteger.prototype.am = function am2(i, x, w, j, c, n) {
    var xl = x & 32767;
    var xh = x >> 15;
    while (--n >= 0) {
      var l = this[i] & 32767;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 32767) << 15) + w[j] + (c & 1073741823);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 1073741823;
    }
    return c;
  };
  dbits = 30;
} else if (inBrowser && j_lm && navigator.appName != "Netscape") {
  BigInteger.prototype.am = function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 67108864);
      w[j++] = v & 67108863;
    }
    return c;
  };
  dbits = 26;
} else {
  BigInteger.prototype.am = function am3(i, x, w, j, c, n) {
    var xl = x & 16383;
    var xh = x >> 14;
    while (--n >= 0) {
      var l = this[i] & 16383;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 16383) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 268435455;
    }
    return c;
  };
  dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RC = [];
var rr;
var vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) {
  BI_RC[rr++] = vv;
}
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
  BI_RC[rr++] = vv;
}
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) {
  BI_RC[rr++] = vv;
}
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return c == null ? -1 : c;
}
function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
}
function nbits(x) {
  var r = 1;
  var t;
  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }
  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }
  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }
  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }
  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }
  return r;
}
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
var Arcfour = (
  /** @class */
  function() {
    function Arcfour2() {
      this.i = 0;
      this.j = 0;
      this.S = [];
    }
    Arcfour2.prototype.init = function(key) {
      var i;
      var j;
      var t;
      for (i = 0; i < 256; ++i) {
        this.S[i] = i;
      }
      j = 0;
      for (i = 0; i < 256; ++i) {
        j = j + this.S[i] + key[i % key.length] & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t;
      }
      this.i = 0;
      this.j = 0;
    };
    Arcfour2.prototype.next = function() {
      var t;
      this.i = this.i + 1 & 255;
      this.j = this.j + this.S[this.i] & 255;
      t = this.S[this.i];
      this.S[this.i] = this.S[this.j];
      this.S[this.j] = t;
      return this.S[t + this.S[this.i] & 255];
    };
    return Arcfour2;
  }()
);
function prng_newstate() {
  return new Arcfour();
}
var rng_psize = 256;
var rng_state;
var rng_pool = null;
var rng_pptr;
if (rng_pool == null) {
  rng_pool = [];
  rng_pptr = 0;
  var t = void 0;
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    var z = new Uint32Array(256);
    window.crypto.getRandomValues(z);
    for (t = 0; t < z.length; ++t) {
      rng_pool[rng_pptr++] = z[t] & 255;
    }
  }
  var count = 0;
  var onMouseMoveListener_1 = function(ev) {
    count = count || 0;
    if (count >= 256 || rng_pptr >= rng_psize) {
      if (window.removeEventListener) {
        window.removeEventListener("mousemove", onMouseMoveListener_1, false);
      } else if (window.detachEvent) {
        window.detachEvent("onmousemove", onMouseMoveListener_1);
      }
      return;
    }
    try {
      var mouseCoordinates = ev.x + ev.y;
      rng_pool[rng_pptr++] = mouseCoordinates & 255;
      count += 1;
    } catch (e) {
    }
  };
  if (typeof window !== "undefined") {
    if (window.addEventListener) {
      window.addEventListener("mousemove", onMouseMoveListener_1, false);
    } else if (window.attachEvent) {
      window.attachEvent("onmousemove", onMouseMoveListener_1);
    }
  }
}
function rng_get_byte() {
  if (rng_state == null) {
    rng_state = prng_newstate();
    while (rng_pptr < rng_psize) {
      var random = Math.floor(65536 * Math.random());
      rng_pool[rng_pptr++] = random & 255;
    }
    rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
      rng_pool[rng_pptr] = 0;
    }
    rng_pptr = 0;
  }
  return rng_state.next();
}
var SecureRandom = (
  /** @class */
  function() {
    function SecureRandom2() {
    }
    SecureRandom2.prototype.nextBytes = function(ba) {
      for (var i = 0; i < ba.length; ++i) {
        ba[i] = rng_get_byte();
      }
    };
    return SecureRandom2;
  }()
);
function pkcs1pad1(s, n) {
  if (n < s.length + 22) {
    console.error("Message too long for RSA");
    return null;
  }
  var len = n - s.length - 6;
  var filler = "";
  for (var f = 0; f < len; f += 2) {
    filler += "ff";
  }
  var m = "0001" + filler + "00" + s;
  return parseBigInt(m, 16);
}
function pkcs1pad2(s, n) {
  if (n < s.length + 11) {
    console.error("Message too long for RSA");
    return null;
  }
  var ba = [];
  var i = s.length - 1;
  while (i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if (c < 128) {
      ba[--n] = c;
    } else if (c > 127 && c < 2048) {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 | 192;
    } else {
      ba[--n] = c & 63 | 128;
      ba[--n] = c >> 6 & 63 | 128;
      ba[--n] = c >> 12 | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = [];
  while (n > 2) {
    x[0] = 0;
    while (x[0] == 0) {
      rng.nextBytes(x);
    }
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}
var RSAKey = (
  /** @class */
  function() {
    function RSAKey2() {
      this.n = null;
      this.e = 0;
      this.d = null;
      this.p = null;
      this.q = null;
      this.dmp1 = null;
      this.dmq1 = null;
      this.coeff = null;
    }
    RSAKey2.prototype.doPublic = function(x) {
      return x.modPowInt(this.e, this.n);
    };
    RSAKey2.prototype.doPrivate = function(x) {
      if (this.p == null || this.q == null) {
        return x.modPow(this.d, this.n);
      }
      var xp = x.mod(this.p).modPow(this.dmp1, this.p);
      var xq = x.mod(this.q).modPow(this.dmq1, this.q);
      while (xp.compareTo(xq) < 0) {
        xp = xp.add(this.p);
      }
      return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
    };
    RSAKey2.prototype.setPublic = function(N, E) {
      if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N, 16);
        this.e = parseInt(E, 16);
      } else {
        console.error("Invalid RSA public key");
      }
    };
    RSAKey2.prototype.encrypt = function(text) {
      var maxLength = this.n.bitLength() + 7 >> 3;
      var m = pkcs1pad2(text, maxLength);
      if (m == null) {
        return null;
      }
      var c = this.doPublic(m);
      if (c == null) {
        return null;
      }
      var h = c.toString(16);
      var length = h.length;
      for (var i = 0; i < maxLength * 2 - length; i++) {
        h = "0" + h;
      }
      return h;
    };
    RSAKey2.prototype.setPrivate = function(N, E, D) {
      if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N, 16);
        this.e = parseInt(E, 16);
        this.d = parseBigInt(D, 16);
      } else {
        console.error("Invalid RSA private key");
      }
    };
    RSAKey2.prototype.setPrivateEx = function(N, E, D, P, Q, DP, DQ, C) {
      if (N != null && E != null && N.length > 0 && E.length > 0) {
        this.n = parseBigInt(N, 16);
        this.e = parseInt(E, 16);
        this.d = parseBigInt(D, 16);
        this.p = parseBigInt(P, 16);
        this.q = parseBigInt(Q, 16);
        this.dmp1 = parseBigInt(DP, 16);
        this.dmq1 = parseBigInt(DQ, 16);
        this.coeff = parseBigInt(C, 16);
      } else {
        console.error("Invalid RSA private key");
      }
    };
    RSAKey2.prototype.generate = function(B, E) {
      var rng = new SecureRandom();
      var qs = B >> 1;
      this.e = parseInt(E, 16);
      var ee = new BigInteger(E, 16);
      for (; ; ) {
        for (; ; ) {
          this.p = new BigInteger(B - qs, 1, rng);
          if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) {
            break;
          }
        }
        for (; ; ) {
          this.q = new BigInteger(qs, 1, rng);
          if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) {
            break;
          }
        }
        if (this.p.compareTo(this.q) <= 0) {
          var t = this.p;
          this.p = this.q;
          this.q = t;
        }
        var p1 = this.p.subtract(BigInteger.ONE);
        var q1 = this.q.subtract(BigInteger.ONE);
        var phi = p1.multiply(q1);
        if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
          this.n = this.p.multiply(this.q);
          this.d = ee.modInverse(phi);
          this.dmp1 = this.d.mod(p1);
          this.dmq1 = this.d.mod(q1);
          this.coeff = this.q.modInverse(this.p);
          break;
        }
      }
    };
    RSAKey2.prototype.decrypt = function(ctext) {
      var c = parseBigInt(ctext, 16);
      var m = this.doPrivate(c);
      if (m == null) {
        return null;
      }
      return pkcs1unpad2(m, this.n.bitLength() + 7 >> 3);
    };
    RSAKey2.prototype.generateAsync = function(B, E, callback) {
      var rng = new SecureRandom();
      var qs = B >> 1;
      this.e = parseInt(E, 16);
      var ee = new BigInteger(E, 16);
      var rsa = this;
      var loop1 = function() {
        var loop4 = function() {
          if (rsa.p.compareTo(rsa.q) <= 0) {
            var t = rsa.p;
            rsa.p = rsa.q;
            rsa.q = t;
          }
          var p1 = rsa.p.subtract(BigInteger.ONE);
          var q1 = rsa.q.subtract(BigInteger.ONE);
          var phi = p1.multiply(q1);
          if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
            rsa.n = rsa.p.multiply(rsa.q);
            rsa.d = ee.modInverse(phi);
            rsa.dmp1 = rsa.d.mod(p1);
            rsa.dmq1 = rsa.d.mod(q1);
            rsa.coeff = rsa.q.modInverse(rsa.p);
            setTimeout(function() {
              callback();
            }, 0);
          } else {
            setTimeout(loop1, 0);
          }
        };
        var loop3 = function() {
          rsa.q = nbi();
          rsa.q.fromNumberAsync(qs, 1, rng, function() {
            rsa.q.subtract(BigInteger.ONE).gcda(ee, function(r) {
              if (r.compareTo(BigInteger.ONE) == 0 && rsa.q.isProbablePrime(10)) {
                setTimeout(loop4, 0);
              } else {
                setTimeout(loop3, 0);
              }
            });
          });
        };
        var loop2 = function() {
          rsa.p = nbi();
          rsa.p.fromNumberAsync(B - qs, 1, rng, function() {
            rsa.p.subtract(BigInteger.ONE).gcda(ee, function(r) {
              if (r.compareTo(BigInteger.ONE) == 0 && rsa.p.isProbablePrime(10)) {
                setTimeout(loop3, 0);
              } else {
                setTimeout(loop2, 0);
              }
            });
          });
        };
        setTimeout(loop2, 0);
      };
      setTimeout(loop1, 0);
    };
    RSAKey2.prototype.sign = function(text, digestMethod, digestName) {
      var header = getDigestHeader(digestName);
      var digest = header + digestMethod(text).toString();
      var m = pkcs1pad1(digest, this.n.bitLength() / 4);
      if (m == null) {
        return null;
      }
      var c = this.doPrivate(m);
      if (c == null) {
        return null;
      }
      var h = c.toString(16);
      if ((h.length & 1) == 0) {
        return h;
      } else {
        return "0" + h;
      }
    };
    RSAKey2.prototype.verify = function(text, signature, digestMethod) {
      var c = parseBigInt(signature, 16);
      var m = this.doPublic(c);
      if (m == null) {
        return null;
      }
      var unpadded = m.toString(16).replace(/^1f+00/, "");
      var digest = removeDigestHeader(unpadded);
      return digest == digestMethod(text).toString();
    };
    return RSAKey2;
  }()
);
function pkcs1unpad2(d, n) {
  var b = d.toByteArray();
  var i = 0;
  while (i < b.length && b[i] == 0) {
    ++i;
  }
  if (b.length - i != n - 1 || b[i] != 2) {
    return null;
  }
  ++i;
  while (b[i] != 0) {
    if (++i >= b.length) {
      return null;
    }
  }
  var ret = "";
  while (++i < b.length) {
    var c = b[i] & 255;
    if (c < 128) {
      ret += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      ret += String.fromCharCode((c & 31) << 6 | b[i + 1] & 63);
      ++i;
    } else {
      ret += String.fromCharCode((c & 15) << 12 | (b[i + 1] & 63) << 6 | b[i + 2] & 63);
      i += 2;
    }
  }
  return ret;
}
var DIGEST_HEADERS = {
  md2: "3020300c06082a864886f70d020205000410",
  md5: "3020300c06082a864886f70d020505000410",
  sha1: "3021300906052b0e03021a05000414",
  sha224: "302d300d06096086480165030402040500041c",
  sha256: "3031300d060960864801650304020105000420",
  sha384: "3041300d060960864801650304020205000430",
  sha512: "3051300d060960864801650304020305000440",
  ripemd160: "3021300906052b2403020105000414"
};
function getDigestHeader(name) {
  return DIGEST_HEADERS[name] || "";
}
function removeDigestHeader(str) {
  for (var name_1 in DIGEST_HEADERS) {
    if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
      var header = DIGEST_HEADERS[name_1];
      var len = header.length;
      if (str.substr(0, len) == header) {
        return str.substr(len);
      }
    }
  }
  return str;
}
/*!
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
var YAHOO = {};
YAHOO.lang = {
  /**
   * Utility to set up the prototype, constructor and superclass properties to
   * support an inheritance strategy that can chain constructors and methods.
   * Static members will not be inherited.
   *
   * @method extend
   * @static
   * @param {Function} subc   the object to modify
   * @param {Function} superc the object to inherit
   * @param {Object} overrides  additional properties/methods to add to the
   *                              subclass prototype.  These will override the
   *                              matching items obtained from the superclass
   *                              if present.
   */
  extend: function(subc, superc, overrides) {
    if (!superc || !subc) {
      throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
    }
    var F = function() {
    };
    F.prototype = superc.prototype;
    subc.prototype = new F();
    subc.prototype.constructor = subc;
    subc.superclass = superc.prototype;
    if (superc.prototype.constructor == Object.prototype.constructor) {
      superc.prototype.constructor = superc;
    }
    if (overrides) {
      var i;
      for (i in overrides) {
        subc.prototype[i] = overrides[i];
      }
      var _IEEnumFix = function() {
      }, ADD = ["toString", "valueOf"];
      try {
        if (/MSIE/.test(navigator.userAgent)) {
          _IEEnumFix = function(r, s) {
            for (i = 0; i < ADD.length; i = i + 1) {
              var fname = ADD[i], f = s[fname];
              if (typeof f === "function" && f != Object.prototype[fname]) {
                r[fname] = f;
              }
            }
          };
        }
      } catch (ex) {
      }
      _IEEnumFix(subc.prototype, overrides);
    }
  }
};
/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.13 (2017-Jun-02)
 * @since jsrsasign 2.1
 * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
 */
var KJUR = {};
if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1)
  KJUR.asn1 = {};
KJUR.asn1.ASN1Util = new function() {
  this.integerToByteHex = function(i) {
    var h = i.toString(16);
    if (h.length % 2 == 1)
      h = "0" + h;
    return h;
  };
  this.bigIntToMinTwosComplementsHex = function(bigIntegerValue) {
    var h = bigIntegerValue.toString(16);
    if (h.substr(0, 1) != "-") {
      if (h.length % 2 == 1) {
        h = "0" + h;
      } else {
        if (!h.match(/^[0-7]/)) {
          h = "00" + h;
        }
      }
    } else {
      var hPos = h.substr(1);
      var xorLen = hPos.length;
      if (xorLen % 2 == 1) {
        xorLen += 1;
      } else {
        if (!h.match(/^[0-7]/)) {
          xorLen += 2;
        }
      }
      var hMask = "";
      for (var i = 0; i < xorLen; i++) {
        hMask += "f";
      }
      var biMask = new BigInteger(hMask, 16);
      var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
      h = biNeg.toString(16).replace(/^-/, "");
    }
    return h;
  };
  this.getPEMStringFromHex = function(dataHex, pemHeader) {
    return hextopem(dataHex, pemHeader);
  };
  this.newObject = function(param) {
    var _KJUR = KJUR, _KJUR_asn1 = _KJUR.asn1, _DERBoolean = _KJUR_asn1.DERBoolean, _DERInteger = _KJUR_asn1.DERInteger, _DERBitString = _KJUR_asn1.DERBitString, _DEROctetString = _KJUR_asn1.DEROctetString, _DERNull = _KJUR_asn1.DERNull, _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier, _DEREnumerated = _KJUR_asn1.DEREnumerated, _DERUTF8String = _KJUR_asn1.DERUTF8String, _DERNumericString = _KJUR_asn1.DERNumericString, _DERPrintableString = _KJUR_asn1.DERPrintableString, _DERTeletexString = _KJUR_asn1.DERTeletexString, _DERIA5String = _KJUR_asn1.DERIA5String, _DERUTCTime = _KJUR_asn1.DERUTCTime, _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime, _DERSequence = _KJUR_asn1.DERSequence, _DERSet = _KJUR_asn1.DERSet, _DERTaggedObject = _KJUR_asn1.DERTaggedObject, _newObject = _KJUR_asn1.ASN1Util.newObject;
    var keys = Object.keys(param);
    if (keys.length != 1)
      throw "key of param shall be only one.";
    var key = keys[0];
    if (":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
      throw "undefined key: " + key;
    if (key == "bool")
      return new _DERBoolean(param[key]);
    if (key == "int")
      return new _DERInteger(param[key]);
    if (key == "bitstr")
      return new _DERBitString(param[key]);
    if (key == "octstr")
      return new _DEROctetString(param[key]);
    if (key == "null")
      return new _DERNull(param[key]);
    if (key == "oid")
      return new _DERObjectIdentifier(param[key]);
    if (key == "enum")
      return new _DEREnumerated(param[key]);
    if (key == "utf8str")
      return new _DERUTF8String(param[key]);
    if (key == "numstr")
      return new _DERNumericString(param[key]);
    if (key == "prnstr")
      return new _DERPrintableString(param[key]);
    if (key == "telstr")
      return new _DERTeletexString(param[key]);
    if (key == "ia5str")
      return new _DERIA5String(param[key]);
    if (key == "utctime")
      return new _DERUTCTime(param[key]);
    if (key == "gentime")
      return new _DERGeneralizedTime(param[key]);
    if (key == "seq") {
      var paramList = param[key];
      var a = [];
      for (var i = 0; i < paramList.length; i++) {
        var asn1Obj = _newObject(paramList[i]);
        a.push(asn1Obj);
      }
      return new _DERSequence({ "array": a });
    }
    if (key == "set") {
      var paramList = param[key];
      var a = [];
      for (var i = 0; i < paramList.length; i++) {
        var asn1Obj = _newObject(paramList[i]);
        a.push(asn1Obj);
      }
      return new _DERSet({ "array": a });
    }
    if (key == "tag") {
      var tagParam = param[key];
      if (Object.prototype.toString.call(tagParam) === "[object Array]" && tagParam.length == 3) {
        var obj = _newObject(tagParam[2]);
        return new _DERTaggedObject({
          tag: tagParam[0],
          explicit: tagParam[1],
          obj
        });
      } else {
        var newParam = {};
        if (tagParam.explicit !== void 0)
          newParam.explicit = tagParam.explicit;
        if (tagParam.tag !== void 0)
          newParam.tag = tagParam.tag;
        if (tagParam.obj === void 0)
          throw "obj shall be specified for 'tag'.";
        newParam.obj = _newObject(tagParam.obj);
        return new _DERTaggedObject(newParam);
      }
    }
  };
  this.jsonToASN1HEX = function(param) {
    var asn1Obj = this.newObject(param);
    return asn1Obj.getEncodedHex();
  };
}();
KJUR.asn1.ASN1Util.oidHexToInt = function(hex) {
  var s = "";
  var i01 = parseInt(hex.substr(0, 2), 16);
  var i0 = Math.floor(i01 / 40);
  var i1 = i01 % 40;
  var s = i0 + "." + i1;
  var binbuf = "";
  for (var i = 2; i < hex.length; i += 2) {
    var value = parseInt(hex.substr(i, 2), 16);
    var bin = ("00000000" + value.toString(2)).slice(-8);
    binbuf = binbuf + bin.substr(1, 7);
    if (bin.substr(0, 1) == "0") {
      var bi = new BigInteger(binbuf, 2);
      s = s + "." + bi.toString(10);
      binbuf = "";
    }
  }
  return s;
};
KJUR.asn1.ASN1Util.oidIntToHex = function(oidString) {
  var itox = function(i2) {
    var h2 = i2.toString(16);
    if (h2.length == 1)
      h2 = "0" + h2;
    return h2;
  };
  var roidtox = function(roid) {
    var h2 = "";
    var bi = new BigInteger(roid, 10);
    var b = bi.toString(2);
    var padLen = 7 - b.length % 7;
    if (padLen == 7)
      padLen = 0;
    var bPad = "";
    for (var i2 = 0; i2 < padLen; i2++)
      bPad += "0";
    b = bPad + b;
    for (var i2 = 0; i2 < b.length - 1; i2 += 7) {
      var b8 = b.substr(i2, 7);
      if (i2 != b.length - 7)
        b8 = "1" + b8;
      h2 += itox(parseInt(b8, 2));
    }
    return h2;
  };
  if (!oidString.match(/^[0-9.]+$/)) {
    throw "malformed oid string: " + oidString;
  }
  var h = "";
  var a = oidString.split(".");
  var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
  h += itox(i0);
  a.splice(0, 2);
  for (var i = 0; i < a.length; i++) {
    h += roidtox(a[i]);
  }
  return h;
};
KJUR.asn1.ASN1Object = function() {
  var hV = "";
  this.getLengthHexFromValue = function() {
    if (typeof this.hV == "undefined" || this.hV == null) {
      throw "this.hV is null or undefined.";
    }
    if (this.hV.length % 2 == 1) {
      throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
    }
    var n = this.hV.length / 2;
    var hN = n.toString(16);
    if (hN.length % 2 == 1) {
      hN = "0" + hN;
    }
    if (n < 128) {
      return hN;
    } else {
      var hNlen = hN.length / 2;
      if (hNlen > 15) {
        throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
      }
      var head = 128 + hNlen;
      return head.toString(16) + hN;
    }
  };
  this.getEncodedHex = function() {
    if (this.hTLV == null || this.isModified) {
      this.hV = this.getFreshValueHex();
      this.hL = this.getLengthHexFromValue();
      this.hTLV = this.hT + this.hL + this.hV;
      this.isModified = false;
    }
    return this.hTLV;
  };
  this.getValueHex = function() {
    this.getEncodedHex();
    return this.hV;
  };
  this.getFreshValueHex = function() {
    return "";
  };
};
KJUR.asn1.DERAbstractString = function(params) {
  KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
  this.getString = function() {
    return this.s;
  };
  this.setString = function(newS) {
    this.hTLV = null;
    this.isModified = true;
    this.s = newS;
    this.hV = stohex(this.s);
  };
  this.setStringHex = function(newHexString) {
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = newHexString;
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params == "string") {
      this.setString(params);
    } else if (typeof params["str"] != "undefined") {
      this.setString(params["str"]);
    } else if (typeof params["hex"] != "undefined") {
      this.setStringHex(params["hex"]);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
KJUR.asn1.DERAbstractTime = function(params) {
  KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);
  this.localDateToUTC = function(d) {
    utc = d.getTime() + d.getTimezoneOffset() * 6e4;
    var utcDate = new Date(utc);
    return utcDate;
  };
  this.formatDate = function(dateObject, type, withMillis) {
    var pad = this.zeroPadding;
    var d = this.localDateToUTC(dateObject);
    var year = String(d.getFullYear());
    if (type == "utc")
      year = year.substr(2, 2);
    var month = pad(String(d.getMonth() + 1), 2);
    var day = pad(String(d.getDate()), 2);
    var hour = pad(String(d.getHours()), 2);
    var min = pad(String(d.getMinutes()), 2);
    var sec = pad(String(d.getSeconds()), 2);
    var s = year + month + day + hour + min + sec;
    if (withMillis === true) {
      var millis = d.getMilliseconds();
      if (millis != 0) {
        var sMillis = pad(String(millis), 3);
        sMillis = sMillis.replace(/[0]+$/, "");
        s = s + "." + sMillis;
      }
    }
    return s + "Z";
  };
  this.zeroPadding = function(s, len) {
    if (s.length >= len)
      return s;
    return new Array(len - s.length + 1).join("0") + s;
  };
  this.getString = function() {
    return this.s;
  };
  this.setString = function(newS) {
    this.hTLV = null;
    this.isModified = true;
    this.s = newS;
    this.hV = stohex(newS);
  };
  this.setByDateValue = function(year, month, day, hour, min, sec) {
    var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
    this.setByDate(dateObject);
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
KJUR.asn1.DERAbstractStructured = function(params) {
  KJUR.asn1.DERAbstractString.superclass.constructor.call(this);
  this.setByASN1ObjectArray = function(asn1ObjectArray) {
    this.hTLV = null;
    this.isModified = true;
    this.asn1Array = asn1ObjectArray;
  };
  this.appendASN1Object = function(asn1Object) {
    this.hTLV = null;
    this.isModified = true;
    this.asn1Array.push(asn1Object);
  };
  this.asn1Array = new Array();
  if (typeof params != "undefined") {
    if (typeof params["array"] != "undefined") {
      this.asn1Array = params["array"];
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);
KJUR.asn1.DERBoolean = function() {
  KJUR.asn1.DERBoolean.superclass.constructor.call(this);
  this.hT = "01";
  this.hTLV = "0101ff";
};
YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);
KJUR.asn1.DERInteger = function(params) {
  KJUR.asn1.DERInteger.superclass.constructor.call(this);
  this.hT = "02";
  this.setByBigInteger = function(bigIntegerValue) {
    this.hTLV = null;
    this.isModified = true;
    this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
  };
  this.setByInteger = function(intValue) {
    var bi = new BigInteger(String(intValue), 10);
    this.setByBigInteger(bi);
  };
  this.setValueHex = function(newHexString) {
    this.hV = newHexString;
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params["bigint"] != "undefined") {
      this.setByBigInteger(params["bigint"]);
    } else if (typeof params["int"] != "undefined") {
      this.setByInteger(params["int"]);
    } else if (typeof params == "number") {
      this.setByInteger(params);
    } else if (typeof params["hex"] != "undefined") {
      this.setValueHex(params["hex"]);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);
KJUR.asn1.DERBitString = function(params) {
  if (params !== void 0 && typeof params.obj !== "undefined") {
    var o = KJUR.asn1.ASN1Util.newObject(params.obj);
    params.hex = "00" + o.getEncodedHex();
  }
  KJUR.asn1.DERBitString.superclass.constructor.call(this);
  this.hT = "03";
  this.setHexValueIncludingUnusedBits = function(newHexStringIncludingUnusedBits) {
    this.hTLV = null;
    this.isModified = true;
    this.hV = newHexStringIncludingUnusedBits;
  };
  this.setUnusedBitsAndHexValue = function(unusedBits, hValue) {
    if (unusedBits < 0 || 7 < unusedBits) {
      throw "unused bits shall be from 0 to 7: u = " + unusedBits;
    }
    var hUnusedBits = "0" + unusedBits;
    this.hTLV = null;
    this.isModified = true;
    this.hV = hUnusedBits + hValue;
  };
  this.setByBinaryString = function(binaryString) {
    binaryString = binaryString.replace(/0+$/, "");
    var unusedBits = 8 - binaryString.length % 8;
    if (unusedBits == 8)
      unusedBits = 0;
    for (var i = 0; i <= unusedBits; i++) {
      binaryString += "0";
    }
    var h = "";
    for (var i = 0; i < binaryString.length - 1; i += 8) {
      var b = binaryString.substr(i, 8);
      var x = parseInt(b, 2).toString(16);
      if (x.length == 1)
        x = "0" + x;
      h += x;
    }
    this.hTLV = null;
    this.isModified = true;
    this.hV = "0" + unusedBits + h;
  };
  this.setByBooleanArray = function(booleanArray) {
    var s = "";
    for (var i = 0; i < booleanArray.length; i++) {
      if (booleanArray[i] == true) {
        s += "1";
      } else {
        s += "0";
      }
    }
    this.setByBinaryString(s);
  };
  this.newFalseArray = function(nLength) {
    var a = new Array(nLength);
    for (var i = 0; i < nLength; i++) {
      a[i] = false;
    }
    return a;
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
      this.setHexValueIncludingUnusedBits(params);
    } else if (typeof params["hex"] != "undefined") {
      this.setHexValueIncludingUnusedBits(params["hex"]);
    } else if (typeof params["bin"] != "undefined") {
      this.setByBinaryString(params["bin"]);
    } else if (typeof params["array"] != "undefined") {
      this.setByBooleanArray(params["array"]);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);
KJUR.asn1.DEROctetString = function(params) {
  if (params !== void 0 && typeof params.obj !== "undefined") {
    var o = KJUR.asn1.ASN1Util.newObject(params.obj);
    params.hex = o.getEncodedHex();
  }
  KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
  this.hT = "04";
};
YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERNull = function() {
  KJUR.asn1.DERNull.superclass.constructor.call(this);
  this.hT = "05";
  this.hTLV = "0500";
};
YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);
KJUR.asn1.DERObjectIdentifier = function(params) {
  var itox = function(i) {
    var h = i.toString(16);
    if (h.length == 1)
      h = "0" + h;
    return h;
  };
  var roidtox = function(roid) {
    var h = "";
    var bi = new BigInteger(roid, 10);
    var b = bi.toString(2);
    var padLen = 7 - b.length % 7;
    if (padLen == 7)
      padLen = 0;
    var bPad = "";
    for (var i = 0; i < padLen; i++)
      bPad += "0";
    b = bPad + b;
    for (var i = 0; i < b.length - 1; i += 7) {
      var b8 = b.substr(i, 7);
      if (i != b.length - 7)
        b8 = "1" + b8;
      h += itox(parseInt(b8, 2));
    }
    return h;
  };
  KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
  this.hT = "06";
  this.setValueHex = function(newHexString) {
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = newHexString;
  };
  this.setValueOidString = function(oidString) {
    if (!oidString.match(/^[0-9.]+$/)) {
      throw "malformed oid string: " + oidString;
    }
    var h = "";
    var a = oidString.split(".");
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
      h += roidtox(a[i]);
    }
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = h;
  };
  this.setValueName = function(oidName) {
    var oid = KJUR.asn1.x509.OID.name2oid(oidName);
    if (oid !== "") {
      this.setValueOidString(oid);
    } else {
      throw "DERObjectIdentifier oidName undefined: " + oidName;
    }
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (params !== void 0) {
    if (typeof params === "string") {
      if (params.match(/^[0-2].[0-9.]+$/)) {
        this.setValueOidString(params);
      } else {
        this.setValueName(params);
      }
    } else if (params.oid !== void 0) {
      this.setValueOidString(params.oid);
    } else if (params.hex !== void 0) {
      this.setValueHex(params.hex);
    } else if (params.name !== void 0) {
      this.setValueName(params.name);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);
KJUR.asn1.DEREnumerated = function(params) {
  KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
  this.hT = "0a";
  this.setByBigInteger = function(bigIntegerValue) {
    this.hTLV = null;
    this.isModified = true;
    this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
  };
  this.setByInteger = function(intValue) {
    var bi = new BigInteger(String(intValue), 10);
    this.setByBigInteger(bi);
  };
  this.setValueHex = function(newHexString) {
    this.hV = newHexString;
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params["int"] != "undefined") {
      this.setByInteger(params["int"]);
    } else if (typeof params == "number") {
      this.setByInteger(params);
    } else if (typeof params["hex"] != "undefined") {
      this.setValueHex(params["hex"]);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);
KJUR.asn1.DERUTF8String = function(params) {
  KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
  this.hT = "0c";
};
YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERNumericString = function(params) {
  KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
  this.hT = "12";
};
YAHOO.lang.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERPrintableString = function(params) {
  KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
  this.hT = "13";
};
YAHOO.lang.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERTeletexString = function(params) {
  KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
  this.hT = "14";
};
YAHOO.lang.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERIA5String = function(params) {
  KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
  this.hT = "16";
};
YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);
KJUR.asn1.DERUTCTime = function(params) {
  KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
  this.hT = "17";
  this.setByDate = function(dateObject) {
    this.hTLV = null;
    this.isModified = true;
    this.date = dateObject;
    this.s = this.formatDate(this.date, "utc");
    this.hV = stohex(this.s);
  };
  this.getFreshValueHex = function() {
    if (typeof this.date == "undefined" && typeof this.s == "undefined") {
      this.date = /* @__PURE__ */ new Date();
      this.s = this.formatDate(this.date, "utc");
      this.hV = stohex(this.s);
    }
    return this.hV;
  };
  if (params !== void 0) {
    if (params.str !== void 0) {
      this.setString(params.str);
    } else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
      this.setString(params);
    } else if (params.hex !== void 0) {
      this.setStringHex(params.hex);
    } else if (params.date !== void 0) {
      this.setByDate(params.date);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);
KJUR.asn1.DERGeneralizedTime = function(params) {
  KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
  this.hT = "18";
  this.withMillis = false;
  this.setByDate = function(dateObject) {
    this.hTLV = null;
    this.isModified = true;
    this.date = dateObject;
    this.s = this.formatDate(this.date, "gen", this.withMillis);
    this.hV = stohex(this.s);
  };
  this.getFreshValueHex = function() {
    if (this.date === void 0 && this.s === void 0) {
      this.date = /* @__PURE__ */ new Date();
      this.s = this.formatDate(this.date, "gen", this.withMillis);
      this.hV = stohex(this.s);
    }
    return this.hV;
  };
  if (params !== void 0) {
    if (params.str !== void 0) {
      this.setString(params.str);
    } else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
      this.setString(params);
    } else if (params.hex !== void 0) {
      this.setStringHex(params.hex);
    } else if (params.date !== void 0) {
      this.setByDate(params.date);
    }
    if (params.millis === true) {
      this.withMillis = true;
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);
KJUR.asn1.DERSequence = function(params) {
  KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
  this.hT = "30";
  this.getFreshValueHex = function() {
    var h = "";
    for (var i = 0; i < this.asn1Array.length; i++) {
      var asn1Obj = this.asn1Array[i];
      h += asn1Obj.getEncodedHex();
    }
    this.hV = h;
    return this.hV;
  };
};
YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);
KJUR.asn1.DERSet = function(params) {
  KJUR.asn1.DERSet.superclass.constructor.call(this, params);
  this.hT = "31";
  this.sortFlag = true;
  this.getFreshValueHex = function() {
    var a = new Array();
    for (var i = 0; i < this.asn1Array.length; i++) {
      var asn1Obj = this.asn1Array[i];
      a.push(asn1Obj.getEncodedHex());
    }
    if (this.sortFlag == true)
      a.sort();
    this.hV = a.join("");
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params.sortflag != "undefined" && params.sortflag == false)
      this.sortFlag = false;
  }
};
YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);
KJUR.asn1.DERTaggedObject = function(params) {
  KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
  this.hT = "a0";
  this.hV = "";
  this.isExplicit = true;
  this.asn1Object = null;
  this.setASN1Object = function(isExplicitFlag, tagNoHex, asn1Object) {
    this.hT = tagNoHex;
    this.isExplicit = isExplicitFlag;
    this.asn1Object = asn1Object;
    if (this.isExplicit) {
      this.hV = this.asn1Object.getEncodedHex();
      this.hTLV = null;
      this.isModified = true;
    } else {
      this.hV = null;
      this.hTLV = asn1Object.getEncodedHex();
      this.hTLV = this.hTLV.replace(/^../, tagNoHex);
      this.isModified = false;
    }
  };
  this.getFreshValueHex = function() {
    return this.hV;
  };
  if (typeof params != "undefined") {
    if (typeof params["tag"] != "undefined") {
      this.hT = params["tag"];
    }
    if (typeof params["explicit"] != "undefined") {
      this.isExplicit = params["explicit"];
    }
    if (typeof params["obj"] != "undefined") {
      this.asn1Object = params["obj"];
      this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
    }
  }
};
YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);
var __extends = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var JSEncryptRSAKey = (
  /** @class */
  function(_super) {
    __extends(JSEncryptRSAKey2, _super);
    function JSEncryptRSAKey2(key) {
      var _this = _super.call(this) || this;
      if (key) {
        if (typeof key === "string") {
          _this.parseKey(key);
        } else if (JSEncryptRSAKey2.hasPrivateKeyProperty(key) || JSEncryptRSAKey2.hasPublicKeyProperty(key)) {
          _this.parsePropertiesFrom(key);
        }
      }
      return _this;
    }
    JSEncryptRSAKey2.prototype.parseKey = function(pem) {
      try {
        var modulus = 0;
        var public_exponent = 0;
        var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
        var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
        var asn1 = ASN1.decode(der);
        if (asn1.sub.length === 3) {
          asn1 = asn1.sub[2].sub[0];
        }
        if (asn1.sub.length === 9) {
          modulus = asn1.sub[1].getHexStringValue();
          this.n = parseBigInt(modulus, 16);
          public_exponent = asn1.sub[2].getHexStringValue();
          this.e = parseInt(public_exponent, 16);
          var private_exponent = asn1.sub[3].getHexStringValue();
          this.d = parseBigInt(private_exponent, 16);
          var prime1 = asn1.sub[4].getHexStringValue();
          this.p = parseBigInt(prime1, 16);
          var prime2 = asn1.sub[5].getHexStringValue();
          this.q = parseBigInt(prime2, 16);
          var exponent1 = asn1.sub[6].getHexStringValue();
          this.dmp1 = parseBigInt(exponent1, 16);
          var exponent2 = asn1.sub[7].getHexStringValue();
          this.dmq1 = parseBigInt(exponent2, 16);
          var coefficient = asn1.sub[8].getHexStringValue();
          this.coeff = parseBigInt(coefficient, 16);
        } else if (asn1.sub.length === 2) {
          if (asn1.sub[0].sub) {
            var bit_string = asn1.sub[1];
            var sequence = bit_string.sub[0];
            modulus = sequence.sub[0].getHexStringValue();
            this.n = parseBigInt(modulus, 16);
            public_exponent = sequence.sub[1].getHexStringValue();
            this.e = parseInt(public_exponent, 16);
          } else {
            modulus = asn1.sub[0].getHexStringValue();
            this.n = parseBigInt(modulus, 16);
            public_exponent = asn1.sub[1].getHexStringValue();
            this.e = parseInt(public_exponent, 16);
          }
        } else {
          return false;
        }
        return true;
      } catch (ex) {
        return false;
      }
    };
    JSEncryptRSAKey2.prototype.getPrivateBaseKey = function() {
      var options = {
        array: [
          new KJUR.asn1.DERInteger({ int: 0 }),
          new KJUR.asn1.DERInteger({ bigint: this.n }),
          new KJUR.asn1.DERInteger({ int: this.e }),
          new KJUR.asn1.DERInteger({ bigint: this.d }),
          new KJUR.asn1.DERInteger({ bigint: this.p }),
          new KJUR.asn1.DERInteger({ bigint: this.q }),
          new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
          new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
          new KJUR.asn1.DERInteger({ bigint: this.coeff })
        ]
      };
      var seq = new KJUR.asn1.DERSequence(options);
      return seq.getEncodedHex();
    };
    JSEncryptRSAKey2.prototype.getPrivateBaseKeyB64 = function() {
      return hex2b64(this.getPrivateBaseKey());
    };
    JSEncryptRSAKey2.prototype.getPublicBaseKey = function() {
      var first_sequence = new KJUR.asn1.DERSequence({
        array: [
          new KJUR.asn1.DERObjectIdentifier({ oid: "1.2.840.113549.1.1.1" }),
          new KJUR.asn1.DERNull()
        ]
      });
      var second_sequence = new KJUR.asn1.DERSequence({
        array: [
          new KJUR.asn1.DERInteger({ bigint: this.n }),
          new KJUR.asn1.DERInteger({ int: this.e })
        ]
      });
      var bit_string = new KJUR.asn1.DERBitString({
        hex: "00" + second_sequence.getEncodedHex()
      });
      var seq = new KJUR.asn1.DERSequence({
        array: [first_sequence, bit_string]
      });
      return seq.getEncodedHex();
    };
    JSEncryptRSAKey2.prototype.getPublicBaseKeyB64 = function() {
      return hex2b64(this.getPublicBaseKey());
    };
    JSEncryptRSAKey2.wordwrap = function(str, width) {
      width = width || 64;
      if (!str) {
        return str;
      }
      var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
      return str.match(RegExp(regex, "g")).join("\n");
    };
    JSEncryptRSAKey2.prototype.getPrivateKey = function() {
      var key = "-----BEGIN RSA PRIVATE KEY-----\n";
      key += JSEncryptRSAKey2.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
      key += "-----END RSA PRIVATE KEY-----";
      return key;
    };
    JSEncryptRSAKey2.prototype.getPublicKey = function() {
      var key = "-----BEGIN PUBLIC KEY-----\n";
      key += JSEncryptRSAKey2.wordwrap(this.getPublicBaseKeyB64()) + "\n";
      key += "-----END PUBLIC KEY-----";
      return key;
    };
    JSEncryptRSAKey2.hasPublicKeyProperty = function(obj) {
      obj = obj || {};
      return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
    };
    JSEncryptRSAKey2.hasPrivateKeyProperty = function(obj) {
      obj = obj || {};
      return obj.hasOwnProperty("n") && obj.hasOwnProperty("e") && obj.hasOwnProperty("d") && obj.hasOwnProperty("p") && obj.hasOwnProperty("q") && obj.hasOwnProperty("dmp1") && obj.hasOwnProperty("dmq1") && obj.hasOwnProperty("coeff");
    };
    JSEncryptRSAKey2.prototype.parsePropertiesFrom = function(obj) {
      this.n = obj.n;
      this.e = obj.e;
      if (obj.hasOwnProperty("d")) {
        this.d = obj.d;
        this.p = obj.p;
        this.q = obj.q;
        this.dmp1 = obj.dmp1;
        this.dmq1 = obj.dmq1;
        this.coeff = obj.coeff;
      }
    };
    return JSEncryptRSAKey2;
  }(RSAKey)
);
var _a;
var version = typeof process !== "undefined" ? (_a = process.env) === null || _a === void 0 ? void 0 : _a.npm_package_version : void 0;
var JSEncrypt = (
  /** @class */
  function() {
    function JSEncrypt2(options) {
      if (options === void 0) {
        options = {};
      }
      options = options || {};
      this.default_key_size = options.default_key_size ? parseInt(options.default_key_size, 10) : 1024;
      this.default_public_exponent = options.default_public_exponent || "010001";
      this.log = options.log || false;
      this.key = null;
    }
    JSEncrypt2.prototype.setKey = function(key) {
      if (this.log && this.key) {
        console.warn("A key was already set, overriding existing.");
      }
      this.key = new JSEncryptRSAKey(key);
    };
    JSEncrypt2.prototype.setPrivateKey = function(privkey) {
      this.setKey(privkey);
    };
    JSEncrypt2.prototype.setPublicKey = function(pubkey) {
      this.setKey(pubkey);
    };
    JSEncrypt2.prototype.decrypt = function(str) {
      try {
        return this.getKey().decrypt(b64tohex(str));
      } catch (ex) {
        return false;
      }
    };
    JSEncrypt2.prototype.encrypt = function(str) {
      try {
        return hex2b64(this.getKey().encrypt(str));
      } catch (ex) {
        return false;
      }
    };
    JSEncrypt2.prototype.sign = function(str, digestMethod, digestName) {
      try {
        return hex2b64(this.getKey().sign(str, digestMethod, digestName));
      } catch (ex) {
        return false;
      }
    };
    JSEncrypt2.prototype.verify = function(str, signature, digestMethod) {
      try {
        return this.getKey().verify(str, b64tohex(signature), digestMethod);
      } catch (ex) {
        return false;
      }
    };
    JSEncrypt2.prototype.getKey = function(cb) {
      if (!this.key) {
        this.key = new JSEncryptRSAKey();
        if (cb && {}.toString.call(cb) === "[object Function]") {
          this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
          return;
        }
        this.key.generate(this.default_key_size, this.default_public_exponent);
      }
      return this.key;
    };
    JSEncrypt2.prototype.getPrivateKey = function() {
      return this.getKey().getPrivateKey();
    };
    JSEncrypt2.prototype.getPrivateKeyB64 = function() {
      return this.getKey().getPrivateBaseKeyB64();
    };
    JSEncrypt2.prototype.getPublicKey = function() {
      return this.getKey().getPublicKey();
    };
    JSEncrypt2.prototype.getPublicKeyB64 = function() {
      return this.getKey().getPublicBaseKeyB64();
    };
    JSEncrypt2.version = version;
    return JSEncrypt2;
  }()
);
const rsaEncrypt = (publicKey, message) => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  return jsEncrypt.encrypt(message);
};
const generateAESKeyAndIV = () => {
  const key = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  return { key, iv };
};
const encryptWithAES = ({ key, iv }, message) => {
  const encrypted = CryptoJS.AES.encrypt(message, key, { iv });
  return encrypted.toString();
};
const encryptMessage = (rsaPublicKey, message) => {
  const { key, iv } = generateAESKeyAndIV();
  const keyString = key.toString();
  const ivString = iv.toString();
  const encryptedKey = rsaEncrypt(rsaPublicKey, keyString);
  if (encryptedKey === false) {
    throw new Error("Failed to encrypt AES key.");
  }
  const encryptedIV = rsaEncrypt(rsaPublicKey, ivString);
  if (encryptedIV === false) {
    throw new Error("Failed to encrypt AES IV.");
  }
  const encryptedBody = encryptWithAES({ key, iv }, message);
  return { encryptedKey, encryptedIV, encryptedBody };
};
class EventBuilder {
  constructor(projectId, apiKey, appName, data) {
    __publicField(this, "transport", null);
    __publicField(this, "config", null);
    __publicField(this, "sessionIdentifier", getCurrentUTCTimestampMilliseconds());
    __publicField(this, "pushHandler", new EventPushHandler(this));
    __publicField(this, "handleAutoCapture", (trackTags) => (event) => {
      const config2 = getConfig();
      const target = event.target;
      if (target && trackTags.includes(target.tagName)) {
        const customProperties = this.getElementProperties(target);
        this.track(
          `${config2.defaultSystemEventPrefix} ${EventType.Click}${config2.defaultSystemEventPrefix}${target.innerText}`,
          customProperties
        );
      }
    });
    this.projectId = projectId;
    this.apiKey = apiKey;
    this.appName = appName;
    this.data = data;
    this.init();
  }
  init() {
    return __async(this, null, function* () {
      try {
        yield this.loadConfig();
        this.setupTransport();
        yield this.pushHandler.flush();
        this.setupAutoCaptureListener();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    });
  }
  loadConfig() {
    return __async(this, null, function* () {
      const client = TransportFactory.getTransport("http", {
        headers: { authorization: `Bearer ${this.apiKey}` },
        requestTimeout: 1e3
      });
      const response = yield client.send(
        `${this.getApiGateway()}?project=${this.projectId}`,
        "GET"
      );
      if (response.status === 200) {
        this.config = yield response.json();
      }
    });
  }
  getApiGateway() {
    return getConfig().apiGateway;
  }
  getRequestTimeout() {
    return getConfig().requestTimeout;
  }
  setupTransport() {
    this.transport = TransportFactory.getTransport("http", {
      headers: {
        "x-api-key": this.apiKey,
        "x-project-id": this.projectId,
        "content-type": "application/json"
      },
      requestTimeout: this.getRequestTimeout()
    });
  }
  setupAutoCaptureListener() {
    var _a3, _b2;
    if ((_a3 = this.config) == null ? void 0 : _a3.auto_capture) {
      const trackTags = this.config.auto_capture_tags.map(
        (tag) => tag.toUpperCase()
      );
      (_b2 = document.body) == null ? void 0 : _b2.addEventListener(
        "click",
        this.handleAutoCapture(trackTags)
      );
    }
  }
  getElementProperties(element) {
    const attributes = [
      "id",
      "href",
      "class",
      "name",
      "value",
      "type",
      "placeholder",
      "title",
      "alt",
      "src"
    ];
    return attributes.reduce(
      (props, attr) => {
        if (element.hasAttribute(attr)) {
          props[attr] = element.getAttribute(attr) || "";
        }
        return props;
      },
      {
        text: element.innerText,
        tag: element.tagName.toLowerCase()
      }
    );
  }
  getConfig() {
    return this.config;
  }
  track(eventName, eventProperties) {
    return __async(this, null, function* () {
      var _a3;
      if (!eventName) {
        throw new Error("Event name is not set.");
      }
      if (!((_a3 = this.data.user) == null ? void 0 : _a3.id)) {
        console.error(
          `Event ${eventName} is not tracked because the app is not running inside Telegram.`
        );
        return;
      }
      const event = this.createEventObject(eventName, eventProperties);
      return this.pushHandler.push(event);
    });
  }
  createEventObject(eventName, eventProperties) {
    const config2 = getConfig();
    return createEvent(
      this.appName,
      eventName,
      this.getUserDetails(),
      this.getEventDetails(eventProperties),
      this.data.user.id.toString(),
      this.data.user.language_code,
      this.data.platform,
      this.data.chat_type || "N/A",
      this.data.chat_instance || "0",
      getCurrentUTCTimestamp(),
      eventName.startsWith(config2.defaultSystemEventPrefix),
      eventProperties.wallet,
      this.sessionIdentifier
    );
  }
  getUserDetails() {
    const { user } = this.data;
    return {
      username: (user == null ? void 0 : user.username) || "",
      firstName: user.first_name,
      lastName: (user == null ? void 0 : user.last_name) || "",
      isPremium: (user == null ? void 0 : user.is_premium) || false,
      writeAccess: (user == null ? void 0 : user.allows_write_to_pm) || false
    };
  }
  getEventDetails(eventProperties) {
    return {
      startParameter: this.data.start_param || "",
      path: document.location.pathname,
      params: eventProperties
    };
  }
  processEvent(event) {
    return __async(this, null, function* () {
      if (!this.config || !this.transport) {
        Logger.error("EventBuilder: Config or transport not initialized", {
          configExists: !!this.config,
          transportExists: !!this.transport
        });
        return;
      }
      try {
        const { encryptedKey, encryptedIV, encryptedBody } = encryptMessage(
          this.config.public_key,
          JSON.stringify(event)
        );
        const response = yield this.transport.send(
          this.config.host,
          "POST",
          JSON.stringify({
            key: encryptedKey,
            iv: encryptedIV,
            body: encryptedBody
          })
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        Logger.info("Event processed successfully", {
          eventType: event.eventType
        });
      } catch (error) {
        if (error instanceof Error) {
          Logger.error("Error processing event", {
            error: error.message,
            stack: error.stack,
            eventType: event.eventType
          });
        } else {
          Logger.error("Unknown error processing event", {
            error,
            eventType: event.eventType
          });
        }
      }
    });
  }
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = require$$0$1, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React = require$$0$1;
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var assign = Object.assign;
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0) {
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          }
          return "\n" + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              if (sampleLines[s] !== controlLines[c]) {
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--;
                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn.displayName);
                      }
                      {
                        if (typeof fn === "function") {
                          componentFrameCache.set(fn, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn === "function") {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x) {
              }
            }
          }
        }
        return "";
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location2, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location2 + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location2, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location2, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location2, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      var didWarnAboutStringRefs;
      {
        didWarnAboutStringRefs = {};
      }
      function hasValidRef(config2) {
        {
          if (hasOwnProperty.call(config2, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config2, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config2.ref !== void 0;
      }
      function hasValidKey(config2) {
        {
          if (hasOwnProperty.call(config2, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config2, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config2.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config2, self2) {
        {
          if (typeof config2.ref === "string" && ReactCurrentOwner.current && self2 && ReactCurrentOwner.current.stateNode !== self2) {
            var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (!didWarnAboutStringRefs[componentName]) {
              error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config2.ref);
              didWarnAboutStringRefs[componentName] = true;
            }
          }
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      var ReactElement = function(type, key, ref, self2, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type,
          key,
          ref,
          props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self2
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      function jsxDEV(type, config2, maybeKey, source, self2) {
        {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          if (maybeKey !== void 0) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = "" + maybeKey;
          }
          if (hasValidKey(config2)) {
            {
              checkKeyStringCoercion(config2.key);
            }
            key = "" + config2.key;
          }
          if (hasValidRef(config2)) {
            ref = config2.ref;
            warnIfStringRefCannotBeAutoConverted(config2, self2);
          }
          for (propName in config2) {
            if (hasOwnProperty.call(config2, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config2[propName];
            }
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self2, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function isValidElement(object) {
        {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node, parentType) {
        {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === void 0 || typeof type === "string") {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self2) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum();
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self2);
          if (element == null) {
            return element;
          }
          if (validType) {
            var children = props.children;
            if (children !== void 0) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k) {
                return k !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      }
      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      var jsx = jsxWithValidationDynamic;
      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
if (process.env.NODE_ENV === "production") {
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;
const webAppHandler = typeof window !== "undefined" && ((_a2 = window == null ? void 0 : window.Telegram) == null ? void 0 : _a2.WebApp) ? window.Telegram.WebApp : null;
const webViewHandler = typeof window !== "undefined" && ((_b = window == null ? void 0 : window.Telegram) == null ? void 0 : _b.WebView) ? window.Telegram.WebView : null;
const loadTelegramWebAppData = () => {
  if (webAppHandler === null) {
    return loadFromHash();
  }
  return loadFromTelegramLib();
};
const loadFromTelegramLib = () => {
  if (webAppHandler === null) {
    throw new Error("Telegram WebApp is not loaded.");
  }
  const initData = webAppHandler.initDataUnsafe;
  return __spreadProps(__spreadValues({}, initData), { platform: webAppHandler.platform });
};
const loadFromHash = () => {
  const documentHash = document.location.hash;
  if (documentHash === "") {
    throw new Error("Telegram WebApp is not loaded.");
  }
  const hash = decodeURIComponent(
    decodeURIComponent(document.location.hash.substring(1))
  );
  const urlParams = new URLSearchParams(hash);
  const tgWebAppData = urlParams.get("tgWebAppData");
  if (tgWebAppData === null) {
    throw new Error("Telegram WebApp is not loaded.");
  }
  const userParams = new URLSearchParams(tgWebAppData);
  return {
    user: userParams.get("user") ? JSON.parse(userParams.get("user")) : void 0,
    chat_type: urlParams.get("chat_type"),
    chat_instance: urlParams.get("chat_instance") || void 0,
    platform: urlParams.get("tgWebAppPlatform") || "unknown",
    auth_date: urlParams.get("auth_date") ? parseInt(urlParams.get("auth_date")) : 0,
    hash: urlParams.get("hash") || "",
    start_param: urlParams.get("start_param") || void 0
  };
};
const TwaAnalyticsProviderContext = createContext(
  null
);
const WalletConnectedKey = "walletConnected";
const TonConnectLocalStorageKey = "ton-connect-storage_bridge-connection";
const TonConnectProviderNameLocalStorageKey = "ton-connect-ui_preferred-wallet";
function getElementProperties(element) {
  return {
    tagName: element.tagName,
    id: element.id,
    className: element.className
    // Add any other properties you want to capture
  };
}
const TwaAnalyticsProvider = (_c) => {
  var _d = _c, {
    children
  } = _d, options = __objRest(_d, [
    "children"
  ]);
  if (!options.projectId) {
    throw new Error("TWA Analytics Provider: Missing projectId");
  }
  const telegramWebAppData = options.telegramWebAppData || loadTelegramWebAppData();
  const eventBuilder = useMemo(() => {
    return new EventBuilder(
      options.projectId,
      options.apiKey,
      options.appName,
      telegramWebAppData
    );
  }, []);
  useEffect(() => {
    webViewHandler == null ? void 0 : webViewHandler.onEvent("main_button_pressed", (event) => {
      eventBuilder.track(EventType.MainButtonPressed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("settings_button_pressed", (event) => {
      eventBuilder.track(EventType.SettingsButtonPressed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("back_button_pressed", (event) => {
      eventBuilder.track(EventType.BackButtonPressed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("secondary_button_pressed", (event, data) => {
      eventBuilder.track(EventType.SecondaryButtonPressed, __spreadValues({}, data));
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("prepared_message_sent", (event) => {
      eventBuilder.track(EventType.PreparedMessageSent, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("fullscreen_changed", (event, data) => {
      eventBuilder.track(EventType.FullScreenChanged, __spreadValues({}, data));
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("home_screen_added", (event) => {
      eventBuilder.track(EventType.HomeScreenAdded, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("home_screen_checked", (event, data) => {
      eventBuilder.track(EventType.HomeScreenChecked, __spreadValues({}, data));
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("emoji_status_set", (event) => {
      eventBuilder.track(EventType.EmojiStatusSet, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("location_checked", (event, data) => {
      eventBuilder.track(EventType.LocationChecked, __spreadValues({}, data));
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("location_requested", (event, data) => {
      eventBuilder.track(EventType.LocationRequested, __spreadValues({}, data));
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("accelerometer_started", (event) => {
      eventBuilder.track(EventType.AccelerometerStarted, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("accelerometer_stopped", (event) => {
      eventBuilder.track(EventType.AccelerometerStopped, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("accelerometer_changed", (event) => {
      eventBuilder.track(EventType.AccelerometerChanged, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("device_orientation_started", (event) => {
      eventBuilder.track(EventType.DeviceOrientationStarted, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("device_orientation_stopped", (event) => {
      eventBuilder.track(EventType.DeviceOrientationStopped, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("device_orientation_changed", (event) => {
      eventBuilder.track(EventType.DeviceOrientationChanged, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("device_orientation_failed", (event) => {
      eventBuilder.track(EventType.DeviceOrientationFailed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("gyroscope_started", (event) => {
      eventBuilder.track(EventType.GyroscropeStarted, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("gyroscope_stopped", (event) => {
      eventBuilder.track(EventType.GyroscropeStopped, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("gyroscope_changed", (event) => {
      eventBuilder.track(EventType.GyroscropeChanged, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent("gyroscope_failed", (event) => {
      eventBuilder.track(EventType.GyroscropeFailed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent(
      "invoice_closed",
      (event, data) => {
        eventBuilder.track(EventType.InvoiceClosed, __spreadValues({}, data));
      }
    );
    webViewHandler == null ? void 0 : webViewHandler.onEvent(
      "clipboard_text_received",
      (event, data) => {
        eventBuilder.track(EventType.ClipboardTextReceived, __spreadValues({}, data));
      }
    );
    webViewHandler == null ? void 0 : webViewHandler.onEvent("popup_closed", (event, data) => {
      eventBuilder.track(EventType.PopupClosed, {});
    });
    webViewHandler == null ? void 0 : webViewHandler.onEvent(
      "write_access_requested",
      (event, data) => {
        eventBuilder.track(EventType.WriteAccessRequested, {});
      }
    );
    webViewHandler == null ? void 0 : webViewHandler.onEvent(
      "qr_text_received",
      (event, data) => {
        eventBuilder.track(EventType.QRTextReceived, __spreadValues({}, data));
      }
    );
    webViewHandler == null ? void 0 : webViewHandler.onEvent(
      "phone_requested",
      (event, data) => {
        eventBuilder.track(EventType.PhoneRequested, __spreadValues({}, data));
      }
    );
  }, []);
  useEffect(() => {
    const locationPath = location.pathname;
    eventBuilder.track(`${EventType.PageView} ${locationPath}`, {
      path: locationPath
    });
  }, []);
  useEffect(() => {
    let lastAddress = null;
    const interval = setInterval(() => {
      var _a3, _b2;
      const tonConnectStoredData = localStorage.getItem(
        TonConnectLocalStorageKey
      );
      if (tonConnectStoredData) {
        try {
          const parsedData = JSON.parse(
            tonConnectStoredData
          );
          const wallets = ((_b2 = (_a3 = parsedData.connectEvent) == null ? void 0 : _a3.payload) == null ? void 0 : _b2.items) || [];
          if (wallets && wallets.length === 0) {
            return;
          }
          const currentAddress = wallets[0].address;
          const walletConnected = localStorage.getItem(WalletConnectedKey);
          if (lastAddress !== currentAddress || !walletConnected) {
            const walletProvider = localStorage.getItem(
              TonConnectProviderNameLocalStorageKey
            );
            const customProperties = {
              wallet: currentAddress,
              walletProvider: walletProvider || "unknown"
            };
            lastAddress = currentAddress;
            localStorage.setItem(WalletConnectedKey, "true");
            eventBuilder.track(EventType.Wallet, customProperties);
          }
        } catch (exception) {
          console.error(exception);
        }
      }
    }, 1e3);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    var _a3, _b2, _c2, _d2, _e;
    const config2 = getConfig();
    if ((_a3 = eventBuilder.getConfig()) == null ? void 0 : _a3.auto_capture) {
      const trackTags = (_d2 = (_c2 = (_b2 = eventBuilder.getConfig()) == null ? void 0 : _b2.auto_capture_tags) == null ? void 0 : _c2.map((tag) => tag.toUpperCase())) != null ? _d2 : [];
      (_e = document.body) == null ? void 0 : _e.addEventListener("click", (event) => {
        const target = event.target;
        if (target && trackTags.includes(target.tagName)) {
          const customProperties = getElementProperties(target);
          eventBuilder.track(
            `${config2.defaultSystemEventPrefix} ${EventType.Click}${config2.defaultSystemEventPrefix}${target.innerText}`,
            customProperties
          );
        }
      });
    }
  }, [eventBuilder]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TwaAnalyticsProviderContext.Provider, { value: eventBuilder, children });
};
const TwaAnalyticsProvider$1 = memo(TwaAnalyticsProvider);
function useTWAEvent() {
  const eventBuilder = useContext(TwaAnalyticsProviderContext);
  if (!eventBuilder || !(eventBuilder instanceof EventBuilder)) {
    throw new Error(
      "TwaAnalyticsProvider is not configured. Please, set up <TwaAnalyticsProvider /> before using this hook."
    );
  }
  return eventBuilder;
}
Logger.setLevel(
  LogLevel.INFO
);
export {
  TwaAnalyticsProvider$1 as TwaAnalyticsProvider,
  useTWAEvent
};
//# sourceMappingURL=index.mjs.map
