"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, updateProjectSchema } from "../schemas";
import { z } from "zod";
import { Fragment, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ImageIcon,
  Loader,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Project } from "../types";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useGetNonProjectMembers } from "@/features/members/api/use-get-non-project-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useAddMemberToProject } from "../api/use-add-member-to-project";
import { useGetProjectMembers } from "../api/use-get-project-members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProjectMember } from "../api/use-remove-member";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();
  const { mutate: addMember } = useAddMemberToProject();
  const { data: nonProjectMembers } = useGetNonProjectMembers({
    workspaceId: initialValues.workspaceId,
    projectId: initialValues.$id,
  });
  const { data: members } = useGetProjectMembers({
    projectId: initialValues.$id,
  });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteProjectMember();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace? This action is irreversible.",
    "destructive"
  );

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member from the project?",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl || "",
    },
  });

  const nonProjectMembersform = useForm<z.infer<typeof addMemberSchema>>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      userId: "",
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteProject(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValues.workspaceId}`;
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues, param: { projectId: initialValues.$id } });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const onMemberChange = (value: string) => {
    nonProjectMembersform.setValue("userId", value);
  };

  const onAddMemberSubmit = (values: z.infer<typeof addMemberSchema>) => {
    const finalValues = {
      ...values,
      userId: values.userId,
    };

    addMember(
      { form: finalValues, param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const handleDeleteMember = async (userId: string) => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteMember(
      { param: { projectId: initialValues.$id }, query: { userId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="outline"
            className="dark:hover:bg-neutral-900"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator className="dark:bg-neutral-700" />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter a name for your project"
                          className="dark:bg-neutral-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="Logo"
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1mb
                          </p>
                          <input
                            className="hidden"
                            type="file"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              className="w-fit mt2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="outline"
                              className="w-fit mt2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <Separator className="my-7 dark:bg-neutral-700" />
              <div className="flex items-center justify-between">
                <div></div>
                <Button size="lg">
                  {isPending ? (
                    <>
                      <Loader className="animate-spin size-10" /> Loading
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {members && (
        <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
          <ConfirmDialog />
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <CardTitle className="text-xl font-bold">
              Project Members List
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <Separator className="dark:bg-neutral-700" />
          </div>
          <CardContent className="p-7">
            {members?.map((member, index) => (
              <Fragment key={member.$id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    names={member.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto dark:hover:bg-neutral-900"
                        variant="outline"
                        size="icon"
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="end"
                      className="dark:bg-neutral-700"
                    >
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(member.$id)}
                        disabled={isDeletingMember}
                      >
                        <TrashIcon />
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index !== members.length - 1 && (
                  <Separator className="my-2.5 dark:bg-neutral-700" />
                )}
              </Fragment>
            ))}
          </CardContent>
        </Card>
      )}

      {nonProjectMembers && (
        <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
            <CardTitle className="text-xl font-bold">
              Add Workspace Member To Project
            </CardTitle>
          </CardHeader>
          <div className="px-7">
            <Separator className="dark:bg-neutral-700" />
          </div>
          <CardContent className="p-7">
            <Form {...form}>
              <form
                onSubmit={nonProjectMembersform.handleSubmit(onAddMemberSubmit)}
              >
                <Select onValueChange={(value) => onMemberChange(value)}>
                  <SelectTrigger className="w-full lg:w-auto h-10 dark:bg-neutral-700">
                    <SelectValue placeholder="All non project members" />
                  </SelectTrigger>
                  <SelectContent className="w-full lg:w-auto dark:bg-neutral-700">
                    {nonProjectMembers?.documents.map((member) => (
                      <SelectItem key={member.$id} value={member.$id}>
                        <div className="flex flex-row items-center gap-x-2">
                          <MemberAvatar
                            className="size-8"
                            fallbackClassName="text-lg"
                            names={member.name}
                          />
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Separator className="my-7 dark:bg-neutral-700" />
                <div className="flex items-center justify-between">
                  <div></div>
                  <Button size="lg">
                    {isPending ? (
                      <>
                        <Loader className="animate-spin size-10" /> Loading
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card className="w-full h-full border-none shadow-none dark:bg-neutral-800">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all associated
              data.
            </p>
            <Separator className="my-4 dark:bg-neutral-700" />
            <Button
              className="w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isDeletingProject}
              onClick={handleDelete}
            >
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
