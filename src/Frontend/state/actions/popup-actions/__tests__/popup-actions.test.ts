// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
// SPDX-FileCopyrightText: Nico Carl <nicocarl@protonmail.com>
//
// SPDX-License-Identifier: Apache-2.0
import {
  Attributions,
  Criticality,
  DiscreteConfidence,
  ExportType,
  FileType,
  PackageInfo,
  Resources,
  ResourcesToAttributions,
} from '../../../../../shared/shared-types';
import { faker } from '../../../../../testing/Faker';
import { PopupType, View } from '../../../../enums/enums';
import { getParsedInputFileEnrichedWithTestData } from '../../../../test-helpers/general-test-helpers';
import { State } from '../../../../types/types';
import { createAppStore } from '../../../configure-store';
import {
  getExpandedIds,
  getManualAttributions,
  getSelectedAttributionId,
  getSelectedResourceId,
  getTargetSelectedAttributionId,
  getTargetSelectedResourceId,
  getTemporaryDisplayPackageInfo,
} from '../../../selectors/resource-selectors';
import {
  getExportFileRequest,
  getImportFileRequest,
  getOpenFileRequest,
  getOpenPopup,
  getSelectedView,
  getTargetView,
} from '../../../selectors/view-selector';
import {
  setResources,
  setTemporaryDisplayPackageInfo,
} from '../../resource-actions/all-views-simple-actions';
import {
  setSelectedAttributionId,
  setSelectedResourceId,
  setTargetSelectedAttributionId,
  setTargetSelectedResourceId,
} from '../../resource-actions/audit-view-simple-actions';
import * as exportActions from '../../resource-actions/export-actions';
import { loadFromFile } from '../../resource-actions/load-actions';
import { savePackageInfo } from '../../resource-actions/save-actions';
import {
  navigateToView,
  openPopup,
  setExportFileRequest,
  setImportFileRequest,
  setOpenFileRequest,
  setTargetView,
} from '../../view-actions/view-actions';
import {
  changeSelectedAttributionOrOpenUnsavedPopup,
  closePopupAndUnsetTargets,
  navigateToSelectedPathOrOpenUnsavedPopup,
  proceedFromUnsavedPopup,
  setSelectedResourceIdOrOpenUnsavedPopup,
  setViewOrOpenUnsavedPopup,
} from '../popup-actions';

describe('The actions checking for unsaved changes', () => {
  describe('navigateToSelectedPathOrOpenUnsavedPopup', () => {
    it('sets view, selectedResourceId and expandedResources', () => {
      const testStore = createAppStore();
      testStore.dispatch(navigateToView(View.Audit));
      testStore.dispatch(
        navigateToSelectedPathOrOpenUnsavedPopup('/folder1/folder2/test_file'),
      );

      expect(getSelectedResourceId(testStore.getState())).toBe(
        '/folder1/folder2/test_file',
      );
      expect(getExpandedIds(testStore.getState())).toMatchObject([
        '/',
        '/folder1/',
        '/folder1/folder2/',
        '/folder1/folder2/test_file',
      ]);
    });
  });

  describe('changeSelectedAttributionIdOrOpenUnsavedPopup', () => {
    it(
      'setsTargetSelectedAttributionId and temporaryDisplayPackageInfo' +
        ' and opens popup if packageInfo were modified',
      () => {
        const testResources: Resources = {
          selectedResource: 1,
          newSelectedResource: 1,
        };
        const attribution: PackageInfo = {
          packageName: 'React',
          criticality: Criticality.None,
          id: 'uuid_1',
        };
        const testManualAttributions: Attributions = {
          uuid_1: attribution,
        };
        const testStore = createAppStore();
        testStore.dispatch(
          loadFromFile(
            getParsedInputFileEnrichedWithTestData({
              resources: testResources,
              manualAttributions: testManualAttributions,
            }),
          ),
        );

        testStore.dispatch(setSelectedResourceId('selectedResource'));
        testStore.dispatch(navigateToView(View.Audit));
        testStore.dispatch(
          savePackageInfo(null, null, {
            packageName: 'Test',
            criticality: Criticality.None,
            id: faker.string.uuid(),
          }),
        );
        testStore.dispatch(
          setTemporaryDisplayPackageInfo({
            packageName: 'Test 2',
            criticality: Criticality.None,
            id: faker.string.uuid(),
          }),
        );

        testStore.dispatch(
          changeSelectedAttributionOrOpenUnsavedPopup(attribution),
        );

        expect(getTargetSelectedAttributionId(testStore.getState())).toBe(
          'uuid_1',
        );
        expect(getSelectedView(testStore.getState())).toBe(View.Audit);
        expect(getOpenPopup(testStore.getState())?.popup).toBe(
          PopupType.NotSavedPopup,
        );
        expect(getSelectedAttributionId(testStore.getState())).toBe('');
        expect(
          getTemporaryDisplayPackageInfo(testStore.getState()),
        ).toMatchObject<Partial<PackageInfo>>({
          packageName: 'Test 2',
        });
      },
    );

    it('setSelectedAttributionId and temporaryDisplayPackageInfo if packageInfo were not modified', () => {
      const testResources: Resources = {
        selectedResource: 1,
        newSelectedResource: 1,
      };
      const attribution: PackageInfo = {
        packageName: 'React',
        criticality: Criticality.None,
        id: 'uuid_1',
      };
      const testManualAttributions: Attributions = {
        uuid_1: attribution,
      };
      const testStore = createAppStore();
      testStore.dispatch(
        loadFromFile(
          getParsedInputFileEnrichedWithTestData({
            resources: testResources,
            manualAttributions: testManualAttributions,
          }),
        ),
      );

      testStore.dispatch(setSelectedResourceId('selectedResource'));
      testStore.dispatch(setSelectedAttributionId('selectedAttributionId'));
      testStore.dispatch(navigateToView(View.Audit));
      testStore.dispatch(
        setTemporaryDisplayPackageInfo({
          packageName: 'Test',
          criticality: Criticality.None,
          id: faker.string.uuid(),
        }),
      );
      testStore.dispatch(
        savePackageInfo('selectedResource', 'selectedAttributionId', {
          packageName: 'Test',
          criticality: Criticality.None,
          id: faker.string.uuid(),
        }),
      );

      testStore.dispatch(
        changeSelectedAttributionOrOpenUnsavedPopup(attribution),
      );

      expect(getSelectedView(testStore.getState())).toBe(View.Audit);
      expect(getOpenPopup(testStore.getState())).toBeFalsy();
      expect(getSelectedAttributionId(testStore.getState())).toBe('uuid_1');
      expect(
        getTemporaryDisplayPackageInfo(testStore.getState()),
      ).toEqual<PackageInfo>({
        packageName: 'React',
        criticality: Criticality.None,
        id: 'uuid_1',
      });
    });
  });

  describe('The setViewOrOpenUnsavedPopup action', () => {
    it('sets view', () => {
      const testStore = createAppStore();
      testStore.dispatch(navigateToView(View.Report));
      testStore.dispatch(setViewOrOpenUnsavedPopup(View.Audit));
      expect(getSelectedView(testStore.getState())).toBe(View.Audit);
    });

    it('opens unsaved-popup', () => {
      const testStore = createAppStore();
      testStore.dispatch(navigateToView(View.Report));
      testStore.dispatch(setSelectedResourceId('/testId/'));
      testStore.dispatch(
        setTemporaryDisplayPackageInfo({
          packageName: 'new Name',
          criticality: Criticality.None,
          id: faker.string.uuid(),
        }),
      );
      testStore.dispatch(setViewOrOpenUnsavedPopup(View.Audit));
      expect(getSelectedView(testStore.getState())).toBe(View.Report);
      expect(getTargetView(testStore.getState())).toBe(View.Audit);
      expect(getTargetSelectedResourceId(testStore.getState())).toBe(
        '/testId/',
      );
      expect(getOpenPopup(testStore.getState())?.popup).toBe(
        PopupType.NotSavedPopup,
      );
    });
  });

  describe('setSelectedResourceIdOrOpenUnsavedPopup', () => {
    const testResources: Resources = {
      thirdParty: {
        'package_1.tr.gz': 1,
        'package_2.tr.gz': 1,
      },
      root: {
        src: {
          'something.js': 1,
        },
        'readme.md': 1,
      },
    };

    const testManualAttributionUuid_1 = '4d9f0b16-fbff-11ea-adc1-0242ac120002';
    const testManualAttributionUuid_2 = 'b5da73d4-f400-11ea-adc1-0242ac120002';
    const testPackageInfo: PackageInfo = {
      attributionConfidence: DiscreteConfidence.High,
      packageVersion: '1.0',
      packageName: 'test Package',
      licenseText: ' test License text',
      criticality: Criticality.None,
      id: testManualAttributionUuid_1,
    };
    const secondTestPackageInfo: PackageInfo = {
      packageVersion: '2.0',
      packageName: 'not assigned test Package',
      licenseText: ' test not assigned License text',
      criticality: Criticality.None,
      id: testManualAttributionUuid_2,
    };
    const testManualAttributions: Attributions = {
      [testManualAttributionUuid_1]: testPackageInfo,
      [testManualAttributionUuid_2]: secondTestPackageInfo,
    };
    const testResourcesToManualAttributions: ResourcesToAttributions = {
      '/root/src/something.js': [testManualAttributionUuid_1],
    };

    it('set selected resource id', () => {
      const testStore = createAppStore();
      testStore.dispatch(
        loadFromFile(
          getParsedInputFileEnrichedWithTestData({
            resources: testResources,
            manualAttributions: testManualAttributions,
            resourcesToManualAttributions: testResourcesToManualAttributions,
          }),
        ),
      );
      testStore.dispatch(setSelectedResourceId('/root/'));
      expect(getSelectedResourceId(testStore.getState())).toBe('/root/');
      testStore.dispatch(
        setSelectedResourceIdOrOpenUnsavedPopup('/thirdParty/'),
      );
      expect(getSelectedResourceId(testStore.getState())).toBe('/thirdParty/');
    });

    it('open unsaved-popup', () => {
      const testStore = createAppStore();
      testStore.dispatch(
        loadFromFile(
          getParsedInputFileEnrichedWithTestData({
            resources: testResources,
            manualAttributions: testManualAttributions,
            resourcesToManualAttributions: testResourcesToManualAttributions,
          }),
        ),
      );
      testStore.dispatch(setSelectedResourceId('/root/'));
      testStore.dispatch(
        setTemporaryDisplayPackageInfo({
          packageName: 'new Name',
          criticality: Criticality.None,
          id: faker.string.uuid(),
        }),
      );
      expect(getSelectedResourceId(testStore.getState())).toBe('/root/');
      testStore.dispatch(
        setSelectedResourceIdOrOpenUnsavedPopup('/thirdParty/'),
      );
      expect(getSelectedResourceId(testStore.getState())).toBe('/root/');
      expect(getTargetSelectedResourceId(testStore.getState())).toBe(
        '/thirdParty/',
      );
      expect(getOpenPopup(testStore.getState())?.popup).toBe(
        PopupType.NotSavedPopup,
      );
    });
  });
});

describe('proceedFromUnsavedPopup', () => {
  function prepareTestState(): State {
    const testStore = createAppStore();
    testStore.dispatch(
      setResources({ selectedResource: 1, newSelectedResource: 1 }),
    );
    testStore.dispatch(setSelectedResourceId('selectedResource'));
    testStore.dispatch(
      setTemporaryDisplayPackageInfo({
        packageName: 'Test',
        criticality: Criticality.None,
        id: faker.string.uuid(),
      }),
    );
    testStore.dispatch(navigateToView(View.Report));
    testStore.dispatch(setTargetView(View.Audit));
    testStore.dispatch(openPopup(PopupType.NotSavedPopup));
    testStore.dispatch(setTargetSelectedResourceId('newSelectedResource'));
    testStore.dispatch(proceedFromUnsavedPopup());
    return testStore.getState();
  }

  it('closes popup', () => {
    const state = prepareTestState();
    expect(getOpenPopup(state)).toBeFalsy();
  });

  it('sets the view', () => {
    const state = prepareTestState();
    expect(getSelectedView(state)).toBe(View.Audit);
  });

  it('sets targetSelectedResourceOrAttribution', () => {
    const state = prepareTestState();
    expect(getSelectedResourceId(state)).toBe('newSelectedResource');
  });

  it('sets temporaryDisplayPackageInfo', () => {
    const state = prepareTestState();
    expect(getTemporaryDisplayPackageInfo(state)).toMatchObject({});
  });

  it('does not save temporaryDisplayPackageInfo', () => {
    const state = prepareTestState();
    expect(getManualAttributions(state)).toMatchObject({});
  });

  it('proceeds with open file request', () => {
    jest.spyOn(window.electronAPI, 'openFile').mockResolvedValue({});

    const testStore = createAppStore();
    testStore.dispatch(setOpenFileRequest(true));
    testStore.dispatch(openPopup(PopupType.NotSavedPopup));
    testStore.dispatch(proceedFromUnsavedPopup());

    expect(window.electronAPI.openFile).toHaveBeenCalled();
    expect(getOpenFileRequest(testStore.getState())).toBe(false);
  });

  it('proceeds with import file request', () => {
    const testStore = createAppStore();
    const fileFormat = {
      fileType: FileType.LEGACY_OPOSSUM,
      extensions: [],
      name: '',
    };
    testStore.dispatch(setImportFileRequest(fileFormat));
    testStore.dispatch(openPopup(PopupType.NotSavedPopup));
    testStore.dispatch(proceedFromUnsavedPopup());

    expect(getOpenPopup(testStore.getState())).toStrictEqual({
      popup: PopupType.ImportDialog,
      attributionId: undefined,
      fileFormat,
    });
    expect(getImportFileRequest(testStore.getState())).toBeNull();
  });

  it('proceeds with export file request', () => {
    jest.spyOn(exportActions, 'exportFile').mockReturnValue(() => {});

    const testStore = createAppStore();
    testStore.dispatch(setExportFileRequest(ExportType.FollowUp));
    testStore.dispatch(openPopup(PopupType.NotSavedPopup));
    testStore.dispatch(proceedFromUnsavedPopup());

    expect(exportActions.exportFile).toHaveBeenCalledWith(ExportType.FollowUp);
    expect(getExportFileRequest(testStore.getState())).toBeNull();
  });
});

describe('closePopupAndUnsetTargets', () => {
  it('closes popup and unsets targets', () => {
    const testStore = createAppStore();
    testStore.dispatch(openPopup(PopupType.NotSavedPopup));
    testStore.dispatch(setTargetView(View.Audit));
    testStore.dispatch(setTargetSelectedResourceId('resourceID'));
    testStore.dispatch(setTargetSelectedAttributionId('attributionID'));
    testStore.dispatch(setOpenFileRequest(true));
    testStore.dispatch(
      setImportFileRequest({
        fileType: FileType.LEGACY_OPOSSUM,
        extensions: [],
        name: '',
      }),
    );
    testStore.dispatch(setExportFileRequest(ExportType.FollowUp));

    testStore.dispatch(closePopupAndUnsetTargets());

    expect(getTargetView(testStore.getState())).toBeNull();
    expect(getTargetSelectedResourceId(testStore.getState())).toBeNull();
    expect(getTargetSelectedAttributionId(testStore.getState())).toBeNull();
    expect(getOpenFileRequest(testStore.getState())).toBe(false);
    expect(getImportFileRequest(testStore.getState())).toBeNull();
    expect(getExportFileRequest(testStore.getState())).toBeNull();
    expect(getOpenPopup(testStore.getState())).toBeNull();
  });
});
