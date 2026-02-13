module.exports = {
    async changePassword(ctx) {
        try {
            const { currentPassword, password, passwordConfirmation } = ctx.request.body;
            const userId = ctx.state.user.id;

            // Validaciones
            if (!currentPassword || !password || !passwordConfirmation) {
                return ctx.badRequest('Todos los campos son requeridos');
            }

            if (password !== passwordConfirmation) {
                return ctx.badRequest('Las contraseñas no coinciden');
            }

            if (password.length < 6) {
                return ctx.badRequest('La nueva contraseña debe tener al menos 6 caracteres');
            }

            // Obtener usuario actual
            const user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { id: userId },
            });

            if (!user) {
                return ctx.notFound('Usuario no encontrado');
            }

            // Verificar contraseña actual
            const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
                currentPassword,
                user.password
            );

            if (!validPassword) {
                return ctx.badRequest('La contraseña actual es incorrecta');
            }

            // Verificar que la nueva contraseña sea diferente
            const samePassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
                password,
                user.password
            );

            if (samePassword) {
                return ctx.badRequest('La nueva contraseña debe ser diferente a la actual');
            }

            // Hash de la nueva contraseña
            const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword({
                password,
            });

            // Actualizar contraseña
            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: userId },
                data: { password: hashedPassword },
            });

            ctx.send({
                message: 'Contraseña actualizada correctamente',
            });
        } catch (error) {
            console.error('Error changing password:', error);
            ctx.internalServerError('Error interno del servidor');
        }
    },
};