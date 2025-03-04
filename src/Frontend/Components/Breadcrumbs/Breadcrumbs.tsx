// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiListItemButton from '@mui/material/ListItemButton';
import MuiTypography from '@mui/material/Typography';
import MuiNavigateNextIcon from '@mui/icons-material/NavigateNext';
import { OpossumColors } from '../../shared-styles';

const classes = {
  breadcrumbs: {
    color: OpossumColors.black,
    '.MuiBreadcrumbs-separator': {
      margin: '0px',
    },
  },
  breadcrumbsButton: {
    padding: '1px 4px',
    backgroundColor: OpossumColors.white,
    '&:hover': {
      backgroundColor: OpossumColors.white,
    },
    '&:loading': {
      backgroundColor: OpossumColors.white,
    },
    '&.Mui-selected': {
      '&:hover': {
        backgroundColor: OpossumColors.white,
      },
      backgroundColor: OpossumColors.white,
    },
    '&.Mui-disabled': {
      opacity: 1,
    },
  },
  breadcrumbsSelected: {
    fontWeight: 'bold',
  },
};

interface BreadcrumbsProps {
  selectedId: string;
  onClick: (id: string) => void;
  idsToDisplayValues: Array<[string, string]>;
}

export function Breadcrumbs(props: BreadcrumbsProps): ReactElement {
  const ids: Array<string> = props.idsToDisplayValues.map(
    (idToDisplayValue) => idToDisplayValue[0]
  );

  return (
    <MuiBreadcrumbs
      sx={classes.breadcrumbs}
      separator={<MuiNavigateNextIcon fontSize="inherit" />}
    >
      {ids.map((id, index) => (
        <MuiListItemButton
          key={`breadcrumbs-${id}`}
          sx={classes.breadcrumbsButton}
          selected={props.selectedId === id}
          onClick={(): void => props.onClick(id)}
          disableRipple={true}
          disabled={index >= ids.indexOf(props.selectedId)}
        >
          <MuiTypography
            sx={props.selectedId === id ? classes.breadcrumbsSelected : null}
          >
            {props.idsToDisplayValues[index][1]}
          </MuiTypography>
        </MuiListItemButton>
      ))}
    </MuiBreadcrumbs>
  );
}
