import notifee, {
    TimestampTrigger,
    TriggerType,
    AndroidImportance,
    EventType,
} from '@notifee/react-native';

export const createNotificationChannel = async () => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
    console.log('Notification channel created:', channelId);
};

export const scheduleNotification = async (taskId, taskName) => {
  const date = new Date(Date.now() + 10 * 1000);

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id: `task-${taskId}`,
      title: 'Task Reminder',
      body: `Time to complete: ${taskName}`,
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
      },
    },
    trigger
  );
};


export const cancelNotification = async (taskId) => {
    await notifee.cancelNotification(`task-${taskId}`);
};
