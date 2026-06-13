export type NotificationLevel = 'success' | 'warning' | 'error' | 'info'

export interface NotificationPayload {
  title?: string
  message: string
  level?: NotificationLevel
  durationMs?: number
}

export interface AppNotification extends Required<Pick<NotificationPayload, 'message'>> {
  id: string
  title?: string
  level: NotificationLevel
  durationMs: number
}

const notificationBus = new EventTarget()
const EVENT_NAME = 'app:notification'

function nextNotificationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `ntf_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function notify(payload: NotificationPayload) {
  const notification: AppNotification = {
    id: nextNotificationId(),
    title: payload.title,
    message: payload.message,
    level: payload.level ?? 'info',
    durationMs: payload.durationMs ?? 3500,
  }

  notificationBus.dispatchEvent(new CustomEvent<AppNotification>(EVENT_NAME, { detail: notification }))
}

export function notifySuccess(message: string, title = 'Success') {
  notify({ title, message, level: 'success' })
}

export function notifyWarning(message: string, title = 'Warning') {
  notify({ title, message, level: 'warning' })
}

export function notifyError(message: string, title = 'Error') {
  notify({ title, message, level: 'error' })
}

export function subscribeNotifications(handler: (notification: AppNotification) => void) {
  const listener: EventListener = (event) => {
    const customEvent = event as CustomEvent<AppNotification>
    handler(customEvent.detail)
  }
  notificationBus.addEventListener(EVENT_NAME, listener)

  return () => {
    notificationBus.removeEventListener(EVENT_NAME, listener)
  }
}
