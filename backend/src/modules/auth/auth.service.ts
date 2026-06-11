import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sendApprovalEmail, sendRejectionEmail } from '../../config/email';
import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from '../../utils/errors';
import type { RegisterInput, LoginInput } from './auth.schema';

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  // ─── Register ─────────────────────────────────────────────────────────────
  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictError('A user with this email already exists');
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        // role defaults to DEVELOPER, status defaults to PENDING
      },
      select: { id: true, name: true, email: true, role: true, status: true, team_id: true, created_at: true },
    });

    return {
      message: 'Registration successful. Your account is pending admin approval.',
      user,
    };
  }

  // ─── Login ────────────────────────────────────────────────────────────────
  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedError('Invalid email or password');

    // Backward compatibility: plain passwords are accepted once and upgraded to bcrypt hash.
    const isStoredAsHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');
    const passwordMatch = isStoredAsHash
      ? await bcrypt.compare(input.password, user.password)
      : input.password === user.password;

    if (!passwordMatch) throw new UnauthorizedError('Invalid email or password');

    // If the current DB value is plain text, migrate it to hash after successful login.
    if (!isStoredAsHash) {
      const newHash = await bcrypt.hash(input.password, SALT_ROUNDS);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      });
    }

    if (user.status === 'PENDING') {
      throw new BadRequestError('Your account is pending approval. You will be notified by email.');
    }
    if (user.status === 'REJECTED') {
      throw new BadRequestError('Your account has been rejected. Please contact an administrator.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      team_id: user.team_id,
      name: user.name,
    };
  }

  // ─── Approve (Admin only) ─────────────────────────────────────────────────
  async approve(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');
    if (user.status === 'ACTIVE') throw new BadRequestError('User is already active');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    // Fire and forget — don't block the response on email
    sendApprovalEmail(user.email, user.name).catch(console.error);

    return updated;
  }

  // ─── Reject (Admin only) ──────────────────────────────────────────────────
  async reject(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'REJECTED' },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    sendRejectionEmail(user.email, user.name).catch(console.error);

    return updated;
  }

  // ─── Get current user ─────────────────────────────────────────────────────
  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, status: true, team_id: true, created_at: true },
    });
    if (!user) throw new NotFoundError('User');
    return user;
  }
}
