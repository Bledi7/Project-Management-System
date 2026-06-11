import { PrismaClient, Role } from '@prisma/client';
import { NotFoundError, ForbiddenError, ConflictError } from '../../utils/errors';
import type { CreatePriorityInput, UpdatePriorityInput, UpdateStatusInput } from './priorities.schema';

const WITH_RELATIONS = {
  creator: { select: { id: true, name: true } },
  team: { select: { id: true, name: true } },
};

type PriorityRow = { team_id: number };

export class PrioritiesService {
  constructor(private prisma: PrismaClient) {}

  private assertCanView(priority: PriorityRow, userRole: string, teamId: number | null) {
    if (userRole === Role.PRODUCT_OWNER || userRole === Role.ADMIN) {
      return;
    }
    if (teamId == null || priority.team_id !== teamId) {
      throw new ForbiddenError();
    }
  }

  /**
   * Users see priorities for their own team; PO/Admin see all.
   */
  async findAll(userRole: string, teamId: number | null) {
    const where = userRole === Role.PRODUCT_OWNER || userRole === Role.ADMIN
      ? {}
      : { team_id: teamId ?? -1 };

    return this.prisma.priority.findMany({
      where,
      include: WITH_RELATIONS,
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: number, userRole: string, teamId: number | null) {
    const priority = await this.prisma.priority.findUnique({ where: { id }, include: WITH_RELATIONS });
    if (!priority) throw new NotFoundError('Priority');
    this.assertCanView(priority, userRole, teamId);
    return priority;
  }

  async create(input: CreatePriorityInput, createdBy: number) {
    if (input.jira_issue_key) {
      const existing = await this.prisma.priority.findUnique({
        where: { jira_issue_key: input.jira_issue_key },
      });
      if (existing) {
        throw new ConflictError('This Jira issue is already marked as a priority');
      }
    }

    return this.prisma.priority.create({
      data: { ...input, created_by: createdBy },
      include: WITH_RELATIONS,
    });
  }

  async update(id: number, input: UpdatePriorityInput) {
    await this.findByIdInternal(id);
    return this.prisma.priority.update({
      where: { id },
      data: input,
      include: WITH_RELATIONS,
    });
  }

  async updateStatus(
    id: number,
    input: UpdateStatusInput,
    userRole: string,
    teamId: number | null,
  ) {
    const priority = await this.findByIdInternal(id);
    this.assertCanView(priority, userRole, teamId);
    return this.prisma.priority.update({
      where: { id },
      data: { status: input.status },
      include: WITH_RELATIONS,
    });
  }

  async delete(id: number) {
    await this.findByIdInternal(id);
    await this.prisma.priority.delete({ where: { id } });
    return { message: 'Priority deleted successfully' };
  }

  private async findByIdInternal(id: number) {
    const priority = await this.prisma.priority.findUnique({ where: { id } });
    if (!priority) throw new NotFoundError('Priority');
    return priority;
  }
}
