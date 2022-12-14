import Command from '../lib/structures/Command';
import MessageEmbed from '../lib/structures/MessageEmbed';
import { COLORS } from '../Constants';
import Axios from 'axios';
import {Message, MessageFile} from 'eris';

export default new Command('reply', async (caller, cmd, log) => {
	if (!cmd.args[0] && cmd.msg.attachments.length === 0)
		return caller.utils.discord.createMessage(cmd.channel.id, 'You must provide a reply.');
	const files: MessageFile[] = [];
	if (cmd.msg.attachments.length > 0) for (const file of cmd.msg.attachments) await Axios.get<Buffer>(file.url, { responseType: 'arraybuffer' })
		.then((response) => files.push({ file: response.data, name: file.filename }))
		.catch(() => false);

	const userEmbed = new MessageEmbed()
		.setAuthor(`${cmd.msg.author.username}#${cmd.msg.author.discriminator}`, cmd.msg.author.dynamicAvatarURL())
		.setColor(COLORS.RED)
		.setDescription(cmd.args.join(' ') || 'No content provided.')
		.setTimestamp();
	if (files.length > 0) userEmbed.addField('Files', `This message contains ${files.length} file${files.length > 1 ? 's' : ''}`);
	const channelEmbed = new MessageEmbed()
		.setAuthor(`${cmd.msg.author.username}#${cmd.msg.author.discriminator}`, cmd.msg.author.dynamicAvatarURL())
		.setColor(COLORS.GREEN)
		.setDescription(cmd.args.join(' ') || 'No content provided.')
		.setTimestamp();

	const guildMsg = await caller.utils.discord.createMessage(cmd.channel.id, { embed: channelEmbed.code }, false, files);
	const userMsg = await caller.utils.discord.createMessage(log!.recipient.id, { embed: userEmbed.code }, true, files);
	if (!(guildMsg || userMsg))
		return caller.utils.discord.createMessage(cmd.channel.id, 'Error al contestar al usuario.');

	// Remove schedules if any.
	if (log!.closureMessage) caller.db.updateLog(log!._id, 'closureMessage', '', 'UNSET');
	if (log!.scheduledClosure) {
		caller.db.updateLog(log!._id, 'scheduledClosure', '', 'UNSET');
		caller.db.updateLog(log!._id, 'closer', '', 'UNSET');
		const closureCancellationEmbed = new MessageEmbed()
			.setTitle('Cierre cancelado')
			.setDescription('Debido a la actividad del ticket, este ticket no se va a eliminar.')
			.setColor(COLORS.YELLOW);
		caller.utils.discord.createMessage(cmd.channel.id, { embed: closureCancellationEmbed.code });
	}

	// Add log to the DB.
	caller.db.appendMessage(log!._id, cmd.msg, 'STAFF_REPLY', cmd.args.join(' '), (userMsg as Message).id, (guildMsg as Message).id);
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: ['r']
});