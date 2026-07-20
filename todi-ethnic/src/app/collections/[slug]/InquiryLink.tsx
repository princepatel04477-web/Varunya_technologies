"use client";

import Link from "next/link";

export default function InquiryLink({
  collectionName,
}: {
  collectionName: string;
}) {
  return (
    <Link
      href={`/inquiry?collection=${encodeURIComponent(collectionName)}`}
      className="inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-200 text-sm px-8 py-3.5 bg-teal text-white hover:bg-teal-light active:bg-teal-light"
    >
      Inquire About This Collection
    </Link>
  );
}
