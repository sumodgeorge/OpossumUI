// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement, useMemo } from 'react';
import { Attributions } from '../../../shared/shared-types';
import MuiTypography from '@mui/material/Typography';
import { List } from '../List/List';
import { useAppSelector } from '../../state/hooks';
import { getPackageSearchTerm } from '../../state/selectors/audit-view-resource-selectors';
import { getFilteredPackageIds } from './package-list-helpers';

const CARD_VERTICAL_DISTANCE = 41;
const TYPICAL_SCROLLBAR_WIDTH = 13;

const classes = {
  paddingRight: {
    paddingRight: `${TYPICAL_SCROLLBAR_WIDTH}px`,
  },
};

interface PackageListProps {
  attributions: Attributions;
  attributionIds: Array<string>;

  getAttributionCard(attributionId: string): ReactElement | null;

  maxNumberOfDisplayedItems: number;
  listTitle: string;
}

export function PackageList(props: PackageListProps): ReactElement {
  const searchTerm = useAppSelector(getPackageSearchTerm);

  const filteredPackageIds: Array<string> = useMemo(
    () =>
      getFilteredPackageIds(
        props.attributions,
        props.attributionIds,
        searchTerm
      ),
    [props.attributions, props.attributionIds, searchTerm]
  );

  const currentHeight = props.attributionIds.length * CARD_VERTICAL_DISTANCE;
  const maxHeight = props.maxNumberOfDisplayedItems * CARD_VERTICAL_DISTANCE;

  return (
    <>
      {filteredPackageIds.length === 0 ? null : (
        <>
          {props.listTitle ? (
            <MuiTypography variant={'body2'}>{props.listTitle}</MuiTypography>
          ) : null}
          <List
            getListItem={(index: number): ReactElement | null =>
              props.getAttributionCard(filteredPackageIds[index])
            }
            max={{ numberOfDisplayedItems: props.maxNumberOfDisplayedItems }}
            length={filteredPackageIds.length}
            cardVerticalDistance={CARD_VERTICAL_DISTANCE}
            sx={currentHeight < maxHeight ? classes.paddingRight : {}}
          />
        </>
      )}
    </>
  );
}
