import { Projects } from "@/components/projects/Projects";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProjectPage() {
  return (
    <div className="container mx-auto">
      <div className="p-2 md:px-20 w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/projects">
                <span className="font-bold text-xl">Projects</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Projects />
      </div>
    </div>
  );
}
