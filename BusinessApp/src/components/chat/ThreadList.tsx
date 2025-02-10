// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useState } from 'react';
import { threadStrings } from '../../utils/constants';
import { formatTimestampForThread } from '../../utils/datetime';
import { ThreadListHeader } from './ThreadListHeader';
import { ThreadItem, ThreadItemStatus } from './useThreads';
import { Label, List, ListItem, Persona } from '@fluentui/react-components';
import { useThreadListStyles } from '../../styles/ThreadList.styles';
import { LoadingSpinner } from './LoadingSpinner';
import { capitalizeString } from '../../utils/utils';

export interface ThreadListProps {
  threads?: Array<ThreadItem>;
  isLoading: boolean;
  onThreadSelected(threadId: string): void;
}

export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { threads, isLoading, onThreadSelected } = props;
  const styles = useThreadListStyles();
  const tabs = [capitalizeString(ThreadItemStatus.ACTIVE), capitalizeString(ThreadItemStatus.RESOLVED)];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

  const handleOnTabSelect = useCallback((tabValue: string): void => {
    setSelectedTab(tabValue);
  }, []);

  const handleOnThreadSelected = useCallback(
    (threadId: string): void => {
      setSelectedThreadId(threadId);
      onThreadSelected(threadId);
    },
    [onThreadSelected]
  );

  const threadItem = (thread: ThreadItem): JSX.Element => {
    return (
      <div key={thread.id} className={styles.threadItemContainer}>
        <Persona name={thread.topic} textAlignment="center" size="medium" />
        <div className={styles.timestamp}>
          {formatTimestampForThread(thread.lastMessageReceivedOn, new Date(), threadStrings)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <ThreadListHeader tabs={tabs} onTabSelect={handleOnTabSelect} />
      <Label className={styles.label}>Assigned to me</Label>
      {!isLoading && threads ? (
        <List className={styles.threadList} navigationMode="items">
          {threads.map((thread) => {
            if (thread.status === selectedTab.toLowerCase()) {
              const isSelected = thread.id === selectedThreadId;
              const threadItemClassName = isSelected ? styles.selectedThreadItem : styles.unselectedThreadItem;
              return (
                <ListItem
                  key={thread.id}
                  onAction={() => {
                    handleOnThreadSelected(thread.id);
                  }}
                  className={threadItemClassName}
                >
                  {threadItem(thread)}
                </ListItem>
              );
            }
          })}
        </List>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};
