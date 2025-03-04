// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import MuiTypography from '@mui/material/Typography';
import React, { ReactElement } from 'react';
import { OpossumColors } from '../../shared-styles';
import { ListCardConfig } from '../../types/types';
import { Criticality } from '../../../shared/shared-types';
import MuiBox from '@mui/material/Box';
import { SxProps } from '@mui/material';
import { merge } from 'lodash';

const defaultCardHeight = '40px';
const hoveredSelectedBackgroundColor = OpossumColors.middleBlueOnHover;
const hoveredBackgroundColor = OpossumColors.lightestBlueOnHover;
const defaultBackgroundColor = OpossumColors.lightestBlue;
const packageBorder = `1px ${OpossumColors.white} solid`;

const getHighlightedBackground = (
  highlightColor: string,
  backgroundColor: string
): string => {
  return (
    'linear-gradient(225deg, ' +
    highlightColor +
    ' 44.5px, ' +
    backgroundColor +
    ' 0) 0 0/100% 40px no-repeat'
  );
};

const classes = {
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    height: defaultCardHeight,
  },
  hover: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  hoveredPackage: {
    border: packageBorder,
    background: hoveredBackgroundColor,
  },
  package: {
    border: packageBorder,
    background: defaultBackgroundColor,
    '&:hover': {
      background: hoveredBackgroundColor,
    },
  },
  highlightedPackage: {
    border: packageBorder,
    background: getHighlightedBackground(
      OpossumColors.lightOrange,
      defaultBackgroundColor
    ),
    '&:hover': {
      background: getHighlightedBackground(
        OpossumColors.lightOrangeOnHover,
        hoveredBackgroundColor
      ),
    },
  },
  externalAttribution: {
    background: defaultBackgroundColor,
    '&:hover': {
      background: hoveredBackgroundColor,
    },
  },
  hoveredExternalAttribution: {
    background: hoveredBackgroundColor,
  },
  resource: {
    background: OpossumColors.white,
    '&:hover': {
      background: OpossumColors.whiteOnHover,
    },
    height: '24px',
  },
  selected: {
    background: OpossumColors.middleBlue,
    '&:hover': {
      background: hoveredSelectedBackgroundColor,
    },
  },
  highlightedSelected: {
    background: getHighlightedBackground(
      OpossumColors.lightOrange,
      OpossumColors.middleBlue
    ),
    '&:hover': {
      background: getHighlightedBackground(
        OpossumColors.lightOrangeOnHover,
        hoveredSelectedBackgroundColor
      ),
    },
  },
  hoveredSelected: {
    background: hoveredSelectedBackgroundColor,
  },
  markedForReplacement: {
    borderRightWidth: 'medium',
    borderRightColor: OpossumColors.brown,
    borderRadius: '2px',
  },
  resolved: {
    opacity: 0.5,
  },
  highCriticality: {
    width: '4px',
    height: defaultCardHeight,
    background: OpossumColors.orange,
  },
  mediumCriticality: {
    width: '4px',
    height: defaultCardHeight,
    background: OpossumColors.mediumOrange,
  },
  textShortened: {
    overflowY: 'auto',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingLeft: '6px',
    marginRight: 'auto',
  },
  textShortenedFromLeftSide: {
    overflowY: 'auto',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingLeft: '6px',
    direction: 'rtl',
    textAlign: 'left',
    marginRight: 'auto',
  },
  count: {
    '&.MuiTypography-body2': {
      fontSize: '0.85rem',
      fontWeight: 'bold',
      lineHeight: '19px',
    },
    height: '19px',
    width: '26px',
    textAlign: 'center',
    writingMode: 'horizontal-tb',
  },
  iconColumn: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'flex-end',
    flexWrap: 'wrap-reverse',
    // fix for width of column flexbox container not growing after wrap
    // -> use row flexbox with vertical writing mode
    writingMode: 'vertical-lr',
    height: defaultCardHeight,
  },
  textLines: {
    margin: '0 6px 0 0',
    flex: 1,
  },
  longTextInFlexbox: {
    // standard fix for css problem "child element with text in flexbox is too long"
    minWidth: '0px',
  },
  textLine: {
    '&.MuiTypography-body2': {
      fontSize: '0.85rem',
    },
  },
  excludeFromNotice: {
    color: OpossumColors.darkBlue,
  },
  header: {
    background: OpossumColors.white,
    '&.MuiTypography-body2': {
      fontWeight: 'bold',
    },
    height: '20px',
    textAlign: 'left',
    '&:hover': {
      background: OpossumColors.white,
    },
  },
};

interface ListCardProps {
  text: string;
  secondLineText?: string;
  cardConfig: ListCardConfig;
  count?: number;
  onClick(): void;
  leftIcon?: JSX.Element;
  rightIcons?: Array<JSX.Element>;
  leftElement?: JSX.Element;
  highlightedCard?: boolean;
}

export function ListCard(props: ListCardProps): ReactElement | null {
  function getDisplayedCount(): string {
    const count = props.count ? props.count.toString() : '';

    if (count.length < 4) {
      return count;
    } else if (count.length < 7) {
      return `${count.slice(0, -3)}k`;
    } else {
      return `${count.slice(0, -6)}M`;
    }
  }

  return (
    <MuiBox sx={getSx(props.cardConfig, props.highlightedCard)}>
      {props.leftElement ? props.leftElement : null}
      <MuiBox
        sx={{
          ...classes.root,
          ...(props.cardConfig.isResource ? {} : classes.longTextInFlexbox),
        }}
        onClick={props.onClick}
      >
        <MuiBox sx={classes.iconColumn}>
          {props.leftIcon ? props.leftIcon : null}
          {getDisplayedCount() ? (
            <MuiTypography variant={'body2'} sx={classes.count}>
              {getDisplayedCount()}
            </MuiTypography>
          ) : null}
        </MuiBox>
        <MuiBox
          sx={{
            ...classes.textLines,
            ...(props.cardConfig.isResource ? {} : classes.longTextInFlexbox),
          }}
        >
          <MuiTypography
            variant={'body2'}
            sx={{
              ...(props.cardConfig.isHeader
                ? classes.header
                : classes.textLine),
              ...(props.cardConfig.isResource
                ? classes.textShortenedFromLeftSide
                : classes.textShortened),
            }}
          >
            {props.cardConfig.isResource ? <bdi>{props.text}</bdi> : props.text}
          </MuiTypography>
          {props.secondLineText ? (
            <MuiTypography
              variant={'body2'}
              sx={{
                ...classes.textLine,
                ...(props.cardConfig.isResource
                  ? classes.textShortenedFromLeftSide
                  : classes.textShortened),
              }}
            >
              {props.cardConfig.isResource ? (
                <bdi>{props.secondLineText}</bdi>
              ) : (
                props.secondLineText
              )}
            </MuiTypography>
          ) : null}
        </MuiBox>
        {props.rightIcons ? (
          <MuiBox sx={classes.iconColumn}>{props.rightIcons}</MuiBox>
        ) : null}
      </MuiBox>
      <MuiBox
        sx={{
          ...(props.cardConfig.criticality === Criticality.High
            ? classes.highCriticality
            : props.cardConfig.criticality === Criticality.Medium
            ? classes.mediumCriticality
            : {}),
        }}
      />
    </MuiBox>
  );
}

function getSx(cardConfig: ListCardConfig, highlightedCard?: boolean): SxProps {
  let sxProps: SxProps = { ...classes.root };

  if (cardConfig.isResource) {
    sxProps = merge(sxProps, classes.resource);
  } else {
    if (cardConfig.isContextMenuOpen) {
      sxProps = merge(sxProps, classes.hoveredPackage);
    } else {
      sxProps = merge(sxProps, classes.package);
    }
  }

  if (cardConfig.isExternalAttribution) {
    if (cardConfig.isContextMenuOpen) {
      sxProps = merge(sxProps, classes.hoveredExternalAttribution);
    } else {
      sxProps = merge(sxProps, classes.externalAttribution);
    }
  }

  if (cardConfig.isHeader) {
    sxProps = merge(sxProps, classes.header);
  } else {
    sxProps = merge(sxProps, classes.hover);
  }

  if (cardConfig.isMarkedForReplacement) {
    sxProps = merge(sxProps, classes.markedForReplacement);
  }

  if (cardConfig.isResolved) {
    sxProps = merge(sxProps, classes.resolved);
  }

  if (cardConfig.isSelected) {
    if (cardConfig.isContextMenuOpen) {
      sxProps = merge(sxProps, classes.hoveredSelected);
    } else {
      if (highlightedCard) {
        sxProps = merge(sxProps, classes.highlightedSelected);
      } else {
        sxProps = merge(sxProps, classes.selected);
      }
    }
  } else if (highlightedCard) {
    sxProps = merge(sxProps, classes.highlightedPackage);
  }

  return sxProps;
}
