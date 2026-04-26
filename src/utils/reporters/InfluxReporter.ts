import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

class InfluxReporter implements Reporter {
  private writeApi;

  constructor() {
    // Данные берем из .env или используем дефолты для локального Docker
    const url = process.env.INFLUX_URL || 'http://localhost:8086';
    const token = process.env.INFLUX_TOKEN || '';
    const org = 'SalesPortalProject';
    const bucket = 'playwright-metrics';

    const influxDB = new InfluxDB({ url, token });
    this.writeApi = influxDB.getWriteApi(org, bucket, 'ms');
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const point = new Point('test_results')
      // .tag('title', test.title)
      .tag('title', test.titlePath().slice(1).join(' > '))
      .tag('project', test.parent.project()?.name || 'unknown')
      .tag('status', result.status)
      .tag('env', process.env.ENVIRONMENT || 'local')
      .floatField('duration', result.duration)
      .intField('passed', result.status === 'passed' ? 1 : 0)
      // .intField('failed', result.status === 'failed' ? 1 : 0);
      .intField('failed', result.status === 'failed' || result.status === 'timedOut' ? 1 : 0);

    if (result.status !== 'passed' && result.error?.message) {
      point.stringField('error_message', result.error.message);
    }

    this.writeApi.writePoint(point);
  }

  async onEnd() {
    try {
      await this.writeApi.close();
      console.log('Successfully sent metrics to InfluxDB');
    } catch (e) {
      console.error('Error sending metrics to InfluxDB:', e);
    }
  }
}

export default InfluxReporter;
