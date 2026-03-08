// Native ANSI color implementation — no dependencies needed
const R = '\x1b[0m';
const clr = (code) => (str) => `\x1b[${code}m${str}${R}`;
const bld = (code) => (str) => `\x1b[1m\x1b[${code}m${str}${R}`;

const bold   = Object.assign(clr(1), { red: bld(31), green: bld(32), yellow: bld(33), cyan: bld(36), white: bld(37), dim: (s) => `\x1b[1m\x1b[2m${s}${R}` });
const red    = Object.assign(clr(31), { bold: bld(31) });
const green  = Object.assign(clr(32), { bold: bld(32) });
const yellow = Object.assign(clr(33), { bold: bld(33) });
const blue   = Object.assign(clr(34), { bold: bld(34) });
const cyan   = Object.assign(clr(36), { bold: bld(36) });
const white  = Object.assign(clr(37), { bold: bld(37) });
const dim    = Object.assign(clr(2),  { bold: (s) => `\x1b[1m\x1b[2m${s}${R}` });

const chalk = { bold, red, green, yellow, blue, cyan, white, dim };
export default chalk;
