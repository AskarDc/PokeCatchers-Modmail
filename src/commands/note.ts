import Command from '../lib/structures/Command';

export default new Command('note', async (caller, cmd, log) => {
	if (!cmd.args[0])
		return caller.utils.discord.createMessage(cmd.channel.id, 'Escribe una nota o `removenote` to remove the note.');
	const updated = await caller.db.updateLog(log!._id, 'note', cmd.args[0] === 'removenote' ? '' : cmd.args.join(' '), cmd.args[0] === 'removenote' ? 'UNSET' : 'SET');
	if (updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Nota actualizada.');
	if (!updated)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Esta nota no fue actualizada.');
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: []
});