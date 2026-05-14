import { createClient } from "@libsql/client";

const url = import.meta.env.VITE_DATABASE_URL || "libsql://farmos-db-hoaitroc2212.aws-ap-northeast-1.turso.io";
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzMzMzE5OTAsImlkIjoiMDE5Y2UyZDItOTkwMS03MTczLWFjMGUtOTZkNjBiNThlNWU1IiwicmlkIjoiZDE0M2QyNDUtOTlhYy00NDRhLTkxM2QtZTA1ZWM4NjUwZDYwIn0.OpprYajVLmlmv1joOqQ2J45kk6y7jUxap2LH489qiqs6ETEUBHCj6U_kAP0maH594xfwHo5cMt0v2VlYmnqxDg";

export const db = createClient({
  url,
  authToken,
});
