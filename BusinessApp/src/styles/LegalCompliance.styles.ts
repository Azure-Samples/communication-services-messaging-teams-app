// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { makeStyles } from '@fluentui/react-components';

export const useLegalComplianceStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '2rem 8rem',
    gap: '1.5rem'
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  title: {
    fontSize: '2.125rem',
    fontWeight: 600,
    lineHeight: '2.375rem',
    margin: '2.5rem 0'
  },
  description: {
    width: '100%',
    padding: '0 1rem',
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: '1.8rem'
  }
});
