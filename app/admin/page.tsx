import type { Metadata } from "next";
import { ProjectEditor } from "@/components/admin/project-editor";
import { SiteShell } from "@/components/shell/site-shell";

export const metadata: Metadata = {
  title: "Project editor prototype",
  robots: { index: false, follow: false },
};

export default function AdminPrototype() {
  return (
    <SiteShell current="" showTopbar={false}>
      <ProjectEditor />
    </SiteShell>
  );
}
