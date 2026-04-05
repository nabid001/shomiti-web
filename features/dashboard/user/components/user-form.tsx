"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Loader2Icon, UserIcon } from "lucide-react";
import { createUser } from "../actions/user";
import { userFormSchema } from "@/schema/user-form-schema";

type FormValues = z.infer<typeof userFormSchema>;

const UserForm = () => {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      photo: undefined,
      isActive: true,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await createUser(data);
      if (res.error) {
        toast.error("Failed to create member. Please check the form.");
        return;
      }
      toast.success("Member created successfully!");
      form.reset();
      setPhotoPreview("");
      router.push("/dashboard/member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-2xl w-full space-y-6"
    >
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-24 w-24 rounded-full border-2 border-dashed border-muted-foreground/30 overflow-hidden bg-muted flex items-center justify-center">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="photo"
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon className="h-10 w-10 text-muted-foreground/40" />
          )}
        </div>
        <Controller
          control={form.control}
          name="photo"
          render={({ field }) => (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setPhotoPreview(res[0].ufsUrl);
                field.onChange(res[0].ufsUrl);
                toast.success("Photo uploaded.");
              }}
              onUploadError={(err) => toast.error(err.message)}
            />
          )}
        />
        {form.formState.errors.photo && (
          <p className="text-sm text-destructive">
            {form.formState.errors.photo.message}
          </p>
        )}
      </div>

      {/* Name + Username */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Email */}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Date of birth + Gender */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="dateOfBirth"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Creating member…
          </>
        ) : (
          "Create member"
        )}
      </Button>
    </form>
  );
};

export default UserForm;
