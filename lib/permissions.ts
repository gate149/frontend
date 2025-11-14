import type { ContestModel, Problem, User } from "../../contracts/core/v1/core";

/**
 * Permission checker utilities for frontend
 * These are client-side checks based on available data
 * Backend always performs authoritative permission checks
 */

export class PermissionChecker {
  private user: User | null;

  constructor(user: User | null) {
    this.user = user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  isGlobalAdmin(): boolean {
    return this.user?.role === "admin";
  }

  // ContestModel permissions

  canViewContest(contest: ContestModel): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Public contests can be viewed by any authenticated user
    if (!contest.is_private) {
      return true;
    }

    // Private contests - need to check role (will be checked by backend)
    // For UI purposes, show if user is admin
    return this.isGlobalAdmin();
  }

  canEditContest(contest: ContestModel): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Global admin can edit any contest
    if (this.isGlobalAdmin()) {
      return true;
    }

    // For now, assume backend will check if user is owner/moderator
    // This is a conservative check for UI purposes
    return false;
  }

  canDeleteContest(contest: ContestModel): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Only admin can delete (conservative check)
    return this.isGlobalAdmin();
  }

  canManageContestParticipants(contest: ContestModel): boolean {
    // Same as edit for now
    return this.canEditContest(contest);
  }

  canViewMonitor(contest: ContestModel): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // If monitor is disabled, only admin/owner/moderator can view
    // For UI purposes, show if user is admin or monitor is enabled
    if (!contest.monitor_enabled) {
      return this.isGlobalAdmin();
    }

    // If monitor is enabled, any participant can view
    return true;
  }

  // Problem permissions

  canViewProblem(problem: Problem): boolean {
    if (!this.isAuthenticated()) {
      return false;
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
export function createPermissionChecker(user: User | null): PermissionChecker {
  return new PermissionChecker(user);
}



