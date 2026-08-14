
'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Camera,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react';

import {
  getCurrentUser,
  removeProfileImage,
  updateCurrentUser,
  uploadProfileImage,
  UserResponse,
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
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { useAuth } from '@/constants/AuthContext';

export default function ProfilePage() {
  const { refreshUser } = useAuth();

  const [user, setUser] =
    useState<UserResponse | null>(null);

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [imageUploading, setImageUploading] =
    useState(false);

  const [imageRemoving, setImageRemoving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await getCurrentUser();

        if (!mounted) {
          return;
        }

        setUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (err) {
        console.error(
          'Failed to load profile:',
          err
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load profile.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    if (!user) {
      return '';
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      .toUpperCase();
  }, [user]);

  const fullName =
    `${firstName} ${lastName}`.trim();

  const handleSave = async () => {
    const normalizedFirstName =
      firstName.trim();

    const normalizedLastName =
      lastName.trim();

    if (normalizedFirstName.length < 2) {
      setError(
        'First name must be at least 2 characters.'
      );
      return;
    }

    if (normalizedLastName.length < 2) {
      setError(
        'Last name must be at least 2 characters.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const updated =
        await updateCurrentUser({
          firstName: normalizedFirstName,
          lastName: normalizedLastName,
        });

      setUser(updated);
      setFirstName(updated.firstName);
      setLastName(updated.lastName);

      // Keep sidebar/header user data in sync.
      await refreshUser();

      setMessage(
        'Profile updated successfully.'
      );
    } catch (err) {
      console.error(
        'Failed to update profile:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Please select a JPG, PNG, or WebP image.'
      );

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Profile picture must be 5 MB or smaller.'
      );

      event.target.value = '';
      return;
    }

    try {
      setImageUploading(true);
      setError('');
      setMessage('');

      const updated =
        await uploadProfileImage(file);

      setUser(updated);

      // Refresh global AuthContext so the sidebar
      // immediately receives the new profileImage.
      await refreshUser();

      setMessage(
        'Profile picture updated successfully.'
      );
    } catch (err) {
      console.error(
        'Failed to upload profile picture:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload profile picture.'
      );
    } finally {
      setImageUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveProfileImage =
    async () => {
      if (!user) {
        return;
      }

      try {
        setImageRemoving(true);
        setError('');
        setMessage('');

        await removeProfileImage();

        setUser({
          ...user,
          profileImage: null,
        });

        // Refresh global AuthContext so the sidebar
        // immediately returns to the initials avatar.
        await refreshUser();

        setMessage(
          'Profile picture removed successfully.'
        );
      } catch (err) {
        console.error(
          'Failed to remove profile picture:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to remove profile picture.'
        );
      } finally {
        setImageRemoving(false);
      }
    };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Profile"
          description="Loading profile..."
        />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader
          title="Profile"
          description={
            error ||
            'Unable to load profile.'
          }
        />
      </>
    );
  }

  const displayName =
    fullName ||
    `${user.firstName} ${user.lastName}`;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal information."
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        <FadeIn>
          <Card className="rounded-2xl border-border/60">

            <CardHeader>
              <CardTitle>
                About You
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center text-center">

              <div className="flex flex-col items-center">

                <div className="relative">

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-4 ring-background">

                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold">
                        {initials}
                      </span>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={
                      imageUploading ||
                      imageRemoving
                    }
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:opacity-90 disabled:opacity-50"
                    aria-label="Change profile picture"
                  >
                    {imageUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={
                    handleProfileImageChange
                  }
                />

                <div className="mt-3 flex gap-2">

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      imageUploading ||
                      imageRemoving
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    {imageUploading
                      ? 'Uploading...'
                      : 'Change Photo'}
                  </Button>

                  {user.profileImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={
                        imageUploading ||
                        imageRemoving
                      }
                      onClick={() => {
                        void handleRemoveProfileImage();
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />

                      {imageRemoving
                        ? 'Removing...'
                        : 'Remove'}
                    </Button>
                  )}

                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG or WebP · Maximum 5 MB
                </p>

              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {displayName}
              </h3>

              <p className="text-muted-foreground">
                {user.role}
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                {user.email}
              </p>

            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn
          delay={0.1}
          className="lg:col-span-2"
        >
          <Card className="rounded-2xl border-border/60">

            <CardHeader>
              <CardTitle>
                Edit Profile
              </CardTitle>

              <CardDescription>
                Update your name. Email and role are managed separately.
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>

                  <Input
                    id="firstName"
                    value={firstName}
                    disabled={saving}
                    onChange={(event) => {
                      setFirstName(
                        event.target.value
                      );
                      setError('');
                      setMessage('');
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>

                  <Input
                    id="lastName"
                    value={lastName}
                    disabled={saving}
                    onChange={(event) => {
                      setLastName(
                        event.target.value
                      );
                      setError('');
                      setMessage('');
                    }}
                  />
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
                  <Label>
                    Role
                  </Label>

                  <Input
                    value={user.role}
                    disabled
                  />
                </div>

              </div>

              <Button
                className="mt-6"
                disabled={saving}
                onClick={() => {
                  void handleSave();
                }}
              >
                <Save className="mr-2 h-4 w-4" />

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>

            </CardContent>
          </Card>
        </FadeIn>

      </div>
    </>
  );
}

