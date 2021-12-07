export const ANALYTICS_EVENT = {
  USER_REGISTERED: 'user_registered',
  USER_LOGGED_IN: 'user_logged_in',
  TEST_STARTED: 'test_started',
  TEST_FINISHED: 'test_finished',
  APPOINTMENT_BOOKED: 'appointment_booked',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  USER_PRINTED_PROFILE: 'user_printed_profile',
};

export const sendAnalyticsEvent = (eventName: string, variables?: any) => {
  if (typeof window !== 'undefined') {
    const { gtag } = window as any;
    if (gtag) {
      gtag('event', eventName, variables);
    }
  }
};
