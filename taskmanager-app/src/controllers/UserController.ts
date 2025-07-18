import { z } from "zod";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getUsers, store, update, destroy } from "@/models/userModel";

/** ----------------------------
 * Zod Schema Definitions
 * ----------------------------- */

// Strong password rules
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Create user schema
const createUserSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.email("Please enter a valid email."),
    photo: z.union([z.string(), z.null()]).default(null),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Update user schema (partial allowed)
const updateUserSchema = createUserSchema
  .partial()
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/** ----------------------------
 * Utility: Zod Error Formatter
 * ----------------------------- */
function getZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((e) => {
    const path = e.path.join(".");
    fieldErrors[path] = e.message;
  });
  return fieldErrors;
}

/** ----------------------------
 * Route Handlers
 * ----------------------------- */

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

// POST /api/users → Create user
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
    console.error("Create user error:", err);
    return NextResponse.json(
      { error: "Failed to create user (server error)" },
      { status: 500 }
    );
  }
}

// PUT /api/users → Update user
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

// DELETE /api/users?id=123
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
