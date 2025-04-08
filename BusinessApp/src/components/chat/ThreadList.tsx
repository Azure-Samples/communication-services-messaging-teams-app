// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useCallback, useEffect } from 'react';
import { threadStrings } from '../../utils/constants';
import { formatTimestampForThread } from '../../utils/datetime';
import { ThreadListHeader } from './ThreadListHeader';
import { ThreadItem } from './useThreads';
import { Label, List, ListItem, Persona } from '@fluentui/react-components';
import { useThreadListStyles } from '../../styles/ThreadList.styles';
import { LoadingSpinner } from './LoadingSpinner';

export interface ThreadListProps {
  threads?: Array<ThreadItem>;
  isLoading: boolean;
  selectedThreadId?: string;
  onThreadSelected(threadId: string): void;
  tabs: string[];
  selectedTab: string;
  onStatusTabSelected(tabValue: string): void;
}

export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { threads, isLoading, selectedThreadId, onThreadSelected, tabs, selectedTab, onStatusTabSelected } = props;
  const styles = useThreadListStyles();

  const handleOnThreadSelected = useCallback(
    (threadId: string): void => {
      onThreadSelected(threadId);
    },
    [onThreadSelected]
  );

  // Select the first thread when the component is mounted
  useEffect(() => {
    if (!selectedThreadId && threads && threads?.length > 0) {
      const firstThread = threads.find((thread) => thread.status === selectedTab.toLowerCase());
      firstThread && handleOnThreadSelected(firstThread?.id);
    }
  }, [handleOnThreadSelected, selectedTab, selectedThreadId, threads]);

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
    const currentStatusThreads = threads?.filter((thread) => thread.status === selectedTab.toLowerCase());
    if (!threads || !currentStatusThreads || currentStatusThreads.length <= 0) {
      return <Label className={styles.noThreadsLabel}>{threadStrings.noThreads}</Label>;
    }
    return (
      <>
        <Label className={styles.assignedToMeLabel}>{threadStrings.assignedToMe}</Label>
        <List className={styles.threadList} navigationMode="items">
          {currentStatusThreads.map((thread) => {
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
          })}
        </List>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <ThreadListHeader tabs={tabs} selectedTab={selectedTab} onTabSelect={onStatusTabSelected} />
      {threadList(threads)}
    </div>
  );
};
