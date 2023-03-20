import { styles } from './styles';

import notifee, {
  EventType,
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
} from '@notifee/react-native'
import { useEffect } from 'react';
import { Text, View, Button } from 'react-native';

export default function App() {

  const createChannelId = async () => {
    const channelId = await notifee.createChannel({
      id: 'test',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    return channelId
  }

  const displayNotification = async () => {
    await notifee.requestPermission()

    const channelId = await createChannelId()

    await notifee.displayNotification({
      id: '7',
      title: 'Olá, John!',
      body: 'Notification successful',
      android: {
        channelId
      }
    })
  }

  const updateNotification = async () => {
    await notifee.requestPermission()

    const channelId = await createChannelId()

    await notifee.displayNotification({
      id: '7',
      title: 'Olá, John!',
      body: 'Notification successful',
      android: {
        channelId
      }
    })
  }

  const cancelNotification = async () => {
    await notifee.cancelNotification('7')
  }

  const scheduleNotification = async () => {
    const date = new Date(Date.now())
    date.setMinutes(date.getMinutes() + 1)

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    }

    const channelId = await createChannelId()

    await notifee.createTriggerNotification({
      title: 'Scheduled Notification!',
      body: 'This is a scheduled notification!',
      android: {
        channelId
      },
    }, trigger)
  }

  const listScheduleNotifications = async () => {
    await notifee.getTriggerNotificationIds().then(ids => console.log(ids))
  }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('The user discarded the notification!')
        case EventType.ACTION_PRESS:
          console.log('The user touched the notification!', detail.notification)
      }
    })
  }, [])

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('The user touched the notification!', detail.notification)
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Local Notifications</Text>

      <Button title="Send Notification" onPress={displayNotification} />
      <Button title="Update Notification" onPress={updateNotification} />
      <Button title="Cancel Notification" onPress={cancelNotification} />
      <Button title="Schedule Notification" onPress={scheduleNotification} />
      <Button title="List Scheduled Notification" onPress={listScheduleNotifications} />
    </View>
  );
}
