import Command from '../lib/structures/Command';

// permission {level/commandName} {add/remove} {ID}
export default new Command('permission', async (caller, cmd, _log, config) => {
	if (!cmd.args[0])
		return caller.utils.discord.createMessage(cmd.channel.id, `Seleciona el nivel o el comando.\n\
		Levels: **regular**, **support** and **admin**.\nUso: ${config.prefix}permission {levelName/commandName} {add/remove} {role ID/user ID}`);
	if (!cmd.args[1] || ['add', 'remove', 'rmv'].indexOf(cmd.args[1]) < 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Porfavor, seleciona `add` o `remove`.');
	if (!cmd.args[2])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Seleciona el rol o el ID del usuario.');

	if (cmd.args[1] === 'add')
		// Levels+
		if (['ADMIN', 'SUPPORT', 'REGULAR'].indexOf(cmd.args[0].toUpperCase()) >= 0) {
			if (config.levelPermissions[cmd.args[0].toUpperCase() as ('REGULAR' | 'SUPPORT' | 'ADMIN')].includes(cmd.args[2]))
				return caller.utils.discord.createMessage(cmd.channel.id, 'Esa ID ya esta agregada a ese permiso.');

			const updated = await caller.db.updateConfig(`levelPermissions.${cmd.args[0].toUpperCase()}`, cmd.args[2], 'PUSH');
			if (updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Los permisos fueron añadidos.');
			if (!updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'No pude añadir esos permisos.');
		}
		// Commands
		else {
			const command = caller.commands.get(cmd.args[0].toLowerCase()) || caller.commands.get(caller.aliases.get(cmd.args[0].toLowerCase()) as  string);
			if (!command)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Ese comando no existe.');

			if (config.commandsPermissions && config.commandsPermissions[command.name] && config.commandsPermissions[command.name].includes(cmd.args[2]))
				return caller.utils.discord.createMessage(cmd.channel.id, 'Esa ID ya esta agregada a ese permiso.');

			const updated = await caller.db.updateConfig(`commandsPermissions.${command.name}`, cmd.args[2], 'PUSH');
			if (updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Los permisos fueron añadidos.');
			if (!updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'No pude añadir los permisos a ese rol.');
		}

	else if (cmd.args[1] === 'remove' || cmd.args[1] === 'rmv')
		// Levels
		if (['ADMIN', 'SUPPORT', 'REGULAR'].indexOf(cmd.args[0].toUpperCase()) >= 0) {
			if (!config.levelPermissions[cmd.args[0].toUpperCase() as ('REGULAR' | 'SUPPORT' | 'ADMIN')].includes(cmd.args[2]))
				return caller.utils.discord.createMessage(cmd.channel.id, 'Esa ID no esta añadida a ese permiso.');

			const updated = await caller.db.updateConfig(`levelPermissions.${cmd.args[0].toUpperCase()}`, cmd.args[2], 'PULL');
			if (updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Eliminé los permisos del rol.');
			if (!updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'No pude eliminar los permisos de este rol.');
		}
		// Commands
		else {
			const command = caller.commands.get(cmd.args[0].toLowerCase()) || caller.commands.get(caller.aliases.get(cmd.args[0].toLowerCase()) as  string);
			if (!command)
				return caller.utils.discord.createMessage(cmd.channel.id, 'El comando especificado no existe.');

			if (!config.commandsPermissions || !config.commandsPermissions[command.name] || !config.commandsPermissions[command.name].includes(cmd.args[2]))
				return caller.utils.discord.createMessage(cmd.channel.id, 'Esa ID no encaja con su permiso.');

			const updated = await caller.db.updateConfig(`commandsPermissions.${command.name}`, cmd.args[2], 'PULL');
			if (updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Permisos eliminados.');
			if (!updated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Los permisos no fueron removidos.');
		}
},
{
	level: 'ADMIN',
	aliases: []
});