import Command from '../lib/structures/Command';
import MessageEmbed from '../lib/structures/MessageEmbed';
import ms from 'ms';
import { COLORS } from '../Constants';

export default new Command('close', async (caller, cmd, log, config) => {
	if (cmd.args[0]) {
		const delay = ms(cmd.args[0]);
		// No date, regular close with reason.
		if (!delay)
			return caller.utils.misc.closeThread(log!, config, cmd, cmd.args.join(' '));
		if (delay < 600000 || delay > 259200000)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Especifica tiempo de 10min a 3días.');

		const closureDate = new Date(Date.now() + delay);
		const closerUpdated = await caller.db.updateLog(log!._id, 'closer', {
			id: cmd.msg.author.id,
			username: cmd.msg.author.username,
			discriminator: cmd.msg.author.discriminator,
			avatarURL: cmd.msg.author.dynamicAvatarURL()
		});
		if (!closerUpdated)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Error, intenta denuevo.');

		const delayed = await caller.db.updateLog(log!._id, 'scheduledClosure', closureDate);
		if (!delayed)
			return caller.utils.discord.createMessage(cmd.channel.id, 'Error con la data de cierre.');

		if (cmd.args[1]) {
			const messageUpdated = await caller.db.updateLog(log!._id, 'closureMessage', cmd.args.slice(1).join(' '));
			if (!messageUpdated)
				return caller.utils.discord.createMessage(cmd.channel.id, 'Eror con el mensaje de cierre.');
		}

		const confirmationEmbed = new MessageEmbed()
			.setTitle('Closure Scheduled')
			.setDescription(`Este ticket será eliminado en \`${closureDate.toDateString()}\` si no hay nuevas respuestas.`)
			.setColor(COLORS.LIGHT_BLUE);
		return caller.utils.discord.createMessage(cmd.channel.id, { embed: confirmationEmbed.code });
	}
	else
		caller.utils.misc.closeThread(log!, config, cmd);
},
{
	level: 'SUPPORT',
	threadOnly: true,
	aliases: ['c']
});