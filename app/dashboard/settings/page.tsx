
'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  Loader2,
} from 'lucide-react';

import {
  changePassword,
  getCurrentUser,
  getUserSettings,
  updateUserSettings,
  type UserResponse,
  type UserSettingsResponse,
} from '@/services/userService';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { useTheme } from '@/components/theme-provider';

export default function SettingsPage() {
  const [user, setUser] =
    useState<UserResponse | null>(null);

  const [settings, setSettings] =
    useState<UserSettingsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const { theme, setTheme } =
    useTheme();

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError('');
        setMessage('');

        const [
          userData,
          settingsData,
        ] = await Promise.all([
          getCurrentUser(),
          getUserSettings(),
        ]);

        if (!mounted) {
          return;
        }

        setUser(userData);
        setSettings(settingsData);

        /*
         * IMPORTANT:
         *
         * Do NOT call setTheme(settingsData.theme)
         * here.
         *
         * The ThemeProvider already owns the current
         * application theme. Loading the Settings page
         * must not unexpectedly switch dark mode back
         * to light mode.
         *
         * The selected theme is synchronized with the
         * backend when the user clicks Save Changes.
         */
      } catch (err) {
        console.error(
          'Failed to load settings:',
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load settings.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const updated =
        await updateUserSettings({
          ...settings,
          theme:
            theme === 'dark'
              ? 'dark'
              : 'light',
        });

      setSettings(updated);

      /*
       * Keep the current UI theme exactly as selected.
       */
      setTheme(
        updated.theme === 'dark'
          ? 'dark'
          : 'light'
      );

      setMessage(
        'Settings saved successfully.'
      );
    } catch (err) {
      console.error(
        'Failed to save settings:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save settings.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword =
    async () => {
      if (!currentPassword) {
        setError(
          'Enter your current password.'
        );
        return;
      }

      if (newPassword.length < 8) {
        setError(
          'New password must be at least 8 characters.'
        );
        return;
      }

      if (newPassword.length > 100) {
        setError(
          'New password cannot exceed 100 characters.'
        );
        return;
      }

      try {
        setPasswordSaving(true);
        setError('');
        setMessage('');

        await changePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword('');
        setNewPassword('');

        setMessage(
          'Password updated successfully.'
        );
      } catch (err) {
        console.error(
          'Failed to change password:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to change password.'
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  if (
    loading ||
    !settings ||
    !user
  ) {
    return (
      <>
        <PageHeader
          title="Settings"
          description="Loading your settings..."
        />

        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, and security."
      />

      {message && (
        <Card className="mt-6 rounded-2xl border-success/30">
          <CardContent className="p-4">
            <p className="text-sm text-success">
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mt-6 rounded-2xl border-destructive/30">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* ACCOUNT */}

        <FadeIn>
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Account
              </CardTitle>

              <CardDescription>
                Manage your account preferences.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label>
                  Display Name
                </Label>

                <Input
                  value={`${user.firstName} ${user.lastName}`}
                  disabled
                />

                <p className="text-xs text-muted-foreground">
                  Change your name from the Profile page.
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Email
                </Label>

                <Input
                  value={user.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">
                  Language
                </Label>

                <Select
                  value={settings.language}
                  onValueChange={(value) => {
                    setSettings({
                      ...settings,
                      language: value,
                    });

                    setMessage('');
                    setError('');
                  }}
                  disabled={saving}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="English">
                      English
                    </SelectItem>

                    <SelectItem value="Spanish">
                      Spanish
                    </SelectItem>

                    <SelectItem value="French">
                      French
                    </SelectItem>

                    <SelectItem value="German">
                      German
                    </SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Your selected language is saved with your account.
                </p>
              </div>

            </CardContent>
          </Card>
        </FadeIn>

        {/* NOTIFICATIONS */}

        <FadeIn delay={0.05}>
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Notifications
              </CardTitle>

              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Email notifications
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Receive job matches and updates via email.
                  </p>
                </div>

                <Switch
                  checked={
                    settings.emailNotifications
                  }
                  disabled={saving}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      emailNotifications:
                        checked,
                    });

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Push notifications
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Get real-time alerts on your devices.
                  </p>
                </div>

                <Switch
                  checked={
                    settings.pushNotifications
                  }
                  disabled={saving}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      pushNotifications:
                        checked,
                    });

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Weekly digest
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    A summary of your activity every Monday.
                  </p>
                </div>

                <Switch
                  checked={
                    settings.weeklyDigest
                  }
                  disabled={saving}
                  onCheckedChange={(checked) => {
                    setSettings({
                      ...settings,
                      weeklyDigest: checked,
                    });

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

            </CardContent>
          </Card>
        </FadeIn>

        {/* SECURITY */}

        <FadeIn delay={0.1}>
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Security
              </CardTitle>

              <CardDescription>
                Update your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  Current Password
                </Label>

                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  disabled={passwordSaving}
                  onChange={(event) => {
                    setCurrentPassword(
                      event.target.value
                    );

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password
                </Label>

                <Input
                  id="newPassword"
                  type="password"
                  minLength={8}
                  maxLength={100}
                  value={newPassword}
                  disabled={passwordSaving}
                  onChange={(event) => {
                    setNewPassword(
                      event.target.value
                    );

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

              <Button
                variant="outline"
                disabled={passwordSaving}
                onClick={() => {
                  void handleChangePassword();
                }}
              >
                {passwordSaving
                  ? 'Updating...'
                  : 'Update Password'}
              </Button>

            </CardContent>
          </Card>
        </FadeIn>

        {/* APPEARANCE */}

        <FadeIn delay={0.15}>
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Appearance
              </CardTitle>

              <CardDescription>
                Customize how the app looks.
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Dark mode
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes.
                  </p>
                </div>

                <Switch
                  checked={theme === 'dark'}
                  disabled={saving}
                  onCheckedChange={(checked) => {

                    const nextTheme =
                      checked
                        ? 'dark'
                        : 'light';

                    /*
                     * Change the UI immediately.
                     */
                    setTheme(nextTheme);

                    /*
                     * Also update local Settings state
                     * so Save Changes persists it.
                     */
                    setSettings({
                      ...settings,
                      theme: nextTheme,
                    });

                    setMessage('');
                    setError('');
                  }}
                />
              </div>

            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* SAVE */}

      <FadeIn delay={0.2}>
        <div className="mt-6 flex justify-end">
          <Button
            disabled={saving}
            onClick={() => {
              void handleSaveSettings();
            }}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}

            {saving
              ? 'Saving...'
              : 'Save Changes'}
          </Button>
        </div>
      </FadeIn>
    </>
  );
}

