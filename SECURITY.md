# Security Guidelines

## API Key Protection

This project uses environment variables to protect your Claude API key.

### ✅ What IS Protected

- **`.env.local`** - Contains your actual API key, ignored by Git
- **API key** - Never appears in code or repository
- **Local configuration** - Each developer uses their own key

### ❌ What to NEVER Commit

- `.env.local` file
- Any file containing `sk-ant-api*`
- Hardcoded API keys in code
- Screenshots showing API keys

### 🔒 Security Checklist

Before pushing to GitHub:

```bash
# 1. Verify .env.local is in .gitignore
cat .gitignore | grep .env.local

# 2. Check git status
git status

# 3. Verify no API keys in staged files
git diff --cached | grep -i "sk-ant-api"

# 4. If you see your API key, DO NOT COMMIT
```

### 🚨 If You Accidentally Commit Your API Key

1. **Immediately revoke** the key at [Anthropic Console](https://console.anthropic.com/settings/keys)
2. **Generate a new key**
3. **Update your `.env.local`** with the new key
4. **Rewrite Git history** (or create a new repository if public)

### 📋 Best Practices

- ✅ Use `.env.local` for secrets
- ✅ Share `.env.example` as a template
- ✅ Document setup in README
- ✅ Keep `.gitignore` updated
- ✅ Review changes before committing
- ✅ Use git hooks for additional protection (optional)

### 🔍 How to Verify Your Setup is Secure

```bash
# Clone your repo to a temp folder
git clone <your-repo-url> /tmp/test-repo
cd /tmp/test-repo

# Search for API keys (should return nothing)
grep -r "sk-ant-api" .

# If nothing is found, you're good!
# Clean up
rm -rf /tmp/test-repo
```

### 🎯 Current Protection Status

- ✅ `.env.local` in `.gitignore`
- ✅ API key loaded from environment
- ✅ No hardcoded keys in code
- ✅ Clear documentation
- ✅ Template provided (`.env.example`)

Your API key is **secure** and ready for GitHub!
