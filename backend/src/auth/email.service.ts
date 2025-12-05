import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
            port: this.configService.get('SMTP_PORT') || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }

    async sendInvitationEmail(
        to: string,
        inviterName: string,
        organizationName: string,
        role: string,
        inviteLink: string,
    ): Promise<void> {
        const from = this.configService.get('SMTP_FROM') || 'BizFlow <noreply@bizflow.com>';

        // If SMTP is not configured, just log
        if (!this.configService.get('SMTP_USER')) {
            console.log('\n========================================');
            console.log('[MOCK EMAIL] No SMTP configured');
            console.log(`To: ${to}`);
            console.log(`From: ${inviterName} at ${organizationName}`);
            console.log(`Role: ${role}`);
            console.log(`Link: ${inviteLink}`);
            console.log('========================================\n');
            return;
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">BizFlow</h1>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b;">You've been invited!</h2>
                    <p style="color: #475569; font-size: 16px;">
                        <strong>${inviterName}</strong> has invited you to join 
                        <strong>${organizationName}</strong> on BizFlow as a <strong>${role}</strong>.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${inviteLink}" 
                           style="background: #6366f1; color: white; padding: 14px 28px; 
                                  text-decoration: none; border-radius: 8px; font-weight: bold;
                                  display: inline-block;">
                            Accept Invitation
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px;">
                        This invitation will expire in 7 days.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="color: #94a3b8; font-size: 12px;">
                        If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from,
                to,
                subject: `${inviterName} invited you to join ${organizationName} on BizFlow`,
                html,
            });
            console.log(`[EMAIL] Invitation sent to ${to}`);
        } catch (error) {
            console.error('[EMAIL ERROR]', error);
            // Don't throw - we still want the invitation to be created
        }
    }
}
