import Command from '../lib/structures/Command';

export default new Command('alias', async (caller, cmd, _log, config) => {
	if (!cmd.args[0] || ['add', 'remove', 'rmv'].indexOf(cmd.args[0]) < 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Porfavor, use `add` or `remove`.');
	if (!cmd.args[1])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Especifica el alias.');
	if (caller.aliases.has(cmd.args[1]))
		return caller.utils.discord.createMessage(cmd.channel.id, 'No puedes usar ese alias, esta reservado al bot.');
	if (!cmd.args[2] && ['remove', 'rmv'].indexOf(cmd.args[0]) < 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Especifica el alias porfavor.');

	const command = caller.commands.get(cmd.args[2]);
	if (!command && ['remove', 'rmv'].indexOf(cmd.args[0]) < 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Comando no encontrado.');

	if (cmd.args[0] === 'add') {
		if (config.aliases && config.aliases[cmd.args[1]])
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este alias ya existia.');

		const updated = await caller.db.updateConfig(`aliases.${cmd.args[1]}`, command!.name);
		if (updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este alias fue creado.');
		if (!updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'No fue posible crear este alias.');
	}
	else if (cmd.args[0] === 'remove' || cmd.args[0] === 'rmv') {
		if (!(config.aliases || config.aliases[cmd.args[1]]))
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este alias no existe.');

		const updated = await caller.db.updateConfig(`aliases.${cmd.args[1]}`, '', 'UNSET');
		if (updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'El alias fue eliminado.');
		if (!updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'No se pudo borrar el alias.');
	}

},
{
	level: 'ADMIN',
	aliases: ['aliases']
});