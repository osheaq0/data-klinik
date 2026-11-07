import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

for (const file of ['.env.local', '.env.seed.local']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const users = JSON.parse(readFileSync(new URL('../lib/auth-users.json', import.meta.url), 'utf8'));
const password = process.env.SEED_PASSWORD?.trim();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim();

const missing = [];
if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL di .env.local');
if (!secretKey) missing.push('SUPABASE_SERVICE_ROLE_KEY atau SUPABASE_SECRET_KEY di .env.seed.local');
if (!password) missing.push('SEED_PASSWORD di .env.seed.local');
if (missing.length) {
  console.error('Variabel yang belum diisi:\n- ' + missing.join('\n- '));
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

async function findUserByEmail(email) {
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 100) return null;
  }
}

for (const [username, email] of Object.entries(users)) {
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      const { error } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { ...existing.user_metadata, username },
      });
      if (error) throw error;
      console.log(`Akun ${username} diperbarui (ID tetap ${existing.id}).`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });
      if (error) throw error;
      console.log(`Akun ${username} dibuat (ID ${data.user.id}).`);
    }
  } catch (error) {
    console.error(`Gagal menyiapkan akun ${username}: ${error.message}`);
    process.exitCode = 1;
    break;
  }
}
