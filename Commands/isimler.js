const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');
module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor("RANDOM").setFooter(config.footer).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp();
    if(![config.kayıtYetkilisi].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komudu kullanmak için <@&" + config.kayıtYetkilisi + "> rolüne sahip olmalısın!")).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let data = db.fetch(`isimler.${member.id}`)
    let isimler = data.map(x => `\`• ${x.Name}\` (${x.Role})`).splice(0, 20)
    let top = db.fetch(`isimler.${member.id}.toplam`)
    message.channel.send(embed.setDescription(`
    Kişinin toplamda **${top}** adet isim kaydı bulundu.
    
    ${isimler.join("\n")}`));


};

exports.conf = {
    name: "isimler",
    aliases: ["isimler"]
}