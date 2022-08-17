// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { Attributions } from '../../../../shared/shared-types';
import { getSortedFilteredPackageIds } from '../package-list-helpers';

describe('The PackageListHelper', () => {
  it('filters Attributions', () => {
    const testAttributions: Attributions = {
      uuid1: {
        packageName: 'Search_term package',
      },
      uuid2: {
        copyright: '(c) Search_term 2022',
      },
      uuid3: {
        licenseName: 'Search_term licence',
      },
      uuid4: {
        packageVersion: 'version search_term',
      },
      uuid5: {
        comment: 'comment search_term',
        licenseText: 'text search_term',
        url: 'www.search_term.com',
      },
    };
    const testAttributionIds = Object.entries(testAttributions).map(
      ([attributionId]) => attributionId
    );
    const sortedFilteredTestAttributions = getSortedFilteredPackageIds(
      testAttributions,
      testAttributionIds,
      'SeArCh_TeRm'
    );

    expect(sortedFilteredTestAttributions).toContain('uuid1');
    expect(sortedFilteredTestAttributions).toContain('uuid2');
    expect(sortedFilteredTestAttributions).toContain('uuid3');
    expect(sortedFilteredTestAttributions).toContain('uuid4');
    expect(sortedFilteredTestAttributions).not.toContain('uuid5');
  });

  it('sorts Attributions', () => {
    const testAttributions = {
      uuid1: {
        packageName: 'package 3',
      },
      uuid2: {
        packageName: 'package 1',
      },
      uuid3: {
        packageName: 'package 2',
      },
    };
    const testAttributionIds = Object.entries(testAttributions).map(
      ([attributionId]) => attributionId
    );
    const sortedFilteredTestAttributions = getSortedFilteredPackageIds(
      testAttributions,
      testAttributionIds,
      ''
    );
    expect(sortedFilteredTestAttributions).toEqual(['uuid2', 'uuid3', 'uuid1']);
  });
});
