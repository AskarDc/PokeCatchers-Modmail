import Command from '../lib/structures/Command';

export default new Command('unsubscribe', async (caller, cmd, log) => {
	if (!log!.subscriptions.includes(cmd.msg.author.id))
		return caller.utils.discord.createMessage(cmd.channel.id, 'No estás suscrito a este ticket.');
	const updated = await caller.db.updateLog(log!._id, 'subscriptions', cmd.msg.author.id, 'PULL');
	if (updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'No recibirás más menciones en este canal.');
	if (!updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Error al desuscribirse.');
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: []
});