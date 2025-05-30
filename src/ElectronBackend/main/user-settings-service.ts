// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0
import { BrowserWindow } from 'electron';
import log from 'electron-log';
import settings from 'electron-settings';

import { AllowedFrontendChannels } from '../../shared/ipc-channels';
import { DEFAULT_USER_SETTINGS } from '../../shared/shared-constants';
import {
  UserSettings as IUserSettings,
  UserSettings,
} from '../../shared/shared-types';

export class UserSettingsService {
  public static async init() {
    if (process.argv.includes('--reset') || process.env.RESET) {
      log.info('Resetting user settings');
      await settings.set(DEFAULT_USER_SETTINGS as unknown as never);
    } else {
      const currentSettings = await settings.get();
      await settings.set({
        ...DEFAULT_USER_SETTINGS,
        ...currentSettings,
      });
    }
  }

  public static get<T extends keyof IUserSettings>(
    path: T,
  ): Promise<IUserSettings[T]>;
  public static get(): Promise<IUserSettings>;
  public static get<T extends keyof IUserSettings>(
    path?: T,
  ): Promise<IUserSettings[T]> | Promise<IUserSettings> {
    if (path) {
      return settings.get(path) as Promise<IUserSettings[T]>;
    }
    return settings.get() as unknown as Promise<IUserSettings>;
  }

  public static async update(
    userSettings: Partial<IUserSettings>,
    { skipNotification }: { skipNotification: boolean } = {
      skipNotification: false,
    },
  ): Promise<void> {
    for (const key of Object.keys(userSettings)) {
      const properKey = key as keyof UserSettings;
      if (userSettings[properKey] !== undefined) {
        await settings.set(properKey, userSettings[properKey]);
      }
    }
    if (!skipNotification) {
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send(
          AllowedFrontendChannels.UserSettingsChanged,
          userSettings,
        );
      });
    }
  }
}
