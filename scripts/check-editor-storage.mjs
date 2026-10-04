// Read-only by default. --enable-uploads adds missing upload and playback rules.
// Run with Bun so .env.local is loaded; never prints credentials.
import { S3Client, GetBucketCorsCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } });
try {
    const result = await s3.send(new GetBucketCorsCommand({ Bucket: process.env.AMPLIFY_BUCKET }));
    if (process.argv.includes("--enable-uploads")) {
        const origins = ["https://juliettekhoo.com", "https://www.juliettekhoo.com", "http://localhost:3000", "https://juliettekhoo.vercel.app"];
        const rules = result.CORSRules || [];
        const originalRuleCount = rules.length;
        for (const origin of origins) {
            const missingMethods = ["GET", "POST"].filter(method => !rules.some(rule => rule.AllowedOrigins?.includes(origin) && rule.AllowedMethods?.includes(method)));
            if (missingMethods.length) rules.push({ AllowedOrigins: [origin], AllowedMethods: missingMethods, AllowedHeaders: ["*"], MaxAgeSeconds: 3600 });
        }
        if (rules.length !== originalRuleCount) {
            // Preserve existing rules. Uploads still require a signed admin policy.
            await s3.send(new PutBucketCorsCommand({ Bucket: process.env.AMPLIFY_BUCKET, CORSConfiguration: { CORSRules: rules } }));
        }
        const verified = await s3.send(new GetBucketCorsCommand({ Bucket: process.env.AMPLIFY_BUCKET }));
        console.log(JSON.stringify({ corsRules: verified.CORSRules }, null, 2));
        process.exit(0);
    }
    console.log(JSON.stringify({ corsRules: result.CORSRules }, null, 2));
} catch (error) {
    console.error(JSON.stringify({ name: error.name, message: error.message }));
    process.exitCode = 1;
}
