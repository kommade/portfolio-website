// Read-only by default. --enable-uploads adds the approved POST rule.
// Run with Bun so .env.local is loaded; never prints credentials.
import { S3Client, GetBucketCorsCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } });
try {
    const result = await s3.send(new GetBucketCorsCommand({ Bucket: process.env.AMPLIFY_BUCKET }));
    if (process.argv.includes("--enable-uploads")) {
        const origins = ["https://juliettekhoo.com", "https://www.juliettekhoo.com", "http://localhost:3000"];
        const rules = result.CORSRules || [];
        const missing = origins.filter(origin => !rules.some(rule => rule.AllowedOrigins?.includes(origin) && rule.AllowedMethods?.includes("POST")));
        if (missing.length) {
            // Preserve every existing rule. Add only authenticated POST support for these sites.
            rules.push({ AllowedOrigins: missing, AllowedMethods: ["POST"], AllowedHeaders: ["*"], MaxAgeSeconds: 3600 });
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
