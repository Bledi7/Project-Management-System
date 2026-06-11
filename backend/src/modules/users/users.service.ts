import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { sendApprovalEmail, sendRejectionEmail } from '../../config/email';
import type { CreateUserInput, UpdateUserInput } from './users.schema';

const SELECTED_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  team_id: true,
  created_at: true,
};

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { ...SELECTED_FIELDS, team: { select: { id: true, name: true } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...SELECTED_FIELDS, team: { select: { id: true, name: true } } },
    });
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async create(input: CreateUserInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictError('Email already in use');
    const hashedPassword = await bcrypt.hash(input.password, 12);

    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        status: input.status ?? 'PENDING',
        team_id: input.team_id,
      },
      select: SELECTED_FIELDS,
    });
  }

  async update(id: number, input: UpdateUserInput) {
    const existingUser = await this.findById(id); // throws 404 if not found

    if (input.email) {
      const conflict = await this.prisma.user.findFirst({
        where: { email: input.email, NOT: { id } },
      });
      if (conflict) throw new ConflictError('Email already in use');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: input,
      select: SELECTED_FIELDS,
    });

    // Send status emails only when status actually changes through admin updates.
    if (input.status && input.status !== existingUser.status) {
      if (input.status === 'ACTIVE') {
        sendApprovalEmail(updatedUser.email, updatedUser.name).catch(console.error);
      } else if (input.status === 'REJECTED') {
        sendRejectionEmail(updatedUser.email, updatedUser.name).catch(console.error);
      }
    }

    return updatedUser;
  }

  async delete(id: number) {
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
