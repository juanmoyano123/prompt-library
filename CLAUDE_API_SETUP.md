# Claude API Setup Guide

## 🎯 Quick Start - Enable Prompt Optimization

Your Prompt Library application is now fully configured to use Claude's API for AI-powered prompt optimization!

## 📋 Setup Steps

### 1. Get Your Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-api...`)

### 2. Configure in the Application

1. Open your Prompt Library at `http://localhost:5173`
2. Click the **Settings** icon (⚙️) in the header
3. Paste your API key
4. Click "Save & Validate"
5. Wait for validation confirmation ✅

### 3. Test the Optimization Feature

1. Click "New Prompt" or edit an existing prompt
2. Add some content to your prompt
3. Click the **"Optimize with AI"** button (purple gradient button)
4. Wait a few seconds while Claude analyzes your prompt
5. Review the optimized version
6. Click "Use Optimized Version" to apply it

## ✨ Features Enabled

### 🤖 AI-Powered Optimization
- Uses Claude 3.5 Sonnet for balanced performance and cost
- Improves clarity, specificity, and structure
- Adds context and constraints
- Defines output formats
- Handles edge cases

### 💰 Cost Information

| Model | Cost per 1K tokens | Best For |
|-------|-------------------|----------|
| Haiku | ~$0.001 | Quick, cheap optimizations |
| Sonnet (default) | ~$0.003 | Balanced quality/cost |
| Opus | ~$0.015 | Maximum quality |

**Typical optimization cost:** $0.01 - $0.05 per prompt

### 🔔 Notifications
- Success/error toast notifications for all actions
- Clear feedback on API operations
- Validation status indicators

## 🔒 Security Considerations

### ⚠️ Important Security Notice

Your API key is stored in **browser localStorage**. This means:

✅ **Safe for:**
- Personal use
- Local development
- Trusted environments
- Single-user applications

❌ **NOT safe for:**
- Public websites
- Shared computers
- Production apps with multiple users
- Any environment where others can access your browser

### 🛡️ Best Practices

1. **Keep your API key private** - Never share it or commit it to version control
2. **Monitor usage** - Check your [Anthropic Console](https://console.anthropic.com/settings/usage) regularly
3. **Set spending limits** - Configure budget alerts in the Anthropic Console
4. **Rotate keys** - Change your API key periodically
5. **Use in development only** - For production, implement a backend proxy

## 🚀 What's Been Updated

### Core Changes

1. **Claude API Integration (`src/utils/claudeAPI.ts`)**
   - Added CORS support header: `anthropic-dangerous-direct-browser-access: true`
   - Updated to latest Claude models (3.5 Sonnet, 3.5 Haiku)
   - Improved error handling with specific messages
   - Better system prompt for optimization

2. **API Settings Component (`src/components/settings/ApiSettings.tsx`)**
   - Security warning prominently displayed
   - Cost estimates for different models
   - Toast notifications for validation
   - External link to Anthropic Console

3. **Prompt Editor (`src/components/prompts/PromptEditor.tsx`)**
   - Toast notifications for all operations
   - Better error messages
   - Automatic API settings dialog if key missing
   - Success feedback on optimization

4. **Prompt Card (`src/components/prompts/PromptCard.tsx`)**
   - Toast notifications for copy/delete/duplicate
   - Better user feedback

## 🧪 Testing the Integration

### Test Prompt 1: Simple Enhancement
```
Write a blog post about AI
```
Expected improvement: More specific instructions, target audience, tone, length specifications

### Test Prompt 2: Technical Task
```
Create a function to sort an array
```
Expected improvement: Language specification, time complexity requirements, edge cases, examples

### Test Prompt 3: Creative Task
```
Generate ideas for a story
```
Expected improvement: Genre specification, character details, setting context, narrative structure

## 🐛 Troubleshooting

### "API Key Required" Error
- Solution: Configure your API key in Settings (⚙️)

### "Network Error" Message
- Check your internet connection
- Verify your API key is valid
- Check [Anthropic Status](https://status.anthropic.com/)

### "Invalid Response Format"
- Try again - might be temporary API issue
- Check if your API key has necessary permissions
- Verify you have credits remaining

### CORS Errors in Console
- This should NOT happen - the CORS header is configured
- If you see CORS errors, verify the latest code is deployed
- Check that `anthropic-dangerous-direct-browser-access: true` is in headers

## 📊 Monitoring Usage

Track your API usage at:
- [Usage Dashboard](https://console.anthropic.com/settings/usage)
- [Billing Settings](https://console.anthropic.com/settings/billing)

## 🎉 Ready to Use!

Your prompt optimization feature is now fully functional. Enjoy creating better prompts with Claude's AI assistance!

## 💡 Tips for Best Results

1. **Be specific** - Give Claude more context in your original prompt
2. **Iterate** - Try optimizing multiple times with different approaches
3. **Learn from optimizations** - Study what Claude improves to write better prompts yourself
4. **Experiment** - Try different types of prompts to see various optimization strategies

---

**Need Help?**
- [Anthropic Documentation](https://docs.anthropic.com/)
- [API Reference](https://docs.anthropic.com/claude/reference)
- [Community Forum](https://community.anthropic.com/)
