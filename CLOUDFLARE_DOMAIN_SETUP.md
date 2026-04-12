# Cloudflare Domain Setup for Vercel

## Current Setup Status

You have two domains configured in Vercel:
- `pmlaos.com` (redirect 307 - needs configuration)
- `www.pmlaos.com` (Production - needs DNS update)

## Required DNS Configuration in Cloudflare

### Step-by-Step Instructions

1. **Log into Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your domain `pmlaos.com`

2. **Navigate to DNS Settings**
   - Click on **DNS** in the left sidebar

3. **Add/Update DNS Records**

   Add these two records:

   **Record 1: Root Domain (pmlaos.com)**
   - **Type**: `CNAME`
   - **Name**: `@` (or `pmlaos.com`)
   - **Target**: `ca965f0e5d6b8a05.vercel-dns-017.com`
   - **Proxy status**: ⚠️ **DNS only** (gray cloud icon) - IMPORTANT!
   - **TTL**: Auto

   **Record 2: WWW Subdomain (www.pmlaos.com)**
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `ca965f0e5d6b8a05.vercel-dns-017.com`
   - **Proxy status**: ⚠️ **DNS only** (gray cloud icon) - IMPORTANT!
   - **TTL**: Auto

4. **Delete Old Records**
   - Remove any existing A or CNAME records for `@` and `www` that point elsewhere
   - Keep only the new Vercel CNAME records

## CRITICAL: Proxy Status Settings

⚠️ **IMPORTANT**: You MUST disable Cloudflare's proxy (set to "DNS only") for the domain to verify with Vercel.

- **Gray cloud** ☁️ = DNS only (required for verification)
- **Orange cloud** 🟠 = Proxied through Cloudflare (will cause verification to fail)

### After Verification (Optional)

Once Vercel verifies your domain, you can optionally re-enable the Cloudflare proxy:
1. Change proxy status back to "Proxied" (orange cloud)
2. Set SSL/TLS mode to **Full (strict)** in Cloudflare SSL/TLS settings

**Benefits of enabling proxy:**
- DDoS protection
- Cloudflare CDN
- Additional security features

**Trade-offs:**
- May interfere with some Vercel analytics
- Adds another layer between users and Vercel

## SSL/TLS Configuration

1. Go to **SSL/TLS** in Cloudflare sidebar
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**

## Verification Timeline

- DNS propagation: **5-30 minutes** typically
- Maximum: Up to 48 hours
- Check status in Vercel dashboard - it will auto-verify

## Troubleshooting

### Domain not verifying?
```bash
# Check DNS propagation
nslookup www.pmlaos.com
nslookup pmlaos.com

# Should show: ca965f0e5d6b8a05.vercel-dns-017.com
```

### Common Issues:
- ❌ Proxy still enabled (orange cloud) - must be gray cloud
- ❌ Old DNS records still present - delete them
- ❌ Wrong CNAME target - use exact value from Vercel
- ❌ DNS not propagated yet - wait 15-30 minutes

## Post-Setup Checklist

After domain is verified:

- [ ] Update `NEXTAUTH_URL` in Vercel environment variables to `https://pmlaos.com`
- [ ] Add `https://pmlaos.com/api/auth/callback/google` to Google OAuth redirect URIs
- [ ] Add `https://www.pmlaos.com/api/auth/callback/google` to Google OAuth redirect URIs
- [ ] Test login functionality on production domain
- [ ] Optional: Re-enable Cloudflare proxy if desired

## Alternative: Using Vercel Nameservers

If you want to use Vercel DNS instead of Cloudflare DNS:

1. In Cloudflare, go to **DNS** → **Nameservers**
2. Change from Cloudflare nameservers to:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

⚠️ **Note**: This removes all Cloudflare features (proxy, firewall, etc.)

## Recommended Approach

**Use Cloudflare DNS** (as outlined above) to keep Cloudflare's features while hosting on Vercel.
