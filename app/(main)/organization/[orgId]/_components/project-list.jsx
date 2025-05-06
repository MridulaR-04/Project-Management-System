import { getProjects } from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }) {
  const projects = await getProjects(orgId);
  if (projects.length === 0) {
    return (
      <p>
        No Projects Found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-200"
          href="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => {
        return (
          <Card
            key={project.id}
            className="bg-[#111827]/80 border border-[#1f2937] shadow-md rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-blue-500/30 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg font-semibold text-white">
                {project.name}
                <DeleteProject projectId={project.id} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {project.description}
              </p>
              <Link
                href={`/project/${project.id}`}
                className="inline-block mt-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                View Project
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
