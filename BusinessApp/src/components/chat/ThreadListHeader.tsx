// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { TabList, Tab, SelectTabEvent, SelectTabData } from '@fluentui/react-components';
import { useThreadListHeaderStyles } from '../../styles/ThreadListHeader.styles';
import { useCallback } from 'react';

export interface ThreadListHeaderProps {
  tabs: string[];
  selectedTab: string;
  onTabSelect(tabValue: string): void;
}

export const ThreadListHeader = (props: ThreadListHeaderProps): JSX.Element => {
  const { tabs, selectedTab, onTabSelect } = props;
  const styles = useThreadListHeaderStyles();

  const handleOnTabSelect = useCallback(
    (_: SelectTabEvent, data: SelectTabData): void => {
      const tabValue = data.value as string;
      if (!tabs.includes(tabValue)) {
        console.error('Invalid tab selected:', data.value);
        return;
      }
      onTabSelect(tabValue);
    },
    [onTabSelect, tabs]
  );

  return (
    <div className={styles.container}>
      <TabList
        aria-label="Thread List"
        className={styles.tabList}
        onTabSelect={handleOnTabSelect}
        selectedValue={selectedTab}
      >
        {tabs.map((tabValue) => {
          return (
            <Tab key={tabValue} value={tabValue}>
              {tabValue}
            </Tab>
          );
        })}
      </TabList>
    </div>
  );
};
