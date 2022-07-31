import Command from '../lib/structures/Command';

export default new Command('subscribe', async (caller, cmd, log) => {
	if (log!.subscriptions.includes(cmd.msg.author.id))
		return caller.utils.discord.createMessage(cmd.channel.id, 'Ya estás suscrito a este ticket.');
	const updated = await caller.db.updateLog(log!._id, 'subscriptions', cmd.msg.author.id, 'PUSH');
	if (updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Recibirás notificaciones en tus respuestas.');
	if (!updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Error al suscribirse al ticket.');
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: []
});