import { Request } from "http";

/**
 * @typedef {Object} ReqParams
 * @property {String} path - Destination path
 * @property {Object} data - Key value pairs
 * @property {String} [method = 'POST'] - Default method
 */

/**
 * @callback OnError
 * @param {number} code
 * @param {string} message
 */

/**
 * @callback OnSuccess
 * @param {string} response
 */

/**
 * @typedef {Object} ReqFns
 * @property {OnSuccess} [onSuccess]
 * @property {OnError} [onError]
 */

/**
 * @typedef {Object} Payload
 * @property {String} status
 * @property {Number} timerRemaining
 * @property {String} [code]
 * @property {String} [name]
 * @property {String} [version]
 */

export class Manager {
  /**
   * @type {Storage}
   */
  #url;
  /**
   * @type {Storage}
   */
  #name;
  #code = "";
  #version = "";

  /**
   * @param {Storage} url
   * @param {Storage} name
   * @param {String} code
   * @param {String}version
   */
  constructor(url, name, code, version) {
    this.#url = url;
    this.#name = name;
    this.#code = code;
    this.#version = version;
  }

  /**
   * @param {ReqParams} options
   * @param {ReqFns} callbacks
   */
  #send(options, callbacks) {
    const request = new Request({
      host: this.#url.getValue(),
      path: options.path,
      method: options.method || "POST",
      body: JSON.stringify(options.data),
      response: String,
    });

    request.callback = function (message, value) {
      if (message === Request.responseComplete) {
        if (callbacks.onSuccess) callbacks.onSuccess(value);
      }

      if (message === Request.error) {
        if (callbacks.onError) callbacks.onError(message, value);
      }
    };
  }

  /**
   * @param {Payload} payload
   * @param {ReqFns} [callbacks]
   */
  report(payload, callbacks) {
    this.#send(
      {
        path: "/api/v1/devices/webhook/status/SWITCH",
        method: "PUT",
        data: {
          code: this.#code,
          version: this.#version,
          name: this.#name.getValue(),
          ...payload,
        },
      },
      callbacks || {},
    );
  }
}
