/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-tslint-rules
 */

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";

let peerDir: string | undefined = undefined;
let peerVersion: string | undefined = undefined;

try {
    const entry = resolve.sync("rxjs");
    peerDir = path.dirname(entry);
    const root = peerDir.replace(/node_modules[\/\\]rxjs[\/\\](.*)$/, (match) => match);
    peerVersion = require(path.join(root, "package.json")).version;
} catch (error) {
    warn();
}

export const dir = peerDir;
export const version = peerVersion;

export function warn(dir: string = ""): void {
    /*tslint:disable-next-line:no-console*/
    console.warn(`Cannot find node_modules/rxjs/${dir}; some rxjs-tslint-rules will be ineffectual.`);
}
