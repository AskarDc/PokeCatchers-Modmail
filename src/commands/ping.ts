import Command from '../lib/structures/Command';

export default new Command('ping', async (caller, cmd) => {
	return caller.utils.discord.createMessage(cmd.channel.id, `Mi ping es: \`${cmd.channel.guild.shard.latency}ms\``);
},
{
	level: 'REGULAR',
	aliases: []
});