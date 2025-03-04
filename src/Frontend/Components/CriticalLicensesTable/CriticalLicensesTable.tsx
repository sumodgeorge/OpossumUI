// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';
import { Criticality } from '../../../shared/shared-types';
import { ProjectLicensesTable } from '../ProjectLicensesTable/ProjectLicensesTable';
import { LicenseNamesWithCriticality } from '../../types/types';

const LICENSE_COLUMN_NAME_IN_TABLE = 'License name';
const COUNT_COLUMN_NAME_IN_TABLE = 'Count';
const FOOTER_TITLE = 'Total';
const TABLE_COLUMN_NAMES = [
  LICENSE_COLUMN_NAME_IN_TABLE,
  COUNT_COLUMN_NAME_IN_TABLE,
];

const classes = {
  container: {
    maxHeight: '400px',
    maxWidth: '500px',
    marginBottom: '3px',
  },
};

interface CriticalLicensesTableProps {
  totalAttributionsPerLicense: { [licenseName: string]: number };
  licenseNamesWithCriticality: LicenseNamesWithCriticality;
  title: string;
}

export function CriticalLicensesTable(
  props: CriticalLicensesTableProps
): ReactElement {
  const allLicensesWithCriticality = Object.entries(
    props.licenseNamesWithCriticality
  ).map((licenseNameAndCriticality) => {
    return {
      licenseName: licenseNameAndCriticality[0],
      criticality: licenseNameAndCriticality[1],
    };
  });
  const highCriticalityLicenseNames = getLicenseNamesByCriticality(
    allLicensesWithCriticality,
    Criticality.High
  );
  const mediumCriticalityLicenseNames = getLicenseNamesByCriticality(
    allLicensesWithCriticality,
    Criticality.Medium
  );
  const highCriticalityLicensesTotalAttributions =
    getCriticalLicenseNamesWithTheirTotalAttributions(
      props.totalAttributionsPerLicense,
      highCriticalityLicenseNames
    );
  const mediumCriticalityLicensesTotalAttributions =
    getCriticalLicenseNamesWithTheirTotalAttributions(
      props.totalAttributionsPerLicense,
      mediumCriticalityLicenseNames
    );
  const criticalLicensesTotalAttributions =
    highCriticalityLicensesTotalAttributions.concat(
      mediumCriticalityLicensesTotalAttributions
    );

  return (
    <ProjectLicensesTable
      title={props.title}
      containerStyle={classes.container}
      columnHeaders={TABLE_COLUMN_NAMES}
      columnNames={TABLE_COLUMN_NAMES}
      rowNames={criticalLicensesTotalAttributions.map(
        (attribution) => attribution.licenseName
      )}
      tableContent={Object.fromEntries(
        criticalLicensesTotalAttributions.map(
          ({ licenseName, totalNumberOfAttributions }) => [
            licenseName,
            { [COUNT_COLUMN_NAME_IN_TABLE]: totalNumberOfAttributions },
          ]
        )
      )}
      tableFooter={[FOOTER_TITLE].concat(
        getTotalNumberOfAttributions(
          criticalLicensesTotalAttributions
        ).toString()
      )}
      licenseNamesWithCriticality={props.licenseNamesWithCriticality}
    />
  );
}

function getLicenseNamesByCriticality(
  allLicensesWithCriticality: Array<{
    licenseName: string;
    criticality: Criticality | undefined;
  }>,
  criticality: Criticality
): Array<string> {
  return allLicensesWithCriticality
    .map((licenseNameAndCriticality) =>
      licenseNameAndCriticality.criticality === criticality
        ? licenseNameAndCriticality.licenseName
        : ''
    )
    .filter((licenseName) => licenseName !== '');
}

function getCriticalLicenseNamesWithTheirTotalAttributions(
  totalAttributionsPerLicense: { [licenseName: string]: number },
  criticalLicenseNames: Array<string>
): Array<{ licenseName: string; totalNumberOfAttributions: number }> {
  const licenseNamesAndTheirTotalAttributions = criticalLicenseNames.map(
    (criticalLicenseName) => {
      return {
        licenseName: criticalLicenseName,
        totalNumberOfAttributions:
          totalAttributionsPerLicense[criticalLicenseName],
      };
    }
  );
  return licenseNamesAndTheirTotalAttributions.sort();
}

function getTotalNumberOfAttributions(
  licenseNamesAndTheirTotalAttributions: Array<{
    licenseName: string;
    totalNumberOfAttributions: number;
  }>
): number {
  return licenseNamesAndTheirTotalAttributions
    .map(
      (licenseNameAndTotalAttributions) =>
        licenseNameAndTotalAttributions.totalNumberOfAttributions
    )
    .reduce((total, value) => total + value, 0);
}
