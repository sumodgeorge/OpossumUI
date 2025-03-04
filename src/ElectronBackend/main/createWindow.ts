// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
// SPDX-FileCopyrightText: Nico Carl <nicocarl@protonmail.com>
//
// SPDX-License-Identifier: Apache-2.0

import { BrowserWindow, Menu } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import upath from 'upath';
import { createMenu } from './menu';
import { getIconPath } from './iconHelpers';

export async function createWindow(): Promise<BrowserWindow> {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(upath.toUnix(__dirname), '../preload.js'),
    },
    icon: getIconPath(),
  });

  Menu.setApplicationMenu(createMenu(mainWindow));
  await loadApplication(mainWindow, '', '../../index.html', true);

  return mainWindow;
}

export async function loadApplication(
  mainWindow: BrowserWindow,
  devURLAppendix: string,
  prodEntryPoint: string,
  openDevTools: boolean
): Promise<void> {
  const devURL = 'http://localhost:3000' + devURLAppendix;
  if (isDev) {
    await mainWindow.loadURL(devURL);
    if (openDevTools) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    await mainWindow.loadURL(
      `file://${path.join(upath.toUnix(__dirname), prodEntryPoint)}`
    );
  }
}
