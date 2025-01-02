// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { threadStrings } from '../../utils/constants';
import { formatTimestampForThread } from '../../utils/datetime';
import './AgentScreen.css';
import { ThreadItem } from './useThreads';

export interface ThreadListProps {
  threads: Array<ThreadItem>;
  setSelectedThreadId(threadId: string): void;
}

export const ThreadList = (props: ThreadListProps): JSX.Element => {
  const { threads, setSelectedThreadId } = props;

  const onThreadSelected = (threadId: string): void => {
    setSelectedThreadId(threadId);
  };

  // TODO: UI will be handled in the future
  const threadItem = (thread: ThreadItem): JSX.Element => {
    return (
      <div
        key={thread.id}
        style={{ display: 'flex', flexDirection: 'row', padding: '10px', borderBottom: '1px solid #ccc' }}
      >
        <button onClick={() => onThreadSelected(thread.id)}>{thread.topic}</button>
        {/* TODO: UI will be handled in the future */}
        {thread.status === 'active' && <div style={{ padding: '5px' }}>Active</div>}
        {
          <div style={{ padding: '5px' }}>
            {formatTimestampForThread(thread.lastMessageReceivedOn, new Date(), threadStrings)}
          </div>
        }
      </div>
    );
  };

  return (
    <div style={{ width: '400px' }}>
      <h1 style={{ marginLeft: '15px' }}>Thread List</h1>
      {threads.map((thread) => threadItem(thread))}
    </div>
  );
};
