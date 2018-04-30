/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict';
const cbor = require('cbor');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

class XoPayload {
  constructor (name, action, space) {
    this.name = name;
    this.action = action;
    this.space = space;
  }

  static fromBytes (payload) {
    const decodedPayload = cbor.decode(payload);
    let xoPayload;

    try {
      xoPayload = new XoPayload(decodedPayload.name, decodedPayload.action, decodedPayload.space);
    } catch (e) {
      throw new InvalidTransaction('Invalid payload');
    }

    if (!xoPayload.name) {
      throw new InvalidTransaction('Name is required');
    }
    if (xoPayload.name.indexOf('|') !== -1) {
      throw new InvalidTransaction('Name cannot contain "|"');
    }

    if (!xoPayload.action) {
      throw new InvalidTransaction('Action is required');
    }
    return xoPayload;
  }
}

module.exports = XoPayload;
