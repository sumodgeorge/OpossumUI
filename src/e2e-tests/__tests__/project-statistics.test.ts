// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0
import { Criticality, RawCriticality } from '../../shared/shared-types';
import { faker, test } from '../utils';

const [resourceName1] = faker.opossum.resourceNames({ count: 1 });
const [attributionId1, packageInfo1] = faker.opossum.rawAttribution({
  criticality: RawCriticality[Criticality.Medium],
});
const [attributionId3, packageInfo3] = faker.opossum.rawAttribution({
  criticality: RawCriticality[Criticality.Medium],
});
test.use({
  data: {
    inputData: faker.opossum.inputData({
      resources: faker.opossum.resources({
        [resourceName1]: 1,
      }),
      externalAttributions: faker.opossum.rawAttributions({
        [attributionId1]: packageInfo1,
        [attributionId3]: packageInfo3,
      }),
      resourcesToAttributions: faker.opossum.resourcesToAttributions({
        [faker.opossum.filePath(resourceName1)]: [
          attributionId1,
          attributionId3,
        ],
      }),
    }),
    outputData: faker.opossum.outputData({
      manualAttributions: faker.opossum.rawAttributions({
        [attributionId1]: packageInfo1,
      }),
    }),
  },
});

test('opens, displays, and closes project statistics', async ({
  menuBar,
  projectStatisticsPopup,
}) => {
  await menuBar.openProjectStatistics();
  await projectStatisticsPopup.assert.titleIsVisible();

  await projectStatisticsPopup.closeButton.click();
  await projectStatisticsPopup.assert.titleIsHidden();
});

test('displays bar and pie charts in the overview tab', async ({
  menuBar,
  projectStatisticsPopup,
}) => {
  await menuBar.openProjectStatistics();
  await projectStatisticsPopup.assert.titleIsVisible();
  // hover on title to avoid getting tooltips that mess up locators
  await projectStatisticsPopup.title.hover();

  await projectStatisticsPopup.assert.attributionPropertiesIsVisible();
  await projectStatisticsPopup.assert.mostFrequentLicensesPieChartIsVisible(
    packageInfo1.licenseName!,
  );
  await projectStatisticsPopup.assert.signalsByCriticalityIsVisible();
  await projectStatisticsPopup.assert.signalsByClassificationIsVisible();
  await projectStatisticsPopup.assert.incompleteAttributionsIsVisible();
});

test('hidden signals are ignored for project statistics', async ({
  menuBar,
  projectStatisticsPopup,
  resourcesTree,
  signalsPanel,
  attributionDetails,
}) => {
  await menuBar.openProjectStatistics();
  await projectStatisticsPopup.assert.titleIsVisible();
  await projectStatisticsPopup.detailsTab.click();

  await projectStatisticsPopup.assert.totalSignalCount(2);

  await projectStatisticsPopup.closeButton.click();
  await resourcesTree.goto(resourceName1);

  await signalsPanel.packageCard.assert.isVisible(packageInfo1);
  await signalsPanel.packageCard.assert.isVisible(packageInfo3);

  await signalsPanel.packageCard.click(packageInfo3);
  await attributionDetails.deleteButton.click();
  await signalsPanel.packageCard.assert.isHidden(packageInfo3);

  await menuBar.openProjectStatistics();
  await projectStatisticsPopup.detailsTab.click();

  await projectStatisticsPopup.assert.totalSignalCount(1);
});
