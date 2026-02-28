import { Platform } from 'react-native';

// Conditionally import health libraries
let AppleHealthKit: any = null;
let HealthConnect: any = null;

if (Platform.OS === 'ios') {
  try {
    AppleHealthKit = require('react-native-health');
  } catch (e) {
    console.log('HealthKit not available');
  }
} else if (Platform.OS === 'android') {
  try {
    HealthConnect = require('react-native-health-connect');
  } catch (e) {
    console.log('Health Connect not available');
  }
}

export interface HealthData {
  steps: number;
  distance: number; // in meters
  heartRate: number | null;
}

/**
 * Health Service - Gets step data from native health apps
 * iOS: HealthKit | Android: Health Connect
 */
class HealthService {
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' && AppleHealthKit) {
        return new Promise((resolve) => {
          const permissions = {
            permissions: {
              read: [
                AppleHealthKit.Constants.Permissions.Steps,
                AppleHealthKit.Constants.Permissions.HeartRate,
                AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
              ],
              write: [],
            },
          };
          
          AppleHealthKit.initHealthKit(permissions, (error: string) => {
            if (error) {
              console.log('HealthKit init error:', error);
              resolve(false);
            } else {
              this.isInitialized = true;
              resolve(true);
            }
          });
        });
      } else if (Platform.OS === 'android' && HealthConnect) {
        try {
          await HealthConnect.initialize();
          await HealthConnect.requestPermission([
            { accessType: 'read', recordType: 'Steps' },
            { accessType: 'read', recordType: 'HeartRate' },
            { accessType: 'read', recordType: 'Distance' },
          ]);
          this.isInitialized = true;
          return true;
        } catch (err) {
          console.log('Health Connect init error:', err);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.log('Health service init error:', error);
      return false;
    }
  }

  async getTodaySteps(): Promise<number> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return 0;
    }

    try {
      if (Platform.OS === 'ios' && AppleHealthKit) {
        return new Promise((resolve) => {
          const options = {
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date().toISOString(),
          };

          AppleHealthKit.getStepCount(options, (err: any, results: any) => {
            if (err) {
              console.log('Error getting steps:', err);
              resolve(0);
            } else {
              resolve(results.value || 0);
            }
          });
        });
      } else if (Platform.OS === 'android' && HealthConnect) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const result: any = await HealthConnect.readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: new Date().toISOString(),
          },
        });

        const records = result.records || [];
        const totalSteps = records.reduce((sum: number, record: any) => 
          sum + (record.count || 0), 0
        );
        return totalSteps;
      }
      return 0;
    } catch (error) {
      console.log('Error getting today steps:', error);
      return 0;
    }
  }

  /**
   * Get current heart rate or recent average
   * Returns most recent reading or average of last 5 minutes
   */
  async getCurrentHeartRate(): Promise<number | null> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return null;
    }

    try {
      if (Platform.OS === 'ios' && AppleHealthKit) {
        return new Promise((resolve) => {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          const options = {
            startDate: fiveMinutesAgo.toISOString(),
            endDate: new Date().toISOString(),
            limit: 10,
          };

          AppleHealthKit.getHeartRateSamples(options, (err: any, results: any) => {
            if (err) {
              console.log('Error getting heart rate:', err);
              resolve(null);
            } else if (results && results.length > 0) {
              // Get most recent reading
              const latest = results[results.length - 1];
              resolve(Math.round(latest.value));
            } else {
              resolve(null);
            }
          });
        });
      } else if (Platform.OS === 'android' && HealthConnect) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const result: any = await HealthConnect.readRecords('HeartRate', {
          timeRangeFilter: {
            operator: 'between',
            startTime: fiveMinutesAgo.toISOString(),
            endTime: new Date().toISOString(),
          },
        });

        const records = result.records || [];
        if (records.length === 0) return null;

        // Get most recent reading
        const latest = records[records.length - 1];
        return Math.round(latest.samples?.[0]?.beatsPerMinute || 0);
      }
      return null;
    } catch (error) {
      console.log('Error getting heart rate:', error);
      return null;
    }
  }

  /**
   * Get average heart rate for a time period
   */
  async getAverageHeartRate(startDate: Date, endDate: Date): Promise<number | null> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return null;
    }

    try {
      if (Platform.OS === 'ios' && AppleHealthKit) {
        return new Promise((resolve) => {
          const options = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            limit: 100,
          };

          AppleHealthKit.getHeartRateSamples(options, (err: any, results: any) => {
            if (err) {
              console.log('Error getting heart rate:', err);
              resolve(null);
            } else if (results && results.length > 0) {
              const sum = results.reduce((acc: number, sample: any) => 
                acc + (sample.value || 0), 0
              );
              const average = Math.round(sum / results.length);
              resolve(average);
            } else {
              resolve(null);
            }
          });
        });
      } else if (Platform.OS === 'android' && HealthConnect) {
        const result: any = await HealthConnect.readRecords('HeartRate', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
          },
        });

        const records = result.records || [];
        if (records.length === 0) return null;

        const sum = records.reduce((acc: number, record: any) => 
          acc + (record.samples?.[0]?.beatsPerMinute || 0), 0
        );
        return Math.round(sum / records.length);
      }
      return null;
    } catch (error) {
      console.log('Error getting average heart rate:', error);
      return null;
    }
  }

  /**
   * Get distance traveled for a time period (in meters)
   */
  async getDistance(startDate: Date, endDate: Date): Promise<number> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return 0;
    }

    try {
      if (Platform.OS === 'ios' && AppleHealthKit) {
        return new Promise((resolve) => {
          const options = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          };

          AppleHealthKit.getDistanceWalkingRunning(options, (err: any, results: any) => {
            if (err) {
              console.log('Error getting distance:', err);
              resolve(0);
            } else {
              resolve(results.value || 0);
            }
          });
        });
      } else if (Platform.OS === 'android' && HealthConnect) {
        const result: any = await HealthConnect.readRecords('Distance', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
          },
        });

        const records = result.records || [];
        const totalDistance = records.reduce((sum: number, record: any) => 
          sum + (record.distance?.inMeters || 0), 0
        );
        return totalDistance;
      }
      return 0;
    } catch (error) {
      console.log('Error getting distance:', error);
      return 0;
    }
  }

  async checkPermissions(): Promise<boolean> {
    return this.isInitialized;
  }
}

export const healthService = new HealthService();
