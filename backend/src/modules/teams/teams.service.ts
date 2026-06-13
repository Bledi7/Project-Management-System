import { PrismaClient } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../utils/errors';
import type { CreateTeamInput, UpdateTeamInput, AddMemberInput } from './teams.schema';

const WITH_RELATIONS = {
  creator: { select: { id: true, name: true, email: true } },
  members: { select: { id: true, name: true, email: true, role: true } },
};

export class TeamsService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.team.findMany({
      include: WITH_RELATIONS,
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: WITH_RELATIONS,
    });
    if (!team) throw new NotFoundError('Team');
    return team;
  }

  async create(input: CreateTeamInput, createdBy: number) {
    return this.prisma.team.create({
      data: { name: input.name, created_by: createdBy },
      include: WITH_RELATIONS,
    });
  }

  async update(id: number, input: UpdateTeamInput) {
    await this.findById(id);
    return this.prisma.team.update({
      where: { id },
      data: { name: input.name },
      include: WITH_RELATIONS,
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await this.prisma.team.delete({ where: { id } });
    return { message: 'Team deleted successfully' };
  }

  async addMember(teamId: number, input: AddMemberInput) {
    await this.findById(teamId);

    const user = await this.prisma.user.findUnique({ where: { id: input.user_id } });
    if (!user) throw new NotFoundError('User');
    if (user.team_id !== null) throw new BadRequestError('User already belongs to a team');

    await this.prisma.user.update({
      where: { id: input.user_id },
      data: { team_id: teamId },
    });

    return this.findById(teamId);
  }

  async removeMember(teamId: number, userId: number) {
    await this.findById(teamId);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');
    if (user.team_id !== teamId) throw new BadRequestError('User does not belong to this team');

    await this.prisma.user.update({
      where: { id: userId },
      data: { team_id: null },
    });

    return this.findById(teamId);
  }
}
