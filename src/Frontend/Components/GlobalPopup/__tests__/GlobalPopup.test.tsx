// SPDX-FileCopyrightText: Meta Platforms, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { openPopup } from '../../../state/actions/view-actions/view-actions';
import {
  createTestAppStore,
  renderComponentWithStore,
} from '../../../test-helpers/render-component-with-store';
import { GlobalPopup } from '../GlobalPopup';
import { PopupType } from '../../../enums/enums';
import { screen } from '@testing-library/react';
import { Attributions } from '../../../../shared/shared-types';
import { loadFromFile } from '../../../state/actions/resource-actions/load-actions';
import { getParsedInputFileEnrichedWithTestData } from '../../../test-helpers/general-test-helpers';
import { setMultiSelectSelectedAttributionIds } from '../../../state/actions/resource-actions/attribution-view-simple-actions';
import { act } from 'react-dom/test-utils';

describe('The GlobalPopUp', () => {
  it('does not open by default', () => {
    renderComponentWithStore(<GlobalPopup />);

    expect(screen.queryByText('Warning')).not.toBeInTheDocument();
  });

  it('opens the NotSavedPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.NotSavedPopup));
    });

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('opens the ErrorPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.UnableToSavePopup));
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('opens the FileSearchPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.FileSearchPopup));
    });

    expect(
      screen.getByText('Search for Files and Directories')
    ).toBeInTheDocument();
  });

  it('opens the ProjectMetadataPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.ProjectMetadataPopup));
    });

    expect(screen.getByText('Project Metadata')).toBeInTheDocument();
  });

  it('opens the ProjectStatisticsPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.ProjectStatisticsPopup));
    });

    expect(screen.getByText('Project Statistics')).toBeInTheDocument();
  });

  it('opens the ReplaceAttributionPopup', () => {
    const testAttributions: Attributions = {
      uuid1: { packageName: 'name 1' },
    };
    const testStore = createTestAppStore();
    testStore.dispatch(
      loadFromFile(
        getParsedInputFileEnrichedWithTestData({
          manualAttributions: testAttributions,
        })
      )
    );

    renderComponentWithStore(<GlobalPopup />, {
      store: testStore,
    });
    act(() => {
      testStore.dispatch(openPopup(PopupType.ReplaceAttributionPopup, 'uuid1'));
    });

    expect(
      screen.getByText('This removes the following attribution')
    ).toBeInTheDocument();
  });

  it('opens the ConfirmDeletionPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.ConfirmDeletionPopup, 'test'));
    });

    expect(
      screen.getByText(
        'Do you really want to delete this attribution for the current file?'
      )
    ).toBeInTheDocument();
  });

  it('opens the ConfirmDeletionGloballyPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.ConfirmDeletionGloballyPopup, 'test'));
    });

    expect(
      screen.getByText(
        'Do you really want to delete this attribution for all files?'
      )
    ).toBeInTheDocument();
  });

  it('opens the ConfirmMultiSelectDeletionPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(openPopup(PopupType.ConfirmMultiSelectDeletionPopup));
      store.dispatch(
        setMultiSelectSelectedAttributionIds(['uuid_1', 'uuid_2'])
      );
    });

    expect(
      screen.getByText(
        'Do you really want to delete the selected attributions for all files? This action will delete 2 attributions.'
      )
    ).toBeInTheDocument();
  });

  it('opens the AttributionWizardPopup', () => {
    const { store } = renderComponentWithStore(<GlobalPopup />);
    act(() => {
      store.dispatch(
        openPopup(PopupType.AttributionWizardPopup, 'test_attribution_id')
      );
    });
    expect(screen.getByText('Attribution Wizard')).toBeInTheDocument();
  });
});
