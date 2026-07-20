"use server";

export async function submitInquiry(
  prevState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const name = formData.get("name") as string;
  const business = formData.get("business") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const collection = formData.get("collection") as string;
  const quantity = formData.get("quantity") as string;
  const requirements = formData.get("requirements") as string;

  // Basic validation
  if (!name || !business || !email || !phone || !requirements) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    // In production: send email via Resend or similar
    console.log("Inquiry received:", {
      name,
      business,
      email,
      phone,
      collection,
      quantity,
      requirements,
    });

    return { success: true, error: null };
  } catch (err) {
    console.error("Failed to process inquiry:", err);
    return {
      success: false,
      error: "Something went wrong. Please try again or contact us directly.",
    };
  }
}
