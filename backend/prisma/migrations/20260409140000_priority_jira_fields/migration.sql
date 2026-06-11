-- AlterTable
ALTER TABLE "priority" ADD COLUMN     "jira_issue_key" VARCHAR(50),
ADD COLUMN     "jira_project_key" VARCHAR(50),
ADD COLUMN     "assignee_label" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "priority_jira_issue_key_key" ON "priority"("jira_issue_key");
