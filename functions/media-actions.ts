"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { requireAdmin } from "./project-auth";
import { mediaLimits, validateMedia, type MediaKind } from "@/lib/media";
import { cleanupMediaCandidates, validateCleanupUrls } from "./media-cleanup";

export async function discardProjectMedia(urls: string[]) {
    try {
        await requireAdmin();
        validateCleanupUrls(urls);
        const pending = await cleanupMediaCandidates(urls);
        return { success: pending.length === 0, pending, message: pending.length ? "Some unused files could not be deleted. Please retry cleanup." : "Unused files deleted." };
    } catch (error) { return { success: false, pending: urls, message: error instanceof Error ? error.message : "Unable to delete unused files." }; }
}

export async function createMediaUpload(kind: MediaKind, type: string, size: number) {
    try {
        await requireAdmin();
        const extension = validateMedia(kind, type, size);
        const key = `projects/uploads/${crypto.randomUUID()}.${extension}`;
        const s3 = new S3Client({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } });
        // The signed policy constrains the key, MIME type and size, not just the client UI.
        // Browser-to-S3 uploads bypass Vercel's request-body limit for large videos.
        const signed = await createPresignedPost(s3, {
            Bucket: process.env.AMPLIFY_BUCKET!, Key: key, Expires: 600,
            Fields: { "Content-Type": type },
            Conditions: [["content-length-range", 1, mediaLimits[kind]], ["eq", "$Content-Type", type]],
        });
        return { success: true as const, ...signed, publicUrl: `https://juliette-portfolio-website.s3.ap-southeast-2.amazonaws.com/${key}` };
    } catch (error) { return { success: false as const, message: error instanceof Error ? error.message : "Unable to start this upload." }; }
}
