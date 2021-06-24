/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

if (process.platform === 'darwin' && process.arch === 'arm64') {
    console.error(`Stronghold is not currently supported on Apple Silicon. We are looking for a solution to this issue and will provide updates when available.`)
    process.exitCode = 1   
}