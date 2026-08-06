export const SECURITY_SETTINGS_DEFAULTS = { biometrics: true, quickLogin: true, operationConfirm: true, suspiciousLogin: true } as const;
export const NOTIFICATION_SETTINGS_DEFAULTS = { push: true, email: true, sms: false, transactions: true, security: true, offers: false } as const;
export const PRIVACY_SETTINGS_DEFAULTS = { analytics: false, personalization: true, marketing: false, location: false } as const;
export const DEVICE_SETTINGS_DEFAULTS = { rememberDevices: true, iphoneActive: true, ipadActive: true } as const;
