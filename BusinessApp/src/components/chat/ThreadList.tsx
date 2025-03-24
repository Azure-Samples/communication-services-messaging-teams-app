// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useEffect, useState } from 'react';
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

  // Select the first thread when the component is mounted
  useEffect(() => {
    if (!selectedThreadId && threads?.[0]?.id) {
      handleOnThreadSelected(threads?.[0]?.id);
    }
  }, [handleOnThreadSelected, selectedThreadId, threads]);

  const threadItem = (thread: ThreadItem): JSX.Element => {
    return (
      <div key={thread.id} className={styles.threadItemContainer}>
        <Persona
          name={thread.topic}
          primaryText={<span className={styles.personaName}>{thread.topic}</span>} // Apply truncation style
          textAlignment="center"
          size="medium"
          avatar={{ color: 'colorful' }}
        />
        <div className={styles.timestamp}>
          {formatTimestampForThread(thread.lastMessageReceivedOn, new Date(), threadStrings)}
        </div>
      </div>
    );
  };

  const getThreadItemContainerStyle = useCallback(
    (threadId: string) => {
      const isSelected = threadId === selectedThreadId;
      const threadItemClassName = isSelected ? styles.selectedThreadItem : styles.unselectedThreadItem;
      return threadItemClassName;
    },
    [selectedThreadId, styles.selectedThreadItem, styles.unselectedThreadItem]
  );

  const threadList = (threads: ThreadItem[] | undefined): JSX.Element => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (!threads || threads.length <= 0) {
      return <Label className={styles.noThreadsLabel}>{threadStrings.noThreads}</Label>;
    }
    return (
      <>
        <Label className={styles.assignedToMeLabel}>{threadStrings.assignedToMe}</Label>
        <List className={styles.threadList} navigationMode="items">
          {threads.map((thread) => {
            if (thread.status === selectedTab.toLowerCase()) {
              return (
                <ListItem
                  key={thread.id}
                  onAction={() => {
                    handleOnThreadSelected(thread.id);
                  }}
                  className={getThreadItemContainerStyle(thread.id)}
                >
                  {threadItem(thread)}
                </ListItem>
              );
            }
          })}
        </List>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <ThreadListHeader tabs={tabs} onTabSelect={handleOnTabSelect} />
      {threadList(threads)}
    </div>
  );
};
