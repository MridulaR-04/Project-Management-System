"use client";
import React, { useState, useEffect } from "react";
import { isAfter, isBefore, format, formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { updateSprintStatus } from "@/actions/sprints";
import { BarLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
  const [status, setStatus] = useState(sprint.status);
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus) => {
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints]);

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined, { shallow: true });
  };

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => {
              return (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} to{" "}
                  {format(sprint.endDate, "MMM d, yyyy")})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge variant="" className="mt-3 ml-1 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
};

export default SprintManager;
