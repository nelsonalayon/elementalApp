export default ({ env }) => ({
	'users-permissions': {
		config: {
			jwtSecret: env('JWT_SECRET'),
			jwt: {
				expiresIn: env('JWT_EXPIRES_IN', '7d'),
			},
		},
	},
});
