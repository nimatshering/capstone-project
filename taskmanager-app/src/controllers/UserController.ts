import { z } from "zod";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getUsers, store, update, destroy } from "@/models/userModel";

// Utility to extract Zod field errors
function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((e) => {
    if (e.path.length > 0) {
      fieldErrors[e.path[0] as string] = e.message;
    }
  });
  return fieldErrors;
}

// Password validation rule
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

// Create user schema
export const createUserSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Please enter a valid email."),
    photo: z.union([z.string(), z.null()]).default(null),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Update user schema (partial fields)
export const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// GET all users
export async function getAllUsers(): Promise<NextResponse> {
  try {
    const users = await getUsers();
    
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch users", err },
      { status: 500 }
    );
  }
}

//  CREATE user
export async function createUser(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const { confirmPassword, password, ...userData } = parsed.data;
    const hashedPassword = await hash(password, 10);

    const newUser = await store({ ...userData, password: hashedPassword });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    console.error("Create user error:");
    return NextResponse.json(
      { error: "Failed to create user (server error)" },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function updateUser(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const parsed = updateUserSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { fieldErrors: getZodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const { confirmPassword: _, password, ...otherFields } = parsed.data;

    // Build updateData with optional password (hashed)
    const updateData = {
      ...otherFields,
      ...(password ? { password: await hash(password, 10) } : {}),
    };

    await update(id, updateData);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function deleteUser(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await destroy(id);
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
