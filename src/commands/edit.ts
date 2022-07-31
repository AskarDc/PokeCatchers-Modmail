import Command from '../lib/structures/Command';

export default new Command('edit', async (caller, cmd, log) => {
	if (!cmd.args[0])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Mandame el ID del mensaje.');
	if (!cmd.args[1])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Enviame el nuevo contenido del mensaje.');

	const guildMsg = await caller.utils.discord.fetchMessage(cmd.channel.id, cmd.args[0]);
	if (!guildMsg || !guildMsg.embeds[0])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Mensaje no encontrado.');

	const message = log!.messages.find((m) => m.id === guildMsg.id);
	if (!message || message.type !== 'STAFF_REPLY')
		return caller.utils.discord.createMessage(cmd.channel.id, 'Mensaje no encontrado.');

	const userMsg = await caller.utils.discord.fetchMessage(log!.recipient.id, message.complementaryID!, true);
	if (!userMsg || !userMsg.embeds[0])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Mensaje no encontrado.');

	// Edit the user message.
	userMsg.embeds[0].description = cmd.args.slice(1).join(' ');
	userMsg.edit({ embed: userMsg.embeds[0] })
		.catch(() => {
			return caller.utils.discord.createMessage(cmd.channel.id, 'EL mensaje del usuario no pude editarlo.');
		});

	caller.db.editMessage(log!, message.id, cmd.args.slice(1).join(' '));

	guildMsg.embeds[0].description = cmd.args.slice(1).join(' ');
	guildMsg.embeds[0].footer ? guildMsg.embeds[0].footer.text = 'Edited' : guildMsg.embeds[0].footer = { text: 'Editado' };
	guildMsg.edit({ embed: guildMsg.embeds[0] })
		.catch(() => {
			return caller.utils.discord.createMessage(cmd.channel.id, 'El mensaje no puede ser editado en este canal.');
		});
	caller.utils.discord.createMessage(cmd.channel.id, 'Mensaje editado.');
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: []
});