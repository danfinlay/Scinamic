// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index",
  [],
  function (exports_1, context_1) {
    "use strict";
    var BLOCK_SIZE,
      OUTPUT_SIZE,
      DEFAULT_H,
      f1,
      f2,
      f3,
      f4,
      f5,
      rol,
      slice,
      readLE32,
      writeLE32,
      writeLE64,
      Round,
      R11,
      R21,
      R31,
      R41,
      R51,
      R12,
      R22,
      R32,
      R42,
      R52,
      Ripemd160;
    var __moduleName = context_1 && context_1.id;
    function getBinaryFromString(str) {
      const len = str.length;
      const result = new Uint32Array(len);
      for (let i = 0; i < len; i++) {
        result[i] = str.charCodeAt(i);
      }
      return result;
    }
    function u32to8(u32) {
      const u8 = new Uint8Array(u32.length);
      for (let i = 0; i < u32.length; i++) {
        const hs = (u32[i] & 255).toString(16);
        u8[i] = parseInt(`0${hs}`.slice(-2), 16);
      }
      return u8;
    }
    function toHex(uint8a) {
      return Array.from(uint8a).map((c) => c.toString(16).padStart(2, "0"))
        .join("");
    }
    function ripemd160(message) {
      const hasher = new Ripemd160();
      if (typeof message === "string") {
        hasher.input(message);
      } else {
        hasher.write(message, message.length);
      }
      const hash = u32to8(hasher.result());
      return typeof message === "string" ? toHex(hash) : hash;
    }
    exports_1("default", ripemd160);
    return {
      setters: [],
      execute: function () {
        BLOCK_SIZE = 64;
        OUTPUT_SIZE = 20;
        DEFAULT_H = [
          0x67452301,
          0xefcdab89,
          0x98badcfe,
          0x10325476,
          0xc3d2e1f0,
        ];
        f1 = (x, y, z) => x ^ y ^ z;
        f2 = (x, y, z) => (x & y) | (~x & z);
        f3 = (x, y, z) => (x | ~y) ^ z;
        f4 = (x, y, z) => (x & z) | (y & ~z);
        f5 = (x, y, z) => x ^ (y | ~z);
        rol = (x, i) => (x << i) | (x >>> (32 - i));
        slice = (arr, start = 0, end = arr.length) => {
          if (arr instanceof Uint32Array) {
            return arr.slice(start, end);
          }
          const result = new Uint32Array(end - start);
          for (let i = start, j = 0; i < end; i++, j++) {
            result[j] = Number(arr[i]);
          }
          return result;
        };
        readLE32 = (ptr, padding = 0) =>
          (Number(ptr[padding + 3]) << 24) |
          (Number(ptr[padding + 2]) << 16) |
          (Number(ptr[padding + 1]) << 8) |
          Number(ptr[padding]);
        writeLE32 = (ptr, padding, x) => {
          ptr[padding + 3] = x >>> 24;
          ptr[padding + 2] = x >>> 16;
          ptr[padding + 1] = x >>> 8;
          ptr[padding] = x >>> 0;
        };
        writeLE64 = (ptr, padding, x) => {
          x = BigInt(x);
          ptr[padding + 7] = x >> 56n;
          ptr[padding + 6] = x >> 48n;
          ptr[padding + 5] = x >> 40n;
          ptr[padding + 4] = x >> 32n;
          ptr[padding + 3] = x >> 24n;
          ptr[padding + 2] = x >> 16n;
          ptr[padding + 1] = x >> 8n;
          ptr[padding] = x;
        };
        Round = (a, b, c, d, e, f, x, k, r) =>
          new Uint32Array([rol(a + f + x + k, r) + e, rol(c, 10)]);
        R11 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f1(b, c, d), x, 0, r);
        R21 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f2(b, c, d), x, 0x5a827999, r);
        R31 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f3(b, c, d), x, 0x6ed9eba1, r);
        R41 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f4(b, c, d), x, 0x8f1bbcdc, r);
        R51 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f5(b, c, d), x, 0xa953fd4e, r);
        R12 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f5(b, c, d), x, 0x50a28be6, r);
        R22 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f4(b, c, d), x, 0x5c4dd124, r);
        R32 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f3(b, c, d), x, 0x6d703ef3, r);
        R42 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f2(b, c, d), x, 0x7a6d76e9, r);
        R52 = (a, b, c, d, e, x, r) =>
          Round(a, b, c, d, e, f1(b, c, d), x, 0, r);
        Ripemd160 = class Ripemd160 {
          constructor(
            h = new Uint32Array(DEFAULT_H),
            bytes = 0,
            buffer = new Uint32Array(BLOCK_SIZE),
          ) {
            this.h = h;
            this.bytes = bytes;
            this.buffer = buffer;
          }
          input(str) {
            const input = getBinaryFromString(str);
            // @ts-ignore
            this.write(input, input.length);
          }
          processBlock(chunk) {
            const s = this.h;
            let a1 = s[0], b1 = s[1], c1 = s[2], d1 = s[3], e1 = s[4];
            let a2 = a1, b2 = b1, c2 = c1, d2 = d1, e2 = e1;
            let w0 = readLE32(chunk, 0),
              w1 = readLE32(chunk, 4),
              w2 = readLE32(chunk, 8),
              w3 = readLE32(chunk, 12);
            let w4 = readLE32(chunk, 16),
              w5 = readLE32(chunk, 20),
              w6 = readLE32(chunk, 24),
              w7 = readLE32(chunk, 28);
            let w8 = readLE32(chunk, 32),
              w9 = readLE32(chunk, 36),
              w10 = readLE32(chunk, 40),
              w11 = readLE32(chunk, 44);
            let w12 = readLE32(chunk, 48),
              w13 = readLE32(chunk, 52),
              w14 = readLE32(chunk, 56),
              w15 = readLE32(chunk, 60);
            [a1, c1] = R11(a1, b1, c1, d1, e1, w0, 11);
            [a2, c2] = R12(a2, b2, c2, d2, e2, w5, 8);
            [e1, b1] = R11(e1, a1, b1, c1, d1, w1, 14);
            [e2, b2] = R12(e2, a2, b2, c2, d2, w14, 9);
            [d1, a1] = R11(d1, e1, a1, b1, c1, w2, 15);
            [d2, a2] = R12(d2, e2, a2, b2, c2, w7, 9);
            [c1, e1] = R11(c1, d1, e1, a1, b1, w3, 12);
            [c2, e2] = R12(c2, d2, e2, a2, b2, w0, 11);
            [b1, d1] = R11(b1, c1, d1, e1, a1, w4, 5);
            [b2, d2] = R12(b2, c2, d2, e2, a2, w9, 13);
            [a1, c1] = R11(a1, b1, c1, d1, e1, w5, 8);
            [a2, c2] = R12(a2, b2, c2, d2, e2, w2, 15);
            [e1, b1] = R11(e1, a1, b1, c1, d1, w6, 7);
            [e2, b2] = R12(e2, a2, b2, c2, d2, w11, 15);
            [d1, a1] = R11(d1, e1, a1, b1, c1, w7, 9);
            [d2, a2] = R12(d2, e2, a2, b2, c2, w4, 5);
            [c1, e1] = R11(c1, d1, e1, a1, b1, w8, 11);
            [c2, e2] = R12(c2, d2, e2, a2, b2, w13, 7);
            [b1, d1] = R11(b1, c1, d1, e1, a1, w9, 13);
            [b2, d2] = R12(b2, c2, d2, e2, a2, w6, 7);
            [a1, c1] = R11(a1, b1, c1, d1, e1, w10, 14);
            [a2, c2] = R12(a2, b2, c2, d2, e2, w15, 8);
            [e1, b1] = R11(e1, a1, b1, c1, d1, w11, 15);
            [e2, b2] = R12(e2, a2, b2, c2, d2, w8, 11);
            [d1, a1] = R11(d1, e1, a1, b1, c1, w12, 6);
            [d2, a2] = R12(d2, e2, a2, b2, c2, w1, 14);
            [c1, e1] = R11(c1, d1, e1, a1, b1, w13, 7);
            [c2, e2] = R12(c2, d2, e2, a2, b2, w10, 14);
            [b1, d1] = R11(b1, c1, d1, e1, a1, w14, 9);
            [b2, d2] = R12(b2, c2, d2, e2, a2, w3, 12);
            [a1, c1] = R11(a1, b1, c1, d1, e1, w15, 8);
            [a2, c2] = R12(a2, b2, c2, d2, e2, w12, 6);
            [e1, b1] = R21(e1, a1, b1, c1, d1, w7, 7);
            [e2, b2] = R22(e2, a2, b2, c2, d2, w6, 9);
            [d1, a1] = R21(d1, e1, a1, b1, c1, w4, 6);
            [d2, a2] = R22(d2, e2, a2, b2, c2, w11, 13);
            [c1, e1] = R21(c1, d1, e1, a1, b1, w13, 8);
            [c2, e2] = R22(c2, d2, e2, a2, b2, w3, 15);
            [b1, d1] = R21(b1, c1, d1, e1, a1, w1, 13);
            [b2, d2] = R22(b2, c2, d2, e2, a2, w7, 7);
            [a1, c1] = R21(a1, b1, c1, d1, e1, w10, 11);
            [a2, c2] = R22(a2, b2, c2, d2, e2, w0, 12);
            [e1, b1] = R21(e1, a1, b1, c1, d1, w6, 9);
            [e2, b2] = R22(e2, a2, b2, c2, d2, w13, 8);
            [d1, a1] = R21(d1, e1, a1, b1, c1, w15, 7);
            [d2, a2] = R22(d2, e2, a2, b2, c2, w5, 9);
            [c1, e1] = R21(c1, d1, e1, a1, b1, w3, 15);
            [c2, e2] = R22(c2, d2, e2, a2, b2, w10, 11);
            [b1, d1] = R21(b1, c1, d1, e1, a1, w12, 7);
            [b2, d2] = R22(b2, c2, d2, e2, a2, w14, 7);
            [a1, c1] = R21(a1, b1, c1, d1, e1, w0, 12);
            [a2, c2] = R22(a2, b2, c2, d2, e2, w15, 7);
            [e1, b1] = R21(e1, a1, b1, c1, d1, w9, 15);
            [e2, b2] = R22(e2, a2, b2, c2, d2, w8, 12);
            [d1, a1] = R21(d1, e1, a1, b1, c1, w5, 9);
            [d2, a2] = R22(d2, e2, a2, b2, c2, w12, 7);
            [c1, e1] = R21(c1, d1, e1, a1, b1, w2, 11);
            [c2, e2] = R22(c2, d2, e2, a2, b2, w4, 6);
            [b1, d1] = R21(b1, c1, d1, e1, a1, w14, 7);
            [b2, d2] = R22(b2, c2, d2, e2, a2, w9, 15);
            [a1, c1] = R21(a1, b1, c1, d1, e1, w11, 13);
            [a2, c2] = R22(a2, b2, c2, d2, e2, w1, 13);
            [e1, b1] = R21(e1, a1, b1, c1, d1, w8, 12);
            [e2, b2] = R22(e2, a2, b2, c2, d2, w2, 11);
            [d1, a1] = R31(d1, e1, a1, b1, c1, w3, 11);
            [d2, a2] = R32(d2, e2, a2, b2, c2, w15, 9);
            [c1, e1] = R31(c1, d1, e1, a1, b1, w10, 13);
            [c2, e2] = R32(c2, d2, e2, a2, b2, w5, 7);
            [b1, d1] = R31(b1, c1, d1, e1, a1, w14, 6);
            [b2, d2] = R32(b2, c2, d2, e2, a2, w1, 15);
            [a1, c1] = R31(a1, b1, c1, d1, e1, w4, 7);
            [a2, c2] = R32(a2, b2, c2, d2, e2, w3, 11);
            [e1, b1] = R31(e1, a1, b1, c1, d1, w9, 14);
            [e2, b2] = R32(e2, a2, b2, c2, d2, w7, 8);
            [d1, a1] = R31(d1, e1, a1, b1, c1, w15, 9);
            [d2, a2] = R32(d2, e2, a2, b2, c2, w14, 6);
            [c1, e1] = R31(c1, d1, e1, a1, b1, w8, 13);
            [c2, e2] = R32(c2, d2, e2, a2, b2, w6, 6);
            [b1, d1] = R31(b1, c1, d1, e1, a1, w1, 15);
            [b2, d2] = R32(b2, c2, d2, e2, a2, w9, 14);
            [a1, c1] = R31(a1, b1, c1, d1, e1, w2, 14);
            [a2, c2] = R32(a2, b2, c2, d2, e2, w11, 12);
            [e1, b1] = R31(e1, a1, b1, c1, d1, w7, 8);
            [e2, b2] = R32(e2, a2, b2, c2, d2, w8, 13);
            [d1, a1] = R31(d1, e1, a1, b1, c1, w0, 13);
            [d2, a2] = R32(d2, e2, a2, b2, c2, w12, 5);
            [c1, e1] = R31(c1, d1, e1, a1, b1, w6, 6);
            [c2, e2] = R32(c2, d2, e2, a2, b2, w2, 14);
            [b1, d1] = R31(b1, c1, d1, e1, a1, w13, 5);
            [b2, d2] = R32(b2, c2, d2, e2, a2, w10, 13);
            [a1, c1] = R31(a1, b1, c1, d1, e1, w11, 12);
            [a2, c2] = R32(a2, b2, c2, d2, e2, w0, 13);
            [e1, b1] = R31(e1, a1, b1, c1, d1, w5, 7);
            [e2, b2] = R32(e2, a2, b2, c2, d2, w4, 7);
            [d1, a1] = R31(d1, e1, a1, b1, c1, w12, 5);
            [d2, a2] = R32(d2, e2, a2, b2, c2, w13, 5);
            [c1, e1] = R41(c1, d1, e1, a1, b1, w1, 11);
            [c2, e2] = R42(c2, d2, e2, a2, b2, w8, 15);
            [b1, d1] = R41(b1, c1, d1, e1, a1, w9, 12);
            [b2, d2] = R42(b2, c2, d2, e2, a2, w6, 5);
            [a1, c1] = R41(a1, b1, c1, d1, e1, w11, 14);
            [a2, c2] = R42(a2, b2, c2, d2, e2, w4, 8);
            [e1, b1] = R41(e1, a1, b1, c1, d1, w10, 15);
            [e2, b2] = R42(e2, a2, b2, c2, d2, w1, 11);
            [d1, a1] = R41(d1, e1, a1, b1, c1, w0, 14);
            [d2, a2] = R42(d2, e2, a2, b2, c2, w3, 14);
            [c1, e1] = R41(c1, d1, e1, a1, b1, w8, 15);
            [c2, e2] = R42(c2, d2, e2, a2, b2, w11, 14);
            [b1, d1] = R41(b1, c1, d1, e1, a1, w12, 9);
            [b2, d2] = R42(b2, c2, d2, e2, a2, w15, 6);
            [a1, c1] = R41(a1, b1, c1, d1, e1, w4, 8);
            [a2, c2] = R42(a2, b2, c2, d2, e2, w0, 14);
            [e1, b1] = R41(e1, a1, b1, c1, d1, w13, 9);
            [e2, b2] = R42(e2, a2, b2, c2, d2, w5, 6);
            [d1, a1] = R41(d1, e1, a1, b1, c1, w3, 14);
            [d2, a2] = R42(d2, e2, a2, b2, c2, w12, 9);
            [c1, e1] = R41(c1, d1, e1, a1, b1, w7, 5);
            [c2, e2] = R42(c2, d2, e2, a2, b2, w2, 12);
            [b1, d1] = R41(b1, c1, d1, e1, a1, w15, 6);
            [b2, d2] = R42(b2, c2, d2, e2, a2, w13, 9);
            [a1, c1] = R41(a1, b1, c1, d1, e1, w14, 8);
            [a2, c2] = R42(a2, b2, c2, d2, e2, w9, 12);
            [e1, b1] = R41(e1, a1, b1, c1, d1, w5, 6);
            [e2, b2] = R42(e2, a2, b2, c2, d2, w7, 5);
            [d1, a1] = R41(d1, e1, a1, b1, c1, w6, 5);
            [d2, a2] = R42(d2, e2, a2, b2, c2, w10, 15);
            [c1, e1] = R41(c1, d1, e1, a1, b1, w2, 12);
            [c2, e2] = R42(c2, d2, e2, a2, b2, w14, 8);
            [b1, d1] = R51(b1, c1, d1, e1, a1, w4, 9);
            [b2, d2] = R52(b2, c2, d2, e2, a2, w12, 8);
            [a1, c1] = R51(a1, b1, c1, d1, e1, w0, 15);
            [a2, c2] = R52(a2, b2, c2, d2, e2, w15, 5);
            [e1, b1] = R51(e1, a1, b1, c1, d1, w5, 5);
            [e2, b2] = R52(e2, a2, b2, c2, d2, w10, 12);
            [d1, a1] = R51(d1, e1, a1, b1, c1, w9, 11);
            [d2, a2] = R52(d2, e2, a2, b2, c2, w4, 9);
            [c1, e1] = R51(c1, d1, e1, a1, b1, w7, 6);
            [c2, e2] = R52(c2, d2, e2, a2, b2, w1, 12);
            [b1, d1] = R51(b1, c1, d1, e1, a1, w12, 8);
            [b2, d2] = R52(b2, c2, d2, e2, a2, w5, 5);
            [a1, c1] = R51(a1, b1, c1, d1, e1, w2, 13);
            [a2, c2] = R52(a2, b2, c2, d2, e2, w8, 14);
            [e1, b1] = R51(e1, a1, b1, c1, d1, w10, 12);
            [e2, b2] = R52(e2, a2, b2, c2, d2, w7, 6);
            [d1, a1] = R51(d1, e1, a1, b1, c1, w14, 5);
            [d2, a2] = R52(d2, e2, a2, b2, c2, w6, 8);
            [c1, e1] = R51(c1, d1, e1, a1, b1, w1, 12);
            [c2, e2] = R52(c2, d2, e2, a2, b2, w2, 13);
            [b1, d1] = R51(b1, c1, d1, e1, a1, w3, 13);
            [b2, d2] = R52(b2, c2, d2, e2, a2, w13, 6);
            [a1, c1] = R51(a1, b1, c1, d1, e1, w8, 14);
            [a2, c2] = R52(a2, b2, c2, d2, e2, w14, 5);
            [e1, b1] = R51(e1, a1, b1, c1, d1, w11, 11);
            [e2, b2] = R52(e2, a2, b2, c2, d2, w0, 15);
            [d1, a1] = R51(d1, e1, a1, b1, c1, w6, 8);
            [d2, a2] = R52(d2, e2, a2, b2, c2, w3, 13);
            [c1, e1] = R51(c1, d1, e1, a1, b1, w15, 5);
            [c2, e2] = R52(c2, d2, e2, a2, b2, w9, 11);
            [b1, d1] = R51(b1, c1, d1, e1, a1, w13, 6);
            [b2, d2] = R52(b2, c2, d2, e2, a2, w11, 11);
            const t = s[0];
            s[0] = s[1] + c1 + d2;
            s[1] = s[2] + d1 + e2;
            s[2] = s[3] + e1 + a2;
            s[3] = s[4] + a1 + b2;
            s[4] = t + b1 + c2;
          }
          write(data, len) {
            let bufsize = this.bytes % 64;
            let padding = 0;
            if (bufsize && bufsize + len >= BLOCK_SIZE) {
              // Fill the buffer, and process it.
              this.buffer.set(slice(data, 0, BLOCK_SIZE - bufsize), bufsize);
              this.bytes += BLOCK_SIZE - bufsize;
              padding += BLOCK_SIZE - bufsize;
              this.processBlock(this.buffer);
              bufsize = 0;
            }
            while (len - padding >= 64) {
              // Process full chunks direct lofrom the source.
              this.processBlock(slice(data, padding, padding + BLOCK_SIZE));
              this.bytes += BLOCK_SIZE;
              padding += BLOCK_SIZE;
            }
            if (len > padding) {
              // Fill the buffer with what remains.
              this.buffer.set(slice(data, padding, len), bufsize);
              this.bytes += len - padding;
            }
          }
          result() {
            const { h, bytes } = this;
            const pad = new Uint32Array(BLOCK_SIZE);
            const hash = new Uint32Array(OUTPUT_SIZE);
            pad[0] = 0x80;
            const sizedesc = new Array(8);
            writeLE64(sizedesc, 0, bytes << 3);
            this.write(pad, 1 + ((119 - (bytes % 64)) % 64));
            this.write(sizedesc, 8);
            writeLE32(hash, 0, h[0]);
            writeLE32(hash, 4, h[1]);
            writeLE32(hash, 8, h[2]);
            writeLE32(hash, 12, h[3]);
            writeLE32(hash, 16, h[4]);
            return hash;
          }
        };
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/random/randomFromSeed",
  ["https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index"],
  function (exports_2, context_2) {
    "use strict";
    var index_ts_1, hexChars;
    var __moduleName = context_2 && context_2.id;
    function randomFromSeed(seed) {
      let num = 0;
      for (let i = 0; i < seed.length; i++) {
        const fraction = hexChars.indexOf(seed[i]) / 16;
        const weight = Math.pow(10, -1 * i);
        // console.log(`Adding ${fraction} * ${weight}`)
        num += fraction * weight;
      }
      return num;
    }
    exports_2("randomFromSeed", randomFromSeed);
    function mixWithSeed(seed, newval) {
      const seedHash = index_ts_1.default(seed + newval);
      return seedHash;
    }
    exports_2("mixWithSeed", mixWithSeed);
    function createRandomGen(seed) {
      let nonce = 0;
      return () => {
        const newSeed = mixWithSeed(seed, String(nonce));
        nonce++;
        return randomFromSeed(newSeed);
      };
    }
    exports_2("createRandomGen", createRandomGen);
    return {
      setters: [
        function (index_ts_1_1) {
          index_ts_1 = index_ts_1_1;
        },
      ],
      execute: function () {
        /*
             * Takes a long hexadecimal string and converts it to a number from 0 to 1.
             *
             * Initial version is being hacked together, I'm not claiming thi sis secure.
             */
        hexChars = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
        ];
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/nameGen",
  ["file:///home/danf/Documents/EvolvingTechGame/src/random/randomFromSeed"],
  function (exports_3, context_3) {
    "use strict";
    var randomFromSeed_ts_1, consonants, vowels;
    var __moduleName = context_3 && context_3.id;
    function nameGen(syllables = 3, seed = "default") {
      let name = "";
      const random = randomFromSeed_ts_1.createRandomGen(seed);
      const vowelFirst = random() > 0.5;
      for (let i = 0; i < syllables * 2; i++) {
        const isVowel = (i % 2 === 0) ? vowelFirst : !vowelFirst;
        name += isVowel ? pickVowel(random) : pickConsonant(random);
      }
      return name;
    }
    exports_3("default", nameGen);
    function pickSegment(list, random) {
      const rand = random();
      return list[Math.floor(list.length * rand)];
    }
    function pickVowel(random) {
      return pickSegment(vowels, random);
    }
    function pickConsonant(random) {
      return pickSegment(consonants, random);
    }
    return {
      setters: [
        function (randomFromSeed_ts_1_1) {
          randomFromSeed_ts_1 = randomFromSeed_ts_1_1;
        },
      ],
      execute: function () {
        consonants = ["bl", "gr", "fr", "kl", "r", "m"];
        vowels = ["a", "e", "ei", "o", "u", "ou", "i"];
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/resourceGen",
  ["file:///home/danf/Documents/EvolvingTechGame/src/nameGen"],
  function (exports_4, context_4) {
    "use strict";
    var nameGen_ts_1;
    var __moduleName = context_4 && context_4.id;
    function generateResources(seed = "default") {
      const resources = {};
      for (let i = 0; i < 3; i++) {
        const resource = {
          name: nameGen_ts_1.default(1, `${seed} resource ${i}`),
        };
        resources[resource.name] = resource;
      }
      return resources;
    }
    exports_4("default", generateResources);
    return {
      setters: [
        function (nameGen_ts_1_1) {
          nameGen_ts_1 = nameGen_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/types",
  [],
  function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/unitGen",
  [
    "file:///home/danf/Documents/EvolvingTechGame/src/nameGen",
    "file:///home/danf/Documents/EvolvingTechGame/src/random/randomFromSeed",
  ],
  function (exports_6, context_6) {
    "use strict";
    var nameGen_ts_2, randomFromSeed_ts_2;
    var __moduleName = context_6 && context_6.id;
    function generateUnit({ resources, seed } = {
      resources: {},
      seed: "default-unit",
    }) {
      const random = randomFromSeed_ts_2.createRandomGen(`${seed}-unit`);
      const cost = {};
      Object.keys(resources).forEach((resourceKey) => {
        cost[resourceKey] = 50;
      });
      return {
        name: nameGen_ts_2.default(3, `${seed}-unit-${random()}`),
        cost,
        time: 30,
      };
    }
    exports_6("default", generateUnit);
    function createUnit({ unitType, seed, player, resources }) {
      if (!player) {
        throw new Error("must include a player to create a unit");
      }
      const random = randomFromSeed_ts_2.createRandomGen(`${seed}-unit`);
      const actions = [];
      const actionCount = Math.ceil(random() * 3);
      for (let i = 0; i < actionCount; i++) {
        actions.push(generateAction({ resources, seed: `${seed}action${i}` }));
      }
      const unit = {
        instanceOf: unitType,
        owner: player,
        actions,
        date: {
          started: Date.now(),
          created: undefined,
          onCompletion,
        },
      };
      let completed = false;
      const completionPromise = new Promise((res) => {
        setTimeout(() => {
          res(unit);
        }, unitType.time);
      });
      function onCompletion() {
        return completionPromise;
      }
      return unit;
    }
    exports_6("createUnit", createUnit);
    function generateAction(
      { resources, seed } = { resources: {}, seed: "default-action" },
    ) {
      const cost = {};
      Object.keys(resources).forEach((resourceKey) => {
        cost[resourceKey] = 30;
      });
      const name = nameGen_ts_2.default(3, seed);
      const action = {
        name,
        cost,
        time: 30000,
        seed,
        unitProduced: generateUnit(
          { resources, seed: `${seed}:action:${name}` },
        ),
      };
      return action;
    }
    return {
      setters: [
        function (nameGen_ts_2_1) {
          nameGen_ts_2 = nameGen_ts_2_1;
        },
        function (randomFromSeed_ts_2_1) {
          randomFromSeed_ts_2 = randomFromSeed_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/playerGen",
  ["file:///home/danf/Documents/EvolvingTechGame/src/unitGen"],
  function (exports_7, context_7) {
    "use strict";
    var unitGen_ts_1;
    var __moduleName = context_7 && context_7.id;
    function generatePlayers({ resources, baseType, playerCount, seed } = {
      resources: {},
      playerCount: 1,
      baseType: { name: "default", cost: {}, time: 0 },
      seed: "default-players",
    }) {
      const players = {};
      for (let i = 0; i < playerCount; i++) {
        const player = generatePlayer(
          resources,
          baseType,
          `Player ${i + 1}`,
          seed,
        );
        players[player.name] = player;
      }
      return players;
    }
    exports_7("default", generatePlayers);
    function generatePlayer(resources, baseType, name, seed) {
      const ownedResources = {};
      for (let resource in resources) {
        ownedResources[resource] = { amount: 100 };
      }
      const player = {
        name,
        resources: ownedResources,
        units: [],
        baseType,
        build,
      };
      generate(baseType, `${seed}-base-unit`);
      /**
         * The player-restricted method of spending resources to produce a unit.
         * @param action The action the player chooses to perform.
         */
      async function build(action) {
        // Ensure user has required funds:
        let sufficientFunds = true;
        for (let resource in action.cost) {
          if (player.resources[resource].amount < action.cost[resource]) {
            throw new Error(`Insufficient ${resource}`);
          }
        }
        // Deduct the balance from the user:
        for (let resource in action.cost) {
          player.resources[resource].amount -= action.cost[resource];
        }
        return generate(action.unitProduced, action.seed);
      }
      /**
         * The unsafe way of generating a unit for a player.
         * Should only be used internally.
         * @param action The unit to pre-generate.
         */
      function generate(unitType, seed) {
        const unit = unitGen_ts_1.createUnit({
          unitType,
          seed,
          player,
          resources,
        });
        player.units.push(unit);
        return unit;
      }
      return player;
    }
    return {
      setters: [
        function (unitGen_ts_1_1) {
          unitGen_ts_1 = unitGen_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/danf/Documents/EvolvingTechGame/src/index",
  [
    "file:///home/danf/Documents/EvolvingTechGame/src/resourceGen",
    "file:///home/danf/Documents/EvolvingTechGame/src/playerGen",
    "file:///home/danf/Documents/EvolvingTechGame/src/unitGen",
    "https://raw.githubusercontent.com/paulmillr/noble-ripemd160/master/index",
  ],
  function (exports_8, context_8) {
    "use strict";
    var resourceGen_ts_1,
      playerGen_ts_1,
      unitGen_ts_2,
      index_ts_2,
      randomSeed,
      seedHash,
      resources,
      baseType,
      players,
      initialState,
      player;
    var __moduleName = context_8 && context_8.id;
    function printResources(player) {
      let output = "Resources: ";
      for (let resource in player.resources) {
        output += `${resource}: ${player.resources[resource].amount}. `;
      }
      return output;
    }
    return {
      setters: [
        function (resourceGen_ts_1_1) {
          resourceGen_ts_1 = resourceGen_ts_1_1;
        },
        function (playerGen_ts_1_1) {
          playerGen_ts_1 = playerGen_ts_1_1;
        },
        function (unitGen_ts_2_1) {
          unitGen_ts_2 = unitGen_ts_2_1;
        },
        function (index_ts_2_1) {
          index_ts_2 = index_ts_2_1;
        },
      ],
      execute: function () {
        randomSeed = Math.round(Math.random() * 100000000000);
        seedHash = index_ts_2.default(String(randomSeed));
        resources = resourceGen_ts_1.default(seedHash);
        baseType = unitGen_ts_2.default({ resources, seed: seedHash });
        players = playerGen_ts_1.default(
          { resources, baseType, playerCount: 1, seed: seedHash },
        );
        initialState = {
          resources,
          baseType,
          players,
        };
        player = players["Player 1"];
        console.log(printResources(player));
        console.log(`Units: `, player.units);
        debugger;
      },
    };
  },
);

__instantiate("file:///home/danf/Documents/EvolvingTechGame/src/index");

