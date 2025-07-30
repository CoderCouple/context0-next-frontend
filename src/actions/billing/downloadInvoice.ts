"use server";

import { auth } from "@clerk/nextjs/server";
import { downloadInvoiceApi } from "@/api/billing-api";

export async function DownloadInvoice(id: string) {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "default" });
  
  if (!userId || !token) {
    throw new Error("unauthenticated");
  }

  const response = await downloadInvoiceApi(id, token);
  
  if (!response.result?.invoiceUrl) {
    throw new Error("Invoice not found");
  }

  return response.result.invoiceUrl;
}
