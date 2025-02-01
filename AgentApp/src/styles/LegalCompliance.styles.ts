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
    padding: '2rem 8rem', // 32px 128px
    gap: '1.5rem' // 16px
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  title: {
    fontSize: '2.125rem', // 34px
    fontWeight: 600,
    lineHeight: '2.375rem', // 38px
    margin: '2.5rem 0' // 24px 0
  },
  description: {
    width: '100%',
    padding: '0 1rem', // 0 16px
    fontSize: '1.25rem', // 20px
    fontWeight: 400,
    lineHeight: '1.8rem' // 28px
  }
});
