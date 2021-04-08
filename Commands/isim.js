const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const config = require('../config.json');
module.exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor("RANDOM").setFooter(config.footer).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setTimestamp();
    if(![config.kayıtYetkilisi].some(x => message.member.roles.cache.get(x)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komudu kullanmak için <@&" + config.kayıtYetkilisi + "> rolüne sahip olmalısın!")).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let isim = args[1].charAt(1).replace("i", "İ").toUpperCase() + args[1].slice(1).toUpperCase()
    let yas = Number(args[2]);
    if(!member || !yaş || !isim) return message.channel.send(embed.setDescription(`Tüm argümanları doğru kullanın!\n\`.isim {user} {isim} {yaş}\``)).then(x => x.delete({timeout: 10000}));
    if(!member.id === message.author.id || !member.id === message.guild.OwnerID || client.user.bot || member.roles.highest.position >= message.member.roles.highest.position) return ;
    let name = `${member.user.username.includes(config.tag) ? config.tag : config.unTag} ${isim} | ${yas}`;
    message.react(config.yes);
    member.setNickname(`${name}`);
    message.channel.send(embed.setDescription(`Kullanıcının adı başarıyla "${name}" olarak ayarlandı!`));
    db.push(`isimler.${member.id}`, {
        Name: name,
        Role: "İsim Değiştirme"
    });

};

exports.conf = {
    name: "isim",
    aliases: ["isim"]
}