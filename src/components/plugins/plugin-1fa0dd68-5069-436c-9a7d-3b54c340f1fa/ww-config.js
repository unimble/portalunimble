export default {
    features: {
        auth: true,
    },
    editor: {
        settings: [
            {
                label: 'Configuration',
                icon: 'advanced',
                edit: () => import('./src/components/Configuration/SettingsEditMultiEnv.vue'),
                summary: () => import('./src/components/Configuration/SettingsSummary.vue'),
                getIsValid(settings) {
                    // Check if using new multi-environment format
                    if (settings.publicData?.environments) {
                        // Production environment is required
                        return !!(settings.publicData.environments.production?.projectUrl && 
                                 settings.publicData.environments.production?.apiKey);
                    }
                    // Legacy format validation
                    return !!settings.publicData.projectUrl && !!settings.publicData.apiKey;
                },
                onSave: 'onSave',
            },
            {
                label: 'Roles tables (optional)',
                icon: 'data',
                edit: () => import('./src/components/RoleTable/SettingsEdit.vue'),
                summary: () => import('./src/components/RoleTable/SettingsSummary.vue'),
                getIsValid() {
                    return true;
                },
            },
        ],
        designSystemId: '290de5c1-a7fb-49a7-88bb-6acd08576c07',
    },
    variables: [
        { name: 'user', value: 'user', type: 'object', defaultValue: null },
        { name: 'isAuthenticated', value: 'isAuthenticated', type: 'boolean', defaultValue: false },
    ],
    actions: [
        {
            name: 'Sign Up',
            code: 'signUp',
            isAsync: true,
        },
        {
            name: 'Sign Out',
            code: 'signOut',
            isAsync: true,
        },
        {
            name: 'Sign In | Email and Password',
            code: 'signInEmail',
            isAsync: true,
        },
        {
            name: 'Sign In | Phone and Password',
            code: 'signInPhone',
            isAsync: true,
        },
        {
            name: 'Sign In | OAuth Provider',
            code: 'signInProvider',
            isAsync: true,
        },
        {
            name: 'Sign In | One-Time Password',
            code: 'signInOTP',
            isAsync: true,
        },
        {
            name: 'Sign In | Magic Link',
            code: 'signInMagicLink',
            isAsync: true,
        },
        {
            name: 'Sign In | OIDC Token',
            code: 'signInOIDC',
            isAsync: true,
        },
        {
            name: 'Sign In | SAML 2.0 SSO',
            code: 'signInSSO',
            isAsync: true,
        },
        {
            name: 'Verify OTP',
            code: 'verifyOTP',
            isAsync: true,
        },
        {
            name: 'Resend OTP',
            code: 'resendOTP',
            isAsync: true,
        },
        {
            name: 'Fetch User',
            code: 'fetchUser',
        },
        {
            name: 'Update User',
            code: 'updateUserMeta',
            isAsync: true,
        },
        {
            name: 'Change Password',
            code: 'updateUserPassword',
            isAsync: true,
        },
        {
            name: 'Forgot Password',
            code: 'resetPasswordForEmail',
            isAsync: true,
        },
        {
            name: 'Confirm Password',
            code: 'confirmPassword',
            isAsync: true,
        },
        {
            name: 'Refresh session',
            code: 'refreshSession',
            isAsync: true,
        },
    ],
};
