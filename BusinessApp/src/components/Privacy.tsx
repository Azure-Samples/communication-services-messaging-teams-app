// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text } from '@fluentui/react-components';
import { useLegalComplianceStyles } from '../styles/LegalCompliance.styles';

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */

export const Privacy = (): JSX.Element => {
  const styles = useLegalComplianceStyles();
  return (
    <div className={styles.container}>
      <Text className={styles.title}>Privacy Statement</Text>
      <div className={styles.sectionContainer}>
        <Text className={styles.description}>
          <strong>Please add your privacy statement before going to production.</strong>
        </Text>
      </div>
      <div className={styles.sectionContainer}>
        {' '}
        <Text className={styles.description}>
          Privacy statement is mandatory for all apps submitted to the Teams Store.
        </Text>
        <Text className={styles.description}>
          For more information, please refer to the Privacy policy section of the{' '}
          <a href="https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/teams-store-validation-guidelines#privacy-policy">
            Teams Store validation guidelines.
          </a>
        </Text>
      </div>

      <div className={styles.sectionContainer}>
        <Text className={styles.description}>
          If you have a privacy policy page hosted elsewhere, instead of using this component, you can directly link to
          the external page by modify the privacyUrl property of the manifest.json file.
        </Text>
        <Text className={styles.description}>
          For more information, please refer to{' '}
          <a href="https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema#developer">
            App manifest.
          </a>
        </Text>
      </div>
    </div>
  );
};

export default Privacy;
