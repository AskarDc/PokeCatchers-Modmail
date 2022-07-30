import Command from '../lib/structures/Command';

export default new Command('blacklist', async (caller, cmd, log, config) => {
	if (!cmd.args[0])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Selecciona `add` or `remove`.');

	let userID: string;
	// If used in a thread, it operates with the recipient, if not, an ID is required.
	if (log) userID = log.recipient.id;
	else {
		if (!cmd.args[1])
			return caller.utils.discord.createMessage(cmd.channel.id, 'Brindame el usuario correcto.');

		const user = cmd.msg.mentions[0] || caller.bot.users.get(cmd.args[1]) || await caller.utils.discord.fetchUser(cmd.args[1]);
		if (!user)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Usuario no encontrado.');
		userID = user.id;
	}

	if (cmd.args[0] === 'add') {
		if (config.blacklist.includes(userID))
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este usuario estaba desde antes en la blacklist.');

		const updated = await caller.db.updateConfig('blacklist', userID, 'PUSH');
		if (updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Usuario añadido a la blacklist.');
		if (!updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este usuario no pudo ser blacklisteado.');

	}
	else if (cmd.args[0] === 'remove' || cmd.args[0] === 'rmv') {
		if (!config.blacklist.includes(userID))
			return caller.utils.discord.createMessage(cmd.channel.id, 'Este usuario no esta blacklisteado.');

		const updated = await caller.db.updateConfig('blacklist', userID, 'PULL');
		if (updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Usuario eliminado de la blacklist.');
		if (!updated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'No pude borrarle de la blacklist.');

	}

},
{
	level: 'ADMIN',
	aliases: ['bl']
});