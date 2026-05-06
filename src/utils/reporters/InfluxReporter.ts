import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import stripAnsi from 'strip-ansi';
import path from 'path';

class InfluxReporter implements Reporter {
  private readonly runId: string;
  private writeApi: WriteApi;

  private generateRunId(): string {
    if (process.env.GITHUB_RUN_ID) {
      const attempt = process.env.GITHUB_RUN_ATTEMPT ? `_attempt_${process.env.GITHUB_RUN_ATTEMPT}` : '';
      return `gh_${process.env.GITHUB_RUN_ID}${attempt}`;
    }

    if (process.env.CI_PIPELINE_ID) {
      return `gitlab_${process.env.CI_PIPELINE_ID}`;
    }
    return `local_${Date.now()}`;
  }

  constructor() {
    const url = process.env.INFLUX_URL || 'http://localhost:8086';
    const token = process.env.INFLUX_TOKEN;
    const org = 'SalesPortalProject';
    const bucket = 'playwright-metrics';

    if (!token) throw new Error('INFLUX_TOKEN is required for Observability');

    const influxDB = new InfluxDB({ url, token });
    this.writeApi = influxDB.getWriteApi(org, bucket, 'ms');
    this.runId = this.generateRunId();
  }

  private categorizeError(message: string): string {
    if (!message) return 'none';
    const msg = message.toLowerCase();
    if (msg.includes('timeout')) return 'Timeout';
    if (msg.includes('waiting for selector') || msg.includes('locator.waitfor') || msg.includes('not found')) return 'Locator_Error';
    if (msg.includes('expected:') || msg.includes('toequal') || msg.includes('tobevisible')) return 'Assertion_Failure';
    if (msg.includes('net::') || msg.includes('api error') || msg.includes('test.info()')) return 'Infrastructure_Error';
    return 'Other';
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const cleanError = result.error?.message ? stripAnsi(result.error.message) : '';
    const relativePath = path.relative(process.cwd(), test.location.file);
    let videoUrl = '';
    let screenshotUrl = '';
    let traceUrl = '';
    const branchName = process.env.CI_COMMIT_REF_NAME || 'local-dev';

    for (const attachment of result.attachments) {
      if (!attachment.path) continue;

      const relativePath = path.relative(process.cwd(), attachment.path);

      const cleanPath = relativePath.replace(/\\/g, '/');

      if (attachment.name === 'video') {
        videoUrl = cleanPath;
      }

      if (attachment.name === 'screenshot') {
        screenshotUrl = cleanPath;
      }

      if (attachment.name === 'trace') {
        traceUrl = relativePath;
      }
    }

    const point = new Point('test_results')
      .tag('run_id', this.runId)
      .tag('title', test.title)
      .tag('file', relativePath)
      .tag('project', test.parent.project()?.name || 'default')
      .tag('status', result.status)
      .tag('error_type', this.categorizeError(cleanError))
      .tag('env', process.env.ENVIRONMENT || 'local')
      .tag('worker', `worker-${result.workerIndex}`)
      .tag('retry_attempt', result.retry.toString())
      .tag('branch', branchName)

      .floatField('duration', result.duration)
      .intField('status_code', result.status === 'passed' ? 1 : 0)
      .stringField('error_msg', cleanError.substring(0, 500))
      .stringField('video_url', videoUrl)
      .stringField('screenshot_url', screenshotUrl)
      .stringField('trace_url', traceUrl);

    this.writeApi.writePoint(point);
  }

  async onEnd() {
    try {
      await this.writeApi.flush();
      await this.writeApi.close();
      console.log('📊 [Observability] Metrics synced with InfluxDB');
    } catch (e: any) {
      console.error('❌ [Observability] Failed to sync:', e.message);
    }
  }
}

export default InfluxReporter;
