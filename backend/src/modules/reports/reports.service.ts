import { PrismaClient, Role } from '@prisma/client';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../utils/errors';
import type { CreateReportInput, UpdateReportInput } from './reports.schema';

const WITH_RELATIONS = {
  user: { select: { id: true, name: true, email: true } },
  team: { select: { id: true, name: true } },
};

export class ReportsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * PO sees all reports; Developers see only their team's reports.
   */
  async findAll(userId: number, userRole: string, teamId: number | null) {
    const where = userRole === Role.PRODUCT_OWNER || userRole === Role.ADMIN
      ? {}
      : { team_id: teamId ?? -1 }; // -1 returns nothing if user has no team

    return this.prisma.report.findMany({
      where,
      include: WITH_RELATIONS,
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: number, userId: number, userRole: string, teamId: number | null) {
    const report = await this.prisma.report.findUnique({ where: { id }, include: WITH_RELATIONS });
    if (!report) throw new NotFoundError('Report');

    // Developers can only view reports from their own team
    if (userRole === Role.DEVELOPER && report.team_id !== teamId) {
      throw new ForbiddenError();
    }
    return report;
  }

  async create(input: CreateReportInput, userId: number, userRole: string, userTeamId: number | null) {
    if (userRole === Role.DEVELOPER) {
      if (userTeamId == null) {
        throw new BadRequestError('You must belong to a team to create a report');
      }
      if (input.team_id !== userTeamId) {
        throw new ForbiddenError('You can only create reports for your own team');
      }
    }

    return this.prisma.report.create({
      data: { ...input, user_id: userId },
      include: WITH_RELATIONS,
    });
  }

  async update(id: number, input: UpdateReportInput, userId: number, userRole: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundError('Report');

    // Only the author or admin can update
    if (report.user_id !== userId && userRole !== Role.ADMIN) throw new ForbiddenError();

    return this.prisma.report.update({
      where: { id },
      data: input,
      include: WITH_RELATIONS,
    });
  }

  async delete(id: number, userId: number, userRole: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundError('Report');

    if (userRole === Role.DEVELOPER) throw new ForbiddenError();

    await this.prisma.report.delete({ where: { id } });
    return { message: 'Report deleted successfully' };
  }
}
