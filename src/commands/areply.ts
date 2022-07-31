import Command from '../lib/structures/Command';
import MessageEmbed from '../lib/structures/MessageEmbed';
import { COLORS } from '../Constants';
import Axios from 'axios';
import { Message, MessageFile } from 'eris';

export default new Command('areply', async (caller, cmd, log) => {
	if (!cmd.args[0] && cmd.msg.attachments.length === 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'Dime la respuesta que quieres que envie.');
	const files: MessageFile[] = [];
	if (cmd.msg.attachments.length > 0) for (const file of cmd.msg.attachments) await Axios.get<Buffer>(file.url, { responseType: 'arraybuffer' })
		.then((response) => files.push({ file: response.data, name: file.filename }))
		.catch(() => false);

	const userEmbed = new MessageEmbed()
		.setAuthor('Staff Reply', cmd.channel.guild.dynamicIconURL())
		.setColor(COLORS.RED)
		.setDescription(cmd.args.join(' ') || 'No hay contenido de mensaje.')
		.setTimestamp();
	if (files.length > 0) userEmbed.addField('Archivos', `Este mensaje contiene ${files.length} archivos${files.length > 1 ? 's' : ''}`);
	const channelEmbed = new MessageEmbed()
		.setAuthor('Respuesta del Staff:', cmd.channel.guild.dynamicIconURL())
		.setColor(COLORS.GREEN)
		.setDescription(cmd.args.join(' ') || 'No hay contenido de mensaje.')
		.setTimestamp();

	const guildMsg = await caller.utils.discord.createMessage(cmd.channel.id, { embed: channelEmbed.code }, false, files);
	const userMsg = await caller.utils.discord.createMessage(log!.recipient.id, { embed: userEmbed.code }, true, files);
	if (!(guildMsg || userMsg))
		return caller.utils.discord.createMessage(cmd.channel.id, 'No puedo enviar el mensaje al usuario, intentalo denuevo.');

	// Remove schedules if any.
	if (log!.closureMessage) caller.db.updateLog(log!._id, 'closureMessage', '', 'UNSET');
	if (log!.scheduledClosure) {
		caller.db.updateLog(log!._id, 'scheduledClosure', '', 'UNSET');
		caller.db.updateLog(log!._id, 'closer', '', 'UNSET');
		const closureCancellationEmbed = new MessageEmbed()
			.setTitle('Closure Cancelled')
			.setDescription('Este ticket será eliminado dado a su actividad.')
			.setColor(COLORS.YELLOW);
		caller.utils.discord.createMessage(cmd.channel.id, { embed: closureCancellationEmbed.code });
	}

	// Add log to the DB.
	caller.db.appendMessage(log!._id, cmd.msg, 'STAFF_REPLY', cmd.args.join(' '), (userMsg as Message).id, (guildMsg as Message).id);
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: ['anonreply']
});