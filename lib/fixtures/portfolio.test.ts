import { describe, expect, it } from "vitest";
import {
  getMember,
  getProject,
  portfolioMembers,
  portfolioProjects,
} from "./portfolio";

describe("public portfolio fixtures", () => {
  it("resolves every project referenced by a member", () => {
    for (const member of portfolioMembers) {
      for (const slug of member.projectSlugs) {
        expect(getProject(slug), `${member.name}: ${slug}`).toBeDefined();
      }
    }
  });

  it("resolves every linked contributor profile", () => {
    for (const project of portfolioProjects) {
      for (const contributor of project.contributors) {
        if (contributor.memberSlug) {
          expect(
            getMember(contributor.memberSlug),
            `${project.title}: ${contributor.memberSlug}`,
          ).toBeDefined();
        }
      }
    }
  });
});
