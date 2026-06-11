import axios, { isAxiosError } from 'axios';
import { env } from '../../config/env';

function jiraRequestErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Jira request failed';
  }
  const data = error.response?.data as { errorMessages?: string[]; message?: string } | undefined;
  if (data?.errorMessages?.length) {
    return data.errorMessages.join('; ');
  }
  if (typeof data?.message === 'string') {
    return data.message;
  }
  if (error.response?.status) {
    return `Jira API error (${error.response.status})`;
  }
  return error.message;
}

function getJiraClient() {
  if (!env.JIRA_BASE_URL || !env.JIRA_EMAIL || !env.JIRA_API_TOKEN) {
    return null;
  }
  return axios.create({
    baseURL: `${env.JIRA_BASE_URL}/rest/api/3`,
    auth: { username: env.JIRA_EMAIL, password: env.JIRA_API_TOKEN },
    headers: { 'Accept': 'application/json' },
  });
}

export class JiraService {
  private client = getJiraClient();

  private notConfigured() {
    return { error: 'Jira is not configured. Set JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN in .env' };
  }

  /**
   * Jira Cloud removed GET/POST /rest/api/3/search — use approximate-count for totals.
   * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/
   */
  private async countByJql(jql: string) {
    if (!this.client) return 0;
    const res = await this.client.post('/search/approximate-count', { jql });
    return Number(res.data?.count ?? 0);
  }

  /** Enhanced JQL search (replaces removed /search). */
  private async searchJql(jql: string, maxResults: number, fields: string[]) {
    if (!this.client) throw new Error('Jira client not configured');
    const res = await this.client.post('/search/jql', {
      jql,
      maxResults,
      fields,
    });
    return res.data as { issues?: unknown[]; isLast?: boolean; nextPageToken?: string };
  }

  /** Safe JQL project clause — quoted key avoids reserved-word / parsing edge cases */
  private projectClause(projectKey: string) {
    const key = projectKey.trim().toUpperCase();
    return `project = "${key}"`;
  }

  /** Get all projects from Jira */
  async getProjects() {
    if (!this.client) return this.notConfigured();

    const response = await this.client.get('/project/search', {
      params: { maxResults: 50, expand: 'description,lead' },
    });
    return response.data;
  }

  /** Get ticket statistics for a specific project */
  async getProjectStats(projectKey: string) {
    if (!this.client) return this.notConfigured();

    const statuses = ['To Do', 'In Progress', 'Done'];
    const stats: Record<string, number> = {};
    const proj = this.projectClause(projectKey);

    try {
      await Promise.all(
        statuses.map(async (status) => {
          const jql = `${proj} AND status = "${status}"`;
          stats[status] = await this.countByJql(jql);
        }),
      );
    } catch (error) {
      return { error: jiraRequestErrorMessage(error) };
    }

    return {
      projectKey: projectKey.trim().toUpperCase(),
      total: Object.values(stats).reduce((a, b) => a + b, 0),
      byStatus: stats,
    };
  }

  /**
   * Get a project status overview for dashboard-style visualization.
   * - doneToday: items currently in Done and updated since start of day
   * - inProgress: items in "In Progress" status category
   * - todo: items in "To Do" status category
   */
  async getProjectOverview(projectKey: string) {
    if (!this.client) return this.notConfigured();

    const proj = this.projectClause(projectKey);

    try {
      // statusCategory values must be quoted in JQL (e.g. "Done", not bare Done)
      const [doneToday, inProgress, todo] = await Promise.all([
        this.countByJql(`${proj} AND statusCategory = "Done" AND updated >= startOfDay()`),
        this.countByJql(`${proj} AND statusCategory = "In Progress"`),
        this.countByJql(`${proj} AND statusCategory = "To Do"`),
      ]);

      return {
        projectKey: projectKey.trim().toUpperCase(),
        doneToday,
        inProgress,
        todo,
        total: doneToday + inProgress + todo,
        byStatus: {
          todo,
          inProgress,
          doneToday,
        },
      };
    } catch (error) {
      return { error: jiraRequestErrorMessage(error) };
    }
  }

  /** Get issues/tickets for a project with optional JQL filter */
  async getProjectIssues(projectKey: string, jql?: string, maxResults = 50, startAt = 0) {
    if (!this.client) return this.notConfigured();

    const proj = this.projectClause(projectKey);
    const query = jql ? `${proj} AND ${jql}` : `${proj} ORDER BY created DESC`;
    const fields = ['summary', 'status', 'assignee', 'priority', 'created', 'updated', 'issuetype'];

    try {
      const fetchSize = Math.min(100, Math.max(maxResults, startAt + maxResults));
      const data = await this.searchJql(query, fetchSize, fields);
      const all = data.issues ?? [];
      return {
        issues: all.slice(startAt, startAt + maxResults),
        isLast: data.isLast,
        nextPageToken: data.nextPageToken,
      };
    } catch (error) {
      return { error: jiraRequestErrorMessage(error) };
    }
  }

  /** Get sprint info for a board (requires Jira Software) */
  async getSprints(boardId: string) {
    if (!this.client) return this.notConfigured();

    const response = await axios.get(
      `${env.JIRA_BASE_URL}/rest/agile/1.0/board/${boardId}/sprint`,
      {
        auth: { username: env.JIRA_EMAIL!, password: env.JIRA_API_TOKEN! },
        headers: { Accept: 'application/json' },
        params: { state: 'active,future' },
      },
    );
    return response.data;
  }
}
