const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');
module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor("RANDOM").setFooter(config.footer).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp();
    if(![config.kayıtYetkilisi].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komudu kullanmak için <@&" + config.kayıtYetkilisi + "> rolüne sahip olmalısın!")).then(x => x.delete({timeout: 10000}));
    let top = message.guild.members.cache.filter(x => db.get(`yt.${x.id}.toplam`)).array().sort((a, b) => Number(db.get(`yt.${b.id}.toplam`)) - Number(db.get(`yt.${a.id}.toplam`))).slice(0 , 20).map((x, i) => `\`${i + 1}.\` ${x}: Toplam Kayıtları: \`${db.get(`yt.${x.id}.toplam`)}\` (\`${db.get(`yt.${x.id}.erkek`) ? db.get(`yt.${x.id}.erkek`) : "0"}\` Erkek , \`${db.get(`yt.${x.id}.kadın`) ? db.get(`yt.${x.id}.kadın`) : "0"}\` Kadın)`)
    if(top === undefined || top === null) top = "Bulunamadı!"
    message.channel.send(embed.setDescription(`${top.join("\n")}`))
};

exports.conf = {
    name: "top-kayıt",
    aliases: ["topkayıt", "topteyit"]
}