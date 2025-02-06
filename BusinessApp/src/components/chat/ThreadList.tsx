// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useState } from 'react';
import { threadStrings } from '../../utils/constants';
import { formatTimestampForThread } from '../../utils/datetime';
import { ThreadListHeader } from './ThreadListHeader';
import { ThreadItem } from './useThreads';
import { Label, List, ListItem, Persona } from '@fluentui/react-components';
import { useThreadListStyles } from '../../styles/ThreadList.styles';

export interface ThreadListProps {
  threads: Array<ThreadItem>;
  setSelectedThreadId(threadId: string): void;
}

export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { threads, setSelectedThreadId } = props;
  const styles = useThreadListStyles();
  const tabs = ['Active', 'Resolved'];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);

  const handleOnTabSelect = useCallback((tabValue: string): void => {
    setSelectedTab(tabValue);
  }, []);

  const onThreadSelected = useCallback(
    (threadId: string): void => {
      setSelectedThreadId(threadId);
    },
    [setSelectedThreadId]
  );

  const threadItem = (thread: ThreadItem): JSX.Element => {
    return (
      <div key={thread.id} className={styles.threadItemContainer}>
        <Persona name={thread.topic} textAlignment="center" size="small" avatar={{ color: 'colorful' }} />
        {
          <div className={styles.timestamp}>
            {formatTimestampForThread(thread.lastMessageReceivedOn, new Date(), threadStrings)}
          </div>
        }
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <ThreadListHeader tabs={tabs} onTabSelect={handleOnTabSelect} />
      <Label className={styles.label}>Assigned to me</Label>
      <List className={styles.threadList} navigationMode="items">
        {threads.map((thread) => {
          if (thread.status === selectedTab.toLowerCase()) {
            return (
              <ListItem
                key={thread.id}
                onAction={() => {
                  onThreadSelected(thread.id);
                }}
                className={styles.threadItem}
              >
                {threadItem(thread)}
              </ListItem>
            );
          }
        })}
      </List>
    </div>
  );
};
