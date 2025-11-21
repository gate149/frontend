import type { ContestModel, Problem } from "../../contracts/core/v1/core";
import type { SessionUser } from "./session";
import type { ContestRole } from "./contest-role";

/**
 * Permission checker utilities for frontend
 * These are client-side checks based on available data
 * Backend always performs authoritative permission checks
 */

export type ContestScope = "owner" | "moderator" | "participant";

// Иерархия ролей: owner > moderator > participant
const ROLE_HIERARCHY: Record<ContestRole, number> = {
  owner: 3,
  moderator: 2,
  participant: 1,
};

/**
 * Check if user's role meets the required scope
 * @param userRole - User's role in the contest
 * @param requiredScope - Required scope/permission level
 * @returns true if user has required role or higher
 */
function hasRequiredRole(userRole: ContestRole, requiredScope: ContestScope): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredScope];
}

export class PermissionChecker {
  private user: SessionUser;
  private contestRole: ContestRole | null;

  constructor(user: SessionUser, contestRole: ContestRole | null = null) {
    this.user = user;
    this.contestRole = contestRole;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  isGlobalAdmin(): boolean {
    return this.user?.role === "admin";
  }

  // Contest permissions

  canViewContest(contest: ContestModel): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Global admin can view any contest
    if (this.isGlobalAdmin()) {
      return true;
    }

    // For now, allow authenticated users to view contests
    // Backend will enforce actual visibility rules
    return true;
  }

  canViewProblems(contest: ContestModel): boolean {
    // Global admin всегда может
    if (this.isGlobalAdmin()) {
      return true;
    }

    // TODO: Когда появится problems_view_scope в backend:
    // if (!this.contestRole) return false;
    // return hasRequiredRole(this.contestRole, contest.problems_view_scope as ContestScope);

    // Временно: все authenticated могут просматривать задачи
    return this.isAuthenticated();
  }

  canSubmitSolution(contest: ContestModel): boolean {
    // Global admin всегда может
    if (this.isGlobalAdmin()) {
      return true;
    }

    // TODO: Когда появится problems_view_scope в backend:
    // if (!this.contestRole) return false;
    // return hasRequiredRole(this.contestRole, contest.problems_view_scope as ContestScope);

    // Временно: все authenticated могут отправлять решения
    return this.isAuthenticated();
  }

  canViewMySubmissions(contest: ContestModel): boolean {
    // Global admin всегда может
    if (this.isGlobalAdmin()) {
      return true;
    }

    // TODO: Когда появится problems_view_scope в backend:
    // if (!this.contestRole) return false;
    // return hasRequiredRole(this.contestRole, contest.problems_view_scope as ContestScope);

    // Временно: все authenticated могут просматривать свои посылки
    return this.isAuthenticated();
  }

  canViewAllSubmissions(contest: ContestModel): boolean {
    // Global admin всегда может
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Проверяем роль в контесте
    if (!this.contestRole) {
      return false;
    }

    // Проверяем соответствие роли требуемому scope
    return hasRequiredRole(this.contestRole, contest.submissions_list_scope as ContestScope);
  }

  canViewMonitor(contest: ContestModel): boolean {
    // Global admin всегда может
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Проверяем роль в контесте
    if (!this.contestRole) {
      return false;
    }

    // Проверяем соответствие роли требуемому scope
    return hasRequiredRole(this.contestRole, contest.monitor_scope as ContestScope);
  }

  canManageContest(contest: ContestModel): boolean {
    // Global admin всегда может управлять
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Проверяем роль в контесте - только owner или moderator
    if (!this.contestRole) {
      return false;
    }

    return this.contestRole === "owner" || this.contestRole === "moderator";
  }

  canDeleteContest(contest: ContestModel): boolean {
    // Global admin can delete
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Only contest owner can delete
    return this.contestRole === "owner";
  }

  canManageContestParticipants(contest: ContestModel): boolean {
    // Same as manage for now
    return this.canManageContest(contest);
  }

  // Problem permissions

  canViewProblem(problem: Problem): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Global admin can view any problem
    if (this.isGlobalAdmin()) {
      return true;
    }

    // Public problems can be viewed by any authenticated user
    if (!problem.is_private) {
      return true;
    }

    // Private problems - only admin can view
    return this.isGlobalAdmin();
  }

  canEditProblem(problem: Problem): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Global admin can edit any problem
    if (this.isGlobalAdmin()) {
      return true;
    }

    // For now, assume backend will check if user is owner/moderator
    return false;
  }

  canDeleteProblem(problem: Problem): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Only admin can delete
    return this.isGlobalAdmin();
  }

  // User permissions

  canEditUser(userId: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // User can edit themselves
    if (this.user?.id === userId) {
      return true;
    }

    // Global admin can edit any user
    return this.isGlobalAdmin();
  }

  canDeleteUser(userId: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Only admin can delete users
    return this.isGlobalAdmin();
  }
}

/**
 * Create permission checker instance from user data
 */
export function createPermissionChecker(
  user: SessionUser,
  contestRole: ContestRole | null = null
): PermissionChecker {
  return new PermissionChecker(user, contestRole);
}
