// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ThreadItem, ThreadItemStatus } from '../components/chat/useThreads';

export const getNextActiveThreadId = (threads: ThreadItem[], currentThreadId: string): string | undefined => {
  const nextActiveThread = findNextActiveThread(threads, currentThreadId);
  if (nextActiveThread) {
    return nextActiveThread.id;
  } else {
    const firstActiveThread = threads.find((thread) => thread.status === ThreadItemStatus.ACTIVE);
    return firstActiveThread?.id;
  }
};

const findNextActiveThread = (threads: ThreadItem[], currentThreadId: string): ThreadItem | undefined => {
  const threadIndex = threads.findIndex((thread) => thread.id === currentThreadId);
  if (threadIndex !== -1 && threads.length > threadIndex + 1) {
    // Find the next thread with the status of ACTIVE
    const nextActiveThread = threads.slice(threadIndex + 1).find((thread) => thread.status === ThreadItemStatus.ACTIVE);
    return nextActiveThread;
  }
  return undefined;
};
