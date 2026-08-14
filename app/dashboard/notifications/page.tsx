'use client';

import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Check,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { CardSkeleton } from '@/components/ui/skeleton';

import { useNotifications } from '@/hooks';
import notificationService from '@/services/notificationService';

import type { Notification } from '@/types';

const typeConfig: Record<
  Notification['type'],
  {
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  info: {
    icon: Info,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
};

export default function NotificationsPage() {
  const {
    data: notifications,
    loading,
  } = useNotifications();

  const items = notifications ?? [];

  const unreadCount =
    items.filter(
      (notification) => !notification.read
    ).length;

  const handleMarkAllRead =
    async () => {
      try {
        await notificationService.markAllAsRead();

        window.location.reload();
      } catch (error) {
        console.error(
          'Failed to mark all notifications as read:',
          error
        );
      }
    };

  const handleMarkRead =
    async (notification: Notification) => {
      if (notification.read) {
        return;
      }

      try {
        await notificationService.markAsRead(
          Number(notification.id)
        );

        window.location.reload();
      } catch (error) {
        console.error(
          'Failed to mark notification as read:',
          error
        );
      }
    };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Notifications"
          description="Stay up to date with your job search activity."
        />

        <div className="space-y-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <CardSkeleton
                key={index}
              />
            )
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Stay up to date with your job search activity."
        action={
          unreadCount > 0 ? (
            <Button
              variant="outline"
              onClick={() => {
                void handleMarkAllRead();
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <Card className="mt-6 rounded-2xl border-border/60">
          <CardContent className="p-10 text-center">
            <Info className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              No notifications
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Youre all caught up. New job search activity will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map(
            (notification, index) => {
              const config =
                typeConfig[
                  notification.type
                ];

              const Icon =
                config.icon;

              const unread =
                !notification.read;

              return (
                <FadeIn
                  key={notification.id}
                  delay={Math.min(
                    index * 0.05,
                    0.3
                  )}
                >
                  <Card
                    className={`rounded-2xl border-border/60 transition-all hover:shadow-soft ${
                      unread
                        ? 'border-primary/30 bg-primary/[0.02]'
                        : ''
                    }`}
                  >
                    <CardContent className="flex items-start gap-4 p-5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                      >
                        <Icon
                          className={`h-5 w-5 ${config.color}`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          void handleMarkRead(
                            notification
                          );
                        }}
                        className="min-w-0 flex-1 text-left"
                        aria-label={
                          unread
                            ? `Mark ${notification.title} as read`
                            : notification.title
                        }
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {
                              notification.title
                            }
                          </p>

                          {unread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {
                            notification.description
                          }
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            notification.createdAt
                          }
                        </p>

                        {unread && (
                          <p className="mt-2 text-xs font-medium text-primary">
                            Click to mark as read
                          </p>
                        )}
                      </button>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            }
          )}
        </div>
      )}
    </>
  );
}