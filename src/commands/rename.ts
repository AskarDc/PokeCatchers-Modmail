import Command from '../lib/structures/Command';

export default new Command('rename', async (caller, cmd) => {
	if (!cmd.args[0]) return caller.utils.discord.createMessage(cmd.channel.id, 'Especifica el nombre del canal.');
	cmd.channel.edit({
		name: cmd.args.join()
	})
		.then(() => caller.utils.discord.createMessage(cmd.channel.id, 'Nombre editado.'))
		.catch(() => caller.utils.discord.createMessage(cmd.channel.id, 'Error al cambiar el nombre del canal.'));
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: []
});