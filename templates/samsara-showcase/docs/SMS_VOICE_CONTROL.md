# SMS & Voice Control Integration

Complete guide for deploying portals via SMS text messages or voice commands using Zapier webhooks.

## Overview

The Samsara Showcase includes webhook endpoints that allow portal deployment through:
- **SMS Commands**: Text messages sent to a Zapier-connected phone number
- **Voice Commands**: Spoken commands transcribed by Zapier's voice-to-text service

## Architecture

```
User → SMS/Voice → Zapier → Webhook → tRPC API → Portal Deployment
```

1. User sends SMS or speaks voice command
2. Zapier receives and processes the input
3. Zapier sends webhook POST to `/api/trpc/zapier.smsCommand` or `/api/trpc/zapier.voiceCommand`
4. Backend parses command and triggers portal deployment
5. User receives confirmation notification

## Supported Commands

### Deployment Commands

- `deploy portal X` - Deploy a single portal by ID
- `deploy all portals` - Deploy all 51 portals in the constellation
- `deploy core portals` - Deploy 12 core infrastructure portals
- `deploy ai portals` - Deploy 17 AI agent portals
- `deploy consciousness portals` - Deploy 17 consciousness portals
- `deploy system portals` - Deploy 6 system portals

### Status Commands

- `status` - Get current deployment status and active portals

## Zapier Setup

### SMS Integration

1. **Create Zapier Account** at https://zapier.com
2. **Connect SMS Service**:
   - Twilio (recommended)
   - SMS by Zapier
   - Clickatell
3. **Create New Zap**:
   - Trigger: "New SMS Received"
   - Action: "Webhooks by Zapier" → "POST"
4. **Configure Webhook**:
   - URL: `https://your-domain.manus.space/api/trpc/zapier.smsCommand`
   - Method: `POST`
   - Data:
     ```json
     {
       "command": "{{SMS Body}}",
       "source": "sms",
       "phoneNumber": "{{From Phone Number}}",
       "timestamp": "{{Received At}}",
       "zapierSecret": "YOUR_WEBHOOK_SECRET"
     }
     ```

### Voice Integration

1. **Create Zapier Account** at https://zapier.com
2. **Connect Voice Service**:
   - Twilio Voice
   - Google Voice
   - Voicemail by Zapier
3. **Create New Zap**:
   - Trigger: "New Voicemail" or "New Call Recording"
   - Action: "Speech to Text by Zapier"
   - Action: "Webhooks by Zapier" → "POST"
4. **Configure Webhook**:
   - URL: `https://your-domain.manus.space/api/trpc/zapier.voiceCommand`
   - Method: `POST`
   - Data:
     ```json
     {
       "command": "{{Transcription Text}}",
       "source": "voice",
       "timestamp": "{{Received At}}",
       "zapierSecret": "YOUR_WEBHOOK_SECRET"
     }
     ```

## Environment Variables

Add these to your `.env` file:

```bash
# Zapier webhook authentication
ZAPIER_WEBHOOK_SECRET=your-secret-token-here

# Admin phone number (optional security layer)
ADMIN_PHONE_NUMBER=+1234567890
```

## Security

### Webhook Authentication

All webhook requests must include the `zapierSecret` parameter matching your `ZAPIER_WEBHOOK_SECRET` environment variable.

### Phone Number Verification

Optionally restrict SMS commands to a specific phone number by setting `ADMIN_PHONE_NUMBER`. Unauthorized attempts will:
- Be rejected with a 403 error
- Trigger a notification to the project owner

### Best Practices

1. **Use Strong Secrets**: Generate random tokens for `ZAPIER_WEBHOOK_SECRET`
2. **Enable HTTPS**: Always use HTTPS endpoints for webhooks
3. **Monitor Logs**: Review webhook activity regularly
4. **Rate Limiting**: Configure Zapier to limit requests per hour
5. **Test Mode**: Use test phone numbers during development

## Testing

### Test Webhook Connectivity

```bash
curl -X POST https://your-domain.manus.space/api/trpc/zapier.testWebhook \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-webhook-secret"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Zapier webhook connection verified",
  "timestamp": "2025-11-21T17:00:00.000Z"
}
```

### Test SMS Command

```bash
curl -X POST https://your-domain.manus.space/api/trpc/zapier.smsCommand \
  -H "Content-Type: application/json" \
  -d '{
    "command": "deploy core portals",
    "source": "sms",
    "phoneNumber": "+1234567890",
    "zapierSecret": "your-webhook-secret"
  }'
```

### Test Voice Command

```bash
curl -X POST https://your-domain.manus.space/api/trpc/zapier.voiceCommand \
  -H "Content-Type: application/json" \
  -d '{
    "command": "deploy all portals",
    "source": "voice",
    "zapierSecret": "your-webhook-secret"
  }'
```

## Command Parser

The backend includes an intelligent command parser that handles:
- Case-insensitive matching
- Natural language variations
- Typo tolerance
- Partial matches

### Examples

All these commands deploy all portals:
- "deploy all portals"
- "Deploy All Portals"
- "DEPLOY ALL"
- "deploy everything"

## Notifications

The system sends notifications to the project owner for:
- ✅ Successful deployments
- ⚠️ Command parsing errors
- 🚨 Unauthorized access attempts
- 📊 Deployment status updates

## Future Enhancements

- [ ] Two-factor authentication for voice commands
- [ ] Natural language processing for complex queries
- [ ] Voice response synthesis (text-to-speech replies)
- [ ] Multi-language support
- [ ] Scheduled deployments via SMS
- [ ] Rollback commands
- [ ] Real-time deployment progress via SMS

## Troubleshooting

### Webhook Not Receiving Requests

1. Verify Zapier Zap is enabled
2. Check webhook URL is correct
3. Ensure HTTPS is enabled
4. Review Zapier task history for errors

### Authentication Failures

1. Verify `ZAPIER_WEBHOOK_SECRET` matches in both Zapier and `.env`
2. Check for trailing spaces or special characters
3. Ensure secret is passed in request body

### Commands Not Recognized

1. Check command format matches supported patterns
2. Review backend logs for parsing errors
3. Test with simple commands first (e.g., "status")

## Support

For issues or questions:
- GitHub Issues: https://github.com/Deathcharge/helix-hub-manus/issues
- Email: ward.andrew32@gmail.com
- Documentation: https://github.com/Deathcharge/helix-hub-manus/tree/main/docs

## License

MIT License - See LICENSE file for details
