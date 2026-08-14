'use client';

import { useMemo, useState } from 'react';

import {
  Calendar,
  FileCheck,
  Search,
  RefreshCw,
  Clock,
  User,
  Video,
  MapPin,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useApplications } from '@/hooks';

import applicationService, {
  type ApplicationResponse,
} from '@/services/applicationService';

import interviewService from '@/services/interviewService';

import type { BadgeProps } from '@/components/ui/badge';

const statusConfig: Record<
  string,
  {
    label: string;
    variant: BadgeProps['variant'];
  }
> = {
  applied: {
    label: 'Applied',
    variant: 'default',
  },

  interview: {
    label: 'Interview',
    variant: 'warning',
  },

  offer: {
    label: 'Offer',
    variant: 'success',
  },

  rejected: {
    label: 'Rejected',
    variant: 'destructive',
  },

  withdrawn: {
    label: 'Withdrawn',
    variant: 'secondary',
  },
};

const tabs = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'applied',
    label: 'Applied',
  },
  {
    value: 'interview',
    label: 'Interview',
  },
  {
    value: 'offer',
    label: 'Offer',
  },
  {
    value: 'rejected',
    label: 'Rejected',
  },
];

function formatDate(
  value?: string | null
) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export default function ApplicationsPage() {
  const {
    data: applications,
    loading,
    error,
    refresh,
  } = useApplications();

  const [query, setQuery] =
    useState('');

  const [tab, setTab] =
    useState('all');

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  const [statusError, setStatusError] =
    useState('');

  // ==========================================
  // Interview scheduling state
  // ==========================================

  const [schedulingId, setSchedulingId] =
    useState<number | null>(null);

  const [scheduleError, setScheduleError] =
    useState('');

  const [scheduleSuccess, setScheduleSuccess] =
    useState('');

  const [interviewType, setInterviewType] =
    useState('VIDEO');

  const [scheduledAt, setScheduledAt] =
    useState('');

  const [interviewerName, setInterviewerName] =
    useState('');

  const [meetingLink, setMeetingLink] =
    useState('');

  const [location, setLocation] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const filtered = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return (applications ?? []).filter(
      (application) => {
        const normalizedStatus =
          application.status
            .toLowerCase();

        const matchesTab =
          tab === 'all' ||
          normalizedStatus === tab;

        const matchesQuery =
          !normalizedQuery ||
          application.jobTitle
            .toLowerCase()
            .includes(normalizedQuery) ||
          application.company
            .toLowerCase()
            .includes(normalizedQuery) ||
          application.location
            .toLowerCase()
            .includes(normalizedQuery);

        return (
          matchesTab &&
          matchesQuery
        );
      }
    );
  }, [
    applications,
    query,
    tab,
  ]);

  // ==========================================
  // Application status
  // ==========================================

  const handleStatusChange = async (
    application: ApplicationResponse,
    status: string
  ) => {
    if (
      application.status.toLowerCase() ===
      status.toLowerCase()
    ) {
      return;
    }

    try {
      setUpdatingId(application.id);
      setStatusError('');
      setScheduleError('');
      setScheduleSuccess('');

      await applicationService.updateStatus(
        application.id,
        status
      );

      await refresh();
    } catch (err) {
      console.error(
        'Failed to update application status:',
        err
      );

      setStatusError(
        err instanceof Error
          ? err.message
          : 'Failed to update application status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Open schedule form
  // ==========================================

  const openScheduleForm = (
    applicationId: number
  ) => {
    setSchedulingId(applicationId);

    setScheduleError('');
    setScheduleSuccess('');

    setInterviewType('VIDEO');
    setScheduledAt('');
    setInterviewerName('');
    setMeetingLink('');
    setLocation('');
    setNotes('');
  };

  // ==========================================
  // Close schedule form
  // ==========================================

  const closeScheduleForm = () => {
    setSchedulingId(null);

    setScheduleError('');
    setScheduleSuccess('');

    setInterviewType('VIDEO');
    setScheduledAt('');
    setInterviewerName('');
    setMeetingLink('');
    setLocation('');
    setNotes('');
  };

  // ==========================================
  // Schedule interview
  // ==========================================

  const handleScheduleInterview = async (
    applicationId: number
  ) => {
    if (!scheduledAt) {
      setScheduleError(
        'Please select an interview date and time.'
      );

      return;
    }

    try {
      setUpdatingId(applicationId);
      setScheduleError('');
      setScheduleSuccess('');

      await interviewService.createInterview({
        applicationId,
        interviewType,
        scheduledAt,
        interviewerName:
          interviewerName.trim() || undefined,
        meetingLink:
          meetingLink.trim() || undefined,
        location:
          location.trim() || undefined,
        notes:
          notes.trim() || undefined,
      });

      setScheduleSuccess(
        'Interview scheduled successfully.'
      );

      setInterviewType('VIDEO');
      setScheduledAt('');
      setInterviewerName('');
      setMeetingLink('');
      setLocation('');
      setNotes('');

      await refresh();
    } catch (err) {
      console.error(
        'Failed to schedule interview:',
        err
      );

      setScheduleError(
        err instanceof Error
          ? err.message
          : 'Failed to schedule interview.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Applications"
          description="Track the jobs you have applied to."
        />

        <div className="mt-6">
          <TableSkeleton />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          title="Applications"
          description="Track the jobs you have applied to."
        />

        <Card className="mt-6 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <FileCheck className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              Unable to load applications
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                void refresh();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Applications"
        description="Track the jobs you have applied to."
      />

      {statusError && (
        <Card className="mt-6 rounded-2xl border-destructive/30">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              {statusError}
            </p>
          </CardContent>
        </Card>
      )}

      {scheduleSuccess && (
        <Card className="mt-6 rounded-2xl border-green-500/30">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">
              {scheduleSuccess}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search applications..."
            value={query}
            onChange={(event) => {
              setQuery(
                event.target.value
              );
            }}
            className="pl-10"
          />
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
        >
          <TabsList>
            {tabs.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        <FadeIn>
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <caption className="sr-only">
                    Your job applications
                  </caption>

                  <thead className="border-b border-border/60">
                    <tr className="text-left text-xs font-medium text-muted-foreground">
                      <th className="px-6 py-3">
                        Position
                      </th>

                      <th className="px-6 py-3">
                        Company
                      </th>

                      <th className="px-6 py-3">
                        Status
                      </th>

                      <th className="px-6 py-3">
                        Location
                      </th>

                      <th className="px-6 py-3">
                        Applied
                      </th>

                      <th className="px-6 py-3">
                        Salary
                      </th>

                      <th className="px-6 py-3 text-right">
                        Update
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border/60">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-sm text-muted-foreground"
                        >
                          {applications.length ===
                          0
                            ? 'You have not applied to any jobs yet.'
                            : 'No applications found.'}
                        </td>
                      </tr>
                    ) : (
                      filtered.map(
                        (application) => {
                          const status =
                            application.status
                              .toLowerCase();

                          const config =
                            statusConfig[
                              status
                            ] ?? {
                              label:
                                application.status,
                              variant:
                                'outline' as const,
                            };

                          const updating =
                            updatingId ===
                            application.id;

                          const isInterview =
                            status ===
                            'interview';

                          const isScheduling =
                            schedulingId ===
                            application.id;

                          return (
                            <tr
                              key={
                                application.id
                              }
                              className="transition-colors hover:bg-secondary/40"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <FileCheck className="h-4 w-4 text-muted-foreground" />

                                  <div>
                                    <span className="font-medium">
                                      {
                                        application.jobTitle
                                      }
                                    </span>

                                    {application.employmentType && (
                                      <p className="mt-0.5 text-xs text-muted-foreground">
                                        {
                                          application.employmentType
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {application.company}
                              </td>

                              <td className="px-6 py-4">
                                <Badge
                                  variant={
                                    config.variant
                                  }
                                >
                                  {
                                    config.label
                                  }
                                </Badge>
                              </td>

                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {
                                  application.location
                                }
                              </td>

                              <td className="px-6 py-4">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />

                                  {formatDate(
                                    application.appliedAt
                                  )}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {
                                  application.salaryRange ||
                                  '—'
                                }
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-wrap justify-end gap-2">
                                  <select
                                    value={status}
                                    disabled={
                                      updating
                                    }
                                    onChange={(
                                      event
                                    ) => {
                                      void handleStatusChange(
                                        application,
                                        event
                                          .target
                                          .value
                                      );
                                    }}
                                    className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={`Update status for ${application.jobTitle}`}
                                  >
                                    <option value="applied">
                                      Applied
                                    </option>

                                    <option value="interview">
                                      Interview
                                    </option>

                                    <option value="offer">
                                      Offer
                                    </option>

                                    <option value="rejected">
                                      Rejected
                                    </option>

                                    <option value="withdrawn">
                                      Withdrawn
                                    </option>
                                  </select>

                                  {isInterview && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      disabled={
                                        updating
                                      }
                                      onClick={() => {
                                        if (
                                          isScheduling
                                        ) {
                                          closeScheduleForm();
                                        } else {
                                          openScheduleForm(
                                            application.id
                                          );
                                        }
                                      }}
                                    >
                                      <Calendar className="mr-2 h-4 w-4" />

                                      {isScheduling
                                        ? 'Close'
                                        : 'Schedule'}
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* ================================================= */}
      {/* Schedule Interview Form */}
      {/* ================================================= */}

      {schedulingId !== null && (
        <FadeIn className="mt-6">
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Schedule Interview
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the interview details for this application.
                  </p>
                </div>
              </div>

              {scheduleError && (
                <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-sm text-destructive">
                    {scheduleError}
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Interview Type
                  </label>

                  <select
                    value={interviewType}
                    onChange={(event) => {
                      setInterviewType(
                        event.target.value
                      );
                    }}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="VIDEO">
                      Video
                    </option>

                    <option value="PHONE">
                      Phone
                    </option>

                    <option value="ONSITE">
                      On-site
                    </option>

                    <option value="TECHNICAL">
                      Technical
                    </option>

                    <option value="HR">
                      HR
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date & Time
                  </label>

                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) => {
                        setScheduledAt(
                          event.target.value
                        );
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Interviewer
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={interviewerName}
                      onChange={(event) => {
                        setInterviewerName(
                          event.target.value
                        );
                      }}
                      placeholder="Interviewer name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Meeting Link
                  </label>

                  <div className="relative">
                    <Video className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={meetingLink}
                      onChange={(event) => {
                        setMeetingLink(
                          event.target.value
                        );
                      }}
                      placeholder="https://meet.google.com/..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={location}
                      onChange={(event) => {
                        setLocation(
                          event.target.value
                        );
                      }}
                      placeholder="Remote / Office location"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) => {
                      setNotes(
                        event.target.value
                      );
                    }}
                    placeholder="Interview preparation notes..."
                    rows={4}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
             <Button
  type="button"
  onClick={() => {
    void handleScheduleInterview(
      schedulingId
    );
  }}
  disabled={
    updatingId === schedulingId ||
    !scheduledAt
  }
>
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    void handleScheduleInterview(
                      schedulingId
                    );
                  }}
                  disabled={updatingId === schedulingId}
                >
                  <Calendar className="mr-2 h-4 w-4" />

                  {updatingId === schedulingId
  ? 'Scheduling...'
  : 'Schedule Interview'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </>
  );
}